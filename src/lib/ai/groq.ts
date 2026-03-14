import Groq from "groq-sdk";

/**
 * Creates a configured Groq instance.
 * Groq offers free tier with generous limits and very fast inference.
 * Lazily initialized to avoid issues during build time.
 */
let groqInstance: Groq | null = null;

export function getGroq(): Groq {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not defined");
    }
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqInstance;
}
