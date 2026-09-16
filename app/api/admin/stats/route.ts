import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  UserRepository,
  JobRepository,
  McqRepository,
  ApplicationRepository,
} from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const [users, jobs, mcqs, applications] = await Promise.all([
      UserRepository.getAllUsers(),
      JobRepository.findMany({ status: undefined }),
      McqRepository.getAll(),
      ApplicationRepository.findAll(),
    ]);

    const usersByRole = {
      seeker: users.filter((u: any) => u.role === "seeker").length,
      recruiter: users.filter((u: any) => u.role === "recruiter").length,
      admin: users.filter((u: any) => u.role === "admin").length,
    };

    const jobsByStatus = {
      published: jobs.filter((j: any) => j.status === "published" || !j.status).length,
      archived: jobs.filter((j: any) => j.status === "archived").length,
      draft: jobs.filter((j: any) => j.status === "draft").length,
    };

    const mcqsByCategory = {
      dsa: mcqs.filter((m: any) => m.category === "dsa").length,
      aptitude: mcqs.filter((m: any) => m.category === "aptitude").length,
      general: mcqs.filter((m: any) => m.category === "general").length,
    };

    const applicationsByStatus = {
      applied: applications.filter((a: any) => a.status === "applied").length,
      reviewing: applications.filter((a: any) => a.status === "reviewing").length,
      shortlisted: applications.filter((a: any) => a.status === "shortlisted").length,
      interviewing: applications.filter((a: any) => a.status === "interviewing").length,
      hired: applications.filter((a: any) => a.status === "hired").length,
      rejected: applications.filter((a: any) => a.status === "rejected").length,
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: users.length,
        usersByRole,
        totalJobs: jobs.length,
        jobsByStatus,
        totalMcqs: mcqs.length,
        mcqsByCategory,
        totalApplications: applications.length,
        applicationsByStatus,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}

