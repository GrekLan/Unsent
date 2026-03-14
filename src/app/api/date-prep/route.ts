import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildDatePrepPrompt } from "@/lib/ai/prompts";
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
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const subscriptionTier = (profile?.subscription_tier || "free") as SubscriptionTier;

    // Check usage limits AND increment atomically
    // All features share one global "analyses" limit
    const { allowed, remaining, limit } = await checkAndIncrementUsage(
      user.id,
      "analyses",  // Shared limit across all features
      subscriptionTier
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: `You've reached your monthly limit of ${limit} date preps. Upgrade for unlimited access!`,
          upgradeUrl: "/upgrade",
          currentTier: subscriptionTier,
          remaining: 0,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { knowAboutThem, dateType } = body;

    if (!knowAboutThem || !dateType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build prompt and call Groq AI
    const prompt = buildDatePrepPrompt(knowAboutThem, dateType);
    const groq = getGroq();
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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

    const resultData = JSON.parse(responseContent);

    // Save analysis to database
    await supabase.from("analyses").insert({
      user_id: user.id,
      type: "date_prep",
      input_data: { knowAboutThem, dateType },
      result_data: resultData,
    });

    // Usage already incremented atomically

    return NextResponse.json({ result: resultData, usage: { remaining, limit } });
  } catch (error) {
    console.error("Date prep error:", error);
    return NextResponse.json(
      { error: "An error occurred while preparing date advice" },
      { status: 500 }
    );
  }
}
