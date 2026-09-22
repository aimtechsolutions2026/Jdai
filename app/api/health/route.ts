import { NextResponse } from "next/server";
import { startRecurringCron, getLastCronRun } from "@/lib/cron";

export const dynamic = "force-dynamic";

export async function GET() {
  // Ensure the 10-minute recurring cron is initialized
  startRecurringCron();

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      cron: {
        active: true,
        schedule: "every 10 minutes",
        intervalMs: 600000,
        lastRun: getLastCronRun(),
      },
    },
    { status: 200 }
  );
}
