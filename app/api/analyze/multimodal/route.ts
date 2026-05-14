import { NextRequest, NextResponse } from "next/server";
import { analyzeMultimodalMedia } from "@/lib/multimodal-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`[AI Multimodal] Processing file: ${file.name} (${file.type}, ${buffer.length} bytes)`);
    
    const result = await analyzeMultimodalMedia(
      buffer,
      file.type,
      file.name
    );

    console.log(`[AI Multimodal] AI result:`, JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Multimodal API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
