import { connectToDatabase } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __codifypro_cron_timer: NodeJS.Timeout | undefined;
  // eslint-disable-next-line no-var
  var __codifypro_last_cron_run: string | undefined;
}

export const TEN_MINUTES_MS = 10 * 60 * 1000; // 600,000 ms

/**
 * Execute the 10-minute maintenance and keep-alive task.
 */
export async function executeCronTask(): Promise<{
  timestamp: string;
  dbConnected: boolean;
  pingStatus: string;
}> {
  const timestamp = new Date().toISOString();
  global.__codifypro_last_cron_run = timestamp;

  console.log(`[Cron:10m] Running periodic 10-minute task at ${timestamp}...`);

  // 1. Maintain MongoDB connection alive
  let dbConnected = false;
  try {
    const conn = await connectToDatabase();
    dbConnected = Boolean(conn);
  } catch (err: any) {
    console.warn(`[Cron:10m] Database connection check: ${err.message}`);
  }

  // 2. Perform self-ping keep-alive if app URL is known
  let pingStatus = "skipped";
  try {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.RENDER_EXTERNAL_URL
        ? `https://${process.env.RENDER_EXTERNAL_URL}`
        : null) ||
      (process.env.PORT
        ? `http://localhost:${process.env.PORT}`
        : "http://localhost:3000");

    if (appUrl) {
      const pingRes = await fetch(`${appUrl}/api/health`, {
        headers: { "User-Agent": "CodifyPro-10m-Cron/1.0" },
        cache: "no-store",
      });
      pingStatus = `ok (${pingRes.status})`;
    }
  } catch (err: any) {
    pingStatus = `note: ${err.message}`;
  }

  console.log(
    `[Cron:10m] Completed at ${timestamp}. DB: ${dbConnected ? "connected" : "in-memory"}, Ping: ${pingStatus}`
  );

  return {
    timestamp,
    dbConnected,
    pingStatus,
  };
}

/**
 * Start the internal 10-minute recurring interval timer if not already running.
 */
export function startRecurringCron() {
  if (global.__codifypro_cron_timer) {
    return;
  }

  console.log("[Cron:10m] Initializing 10-minute recurring background cron runner...");

  // Schedule every 10 minutes
  global.__codifypro_cron_timer = setInterval(() => {
    executeCronTask().catch((err) => {
      console.error("[Cron:10m] Unhandled error during 10m cron execution:", err);
    });
  }, TEN_MINUTES_MS);

  if (global.__codifypro_cron_timer.unref) {
    global.__codifypro_cron_timer.unref();
  }
}

export function getLastCronRun(): string | null {
  return global.__codifypro_last_cron_run || null;
}

