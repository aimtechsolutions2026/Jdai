import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExperience {
  company: string;
  title: string;
  from: string;
  to: string;
  description: string;
}

export interface IEducation {
  school: string;
  degree: string;
  year: string;
}

export interface ICertificate {
  name: string;
  issuer: string;
  url?: string;
  date?: string;
}

export interface ISeekerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  parsedResumeRaw?: any;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  certificates: ICertificate[];
  salaryExpectation: {
    min: number;
    max: number;
    currency: string;
  };
  location?: string;
  pincode?: string;
  contact?: string;
  profileCompleteness: number;
  streak: {
    current: number;
    longest: number;
    lastSolvedDate?: string;
  };
  xp: number;
  createdAt: Date;
  updatedAt: Date;
}

const SeekerProfileSchema = new Schema<ISeekerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    resumeUrl: {
      type: String,
    },
    parsedResumeRaw: {
      type: Schema.Types.Mixed,
    },
    experience: [
      {
        company: { type: String, default: "" },
        title: { type: String, default: "" },
        from: { type: String, default: "" },
        to: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    education: [
      {
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        year: { type: String, default: "" },
      },
    ],
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    certificates: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        url: { type: String, default: "" },
        date: { type: String, default: "" },
      },
    ],
    salaryExpectation: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    location: {
      type: String,
      default: "",
      index: true,
    },
    pincode: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
    profileCompleteness: {
      type: Number,
      default: 20,
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastSolvedDate: { type: String },
    },
    xp: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const SeekerProfile: Model<ISeekerProfile> =
  mongoose.models.SeekerProfile ||
  mongoose.model<ISeekerProfile>("SeekerProfile", SeekerProfileSchema);

