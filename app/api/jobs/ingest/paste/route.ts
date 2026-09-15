import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { extractJobWithGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { text } = body;

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Please paste a complete job description (at least 20 characters)" },
        { status: 400 }
      );
    }

    const extracted = await extractJobWithGroq(text);

    return NextResponse.json({ success: true, extracted });
  } catch (error: any) {
    console.error("Paste ingestion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to extract job from text" },
      { status: 500 }
    );
  }
}

