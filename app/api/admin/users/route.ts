import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { UserRepository, ProfileRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const rawUsers = await UserRepository.getAllUsers();

    // Enrich users with profile data
    const enrichedUsers = await Promise.all(
      rawUsers.map(async (u: any) => {
        const profile = await ProfileRepository.findByUserId(String(u._id));
        return {
          ...u,
          location: profile?.location || "Unspecified",
          skills: profile?.skills || [],
          experienceCount: profile?.experience?.length || 0,
          profileCompleteness: profile?.profileCompleteness || 60,
          streak: profile?.streak?.current || 0,
          profileData: profile || null,
        };
      })
    );

    return NextResponse.json({ success: true, users: enrichedUsers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, phone, location, skills } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password || "password123");
    const newUser = await UserRepository.create({
      name,
      email,
      passwordHash,
      role: role || "seeker",
      phone: phone || "",
      isVerified: true,
      avatarUrl: "",
    });

    // Create associated profile
    await ProfileRepository.upsertByUserId(String(newUser._id), {
      name,
      email,
      phone: phone || "",
      location: location || "San Francisco, CA",
      skills: Array.isArray(skills) ? skills : ["React", "TypeScript"],
      experience: [],
      education: [],
      certificates: [],
      profileCompleteness: 70,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, email, phone, role, isVerified, location, skills } = body;

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (role) updates.role = role;
    if (isVerified !== undefined) updates.isVerified = isVerified;

    const updatedUser = await UserRepository.update(id, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also update profile if location or skills were specified
    if (location !== undefined || skills !== undefined || name || phone) {
      const profUpdates: any = {};
      if (name) profUpdates.name = name;
      if (phone !== undefined) profUpdates.phone = phone;
      if (location !== undefined) profUpdates.location = location;
      if (skills !== undefined) profUpdates.skills = skills;
      await ProfileRepository.upsertByUserId(id, profUpdates);
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    await UserRepository.delete(id);
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
