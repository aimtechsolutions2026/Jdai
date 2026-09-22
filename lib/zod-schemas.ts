import { z } from "zod";

// Safe string coercer that never throws on numbers or nulls
const safeString = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((val) => (val === null || val === undefined ? "" : String(val).trim()))
  .default("");

// 1. Resume AI Extracted Schema
export const ResumeParsedSchema = z.object({
  name: safeString,
  email: safeString,
  phone: safeString,
  headline: safeString,
  summary: safeString,
  location: safeString,
  pincode: safeString,
  skills: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        company: safeString,
        title: safeString,
        from: safeString,
        to: safeString,
        description: safeString,
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        school: safeString,
        degree: safeString,
        year: safeString,
      })
    )
    .default([]),
  certificates: z
    .array(
      z.object({
        name: safeString,
        issuer: safeString,
        certificateId: safeString,
        url: safeString,
        date: safeString,
      })
    )
    .default([]),
  achievements: z.array(z.string()).default([]),
  projects: z
    .array(
      z.object({
        name: safeString,
        description: safeString,
        techStack: safeString,
        url: safeString,
      })
    )
    .default([]),
  socialLinks: z
    .object({
      linkedin: safeString,
      github: safeString,
      portfolio: safeString,
    })
    .default({}),
  languages: z.array(z.string()).default([]),
  salaryExpectation: z
    .object({
      min: z.coerce.number().default(0),
      max: z.coerce.number().default(0),
      currency: safeString.default("INR"),
    })
    .default({ min: 0, max: 0, currency: "INR" }),
});

export type ResumeParsedData = z.infer<typeof ResumeParsedSchema>;

// 2. Job AI Extraction Schema
export const JobExtractedSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyLogoUrl: z.string().optional().default(""),
  role: z.string().min(1, "Role title is required"),
  jd: z.string().min(10, "Job description is required"),
  salaryRange: z
    .object({
      min: z.number().default(0),
      max: z.number().default(0),
      currency: z.string().default("INR"),
    })
    .default({ min: 0, max: 0, currency: "INR" }),
  location: z.string().default("Remote"),
  pincode: z.string().default(""),
  experienceRequired: z
    .object({
      min: z.number().default(0),
      max: z.number().default(10),
    })
    .default({ min: 0, max: 5 }),
  jobType: z.enum(["remote", "onsite", "hybrid"]).default("remote"),
  applyUrl: z.string().default(""),
  applyMode: z.enum(["external", "easy-apply"]).default("easy-apply"),
  skills: z.array(z.string()).default([]),
});

export type JobExtractedData = z.infer<typeof JobExtractedSchema>;
export const JobCreateSchema = JobExtractedSchema;

// 3. User Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["seeker", "recruiter", "admin"]).default("seeker"),
  phone: z
    .string()
    .min(8, "Please enter a valid phone number (at least 8 digits)"),
  termsAccepted: z.boolean().optional(),
});

export const LoginSchema = z.object({
  email: z.string().min(3, "Please enter your email or phone number"),
  password: z.string().min(1, "Password is required"),
});

// 4. Seeker Profile Update Schema
export const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  pincode: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z
    .array(
      z.object({
        company: safeString,
        title: safeString,
        from: safeString,
        to: safeString,
        description: safeString,
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        school: safeString,
        degree: safeString,
        year: safeString,
      })
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: safeString,
        issuer: safeString,
        certificateId: safeString,
        url: safeString,
        date: safeString,
      })
    )
    .optional(),
  achievements: z.array(z.string()).optional(),
  projects: z
    .array(
      z.object({
        name: safeString,
        description: safeString,
        techStack: safeString,
        url: safeString,
      })
    )
    .optional(),
  socialLinks: z
    .object({
      linkedin: safeString,
      github: safeString,
      portfolio: safeString,
    })
    .optional(),
  languages: z.array(z.string()).optional(),
  salaryExpectation: z
    .object({
      min: z.coerce.number().default(0),
      max: z.coerce.number().default(0),
      currency: safeString.default("INR"),
    })
    .optional(),
});
