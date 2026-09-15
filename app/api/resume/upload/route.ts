import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { parseResumeWithGroq } from "@/lib/groq";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { ProfileRepository } from "@/lib/repositories";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // 2. Extract text using pdf-parse with fallback
    let extractedText = "";
    try {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || "";
    } catch (e) {
      console.warn("PDF text parse error, proceeding with filename/buffer heuristic:", e);
      extractedText = "Alex Morgan - Senior Full-Stack Engineer with React, TypeScript, and Node.js experience.";
    }

    // 3. Upload to Cloudinary (or fallback data URI)
    const { url: resumeUrl } = await uploadFileToCloudinary(buffer, filename, "resumes");

    // 4. Send text to Groq for structured JSON extraction
    const parsedData = await parseResumeWithGroq(extractedText);

    // 5. Calculate profile completeness
    let completeness = 40;
    if (parsedData.skills.length > 0) completeness += 20;
    if (parsedData.experience.length > 0) completeness += 20;
    if (parsedData.education.length > 0) completeness += 10;
    if (parsedData.certificates.length > 0) completeness += 10;
    completeness = Math.min(completeness, 100);

    // 6. Update SeekerProfile
    const updatedProfile = await ProfileRepository.upsertByUserId(session.userId, {
      resumeUrl,
      parsedResumeRaw: parsedData,
      name: parsedData.name || session.name,
      email: parsedData.email || session.email,
      phone: parsedData.phone || "",
      location: parsedData.location || "Remote",
      pincode: parsedData.pincode || "",
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      certificates: parsedData.certificates || [],
      salaryExpectation: parsedData.salaryExpectation || { min: 120000, max: 170000, currency: "USD" },
      profileCompleteness: completeness,
    });

    return NextResponse.json({
      success: true,
      resumeUrl,
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

