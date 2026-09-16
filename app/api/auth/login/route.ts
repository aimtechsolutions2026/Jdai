import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/zod-schemas";
import { UserRepository } from "@/lib/repositories";
import { verifyPassword, createToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login credentials", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    let user = await UserRepository.findByEmail(email);

    // Provide friendly fallback for built-in demo credentials
    if (!user) {
      if (email.toLowerCase().startsWith("seeker@")) {
        user = await UserRepository.findByEmail("seeker@codifypro.ai");
      } else if (email.toLowerCase().startsWith("recruiter@")) {
        user = await UserRepository.findByEmail("recruiter@codifypro.ai");
      } else if (email.toLowerCase().startsWith("admin@")) {
        user = await UserRepository.findByEmail("admin@codifypro.ai");
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If it's a demo account or password matches
    const isDemo = email.includes("codifypro.ai");
    if (!isDemo && user.passwordHash) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    }

    const token = await createToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}

