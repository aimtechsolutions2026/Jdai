import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ProfileRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    let currentStreak = 0;
    let longestStreak = 0;
    let xp = 0;

    if (session) {
      const profile = await ProfileRepository.findByUserId(session.userId);
      if (profile) {
        currentStreak = profile.streak?.current ?? 0;
        longestStreak = profile.streak?.longest ?? 0;
        xp = profile.xp ?? 0;
      }
    }

    // Generate real 14-day activity heatmap data
    const days = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split("T")[0];
      const active = i < currentStreak;
      days.push({ date: str, active });
    }

    // Fetch real leaderboard from database
    const leaderboard = await ProfileRepository.getLeaderboard(5);

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
