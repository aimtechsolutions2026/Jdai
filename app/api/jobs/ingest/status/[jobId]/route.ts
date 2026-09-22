import { NextRequest, NextResponse } from "next/server";
import { IngestionJobRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const job = await IngestionJobRepository.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Ingestion job not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: job.status,
      result: job.result || null,
      error: job.error || null,
      type: job.type,
      updatedAt: job.updatedAt,
    });
  } catch (error: any) {
    console.error("Job status check error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check job status" },
      { status: 500 }
    );
  }
}

