import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/lib/repositories";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await JobRepository.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    const session = await getSessionUser(req);
    const jobData = job.toObject ? job.toObject() : { ...job };

    // If user is not logged in, omit the apply link
    if (!session) {
      delete jobData.applyUrl;
    }

    return NextResponse.json(
      { success: true, job: jobData },
      {
        headers: {
          "Cache-Control": session
            ? "private, no-cache, no-store"
            : "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    if (body.city !== undefined) {
      let normalizedCity = body.city ? String(body.city).trim() : "";
      if (normalizedCity) {
        normalizedCity = normalizedCity
          .split(" ")
          .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
          .join(" ");
      }
      body.city = normalizedCity;
    }
    const updated = await JobRepository.update(params.id, body);
    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await JobRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

