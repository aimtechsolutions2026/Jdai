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

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, category, question, options, correctIndex, difficulty, explanation } = body;

    if (!id) {
      return NextResponse.json({ error: "Question id is required" }, { status: 400 });
    }

    const updates: any = {};
    if (category) updates.category = category;
    if (question) updates.question = question;
    if (options && options.length >= 2) updates.options = options;
    if (correctIndex !== undefined) updates.correctIndex = Number(correctIndex);
    if (difficulty) updates.difficulty = difficulty;
    if (explanation !== undefined) updates.explanation = explanation;

    const updated = await McqRepository.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, question: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Question id is required" }, { status: 400 });
    }

    await McqRepository.delete(id);
    return NextResponse.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
