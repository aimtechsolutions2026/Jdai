import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ProfileRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "recruiter" && session.role !== "admin")) {
      return NextResponse.json({ error: "Recruiter access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const skillsParam = searchParams.get("skills");
    const role = searchParams.get("role") || undefined;
    const location = searchParams.get("location") || undefined;

    const skills = skillsParam
      ? skillsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    const candidates = await ProfileRepository.searchCandidates({
      skills,
      role,
      location,
    });

    return NextResponse.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search candidates" },
      { status: 500 }
    );
  }
}

