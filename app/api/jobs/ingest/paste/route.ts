import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { IngestionJobRepository } from "@/lib/repositories";
import { processJdPasteJob } from "@/lib/ingestion-worker";

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

    // 2. Trigger asynchronous background worker (fire-and-forget)
    processJdPasteJob(jobId, text).catch((err) => {
      console.error(`[IngestPaste] Background worker error for job ${jobId}:`, err);
    });

    // 3. Return immediately with HTTP 202 Accepted
    return NextResponse.json(
      {
        success: true,
        jobId,
        status: "processing",
        message: "Job description accepted. Automated extraction is running in the background.",
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error("Paste ingestion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate job extraction" },
      { status: 500 }
    );
  }
}
