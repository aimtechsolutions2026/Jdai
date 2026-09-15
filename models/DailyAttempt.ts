import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDailyAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  questionId: mongoose.Types.ObjectId;
  selectedOption: number;
  isCorrect: boolean;
  answeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DailyAttemptSchema = new Schema<IDailyAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "MCQQuestion",
      required: true,
    },
    selectedOption: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

DailyAttemptSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyAttempt: Model<IDailyAttempt> =
  mongoose.models.DailyAttempt ||
  mongoose.model<IDailyAttempt>("DailyAttempt", DailyAttemptSchema);

