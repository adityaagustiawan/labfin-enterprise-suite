import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { runMultiAgentAnalysis } from "@/lib/multi-agent-engine";

export async function POST(req: NextRequest) {
  try {
    const { ticker } = await req.json();

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    console.log(`[Multi-Agent API] Fetching real-time data for: ${ticker}`);

    // 1. Fetch REAL-TIME data from Yahoo Finance
    let marketData = null;
    try {
      // Try to get quote data with a timeout or specific check
      marketData = await yahooFinance.quote(ticker);
      console.log(`[Multi-Agent API] Yahoo Finance Data Success:`, !!marketData);
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
