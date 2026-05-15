import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { runMultiAgentAnalysis } from "@/lib/multi-agent-engine";
import { hasApiKey } from "@/lib/gemini-handler";

export async function POST(req: NextRequest) {
  try {
    const { ticker } = await req.json();

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    if (!hasApiKey()) {
      console.error("[Multi-Agent API] MISSING API KEY");
      return NextResponse.json({ error: "Server Configuration Error: Gemini API Key missing" }, { status: 500 });
    }

    console.log(`[Multi-Agent API] Fetching real-time data for: ${ticker}`);

    // 1. Fetch REAL-TIME data from Yahoo Finance
    let marketData = null;
    try {
      // Try to get quote data
      const fullData = (await yahooFinance.quote(ticker)) as Record<string, unknown>;
      console.log(`[Multi-Agent API] Yahoo Finance Data Success:`, !!fullData);
      
      if (fullData) {
        // Extract only the most relevant fields to keep context small and safe
        marketData = {
          symbol: fullData.symbol as string,
          price: fullData.regularMarketPrice as number,
          change: fullData.regularMarketChangePercent as number,
          high: fullData.regularMarketDayHigh as number,
          low: fullData.regularMarketDayLow as number,
          volume: fullData.regularMarketVolume as number,
          marketCap: fullData.marketCap as number,
          pe: fullData.trailingPE as number,
          name: fullData.longName as string,
          currency: fullData.currency as string,
          exchange: fullData.fullExchangeName as string
        };
      }
    } catch (e) {
      console.error(`[Multi-Agent API] Yahoo Finance Fetch ERROR for ${ticker}:`, e);
      // We will continue even if Yahoo fails, but log it clearly
    }

    // 2. Pass real data to the Multi-Agent Engine
    console.log(`[Multi-Agent API] Running AI Analysis...`);
    const result = await runMultiAgentAnalysis(ticker, marketData);
    console.log(`[Multi-Agent API] AI Analysis DONE`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Multi-Agent API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
