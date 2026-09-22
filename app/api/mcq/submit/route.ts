import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { McqRepository, ProfileRepository } from "@/lib/repositories";
import { redis } from "@/lib/redis";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to play Daily MCQ" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, selectedIndex } = body;

    if (!questionId || selectedIndex === undefined) {
      return NextResponse.json(
        { error: "Question ID and selected option are required" },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const cacheKey = `daily:${session.userId}:${todayStr}`;

    // 1. Check Redis daily attempt flag
    const alreadyAttempted = await redis.get(cacheKey);
    if (alreadyAttempted) {
      return NextResponse.json(
        { error: "You have already completed today's challenge. Come back tomorrow!" },
        { status: 429 }
      );
    }

    // 2. Fetch question and verify answer
    const question = await McqRepository.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isCorrect = Number(selectedIndex) === question.correctIndex;

    // 3. Compute streak
    const profile = await ProfileRepository.findByUserId(session.userId);
    let currentStreak = profile?.streak?.current || 0;
    let longestStreak = profile?.streak?.longest || 0;
    const lastDate = profile?.streak?.lastSolvedDate;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (isCorrect) {
      if (lastDate === yesterdayStr) {
        currentStreak += 1;
      } else if (lastDate === todayStr) {
        // already solved
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // wrong answer: streak resets to 0 or 1
      currentStreak = Math.max(0, currentStreak);
    }

    const xpEarned = isCorrect ? 25 : 5;
    const newXp = (profile?.xp || 0) + xpEarned;

    // 4. Update Profile
    await ProfileRepository.upsertByUserId(session.userId, {
      streak: {
        current: currentStreak,
        longest: longestStreak,
        lastSolvedDate: todayStr,
      },
      xp: newXp,
    });

    // Event Trigger: Create Streak Notification
    if (isCorrect) {
      try {
        await createNotification(session.userId, "streak", {
          title: "Daily Streak Active 🔥",
          body: `You completed today's coding challenge! Current learning streak: ${currentStreak} day${currentStreak === 1 ? "" : "s"}.`,
          relatedEntityId: questionId,
          actionUrl: "/mcq",
          badgeText: `${currentStreak}d Streak`,
        });
      } catch (notifErr) {
        console.warn("Failed to create streak notification:", notifErr);
      }
    }

    // 5. Store Redis flag for 24h
    const attemptRecord = {
      isCorrect,
      selectedIndex,
      correctIndex: question.correctIndex,
      date: todayStr,
    };
    await redis.set(cacheKey, JSON.stringify(attemptRecord), { ex: 86400 });

    return NextResponse.json({
      success: true,
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      currentStreak,
      longestStreak,
      xpEarned,
      totalXp: newXp,
    });
  } catch (error: any) {
    console.error("MCQ submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}

