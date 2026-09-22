import { NextRequest, NextResponse } from "next/server";
import { executeCronTask, startRecurringCron, getLastCronRun } from "@/lib/cron";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Ensure internal Node.js background timer is active
  startRecurringCron();

  // 2. Execute 10-minute cron task immediately
  const result = await executeCronTask();

  return NextResponse.json({
    success: true,
    message: "10-minute cron task executed successfully",
    schedule: "every 10 minutes",
    intervalMs: 600000,
    lastRun: result.timestamp,
    status: result,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

