import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { SiteContentRepository, DEFAULT_SITE_CONTENT } from "@/lib/site-content";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const content = await SiteContentRepository.get();
    return NextResponse.json({
      success: true,
      content: content || DEFAULT_SITE_CONTENT,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch site content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await SiteContentRepository.update(body);

    return NextResponse.json({
      success: true,
      content: updated,
      message: "Website content updated successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update site content" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    if (body.action === "reset") {
      const resetContent = await SiteContentRepository.reset();
      return NextResponse.json({
        success: true,
        content: resetContent,
        message: "Website content has been reset to defaults!",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
