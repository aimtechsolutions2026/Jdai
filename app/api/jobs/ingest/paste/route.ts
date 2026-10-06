import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { IngestionJobRepository } from "@/lib/repositories";
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

    // 1. Create IngestionJob in MongoDB with status "processing"
    const job = await IngestionJobRepository.create({
      type: "jd_paste",
      status: "processing",
      inputRef: text.slice(0, 120),
      userId: session.userId,
    });

    const jobId = String(job._id);

    // 2. Perform extraction directly (Groq LLM + heuristic fallback)
    const extracted = await extractJobWithGroq(text);

    // 3. Update IngestionJob to completed status
    await IngestionJobRepository.update(jobId, {
      status: "completed",
      result: {
        extracted,
      },
    });

    // 4. Return immediately with completed status and extracted payload
    return NextResponse.json(
      {
        success: true,
        jobId,
        status: "completed",
        extracted,
        result: {
          extracted,
        },
        message: "Job description extracted successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Paste ingestion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate job extraction" },
      { status: 500 }
    );
  }
}

