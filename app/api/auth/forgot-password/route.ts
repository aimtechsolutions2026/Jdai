import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { UserRepository } from "@/lib/repositories";
import { sendNewPasswordEmail } from "@/lib/brevo";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserRepository.findByEmail(cleanEmail);

    if (user) {
      // Generate a clean, secure new password that meets validation rules:
      // (at least 8 chars, uppercase, lowercase, number, symbol)
      const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
      const newPassword = `Codify#${randomSuffix}9`;

      const passwordHash = await hashPassword(newPassword);

      await UserRepository.updateUser(String(user._id), {
        passwordHash,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });

      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        req.headers.get("origin") ||
        "http://localhost:3000";
      const loginUrl = `${origin}/login`;

      await sendNewPasswordEmail(user.email, newPassword, loginUrl, user.name);
    }

    // Always respond with success to prevent user email enumeration
    return NextResponse.json({
      success: true,
      message:
        "If your email is registered in our platform, you will get a new password in your email to login.",
    });
  } catch (err: any) {
    console.error("[FORGOT PASSWORD ERROR]", err);
    return NextResponse.json(
      { error: "Failed to process password request. Please try again later." },
      { status: 500 }
    );
  }
}

