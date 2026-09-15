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
        name: session.name,
        role: session.role,
        avatarUrl: user?.avatarUrl || "",
        streak: profile?.streak || { current: 3, longest: 7 },
        xp: profile?.xp || 150,
      },
      profile,
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

