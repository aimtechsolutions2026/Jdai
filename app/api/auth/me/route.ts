import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { UserRepository, ProfileRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await UserRepository.findById(session.userId);
    const profile =
      session.role === "seeker"
        ? await ProfileRepository.findByUserId(session.userId)
        : null;

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: user?.name || session.name,
        phone: user?.phone || profile?.phone || "",
        role: session.role,
        avatarUrl: user?.avatarUrl || "",
        isVerified: user?.isVerified ?? true,
        isActive: user?.isActive ?? true,
        deletionRequested: user?.deletionRequested ?? false,
        deletionRequestedAt: user?.deletionRequestedAt || null,
        createdAt: user?.createdAt || null,
        streak: profile?.streak || { current: 0, longest: 0 },
        xp: profile?.xp || 0,
      },
      profile,
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const updates: any = {};
    if (typeof name === "string" && name.trim()) {
      updates.name = name.trim();
    }
    if (typeof phone === "string") {
      updates.phone = phone.trim();
    }

    const updatedUser = await UserRepository.updateUser(session.userId, updates);

    // Also sync candidate profile if seeker
    if (session.role === "seeker") {
      await ProfileRepository.upsertByUserId(session.userId, {
        phone: updates.phone,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        isActive: updatedUser.isActive,
      },
      message: "Personal details updated successfully.",
    });
  } catch (error: any) {
    console.error("[UPDATE ME ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update personal details." },
      { status: 500 }
    );
  }
}
