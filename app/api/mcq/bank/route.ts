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

interface NormalizedMCQ {
  category: "dsa" | "aptitude" | "general";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function normalizeQuestion(item: any): NormalizedMCQ | null {
  if (!item || typeof item !== "object") return null;
  const question = typeof item.question === "string" ? item.question.trim() : "";
  if (!question) return null;

  let options: string[] = [];
  if (Array.isArray(item.options)) {
    options = item.options.map((opt: any) => String(opt).trim()).filter(Boolean);
  } else if (item.options && typeof item.options === "object") {
    options = Object.values(item.options).map((opt: any) => String(opt).trim()).filter(Boolean);
  }

  if (options.length < 2) return null;

  let correctIndex = 0;
  if (typeof item.correctIndex === "number") {
    correctIndex = Math.max(0, Math.min(options.length - 1, item.correctIndex));
  } else if (typeof item.correctIndex === "string") {
    const trimmed = item.correctIndex.trim().toUpperCase();
    if (/^[A-Z]$/.test(trimmed)) {
      correctIndex = trimmed.charCodeAt(0) - 65;
    } else {
      const parsed = parseInt(trimmed, 10);
      correctIndex = isNaN(parsed) ? 0 : parsed;
    }
  } else if (typeof item.correctAnswer === "string") {
    const trimmed = item.correctAnswer.trim();
    const foundIdx = options.findIndex((o) => o.toLowerCase() === trimmed.toLowerCase());
    if (foundIdx !== -1) {
      correctIndex = foundIdx;
    } else if (/^[A-Za-z]$/.test(trimmed)) {
      correctIndex = trimmed.toUpperCase().charCodeAt(0) - 65;
    }
  }
  correctIndex = Math.max(0, Math.min(options.length - 1, correctIndex));

  let category: "dsa" | "aptitude" | "general" = "dsa";
  if (item.category) {
    const cat = String(item.category).toLowerCase().trim();
    if (cat.includes("apt")) category = "aptitude";
    else if (cat.includes("gen") || cat.includes("system") || cat.includes("web")) category = "general";
    else category = "dsa";
  }

  let difficulty: "easy" | "medium" | "hard" = "medium";
  if (item.difficulty) {
    const diff = String(item.difficulty).toLowerCase().trim();
    if (diff === "easy" || diff === "medium" || diff === "hard") {
      difficulty = diff;
    }
  }

  const explanation = typeof item.explanation === "string" ? item.explanation.trim() : "";

  return {
    category,
    difficulty,
    question,
    options,
    correctIndex,
    explanation,
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();

    const rawList = Array.isArray(body)
      ? body
      : Array.isArray(body.questions)
      ? body.questions
      : [body];

    const normalizedList: NormalizedMCQ[] = [];
    for (const item of rawList) {
      const q = normalizeQuestion(item);
      if (q) normalizedList.push(q);
    }

    if (normalizedList.length === 0) {
      return NextResponse.json(
        {
          error:
            "Invalid format. Each question requires a question statement, at least 2 options, and a correct answer index.",
        },
        { status: 400 }
      );
    }

    if (normalizedList.length === 1 && !Array.isArray(body) && !Array.isArray(body.questions)) {
      const newQ = await McqRepository.create(normalizedList[0]);
      return NextResponse.json({ success: true, question: newQ });
    }

    const created = await McqRepository.createMany(normalizedList);
    return NextResponse.json({
      success: true,
      count: created.length,
      questions: created,
      message: `Successfully imported ${created.length} challenge question${created.length === 1 ? "" : "s"}!`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create question(s)" },
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
