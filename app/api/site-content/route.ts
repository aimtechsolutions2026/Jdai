import { NextRequest, NextResponse } from "next/server";
import { SiteContentRepository, DEFAULT_SITE_CONTENT } from "@/lib/site-content";

export async function GET(req: NextRequest) {
  try {
    const content = await SiteContentRepository.get();
    return NextResponse.json(
      {
        success: true,
        content: content || DEFAULT_SITE_CONTENT,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: true, content: DEFAULT_SITE_CONTENT },
      { status: 200 }
    );
  }
}
