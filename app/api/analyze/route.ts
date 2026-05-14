import { NextResponse } from "next/server";
import { runFullAnalysis } from "@/lib/analyze";
import type { CompanyFinancials } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CompanyFinancials;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const result = runFullAnalysis(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
