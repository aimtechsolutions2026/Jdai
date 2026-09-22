import mongoose, { Schema, Document, Model } from "mongoose";

export type IngestionJobType = "resume" | "jd_paste" | "jd_link";
export type IngestionJobStatus = "processing" | "completed" | "failed";

export interface IIngestionJob extends Document {
  _id: mongoose.Types.ObjectId;
  type: IngestionJobType;
  status: IngestionJobStatus;
  inputRef?: string;
  result?: any;
  error?: string | null;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IngestionJobSchema = new Schema<IIngestionJob>(
  {
    type: {
      type: String,
      enum: ["resume", "jd_paste", "jd_link"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
      index: true,
    },
    inputRef: {
      type: String,
      default: "",
    },
    result: {
      type: Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const IngestionJob: Model<IIngestionJob> =
  mongoose.models.IngestionJob ||
  mongoose.model<IIngestionJob>("IngestionJob", IngestionJobSchema);

