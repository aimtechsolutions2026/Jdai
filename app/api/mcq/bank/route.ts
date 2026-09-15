import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { McqRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const questions = await McqRepository.getAll();
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch question bank" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { category, question, options, correctIndex, difficulty, explanation } = body;

    if (!question || !options || options.length < 2 || correctIndex === undefined) {
      return NextResponse.json(
        { error: "Please provide question, at least 2 options, and correct index" },
        { status: 400 }
      );
    }

    const newQ = await McqRepository.create({
      category: category || "dsa",
      question,
      options,
      correctIndex: Number(correctIndex),
      difficulty: difficulty || "medium",
      explanation: explanation || "",
    });

    return NextResponse.json({ success: true, question: newQ });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

