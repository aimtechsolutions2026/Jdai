import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { DailyAttemptRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ attempts: [] }, { status: 401 });
    }

    const attempts = await DailyAttemptRepository.getUserAttempts(session.userId);

    return NextResponse.json({
      success: true,
      attempts: attempts || [],
    });
  } catch (error) {
    console.error("MCQ history error:", error);
    return NextResponse.json(
      { error: "Failed to load submission history" },
      { status: 500 }
    );
  }
}
