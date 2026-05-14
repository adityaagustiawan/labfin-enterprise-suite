import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FullAnalysis } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export interface NewsletterReport {
  title: string;
  headline: string;
  marketSentiment: "bullish" | "bearish" | "neutral";
  keyTakeaways: string[];
  globalContext: string;
  sourceReference: string;
}

/** 
 * Advanced Analyst Agent.
 * Generates grounded replies and advanced company newsletters.
 */
export async function generateNewsletter(a: FullAnalysis): Promise<NewsletterReport> {
  const { financials, ratios, insights, decision } = a;
  const t = financials.ticker ?? financials.company_name;

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("API Key missing");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a world-class financial journalist and quantitative analyst.
      Based on the following data for ${t}, generate a professional "Investor Pulse" Newsletter.
      
      DATA PACK:
      - Health Score: ${insights.healthRating}/10
      - Revenue: ${financials.income_statement.revenue}
      - Net Margin: ${ratios.net_profit_margin.toFixed(2)}%
      - Verdict: ${decision.verdict}
      - Risks: ${insights.risks.join(", ")}
      
      INSTRUCTIONS:
      1. Create a compelling Title and Headline.
      2. Determine Market Sentiment (bullish/bearish/neutral).
      3. Provide 3-4 Key Takeaways.
      4. Add "Global Context" linking this company's performance to broader market trends (e.g., inflation, tech cycle).
      5. Include a "Source Reference" mentioning that this was generated via FinLab's real-time AI agent.
      
      Return ONLY a JSON object:
      {
        "title": "...",
        "headline": "...",
        "marketSentiment": "...",
        "keyTakeaways": ["...", "..."],
        "globalContext": "...",
        "sourceReference": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (error) {
    console.error("Newsletter Generation Error:", error);
    return {
      title: `${t} Quick Update`,
      headline: "Analysis Complete",
      marketSentiment: "neutral",
      keyTakeaways: ["Data processed successfully", "Awaiting deeper market signals"],
      globalContext: "Macro-economic indicators remain stable.",
      sourceReference: "FinLab AI Default Engine"
    };
  }
}

export async function analystReply(question: string, a: FullAnalysis): Promise<string> {
  const q = question.trim();
  const { financials, ratios, insights, decision, riskScores, benchmarkDeltas } = a;
  const t = financials.ticker ?? financials.company_name;

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return "AI Analyst is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context = `
      You are a specialized financial analyst. You are currently analyzing ${t}.
      
      FINANCIAL DATA:
      - Company: ${financials.company_name} (${financials.ticker || "N/A"})
      - Sector: ${financials.sector || "N/A"}
      - Year: ${financials.year}
      
      KEY RATIOS:
      - ROE: ${ratios.roe.toFixed(2)}% (Industry Delta: ${benchmarkDeltas.roe_vs_industry.toFixed(2)}%)
      - ROA: ${ratios.roa.toFixed(2)}%
      - Net Margin: ${ratios.net_profit_margin.toFixed(2)}%
      - Current Ratio: ${ratios.current_ratio.toFixed(2)}
      - Debt to Equity: ${ratios.debt_to_equity.toFixed(2)}
      
      ENGINE ANALYSIS:
      - Health Score: ${insights.healthRating}/10
      - Verdict: ${decision.verdict}
      - Recommendation: ${insights.recommendation}
      - Flags: ${decision.flags.join(", ") || "None"}
      - Risk Scores: Liquidity ${riskScores.liquidity}%, Leverage ${riskScores.leverage}%, Solvency ${riskScores.solvency}%
      
      STRENGTHS:
      ${insights.strengths.map(s => `- ${s}`).join("\n")}
      
      WEAKNESSES:
      ${insights.weaknesses.map(w => `- ${w}`).join("\n")}
      
      RISKS:
      ${insights.risks.map(r => `- ${r}`).join("\n")}
      
      EXECUTIVE SUMMARY:
      ${insights.executiveSummary}
    `;

    const prompt = `
      ${context}
      
      USER QUESTION: "${q}"
      
      INSTRUCTIONS:
      - Answer the user's question as a professional financial analyst.
      - Use the provided data to ground your answer.
      - Be concise but insightful.
      - If the question is not related to the company's financials or the provided data, politely steer them back.
      - Do not make up numbers that are not in the context.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Analyst Agent Error:", error);
    return "I'm having trouble analyzing the data right now. Please try again in a moment.";
  }
}
