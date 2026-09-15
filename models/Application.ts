import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  resumeUrlUsed?: string;
  status: "applied" | "viewed" | "shortlisted" | "rejected";
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    resumeUrlUsed: {
      type: String,
    },
    status: {
      type: String,
      enum: ["applied", "viewed", "shortlisted", "rejected"],
      default: "applied",
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

