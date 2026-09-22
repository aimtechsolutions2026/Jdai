import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Database seeding is permanently disabled. CodifyPro runs with zero mock/demo data.",
      seeded: false,
    },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message: "Database seeding is permanently disabled. CodifyPro runs with zero mock/demo data.",
      seeded: false,
    },
    { status: 200 }
  );
}
