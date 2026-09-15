import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMCQQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  category: "dsa" | "aptitude" | "general";
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}

const MCQQuestionSchema = new Schema<IMCQQuestion>(
  {
    category: {
      type: String,
      enum: ["dsa", "aptitude", "general"],
      default: "dsa",
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length >= 2, "At least 2 options required"],
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      index: true,
    },
    explanation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const MCQQuestion: Model<IMCQQuestion> =
  mongoose.models.MCQQuestion ||
  mongoose.model<IMCQQuestion>("MCQQuestion", MCQQuestionSchema);

