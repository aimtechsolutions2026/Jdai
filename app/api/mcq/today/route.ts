import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { McqRepository, ProfileRepository } from "@/lib/repositories";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    const todayQuestion = await McqRepository.getTodayQuestion();

    if (!todayQuestion) {
      return NextResponse.json({ error: "No question scheduled for today" }, { status: 404 });
    }

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let hasAttempted = false;
    let previousAttempt: any = null;

    if (session) {
      const cacheKey = `daily:${session.userId}:${todayStr}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        hasAttempted = true;
        try {
          previousAttempt = JSON.parse(cached);
        } catch {}
      }
    }

    // Do not reveal correctIndex unless user has already submitted!
    const sanitizedQuestion = {
      _id: todayQuestion._id,
      category: todayQuestion.category,
      difficulty: todayQuestion.difficulty,
      question: todayQuestion.question,
      options: todayQuestion.options,
      hasAttempted,
      previousAttempt,
      correctIndex: hasAttempted ? todayQuestion.correctIndex : undefined,
      explanation: hasAttempted ? todayQuestion.explanation : undefined,
    };

    return NextResponse.json({ success: true, question: sanitizedQuestion, date: todayStr });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load today's question" },
      { status: 500 }
    );
  }
}

