import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { UserRepository } from "@/lib/repositories";
import { sendPasswordResetEmail } from "@/lib/brevo";

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
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

      await UserRepository.updateUser(String(user._id), {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      });

      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        req.headers.get("origin") ||
        "http://localhost:3000";
      const resetUrl = `${origin}/reset-password?token=${resetToken}`;

      await sendPasswordResetEmail(user.email, resetUrl, user.name);
    }

    // Always respond with success to prevent user email enumeration
    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent. Please check your inbox.",
    });
  } catch (err: any) {
    console.error("[FORGOT PASSWORD ERROR]", err);
    return NextResponse.json(
      { error: "Failed to process password reset request. Please try again later." },
      { status: 500 }
    );
  }
}

