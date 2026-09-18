import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ProfileRepository } from "@/lib/repositories";
import { ProfileUpdateSchema } from "@/lib/zod-schemas";

const DEFAULT_GUEST_PROFILE = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 349-2041",
  location: "San Francisco, CA",
  pincode: "94105",
  skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS", "Tailwind CSS"],
  experience: [
    {
      company: "Apex Tech Labs",
      title: "Senior Full-Stack Engineer",
      from: "2022",
      to: "Present",
      description: "Built scalable web apps and high-performance serverless endpoints in Next.js, TypeScript, and Go. Reduced API p99 latency by 45%.",
    },
    {
      company: "Starlight Systems",
      title: "Software Engineer",
      from: "2020",
      to: "2022",
      description: "Engineered reusable design system components in React and optimized real-time WebSocket event pipelines.",
    },
  ],
  education: [
    {
      school: "UC Berkeley",
      degree: "B.S. in Computer Science",
      year: "2020",
    },
  ],
  certificates: [
    {
      name: "AWS Certified Solutions Architect Associate",
      issuer: "Amazon Web Services",
      certificateId: "AWS-SAA-802319",
      date: "2023",
      url: "https://aws.amazon.com/verification",
    },
  ],
  salaryExpectation: { min: 140000, max: 185000, currency: "USD" },
  profileCompleteness: 85,
  streak: { current: 3, longest: 7 },
  xp: 220,
};

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profile = await ProfileRepository.findByUserId(session.userId);
    if (!profile) {
      profile = await ProfileRepository.upsertByUserId(session.userId, {
        ...DEFAULT_GUEST_PROFILE,
        name: session.name || DEFAULT_GUEST_PROFILE.name,
        email: session.email || DEFAULT_GUEST_PROFILE.email,
      });
    }

    return NextResponse.json({ profile, isGuest: false });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ProfileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Recalculate completeness
    let completeness = 30;
    if (parsed.data.skills && parsed.data.skills.length > 0) completeness += 20;
    if (parsed.data.experience && parsed.data.experience.length > 0) completeness += 25;
    if (parsed.data.education && parsed.data.education.length > 0) completeness += 15;
    if (parsed.data.certificates && parsed.data.certificates.length > 0) completeness += 10;
    completeness = Math.min(completeness, 100);

    const updated = await ProfileRepository.upsertByUserId(session.userId, {
      ...parsed.data,
      profileCompleteness: completeness,
    });

    return NextResponse.json({ success: true, isGuest: false, profile: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
