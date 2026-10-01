import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/lib/repositories";
import { getSessionUser } from "@/lib/auth";
import { JobCreateSchema } from "@/lib/zod-schemas";
import { notifyMatchingSeekersOfJob } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const city = searchParams.get("city") || undefined;
    const jobType = searchParams.get("jobType") || undefined;
    const role = searchParams.get("role") || undefined;
    const salaryMin = searchParams.get("salaryMin")
      ? Number(searchParams.get("salaryMin"))
      : undefined;
    const experienceMin = searchParams.get("experienceMin")
      ? Number(searchParams.get("experienceMin"))
      : undefined;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam ? Math.max(1, Number(pageParam)) : 1;
    const limit = limitParam ? Math.max(1, Math.min(50, Number(limitParam))) : 10;

    const { jobs, totalCount, totalPages, hasMore } = await JobRepository.findManyPaginated({
      search,
      location,
      city,
      jobType,
      role,
      salaryMin,
      experienceMin,
      status: "published",
      page,
      limit,
    });

    // Exclude applyUrl from jobs list response so unauthenticated viewers and list endpoints do not expose direct apply links
    const sanitizedJobs = (jobs || []).map((job: any) => {
      const jobObj = job.toObject ? job.toObject() : { ...job };
      delete jobObj.applyUrl;
      return jobObj;
    });

    return NextResponse.json(
      {
        success: true,
        count: totalCount,
        page,
        limit,
        totalPages,
        hasMore,
        jobs: sanitizedJobs,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    let normalizedCity = body.city ? String(body.city).trim() : "";
    if (normalizedCity) {
      normalizedCity = normalizedCity
        .split(" ")
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
        .join(" ");
    }

    const newJob = await JobRepository.create({
      ...body,
      city: normalizedCity,
      postedAt: new Date(),
      status: body.status || "published",
    });

    // Event Trigger: Notify active seekers of new matching job
    if (newJob.status === "published") {
      notifyMatchingSeekersOfJob(newJob).catch((err) =>
        console.warn("Failed to notify seekers of new job:", err)
      );
    }

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

