import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSessionUser } from "@/lib/auth";
import { UserRepository } from "@/lib/repositories";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current password and new password are required." },
        { status: 400 }
      );
    }

    const user = await UserRepository.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect current password. Please check and try again." },
        { status: 400 }
      );
    }

    // New password complexity validation
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      return NextResponse.json(
        {
          error:
            "New password must be at least 8 characters long and contain uppercase letters, lowercase letters, and a number.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UserRepository.updateUser(session.userId, { passwordHash });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err: any) {
    console.error("[CHANGE PASSWORD ERROR]", err);
    return NextResponse.json(
      { error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }
}

