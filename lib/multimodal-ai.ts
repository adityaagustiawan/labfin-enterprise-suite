import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { CompanyFinancials } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export interface MultimodalAnalysisResult {
  isBusiness: boolean;
  summary: string;
  extractedData?: Partial<CompanyFinancials>;
  error?: string;
}

export async function analyzeMultimodalMedia(
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<MultimodalAnalysisResult> {
  console.log(`[AI Multimodal] Starting analysis for ${fileName}...`);
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("[AI Multimodal] ERROR: GOOGLE_GENERATIVE_AI_API_KEY is not set!");
    return {
      isBusiness: false,
      summary: "Configuration error: API Key missing.",
      error: "API Key not found in environment variables.",
    };
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a specialized financial analyst and researcher. 
      Analyze the provided media (video, image, or document).
      
      Your goal is to provide a comprehensive summary and extract any possible financial or business data.
      
      - Provide a detailed summary of the content. If it is business-related, include a transcription of key dialogue or text found in the media.
      - If it is a company report, market prediction, or financial document, be extremely thorough in your analysis and data extraction.
      - Extract any mentioned financial data like company name, ticker, sector, revenue, net income, assets, liabilities, etc.
      - Even if the data is partial, estimated, or predictive (like market forecasts), extract the numbers and names.
      - If you are unsure about a number, provide your best estimate based on the context.
      
      Return a JSON object with the following structure (DO NOT include any other text outside this JSON):
      {
        "isBusiness": true,
        "summary": "...",
        "extractedData": {
          "company_name": "...",
          "ticker": "...",
          "sector": "...",
          "year": 2024,
          "income_statement": {
            "revenue": 0,
            "cost_of_goods_sold": 0,
            "gross_profit": 0,
            "operating_expense": 0,
            "net_income": 0
          },
          "balance_sheet": {
            "total_assets": 0,
            "total_liabilities": 0,
            "total_equity": 0,
            "current_assets": 0,
            "current_liabilities": 0
          },
          "cash_flow": {
            "operating_cash_flow": 0,
            "investing_cash_flow": 0,
            "financing_cash_flow": 0
          }
        }
      }
      
      IMPORTANT: 
      - Always provide a summary regardless of the content.
      - Set "isBusiness" to true if there is any relevance to companies, markets, economy, or finance.
      - If no financial numbers are found, use 0 for numbers and null for strings in "extractedData".
      - Only return valid JSON.
    `;

    const filePart: Part = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();
    console.log(`[Gemini API] Raw response text:`, text);

    try {
      // Extract JSON from the response text (Gemini sometimes wraps it in markdown blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const parsed = JSON.parse(jsonStr) as MultimodalAnalysisResult;
      
      // Ensure summary is present even if AI didn't return it in JSON
      if (!parsed.summary && text) {
        parsed.summary = text.replace(/\{[\s\S]*\}/, '').trim() || "Summary extracted from media.";
      }
      
      return parsed;
    } catch (e) {
      console.error("[Gemini API] JSON Parse Error:", e, "Text:", text);
      return {
        isBusiness: true,
        summary: text,
        error: "Failed to extract structured data",
      };
    }
  } catch (error) {
    console.error("Multimodal analysis error:", error);
    return {
      isBusiness: false,
      summary: "",
      error: error instanceof Error ? error.message : "Unknown AI error",
    };
  }
}
