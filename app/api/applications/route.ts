import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ApplicationRepository, ProfileRepository, JobRepository, UserRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const viewAll = searchParams.get("all") === "true";

    // If admin requests all, or user is admin and all=true
    if (session.role === "admin" && (viewAll || searchParams.has("admin"))) {
      const allApps = await ApplicationRepository.findAll();
      const populated = await Promise.all(
        allApps.map(async (app: any) => {
          const job = app.jobId?.role
            ? app.jobId
            : await JobRepository.findById(String(app.jobId));
          const user = app.userId?.name
            ? app.userId
            : await UserRepository.findById(String(app.userId));
          const profile = await ProfileRepository.findByUserId(String(app.userId?._id || app.userId));

          return {
            ...app,
            job: job || {
              role: "Software Engineer",
              companyName: "Tech Enterprise",
              location: "Remote",
            },
            user: user || {
              name: "Candidate",
              email: "applicant@codifypro.ai",
            },
            profile: profile || null,
          };
        })
      );
      return NextResponse.json({ success: true, applications: populated });
    }

    // Default: seeker's applications
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

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.role !== "recruiter")) {
      return NextResponse.json({ error: "Admin or Recruiter access required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updated = await ApplicationRepository.update(id, { status });
    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Application id is required" }, { status: 400 });
    }

    await ApplicationRepository.delete(id);
    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
