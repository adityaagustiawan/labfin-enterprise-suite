import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export interface AgentResponse {
  agentName: string;
  role: string;
  content: string;
  data?: Record<string, string | number | boolean>;
}

export interface MultiAgentResult {
  orchestratorSummary: string;
  agentResponses: AgentResponse[];
  finalVerdict: string;
}

/**
 * MULTI-AGENT ANALYTICS ENGINE
 * Orchestrates multiple specialized agents to provide a comprehensive market view.
 */
export async function runMultiAgentAnalysis(query: string, contextData?: Record<string, unknown> | null): Promise<MultiAgentResult> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Gemini API Key missing");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the "LabFin Multi-Agent Orchestrator". 
      Your task is to analyze the user's query by coordinating three specialized virtual agents.
      
      USER QUERY: "${query}"
      
      REAL-TIME MARKET DATA (Context):
      ${contextData ? JSON.stringify(contextData, null, 2) : "No real-time data found for this ticker. Use your internal knowledge."}
      
      AGENTS TO SIMULATE:
      1. **MarketDataAgent**: Analyze the REAL-TIME MARKET DATA provided. Mention specific prices, volume, and daily ranges.
      2. **SentimentAgent**: Analyze the global sentiment for this asset based on the provided context and news.
      3. **RiskAgent**: Identify potential risks based on the financial metrics (P/E, market cap, 52-week highs/lows) in the context.
      
      INSTRUCTIONS:
      - Use the REAL-TIME MARKET DATA to ground your responses.
      - If data is provided, use the actual price and change % in the MarketDataAgent response.
      - Each agent must provide its specific perspective.
      - The Orchestrator should summarize the findings and give a final "LabFin Verdict".
      
      OUTPUT FORMAT (Strict JSON):
      {
        "orchestratorSummary": "...",
        "agentResponses": [
          { "agentName": "MarketDataAgent", "role": "Quantitative Researcher", "content": "...", "data": { "ticker": "...", "price": "...", "change": "..." } },
          { "agentName": "SentimentAgent", "role": "News & Trends Analyst", "content": "..." },
          { "agentName": "RiskAgent", "role": "Credit & Risk Officer", "content": "..." }
        ],
        "finalVerdict": "..."
      }
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    console.log(`[Multi-Agent Engine] Raw AI Response:`, text.substring(0, 100) + "...");
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`[Multi-Agent Engine] FAILED to find JSON in response:`, text);
      throw new Error("Invalid AI response format (no JSON found)");
    }
    
    const parsed = JSON.parse(jsonMatch[0]) as MultiAgentResult;
    console.log(`[Multi-Agent Engine] Successfully parsed agents:`, parsed.agentResponses.length);
    
    return parsed;
  } catch (error) {
    console.error("Multi-Agent Engine Error:", error);
    return {
      orchestratorSummary: "I encountered an error coordinating the agents.",
      agentResponses: [],
      finalVerdict: "System Offline"
    };
  }
}
