import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ApplicationRepository, ProfileRepository, JobRepository, UserRepository } from "@/lib/repositories";
import { createNotification } from "@/lib/notifications";

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

    // Event Trigger 1: Notify Applicant
    const job = await JobRepository.findById(jobId);
    const roleTitle = job?.role || "Software Engineer";
    const company = job?.companyName || "Tech Company";

    await createNotification(session.userId, "application_update", {
      title: "Application Submitted",
      body: `You applied for ${roleTitle} at ${company}.`,
      relatedEntityId: String(application._id),
      actionUrl: "/applications",
      badgeText: company,
    });

    // Event Trigger 2: Notify Recruiter / Admin staff
    const allUsers = await UserRepository.findAll();
    const candidateUser = await UserRepository.findById(session.userId);
    const candidateName = candidateUser?.name || session.name || "Candidate";
    const staffToNotify = (allUsers || []).filter(
      (u: any) => u.role === "recruiter" || u.role === "admin"
    );
    for (const staff of staffToNotify.slice(0, 10)) {
      await createNotification(String(staff._id), "recruiter_update", {
        title: `New Applicant: ${candidateName}`,
        body: `Applied for ${roleTitle} at ${company}.`,
        relatedEntityId: String(application._id),
        actionUrl: "/recruiter/search",
        badgeText: roleTitle,
      });
    }

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

    // Event Trigger: Status Change Notification for Candidate
    try {
      const job = await JobRepository.findById(String(updated.jobId));
      const roleTitle = job?.role || "Software Engineer";
      const company = job?.companyName || "Tech Company";
      const candidateUserId = String(updated.userId);

      let title = "Application Status Update";
      let notifBody = `Update received on your application for ${roleTitle} at ${company}. Status: ${status}.`;
      let badge = "Status Update";

      if (status === "shortlisted") {
        title = "Application Shortlisted 🎉";
        notifBody = `Congratulations! Your application for ${roleTitle} at ${company} was shortlisted.`;
        badge = "Shortlisted";
      } else if (status === "viewed") {
        title = "Application Viewed";
        notifBody = `The hiring team at ${company} reviewed your application for ${roleTitle}.`;
        badge = "Viewed";
      } else if (status === "rejected") {
        title = "Application Status Update";
        notifBody = `Update received on your application for ${roleTitle} at ${company}.`;
        badge = "Status Update";
      }

      await createNotification(candidateUserId, "application_update", {
        title,
        body: notifBody,
        relatedEntityId: String(updated._id),
        actionUrl: "/applications",
        badgeText: badge,
      });
    } catch (notifErr) {
      console.warn("Failed to create application update notification:", notifErr);
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
