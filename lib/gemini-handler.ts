import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Centralized Gemini Client and Error Handler
 */
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY_2 || "");

export function hasApiKey(): boolean {
  return !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY_2);
}

export function isGeminiBlocked(error: unknown): boolean {
  const errorMsg = error instanceof Error ? error.message : String(error);
  return errorMsg.includes("403") || errorMsg.includes("API_KEY_SERVICE_BLOCKED") || errorMsg.includes("blocked");
}

export function handleGeminiError(error: unknown, context: string): string {
  const errorMsg = error instanceof Error ? error.message : String(error);
  console.error(`[Gemini ${context}] ERROR:`, errorMsg);

  if (errorMsg.includes("403") || errorMsg.includes("API_KEY_SERVICE_BLOCKED") || errorMsg.includes("blocked")) {
    return `API Service Blocked (403). Please ensure "Generative Language API" is enabled in your Google Cloud Console for Project: sound-splicer-490504-p1 (ID: 1059209133980). Visit: https://aistudio.google.com/app/apikey`;
  }

  if (errorMsg.includes("401") || errorMsg.includes("API_KEY_INVALID")) {
    return "Invalid API Key. Please check your GOOGLE_GENERATIVE_AI_API_KEY in environment variables.";
  }

  if (errorMsg.includes("quota") || errorMsg.includes("429")) {
    return "API Quota exceeded. Please try again later or check your usage limits.";
  }

  return `Gemini API Error: ${errorMsg}`;
}
