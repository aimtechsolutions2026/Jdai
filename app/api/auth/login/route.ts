import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/zod-schemas";
import { UserRepository } from "@/lib/repositories";
import { verifyPassword, createToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        {
          error: "Database Service Unavailable",
          message:
            "Unable to connect to the database. Please ensure your MongoDB Atlas cluster is online and your current IP address is whitelisted in MongoDB Atlas Network Access.",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login credentials", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await UserRepository.findByEmailOrPhone(email);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
        { status: 401 }
      );
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
    if (error?.message === "DATABASE_UNAVAILABLE") {
      return NextResponse.json(
        {
          error: "Database Service Unavailable",
          message:
            "Unable to connect to the database. Please ensure your MongoDB Atlas cluster is online and your current IP address is whitelisted in MongoDB Atlas Network Access.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
