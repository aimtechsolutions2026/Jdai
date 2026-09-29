import { NextResponse } from "next/server";
import { JobRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cities = await JobRepository.getDistinctCities();
    return NextResponse.json({ success: true, cities });
  } catch (error) {
    console.error("Error fetching distinct cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}

