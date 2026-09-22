import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { NotificationRepository } from "@/lib/repositories";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
    }

    const updated = await NotificationRepository.markAsRead(id, session.userId);
    if (!updated) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return PATCH(req, context);
}

