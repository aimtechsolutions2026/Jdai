import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  return seedAdminHandler();
}

export async function POST() {
  return seedAdminHandler();
}

async function seedAdminHandler() {
  const ADMIN_EMAIL = "admin@codifypro.ai";
  const ADMIN_PASSWORD = "admin123";
  const ADMIN_NAME = "CodifyPro Admin";
  const ADMIN_PHONE = "+91 9999999999";

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        {
          error: "Database Service Unavailable",
          message:
            "Could not connect to MongoDB. Please ensure MongoDB is running or your current IP is whitelisted in MongoDB Atlas Network Access.",
        },
        { status: 503 }
      );
    }

    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existing) {
      existing.role = "admin";
      existing.passwordHash = passwordHash;
      existing.isVerified = true;
      existing.isActive = true;
      if (!existing.name) existing.name = ADMIN_NAME;
      await existing.save();

      return NextResponse.json({
        success: true,
        message: `Admin user (${ADMIN_EMAIL}) successfully updated in MongoDB!`,
        user: {
          id: String(existing._id),
          email: existing.email,
          role: existing.role,
          name: existing.name,
        },
        credentials: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        },
      });
    }

    const newAdmin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "admin",
      phone: ADMIN_PHONE,
      isVerified: true,
      isActive: true,
      deletionRequested: false,
    });

    return NextResponse.json({
      success: true,
      message: `Admin user (${ADMIN_EMAIL}) successfully created in MongoDB!`,
      user: {
        id: String(newAdmin._id),
        email: newAdmin.email,
        role: newAdmin.role,
        name: newAdmin.name,
      },
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    });
  } catch (error: any) {
    console.error("Admin seed error:", error);
    return NextResponse.json(
      {
        error: "Seeding Failed",
        message: error.message || "Failed to seed admin into MongoDB",
      },
      { status: 500 }
    );
  }
}
