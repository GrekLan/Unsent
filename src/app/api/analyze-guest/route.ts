import { NextResponse } from "next/server";
import { buildAnalysisPrompt } from "@/lib/ai/prompts";
import { getGroq } from "@/lib/ai/groq";

/**
 * Guest (unauthenticated) analysis endpoint.
 * Rate limiting is handled client-side via localStorage (2 free tries).
 * No database writes — results are returned directly.
 */
export async function POST(request: Request) {
  try {
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

    // If image is provided, extract text using vision model
    if (imageBase64) {
      try {
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
                  image_url: { url: imageBase64 },
                },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });

        const extractedText = visionResponse.choices[0]?.message?.content;
        if (extractedText) {
          extractedConversation = conversationText
            ? `${conversationText}\n\n--- From Screenshot ---\n${extractedText}`
            : extractedText;
        } else {
          throw new Error("No text extracted from image");
        }
      } catch (visionError: unknown) {
        console.error("Vision extraction error:", visionError);
        if (!conversationText) {
          const msg = visionError instanceof Error ? visionError.message : "Unknown";
          return NextResponse.json(
            { error: `Failed to extract text from image: ${msg}. Try pasting the conversation text instead.` },
            { status: 500 }
          );
        }
      }
    }

    // Build prompt and call Groq AI
    const prompt = buildAnalysisPrompt(extractedConversation, goal);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
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

    return NextResponse.json({ result: resultData });
  } catch (error: unknown) {
    console.error("Guest analysis error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Analysis failed: ${msg}` },
      { status: 500 }
    );
  }
}
