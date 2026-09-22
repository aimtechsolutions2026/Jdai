import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { NotificationRepository } from "@/lib/repositories";
import { formatRelativeTime } from "@/lib/utils";

/**
 * GET /api/notifications
 * 
 * Precomputed, event-driven paginated notifications query.
 * Direct indexed read: find({ userId }).sort({ createdAt: -1 }).limit(n)
 * Zero live derivation, zero cross-collection joins.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: true, notifications: [], unreadCount: 0 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
    const filterReadParam = searchParams.get("read");
    const filterRead =
      filterReadParam === "true" ? true : filterReadParam === "false" ? false : undefined;

    // Fast indexed query backed by compound index: { userId: 1, read: 1, createdAt: -1 }
    const rawNotifs = await NotificationRepository.findByUser(session.userId, {
      page,
      limit,
      read: filterRead,
    });

    const unreadCount = await NotificationRepository.countUnread(session.userId);
    const totalCount = await NotificationRepository.countByUser(session.userId);

    // Map UI type compatibility for frontend rendering
    const uiTypeMap: Record<string, "application" | "job" | "streak" | "profile" | "activity"> = {
      application_update: "application",
      job_match: "job",
      streak: "streak",
      recruiter_update: "application",
    };

    const notifications = (rawNotifs || []).map((n: any) => ({
      id: String(n._id),
      _id: String(n._id),
      userId: String(n.userId),
      type: uiTypeMap[n.type] || "activity",
      rawType: n.type,
      title: n.title,
      body: n.body,
      description: n.body,
      read: Boolean(n.read),
      unread: !n.read,
      timestamp: formatRelativeTime(n.createdAt),
      createdAt: n.createdAt,
      relatedEntityId: n.relatedEntityId || null,
      actionUrl:
        n.actionUrl ||
        (n.type === "streak"
          ? "/mcq"
          : n.type === "job_match"
          ? n.relatedEntityId
            ? `/jobs/${n.relatedEntityId}`
            : "/jobs"
          : "/applications"),
      badgeText:
        n.badgeText ||
        (n.type === "streak"
          ? "Streak"
          : n.type === "job_match"
          ? "Job Match"
          : "Application"),
    }));

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    });
  } catch (error: any) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * 
 * Batch mark all notifications for the authenticated user as read.
 */
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
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
