import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { UserRepository } from "@/lib/repositories";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const users = await UserRepository.getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

