import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
  | "application_update"
  | "streak"
  | "job_match"
  | "recruiter_update";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  relatedEntityId?: string;
  actionUrl?: string;
  badgeText?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["application_update", "streak", "job_match", "recruiter_update"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedEntityId: {
      type: String,
    },
    actionUrl: {
      type: String,
    },
    badgeText: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

// Compound index for ultra-fast unread queries and sorted user timelines
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema, "notifications");

