import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/zod-schemas";
import { UserRepository, ProfileRepository } from "@/lib/repositories";
import { hashPassword, createToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let { email, password, name, role, phone } = parsed.data;
    if (!name || !name.trim()) {
      name = email.split("@")[0] || "User";
    }

    // 1. Check if email already exists
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // 2. Check if phone number already exists
    if (phone && phone.trim()) {
      const existingPhone = await UserRepository.findByPhone(phone);
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists. Please sign in instead." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hashPassword(password);
    const user = await UserRepository.create({
      email,
      passwordHash,
      name,
      role,
      phone: phone || "",
      isVerified: true,
    });

    // Create seeker profile if seeker
    if (role === "seeker") {
      await ProfileRepository.upsertByUserId(String(user._id), {
        name,
        email,
        phone: phone || "",
        location: "United States",
        skills: ["React", "TypeScript", "Node.js"],
        experience: [],
        education: [],
        certificates: [],
        profileCompleteness: 35,
        streak: { current: 1, longest: 1 },
        xp: 25,
      });
    }

    // Create auth token
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
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

