import { NextRequest, NextResponse } from "next/server";
import { ProfileRepository, UserRepository } from "@/lib/repositories";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Candidate ID required" }, { status: 400 });
    }

    // 1. Fetch user if ID is userId, or fetch profile first
    let user = await UserRepository.findById(id);
    let profile = await ProfileRepository.findByIdOrUserId(id);

    // If profile was found by profileId, get user by profile.userId
    if (profile && !user && profile.userId) {
      user = await UserRepository.findById(String(profile.userId));
    }

    if (!profile && !user) {
      return NextResponse.json({ error: "Candidate resume not found" }, { status: 404 });
    }

    const publicResume = {
      id: String(user?._id || profile?._id || id),
      name: user?.name || profile?.name || "Candidate",
      email: user?.email || profile?.email || "",
      phone: user?.phone || profile?.phone || "",
      headline: profile?.headline || "Software Engineer",
      summary: profile?.summary || "",
      location: profile?.location || "",
      pincode: profile?.pincode || "",
      skills: profile?.skills || [],
      experience: profile?.experience || [],
      education: profile?.education || [],
      certificates: profile?.certificates || [],
      achievements: profile?.achievements || [],
      projects: profile?.projects || [],
      socialLinks: profile?.socialLinks || { linkedin: "", github: "", portfolio: "" },
      languages: profile?.languages || [],
      salaryExpectation: profile?.salaryExpectation || null,
      resumeUrl: profile?.resumeUrl || "",
    };

    return NextResponse.json(
      { success: true, profile: publicResume },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load public resume:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

