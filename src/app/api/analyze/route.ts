import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAnalysisPrompt } from "@/lib/ai/prompts";
import { getGroq } from "@/lib/ai/groq";
import { checkAndIncrementUsage } from "@/lib/usage-tracking";
import type { SubscriptionTier } from "@/types/database.types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    // If no profile exists, create one (handles missing trigger)
    if (profileError && profileError.code === "PGRST116") {
      // Profile doesn't exist, create it
      const { error: insertProfileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          subscription_tier: "free",
        });
      
      if (insertProfileError) {
        console.error("Failed to create profile:", insertProfileError);
        return NextResponse.json(
          { error: `Database setup issue: ${insertProfileError.message}. Please ensure database tables are created.` },
          { status: 500 }
        );
      }
    } else if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json(
        { error: `Database error: ${profileError.message}` },
        { status: 500 }
      );
    }

    const subscriptionTier = (profile?.subscription_tier || "free") as SubscriptionTier;

    // Check usage limits AND increment atomically (before AI call)
    // All features share one global "analyses" limit
    let usageResult;
    try {
      usageResult = await checkAndIncrementUsage(
        user.id,
        "analyses",  // Shared limit across all features
        subscriptionTier
      );
    } catch (usageError: unknown) {
      console.error("Usage check error:", usageError);
      const msg = usageError instanceof Error ? usageError.message : "Unknown";
      return NextResponse.json(
        { error: `Usage tracking error: ${msg}. Please ensure the usage_tracking table exists.` },
        { status: 500 }
      );
    }

    const { allowed, remaining, limit } = usageResult;

    if (!allowed) {
      return NextResponse.json(
        {
          error: `You've reached your monthly limit of ${limit} analyses. Upgrade for unlimited access!`,
          upgradeUrl: "/upgrade",
          currentTier: subscriptionTier,
          remaining: 0,
          limit,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { conversationText, imageBase64, goal } = body;

    if (!conversationText && !imageBase64) {
      return NextResponse.json(
        { error: "Please provide either conversation text or an image" },
        { status: 400 }
      );
    }

    if (!goal) {
      return NextResponse.json(
        { error: "Please select a goal" },
        { status: 400 }
      );
    }

    const groq = getGroq();
    let extractedConversation = conversationText || "";

    // If image is provided, extract text from it using vision model
    if (imageBase64) {
      try {
        // Use Groq's vision model - Llama 4 Scout (multimodal)
        const visionResponse = await groq.chat.completions.create({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all the text from this chat/messaging screenshot. Format it as a conversation with clear speaker labels. Only output the extracted conversation text, nothing else. If you can identify who sent which message, label them appropriately (e.g., 'You:' and 'Them:' or use visible names).",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64,
                  },
                },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });

        const extractedText = visionResponse.choices[0]?.message?.content;
        if (extractedText) {
          // Combine with any text input if provided
          extractedConversation = conversationText 
            ? `${conversationText}\n\n--- From Screenshot ---\n${extractedText}`
            : extractedText;
        } else {
          throw new Error("No text extracted from image");
        }
      } catch (visionError: unknown) {
        console.error("Vision extraction error:", visionError);
        const errorMessage = visionError instanceof Error ? visionError.message : "Unknown error";
        
        // If vision fails but we have text, continue with text
        if (!conversationText) {
          return NextResponse.json(
            { error: `Failed to extract text from image: ${errorMessage}. Please try pasting the conversation text instead.` },
            { status: 500 }
          );
        }
        // If we have conversationText, continue with that
      }
    }

    // Build prompt and call Groq AI for analysis
    const prompt = buildAnalysisPrompt(extractedConversation, goal);
    
    let resultData;
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // Current Groq model
        messages: [
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        return NextResponse.json(
          { error: "No response from AI" },
          { status: 500 }
        );
      }

      resultData = JSON.parse(responseContent);
    } catch (aiError: unknown) {
      console.error("Groq AI error:", aiError);
      const msg = aiError instanceof Error ? aiError.message : "Unknown error";
      return NextResponse.json(
        { error: `AI analysis failed: ${msg}` },
        { status: 500 }
      );
    }

    // Save analysis to database
    const { data: analysis, error: insertError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        type: "conversation",
        input_data: { 
          conversationText: extractedConversation, 
          hadImage: !!imageBase64,
          goal 
        },
        goal,
        result_data: resultData,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to save analysis:", insertError);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      );
    }

    // Usage was already incremented atomically in checkAndIncrementUsage

    return NextResponse.json({
      analysisId: analysis.id,
      result: resultData,
      usage: {
        remaining,
        limit,
      },
    });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Analysis failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
