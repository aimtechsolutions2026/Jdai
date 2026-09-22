import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { NotificationRepository } from "@/lib/repositories";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const modifiedCount = await NotificationRepository.markAllAsRead(session.userId);
    return NextResponse.json({ success: true, modifiedCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}

