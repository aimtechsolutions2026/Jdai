import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { MCQQuestion } from "@/models/MCQQuestion";
import { User } from "@/models/User";
import { SeekerProfile } from "@/models/SeekerProfile";
import { SEED_JOBS, SEED_MCQS, SEED_CANDIDATES } from "@/lib/seed-data";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        message: "In-memory database is active with seeded jobs, questions, and candidates.",
        seededInMemory: true,
      });
    }

    // Seed Jobs
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany(SEED_JOBS);
    }

    // Seed MCQs
    const mcqCount = await MCQQuestion.countDocuments();
    if (mcqCount === 0) {
      await MCQQuestion.insertMany(SEED_MCQS);
    }

    // Seed default demo accounts
    const existingSeeker = await User.findOne({ email: "seeker@codifypro.ai" });
    if (!existingSeeker) {
      const passwordHash = await hashPassword("demopassword123");
      const user = await User.create({
        email: "seeker@codifypro.ai",
        passwordHash,
        name: "Alex Morgan",
        role: "seeker",
        phone: "+1 (555) 349-2041",
        isVerified: true,
      });

      await SeekerProfile.create({
        userId: user._id,
        name: "Alex Morgan",
        email: "seeker@codifypro.ai",
        phone: "+1 (555) 349-2041",
        location: "San Francisco, CA",
        skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS"],
        experience: [
          {
            company: "Apex Tech Labs",
            title: "Senior Full-Stack Engineer",
            from: "2022",
            to: "Present",
            description: "Built scalable web apps and high-performance serverless endpoints in Next.js and Go.",
          },
        ],
        education: [{ school: "UC Berkeley", degree: "B.S. in Computer Science", year: "2020" }],
        certificates: [{ name: "AWS Solutions Architect Associate", issuer: "AWS", date: "2023" }],
        salaryExpectation: { min: 140000, max: 185000, currency: "USD" },
        profileCompleteness: 85,
        streak: { current: 3, longest: 7 },
        xp: 220,
      });
    }

    const existingRecruiter = await User.findOne({ email: "recruiter@codifypro.ai" });
    if (!existingRecruiter) {
      const passwordHash = await hashPassword("demopassword123");
      await User.create({
        email: "recruiter@codifypro.ai",
        passwordHash,
        name: "Sarah Jenkins",
        role: "recruiter",
        phone: "+1 (555) 890-1234",
        isVerified: true,
      });
    }

    const existingAdmin = await User.findOne({ email: "admin@codifypro.ai" });
    if (!existingAdmin) {
      const passwordHash = await hashPassword("demopassword123");
      await User.create({
        email: "admin@codifypro.ai",
        passwordHash,
        name: "System Admin",
        role: "admin",
        phone: "+1 (555) 000-1111",
        isVerified: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database successfully populated with jobs, MCQs, and demo accounts.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to seed" }, { status: 500 });
  }
}

