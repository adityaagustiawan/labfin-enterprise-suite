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
export async function runMultiAgentAnalysis(query: string, contextData?: Record<string, unknown>): Promise<MultiAgentResult> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Gemini API Key missing");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the "LabFin Multi-Agent Orchestrator". 
      Your task is to analyze the user's query by coordinating three specialized virtual agents.
      
      USER QUERY: "${query}"
      CURRENT CONTEXT: ${JSON.stringify(contextData || "No specific company loaded")}
      
      AGENTS TO SIMULATE:
      1. **MarketDataAgent**: Focused on real-time prices, Yahoo Finance trends, and ticker-specific movements.
      2. **SentimentAgent**: Focused on news, social sentiment, and global market mood.
      3. **RiskAgent**: Focused on financial health, debt ratios, and solvency "red flags".
      
      INSTRUCTIONS:
      - Each agent must provide its specific perspective based on the query.
      - If the query mentions a ticker (e.g., AAPL, TSLA), the agents should act as if they just fetched real-time data from global markets.
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
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text) as MultiAgentResult;
    
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
