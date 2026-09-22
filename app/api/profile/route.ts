import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ProfileRepository, UserRepository } from "@/lib/repositories";
import { ProfileUpdateSchema } from "@/lib/zod-schemas";

const EMPTY_INITIAL_PROFILE = {
  name: "",
  email: "",
  phone: "",
  headline: "",
  summary: "",
  location: "",
  pincode: "",
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  achievements: [],
  projects: [],
  socialLinks: { linkedin: "", github: "", portfolio: "" },
  languages: [],
  salaryExpectation: { min: 600000, max: 1200000, currency: "INR" },
  profileCompleteness: 20,
  streak: { current: 0, longest: 0 },
  xp: 0,
};

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, existingProfile] = await Promise.all([
      UserRepository.findById(session.userId),
      ProfileRepository.findByUserId(session.userId),
    ]);

    let profile = existingProfile;
    if (!profile) {
      profile = await ProfileRepository.upsertByUserId(session.userId, {
        ...EMPTY_INITIAL_PROFILE,
        name: user?.name || session.name || "",
        email: user?.email || session.email || "",
        phone: user?.phone || "",
      });
    } else {
      profile = {
        ...EMPTY_INITIAL_PROFILE,
        ...profile,
        name: user?.name || profile.name || session.name || "",
        email: user?.email || profile.email || session.email || "",
        phone: user?.phone || profile.phone || profile.contact || "",
      };
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
    let completeness = 20;
    if (parsed.data.name && (parsed.data.phone || session.email)) completeness += 15;
    if (parsed.data.skills && parsed.data.skills.length > 0) completeness += 15;
    if (parsed.data.experience && parsed.data.experience.length > 0) completeness += 20;
    if (parsed.data.education && parsed.data.education.length > 0) completeness += 10;
    if (parsed.data.summary || parsed.data.headline) completeness += 10;
    if (parsed.data.certificates && parsed.data.certificates.length > 0) completeness += 5;
    if (parsed.data.projects && parsed.data.projects.length > 0) completeness += 5;
    completeness = Math.min(completeness, 100);

    // Sync name and phone to User model
    if (parsed.data.name || parsed.data.phone) {
      await UserRepository.update(session.userId, {
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
        ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
      });
    }

    const updated = await ProfileRepository.upsertByUserId(session.userId, {
      ...parsed.data,
      profileCompleteness: completeness,
    });

    return NextResponse.json({ success: true, isGuest: false, profile: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
