import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ProfileRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    let currentStreak = 3;
    let longestStreak = 7;
    let xp = 150;

    if (session) {
      const profile = await ProfileRepository.findByUserId(session.userId);
      if (profile) {
        currentStreak = profile.streak?.current ?? 3;
        longestStreak = profile.streak?.longest ?? 7;
        xp = profile.xp ?? 150;
      }
    }

    // Generate mock 14-day activity heatmap data
    const days = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split("T")[0];
      // Mark active if within current streak window
      const active = i < currentStreak;
      days.push({ date: str, active });
    }

    const leaderboard = [
      { rank: 1, name: "David Chen", streak: 22, xp: 660 },
      { rank: 2, name: "Elena Rostova", streak: 18, xp: 540 },
      { rank: 3, name: "Maya Lin", streak: 14, xp: 420 },
      { rank: 4, name: "Priya Sharma", streak: 9, xp: 270 },
      { rank: 5, name: session?.name || "You", streak: currentStreak, xp },
    ];

    return NextResponse.json({
      currentStreak,
      longestStreak,
      xp,
      days,
      leaderboard,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}

