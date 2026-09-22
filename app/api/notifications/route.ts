import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  ApplicationRepository,
  JobRepository,
  ProfileRepository,
  UserRepository,
} from "@/lib/repositories";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    const notifications: any[] = [];
    const userId = session.userId;
    const role = session.role;

    // 1. Fetch user's profile
    const profile = await ProfileRepository.findByUserId(userId);

    // ========================================================================
    // ROLE: SEEKER
    // ========================================================================
    if (role === "seeker") {
      // 1A. Real Applications
      const userApps = await ApplicationRepository.findByUser(userId);
      for (const app of userApps.slice(0, 5)) {
        const job = app.jobId?.role
          ? app.jobId
          : await JobRepository.findById(String(app.jobId));
        const roleTitle = job?.role || "Software Engineer";
        const company = job?.companyName || "Tech Venture";
        const appStatus = app.status || "applied";

        let title = "Application Submitted";
        let desc = `You applied for ${roleTitle} at ${company}.`;
        let badge = company;

        if (appStatus === "shortlisted") {
          title = "Application Shortlisted 🎉";
          desc = `Congratulations! Your application for ${roleTitle} at ${company} was shortlisted.`;
          badge = "Shortlisted";
        } else if (appStatus === "viewed") {
          title = "Application Viewed";
          desc = `The hiring team at ${company} reviewed your application for ${roleTitle}.`;
          badge = "Viewed";
        } else if (appStatus === "rejected") {
          title = "Application Status Update";
          desc = `Update received on your application for ${roleTitle} at ${company}.`;
          badge = "Status Update";
        }

        notifications.push({
          id: `app-${app._id}`,
          type: "application",
          title,
          description: desc,
          timestamp: formatRelativeTime(app.updatedAt || app.appliedAt || new Date()),
          createdAt: app.updatedAt || app.appliedAt || new Date(),
          unread: true,
          actionUrl: "/dashboard",
          badgeText: badge,
        });
      }

      // 1B. Daily Challenge & Streak
      const streakCurrent = profile?.streak?.current ?? 0;
      const todayStr = new Date().toISOString().split("T")[0];
      const solvedToday = profile?.streak?.lastSolvedDate === todayStr;

      if (solvedToday) {
        notifications.push({
          id: `streak-active-${todayStr}`,
          type: "streak",
          title: "Daily Streak Active 🔥",
          description: `You completed today's coding challenge! Current learning streak: ${streakCurrent} days.`,
          timestamp: "Today",
          createdAt: new Date(),
          unread: false,
          actionUrl: "/mcq",
          badgeText: `${streakCurrent}d Streak`,
        });
      } else {
        notifications.push({
          id: `streak-pending-${todayStr}`,
          type: "streak",
          title: "Today's Challenge Awaiting 🔥",
          description: `Solve today's coding challenge to keep your ${streakCurrent}-day streak alive!`,
          timestamp: "Pending",
          createdAt: new Date(),
          unread: true,
          actionUrl: "/mcq",
          badgeText: streakCurrent > 0 ? `${streakCurrent}d at Risk` : "Start Streak",
        });
      }

      // 1C. Real Recent Job Opportunities
      const recentJobs = await JobRepository.findMany({ status: "published" });
      for (const job of (recentJobs || []).slice(0, 3)) {
        notifications.push({
          id: `job-${job._id}`,
          type: "job",
          title: `New Position: ${job.role}`,
          description: `${job.companyName} is hiring in ${job.location} • ${formatSalaryRange(
            job.salaryRange
          )}`,
          timestamp: formatRelativeTime(job.postedAt || job.createdAt || new Date()),
          createdAt: job.postedAt || job.createdAt || new Date(),
          unread: true,
          actionUrl: `/jobs/${job._id}`,
          badgeText: job.companyName,
        });
      }

      // 1D. Profile Completeness Alert
      const completeness = profile?.profileCompleteness ?? 30;
      if (completeness < 80) {
        notifications.push({
          id: `profile-complete-${completeness}`,
          type: "profile",
          title: "Boost Recruiter Visibility",
          description: `Your candidate profile is ${completeness}% complete. Add more verified skills or upload your resume to get noticed.`,
          timestamp: "Tip",
          createdAt: new Date(Date.now() - 3600000),
          unread: false,
          actionUrl: "/profile",
          badgeText: `${completeness}% Done`,
        });
      }
    }

    // ========================================================================
    // ROLE: RECRUITER
    // ========================================================================
    if (role === "recruiter") {
      const allApps = await ApplicationRepository.findAll();
      for (const app of (allApps || []).slice(0, 5)) {
        const job = app.job || (await JobRepository.findById(String(app.jobId)));
        const candidate = app.user || (await UserRepository.findById(String(app.userId)));

        notifications.push({
          id: `rec-app-${app._id}`,
          type: "application",
          title: `New Applicant: ${candidate?.name || "Verified Engineer"}`,
          description: `Applied for ${job?.role || "Position"} at ${job?.companyName || "Company"}.`,
          timestamp: formatRelativeTime(app.appliedAt || new Date()),
          createdAt: app.appliedAt || new Date(),
          unread: true,
          actionUrl: "/recruiter/search",
          badgeText: job?.role || "Applicant",
        });
      }

      notifications.push({
        id: "rec-talent-search",
        type: "activity",
        title: "Talent Discovery Active",
        description: "Filter candidates by stack (React, Next.js, Go, Python) and download verified ATS profiles.",
        timestamp: "Live",
        createdAt: new Date(),
        unread: false,
        actionUrl: "/recruiter/search",
        badgeText: "Talent Pool",
      });
    }

    // ========================================================================
    // ROLE: ADMIN
    // ========================================================================
    if (role === "admin") {
      const recentJobs = await JobRepository.findMany({ status: "published" });
      for (const job of (recentJobs || []).slice(0, 4)) {
        notifications.push({
          id: `adm-job-${job._id}`,
          type: "job",
          title: `Live Opportunity: ${job.role}`,
          description: `Published for ${job.companyName} • ${formatSalaryRange(job.salaryRange)}`,
          timestamp: formatRelativeTime(job.postedAt || new Date()),
          createdAt: job.postedAt || new Date(),
          unread: false,
          actionUrl: "/admin/jobs",
          badgeText: job.companyName,
        });
      }

      notifications.push({
        id: "adm-system-health",
        type: "activity",
        title: "Platform Services Healthy",
        description: "MongoDB Atlas cluster and Groq AI inference engine are operational.",
        timestamp: "Now",
        createdAt: new Date(),
        unread: false,
        actionUrl: "/admin",
        badgeText: "System Live",
      });
    }

    // Sort notifications by date (newest first)
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

