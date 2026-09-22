import { NotificationRepository, UserRepository } from "./repositories";
import { NotificationType } from "@/models/Notification";

export interface CreateNotificationPayload {
  title: string;
  body: string;
  relatedEntityId?: string;
  actionUrl?: string;
  badgeText?: string;
}

/**
 * Shared helper to insert a precomputed event-driven notification into the database.
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  payload: CreateNotificationPayload
) {
  try {
    if (!userId) return null;
    return await NotificationRepository.create({
      userId: String(userId),
      type,
      title: payload.title,
      body: payload.body,
      relatedEntityId: payload.relatedEntityId,
      actionUrl: payload.actionUrl,
      badgeText: payload.badgeText,
      read: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error(`[Notification] Failed to create notification for user ${userId}:`, error);
    return null;
  }
}

/**
 * Dispatches job_match notifications to active seekers when a new job is published.
 */
export async function notifyMatchingSeekersOfJob(job: any) {
  try {
    if (!job || job.status !== "published") return;

    const users = await UserRepository.findAll();
    const seekers = (users || []).filter((u: any) => u.role === "seeker");

    const roleName = job.role || "Software Engineer";
    const company = job.companyName || "Tech Company";
    const location = job.location || "Remote";

    const candidatesToNotify = seekers.slice(0, 50);
    for (const seeker of candidatesToNotify) {
      await createNotification(String(seeker._id), "job_match", {
        title: `New Position: ${roleName}`,
        body: `${company} is hiring in ${location}. Review requirements and apply!`,
        relatedEntityId: String(job._id),
        actionUrl: `/jobs/${job._id}`,
        badgeText: company,
      });
    }
  } catch (error) {
    console.error("[Notification] Failed to notify seekers of new job:", error);
  }
}

