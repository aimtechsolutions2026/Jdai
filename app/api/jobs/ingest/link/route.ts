import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { IngestionJobRepository } from "@/lib/repositories";
import { processJdLinkJob } from "@/lib/ingestion-worker";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "Please provide a valid web URL starting with http:// or https://" },
        { status: 400 }
      );
    }

    // 1. Create IngestionJob in MongoDB with status "processing"
    const job = await IngestionJobRepository.create({
      type: "jd_link",
      status: "processing",
      inputRef: url,
      userId: session.userId,
    });

    const jobId = String(job._id);

    // 2. Perform link extraction directly
    try {
      await processJdLinkJob(jobId, url);
      const updated = await IngestionJobRepository.findById(jobId);
      if (updated && updated.status === "completed" && updated.result?.extracted) {
        return NextResponse.json({
          success: true,
          jobId,
          status: "completed",
          extracted: updated.result.extracted,
          result: updated.result,
          message: "Job extracted from URL successfully.",
        });
      }
    } catch (e) {
      console.warn("[IngestLink] Direct link extraction fell back to background:", e);
    }

    // 3. Fallback to 202 if taking longer
    return NextResponse.json(
      {
        success: true,
        jobId,
        status: "processing",
        message: "Job URL accepted. Scraping and automated extraction running in background.",
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error("Link ingestion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate link extraction" },
      { status: 500 }
    );
  }
}
