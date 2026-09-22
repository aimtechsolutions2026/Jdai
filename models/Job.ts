import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  source: "apify" | "link" | "manual-paste";
  companyName: string;
  companyLogoUrl?: string;
  role: string;
  jd: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  pincode?: string;
  experienceRequired: {
    min: number;
    max: number;
  };
  jobType: "remote" | "onsite" | "hybrid";
  applyUrl?: string;
  applyMode: "external" | "easy-apply";
  status: "pending-review" | "published" | "archived";
  skills?: string[];
  postedAt: Date;
  rawExtractedByAI?: any;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    source: {
      type: String,
      enum: ["apify", "link", "manual-paste"],
      default: "manual-paste",
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companyLogoUrl: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    jd: {
      type: String,
      required: true,
    },
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    location: {
      type: String,
      default: "Remote",
      index: true,
    },
    pincode: {
      type: String,
      default: "",
    },
    experienceRequired: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10 },
    },
    jobType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "remote",
      index: true,
    },
    applyUrl: {
      type: String,
      default: "",
    },
    applyMode: {
      type: String,
      enum: ["external", "easy-apply"],
      default: "easy-apply",
    },
    status: {
      type: String,
      enum: ["pending-review", "published", "archived"],
      default: "published",
      index: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    rawExtractedByAI: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Text index for high-speed keyword search across role, skills, company, and description
JobSchema.index(
  {
    role: "text",
    skills: "text",
    companyName: "text",
    jd: "text",
  },
  {
    weights: {
      role: 10,
      skills: 5,
      companyName: 3,
      jd: 1,
    },
    name: "JobTextSearchIndex",
  }
);

// Compound indexes for common discovery and filtering combinations (ESR rule)
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ status: 1, jobType: 1, postedAt: -1 });
JobSchema.index({ status: 1, location: 1, postedAt: -1 });
JobSchema.index({ status: 1, jobType: 1, location: 1, postedAt: -1 });

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

