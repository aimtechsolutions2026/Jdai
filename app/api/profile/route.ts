import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ProfileRepository } from "@/lib/repositories";
import { ProfileUpdateSchema } from "@/lib/zod-schemas";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await ProfileRepository.findByUserId(session.userId);
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
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

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

