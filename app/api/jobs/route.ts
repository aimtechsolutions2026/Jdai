import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/lib/repositories";
import { getSessionUser } from "@/lib/auth";
import { JobCreateSchema } from "@/lib/zod-schemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const jobType = searchParams.get("jobType") || undefined;
    const role = searchParams.get("role") || undefined;
    const salaryMin = searchParams.get("salaryMin")
      ? Number(searchParams.get("salaryMin"))
      : undefined;

    const jobs = await JobRepository.findMany({
      search,
      location,
      jobType,
      role,
      salaryMin,
      status: "published",
    });

    return NextResponse.json({ success: true, count: jobs.length, jobs });
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
    const newJob = await JobRepository.create({
      ...body,
      postedAt: new Date(),
      status: body.status || "published",
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

