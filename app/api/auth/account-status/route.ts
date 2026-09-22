import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { UserRepository } from "@/lib/repositories";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Invalid account status value. Expected boolean." },
        { status: 400 }
      );
    }

    const updated = await UserRepository.updateUser(session.userId, { isActive });
    return NextResponse.json({
      success: true,
      isActive: updated.isActive,
      message: isActive ? "Account activated successfully." : "Account deactivated successfully.",
    });
  } catch (err: any) {
    console.error("[ACCOUNT STATUS ERROR]", err);
    return NextResponse.json({ error: "Failed to update account status." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, reason } = body;

    if (action === "request_deletion") {
      const updated = await UserRepository.updateUser(session.userId, {
        deletionRequested: true,
        deletionRequestedAt: new Date(),
        deletionReason: reason?.trim() || "User requested account deletion via dashboard.",
      });

      return NextResponse.json({
        success: true,
        deletionRequested: true,
        deletionRequestedAt: updated.deletionRequestedAt,
        message:
          "Account deletion request submitted. An administrator will review and process your request within 48 hours.",
      });
    }

    if (action === "cancel_deletion") {
      await UserRepository.updateUser(session.userId, {
        deletionRequested: false,
        deletionRequestedAt: null,
        deletionReason: "",
      });

      return NextResponse.json({
        success: true,
        deletionRequested: false,
        message: "Account deletion request has been cancelled.",
      });
    }

    return NextResponse.json({ error: "Invalid action. Expected 'request_deletion' or 'cancel_deletion'." }, { status: 400 });
  } catch (err: any) {
    console.error("[DELETION REQUEST ERROR]", err);
    return NextResponse.json({ error: "Failed to process account deletion request." }, { status: 500 });
  }
}

