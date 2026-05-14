import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FullAnalysis } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/** 
 * Real AI Analyst using Gemini API.
 * Grounded on the active statement pack and full analysis results.
 */
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
