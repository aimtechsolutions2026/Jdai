import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ApplicationRepository, ProfileRepository, JobRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await ApplicationRepository.findByUser(session.userId);

    // Populate job details
    const populated = await Promise.all(
      applications.map(async (app: any) => {
        const job = app.jobId?.role
          ? app.jobId
          : await JobRepository.findById(String(app.jobId));
        return {
          ...app,
          job: job || {
            role: "Software Engineer",
            companyName: "Tech Enterprise",
            location: "Remote",
          },
        };
      })
    );

    return NextResponse.json({ success: true, applications: populated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to apply" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const profile = await ProfileRepository.findByUserId(session.userId);
    const resumeUrlUsed = profile?.resumeUrl || "";

    const application = await ApplicationRepository.create({
      userId: session.userId,
      jobId,
      resumeUrlUsed,
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    return NextResponse.json({ error: "Failed to apply to job" }, { status: 500 });
  }
}

