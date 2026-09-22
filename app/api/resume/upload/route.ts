import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { IngestionJobRepository } from "@/lib/repositories";
import { processResumeJob } from "@/lib/ingestion-worker";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
    }

    // 1. Strict PDF validation
    const filename = file.name || "resume.pdf";
    if (!filename.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF resumes are accepted." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Extract text using pdf-parse in-memory with raw buffer stream fallback
    let extractedText = "";
    try {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || "";
    } catch (e) {
      console.warn("PDF text parse warning, attempting stream fallback:", e);
    }

    // If pdf-parse extracted minimal text, attempt ASCII/UTF-8 chunk recovery
    if (!extractedText || extractedText.trim().length < 30) {
      const rawStr = buffer.toString("utf-8");
      const textChunks = rawStr.match(/[\x20-\x7E\t\n\r]{4,}/g);
      if (textChunks && textChunks.length > 0) {
        extractedText = textChunks.join("\n");
      }
    }

    // 3. Raw PDF buffer is discarded immediately from memory (zero disk persistence).
    // Candidate privacy is preserved.

    // 4. Persist IngestionJob in MongoDB with status "processing"
    const job = await IngestionJobRepository.create({
      type: "resume",
      status: "processing",
      inputRef: filename,
      userId: session?.userId,
    });

    const jobId = String(job._id);

    // 5. Trigger background worker asynchronously (fire-and-forget)
    processResumeJob(jobId, extractedText, session).catch((err) => {
      console.error(`[Upload] Unhandled background resume error for job ${jobId}:`, err);
    });

    // 6. Return immediately with HTTP 202 Accepted
    return NextResponse.json(
      {
        success: true,
        jobId,
        status: "processing",
        message: "Resume upload accepted. Automated extraction is running in the background.",
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process resume upload" },
      { status: 500 }
    );
  }
}
