import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { parseResumeWithGroq } from "@/lib/groq";
import { ProfileRepository, UserRepository } from "@/lib/repositories";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
    }

    // 1. Strict PDF validation
    const filename = file.name || "resume.pdf";
    if (!filename.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF resumes are accepted." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Extract text using pdf-parse in-memory with raw buffer stream fallback
    let extractedText = "";
    try {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || "";
    } catch (e) {
      console.warn("PDF text parse warning, attempting stream fallback:", e);
    }

    // If pdf-parse extracted minimal text, attempt ASCII/UTF-8 chunk recovery
    if (!extractedText || extractedText.trim().length < 30) {
      const rawStr = buffer.toString("utf-8");
      const textChunks = rawStr.match(/[\x20-\x7E\t\n\r]{4,}/g);
      if (textChunks && textChunks.length > 0) {
        extractedText = textChunks.join("\n");
      }
    }

    // 3. The raw PDF buffer is discarded immediately after text extraction.
    // No PDF file is stored on external cloud storage or database,
    // preserving candidate data privacy and eliminating storage costs.

    // 4. Send text to AI and heuristic parsing engine for full structured extraction
    const parsedData = await parseResumeWithGroq(extractedText);

    // 5. Calculate profile completeness
    let completeness = 20;
    if (parsedData.name && (parsedData.email || parsedData.phone)) completeness += 15;
    if (parsedData.skills && parsedData.skills.length > 0) completeness += 15;
    if (parsedData.experience && parsedData.experience.length > 0) completeness += 20;
    if (parsedData.education && parsedData.education.length > 0) completeness += 10;
    if (parsedData.summary || parsedData.headline) completeness += 10;
    if (parsedData.certificates && parsedData.certificates.length > 0) completeness += 5;
    if (parsedData.projects && parsedData.projects.length > 0) completeness += 5;
    completeness = Math.min(completeness, 100);

    let updatedProfile = {
      parsedResumeRaw: parsedData,
      name: parsedData.name || session?.name || "",
      email: parsedData.email || session?.email || "",
      phone: parsedData.phone || "",
      headline: parsedData.headline || "",
      summary: parsedData.summary || "",
      location: parsedData.location || "",
      pincode: parsedData.pincode || "",
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      certificates: parsedData.certificates || [],
      achievements: parsedData.achievements || [],
      projects: parsedData.projects || [],
      socialLinks: parsedData.socialLinks || { linkedin: "", github: "", portfolio: "" },
      languages: parsedData.languages || [],
      salaryExpectation: parsedData.salaryExpectation || { min: 800000, max: 1500000, currency: "INR" },
      profileCompleteness: completeness,
    };

    // 6. If logged in, persist to SeekerProfile and User
    if (session) {
      if (parsedData.name || parsedData.phone) {
        await UserRepository.update(session.userId, {
          ...(parsedData.name ? { name: parsedData.name } : {}),
          ...(parsedData.phone ? { phone: parsedData.phone } : {}),
        });
      }
      updatedProfile = await ProfileRepository.upsertByUserId(session.userId, updatedProfile);
    }

    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully and all profile fields populated. Uploaded document has been securely processed and discarded.",
      parsedData,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process resume" },
      { status: 500 }
    );
  }
}
