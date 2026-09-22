import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRepository } from "@/lib/repositories";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing password reset token." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Please enter a valid new password." },
        { status: 400 }
      );
    }

    // Password validation rules
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long and contain uppercase letters, lowercase letters, and at least one number.",
        },
        { status: 400 }
      );
    }

    const user = await UserRepository.findByResetToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Password reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await UserRepository.updateUser(String(user._id), {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You can now sign in.",
    });
  } catch (err: any) {
    console.error("[RESET PASSWORD ERROR]", err);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}

