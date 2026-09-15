import { z } from "zod";

// 1. Resume AI Extracted Schema
export const ResumeParsedSchema = z.object({
  name: z.string().default(""),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().default(""),
  location: z.string().default(""),
  pincode: z.string().default(""),
  skills: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        title: z.string().default(""),
        from: z.string().default(""),
        to: z.string().default(""),
        description: z.string().default(""),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        school: z.string().default(""),
        degree: z.string().default(""),
        year: z.string().default(""),
      })
    )
    .default([]),
  certificates: z
    .array(
      z.object({
        name: z.string().default(""),
        issuer: z.string().default(""),
        url: z.string().default(""),
        date: z.string().default(""),
      })
    )
    .default([]),
  salaryExpectation: z
    .object({
      min: z.number().default(0),
      max: z.number().default(0),
      currency: z.string().default("USD"),
    })
    .default({ min: 0, max: 0, currency: "USD" }),
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
      currency: z.string().default("USD"),
    })
    .default({ min: 0, max: 0, currency: "USD" }),
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
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["seeker", "recruiter", "admin"]).default("seeker"),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// 4. Seeker Profile Update Schema
export const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  pincode: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z
    .array(
      z.object({
        company: z.string(),
        title: z.string(),
        from: z.string(),
        to: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        school: z.string(),
        degree: z.string(),
        year: z.string(),
      })
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        url: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .optional(),
  salaryExpectation: z
    .object({
      min: z.number(),
      max: z.number(),
      currency: z.string(),
    })
    .optional(),
});
