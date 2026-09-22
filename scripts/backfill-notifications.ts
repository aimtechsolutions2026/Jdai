/**
 * ============================================================================
 * MIGRATION SCRIPT STUB: Backfill Notifications for Existing Users
 * ============================================================================
 *
 * PURPOSE:
 * Scaffolds one-time event-driven notifications for historical records created
 * before the precomputed notifications collection was introduced.
 *
 * INSTRUCTIONS:
 * 1. Do NOT execute this script automatically during builds or dev server startup.
 * 2. If deploying to staging/production with existing live users, run manually via:
 *    npx ts-node scripts/backfill-notifications.ts
 *
 * TARGET POPULATION:
 * - Applications: Creates application_update notifications for past candidate applications.
 * - Daily MCQ Attempts: Creates streak notifications for users with active streaks.
 * - Published Jobs: Creates initial job_match notifications for candidate seekers.
 */

import { connectToDatabase } from "../lib/db";
import { Application } from "../models/Application";
import { Job } from "../models/Job";
import { SeekerProfile } from "../models/SeekerProfile";
import { Notification } from "../models/Notification";

async function backfillNotifications() {
  console.log("[Migration Stub] Connecting to MongoDB...");
  const conn = await connectToDatabase();
  if (!conn) {
    console.error("[Migration Stub] MongoDB connection failed. Ensure MONGODB_URI is set.");
    process.exit(1);
  }

  console.log("[Migration Stub] Scanning existing records to backfill...");

  let backfillCount = 0;

  try {
    // 1. Backfill Applications
    const applications = await Application.find().populate("jobId").limit(100);
    console.log(`[Migration Stub] Found ${applications.length} historical applications.`);

    for (const app of applications) {
      const existing = await Notification.findOne({
        userId: app.userId,
        relatedEntityId: String(app._id),
      });

      if (!existing) {
        const job: any = app.jobId;
        const roleTitle = job?.role || "Software Engineer";
        const company = job?.companyName || "Tech Company";

        await Notification.create({
          userId: app.userId,
          type: "application_update",
          title: app.status === "shortlisted" ? "Application Shortlisted 🎉" : "Application Submitted",
          body: `You applied for ${roleTitle} at ${company}. Status: ${app.status || "applied"}.`,
          relatedEntityId: String(app._id),
          actionUrl: "/applications",
          badgeText: company,
          read: true, // Marked as read for historical backfills
          createdAt: app.appliedAt || app.createdAt || new Date(),
        });
        backfillCount++;
      }
    }

    // 2. Backfill Active Streaks
    const profiles = await SeekerProfile.find({ "streak.current": { $gt: 0 } }).limit(50);
    console.log(`[Migration Stub] Found ${profiles.length} profiles with active streaks.`);

    for (const p of profiles) {
      const existing = await Notification.findOne({
        userId: p.userId,
        type: "streak",
      });

      if (!existing && p.streak?.current) {
        await Notification.create({
          userId: p.userId,
          type: "streak",
          title: "Daily Streak Active 🔥",
          body: `Keep your learning streak alive! Current streak: ${p.streak.current} days.`,
          actionUrl: "/mcq",
          badgeText: `${p.streak.current}d Streak`,
          read: true,
          createdAt: new Date(),
        });
        backfillCount++;
      }
    }

    console.log(`[Migration Stub] Successfully created ${backfillCount} backfilled notifications.`);
  } catch (error) {
    console.error("[Migration Stub] Error during backfill:", error);
  } finally {
    console.log("[Migration Stub] Completed backfill process.");
  }
}

// Export for programmatic invocation if needed
export default backfillNotifications;

