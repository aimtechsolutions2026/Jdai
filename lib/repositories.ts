import { connectToDatabase } from "./db";
import { User, IUser } from "@/models/User";
import { Job, IJob } from "@/models/Job";
import { SeekerProfile, ISeekerProfile } from "@/models/SeekerProfile";
import { Application, IApplication } from "@/models/Application";
import { MCQQuestion, IMCQQuestion } from "@/models/MCQQuestion";
import { DailyAttempt } from "@/models/DailyAttempt";
import { SEED_JOBS, SEED_MCQS, SEED_CANDIDATES } from "./seed-data";

// In-memory runtime cache stores
let memoryJobs: any[] = [...SEED_JOBS];
let memoryMCQs: any[] = [...SEED_MCQS];
let memoryUsers: any[] = [
  {
    _id: "66e000000000000000000001",
    email: "seeker@talentpulse.ai",
    passwordHash: "$2a$10$wJjK...mockhash",
    name: "Alex Morgan",
    role: "seeker",
    phone: "+1 (555) 349-2041",
    avatarUrl: "",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    _id: "66e000000000000000000002",
    email: "recruiter@talentpulse.ai",
    passwordHash: "$2a$10$wJjK...mockhash",
    name: "Sarah Jenkins (Recruiter)",
    role: "recruiter",
    phone: "+1 (555) 890-1234",
    avatarUrl: "",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    _id: "66e000000000000000000003",
    email: "admin@talentpulse.ai",
    passwordHash: "$2a$10$wJjK...mockhash",
    name: "System Admin",
    role: "admin",
    phone: "+1 (555) 000-1111",
    avatarUrl: "",
    isVerified: true,
    createdAt: new Date(),
  },
];

let memoryProfiles: any[] = [
  {
    userId: "66e000000000000000000001",
    name: "Alex Morgan",
    email: "seeker@talentpulse.ai",
    phone: "+1 (555) 349-2041",
    location: "San Francisco, CA",
    pincode: "94105",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS"],
    experience: [
      {
        company: "Apex Tech Labs",
        title: "Senior Full-Stack Engineer",
        from: "2022",
        to: "Present",
        description: "Built scalable web apps and high-performance serverless endpoints in Next.js and Go.",
      },
      {
        company: "Starlight Systems",
        title: "Software Engineer",
        from: "2020",
        to: "2022",
        description: "Developed frontend client libraries and GraphQL microservices.",
      },
    ],
    education: [
      {
        school: "UC Berkeley",
        degree: "B.S. in Computer Science",
        year: "2020",
      },
    ],
    certificates: [
      {
        name: "AWS Solutions Architect Associate",
        issuer: "Amazon Web Services",
        url: "",
        date: "2023",
      },
    ],
    salaryExpectation: { min: 140000, max: 185000, currency: "USD" },
    profileCompleteness: 85,
    streak: { current: 3, longest: 7, lastSolvedDate: "" },
    xp: 220,
  },
];

// Seed other candidates into memory profiles
SEED_CANDIDATES.forEach((cand, idx) => {
  const fakeId = `66e00000000000000000001${idx + 4}`;
  memoryUsers.push({
    _id: fakeId,
    email: cand.email,
    passwordHash: "",
    name: cand.name,
    role: "seeker",
    phone: "+1 (555) 123-4567",
    avatarUrl: cand.avatarUrl,
    isVerified: true,
    createdAt: new Date(),
  });
  memoryProfiles.push({
    userId: fakeId,
    name: cand.name,
    email: cand.email,
    phone: "+1 (555) 123-4567",
    location: cand.location,
    pincode: "94016",
    skills: cand.skills,
    experience: [
      {
        company: "Tech Enterprise",
        title: cand.role,
        from: "2021",
        to: "Present",
        description: cand.bio,
      },
    ],
    education: [{ school: "Top University", degree: "B.S. CS", year: "2019" }],
    certificates: [],
    salaryExpectation: { min: 130000, max: 180000, currency: "USD" },
    profileCompleteness: cand.profileCompleteness,
    streak: { current: cand.streak, longest: cand.streak + 4 },
    xp: cand.streak * 30,
  });
});

let memoryApplications: any[] = [];
let memoryAttempts: any[] = [];

// JOB REPOSITORY
export const JobRepository = {
  async findMany(filters: {
    search?: string;
    role?: string;
    location?: string;
    jobType?: string;
    experienceMin?: number;
    salaryMin?: number;
    status?: string;
  }) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const query: any = {};
        if (filters.status) query.status = filters.status;
        else query.status = "published";

        if (filters.jobType && filters.jobType !== "all") {
          query.jobType = filters.jobType;
        }
        if (filters.location && filters.location !== "all") {
          query.location = { $regex: filters.location, $options: "i" };
        }
        if (filters.search) {
          query.$or = [
            { role: { $regex: filters.search, $options: "i" } },
            { companyName: { $regex: filters.search, $options: "i" } },
            { skills: { $in: [new RegExp(filters.search, "i")] } },
          ];
        }
        const jobs = await Job.find(query).sort({ postedAt: -1 }).lean();
        if (jobs && jobs.length > 0) return jobs;
      } catch (e) {
        console.warn("DB find error, fallback to memory:", e);
      }
    }

    // Memory fallback
    let result = [...memoryJobs];
    if (filters.status) {
      result = result.filter((j) => j.status === filters.status);
    } else {
      result = result.filter((j) => j.status === "published");
    }

    if (filters.jobType && filters.jobType !== "all") {
      result = result.filter((j) => j.jobType === filters.jobType);
    }
    if (filters.location && filters.location !== "all") {
      result = result.filter((j) =>
        j.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (j) =>
          j.role.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skills?.some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return result;
  },

  async findById(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const job = await Job.findById(id).lean();
        if (job) return job;
      } catch {}
    }
    return memoryJobs.find((j) => String(j._id) === id || j._id === id) || null;
  },

  async create(data: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const job = await Job.create(data);
        return job.toObject();
      } catch {}
    }
    const newJob = {
      ...data,
      _id: `66e01a1111111111111111${Date.now().toString().slice(-4)}`,
      postedAt: new Date(),
      status: data.status || "published",
    };
    memoryJobs.unshift(newJob);
    return newJob;
  },

  async update(id: string, updates: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const job = await Job.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (job) return job;
      } catch {}
    }
    const idx = memoryJobs.findIndex((j) => String(j._id) === id);
    if (idx !== -1) {
      memoryJobs[idx] = { ...memoryJobs[idx], ...updates };
      return memoryJobs[idx];
    }
    return null;
  },

  async delete(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await Job.findByIdAndDelete(id);
      } catch {}
    }
    memoryJobs = memoryJobs.filter((j) => String(j._id) !== id);
    return true;
  },
};

// USER & PROFILE REPOSITORY
export const UserRepository = {
  async findByEmail(email: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.findOne({ email: email.toLowerCase() }).lean();
        if (user) return user;
      } catch {}
    }
    return (
      memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
    );
  },

  async findById(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.findById(id).lean();
        if (user) return user;
      } catch {}
    }
    return memoryUsers.find((u) => String(u._id) === id) || null;
  },

  async create(userData: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.create(userData);
        return user.toObject();
      } catch {}
    }
    const newUser = {
      ...userData,
      _id: `66e00000000000000000000${Date.now().toString().slice(-4)}`,
      createdAt: new Date(),
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  async getAllUsers() {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const users = await User.find().lean();
        if (users && users.length > 0) return users;
      } catch {}
    }
    return memoryUsers;
  },
};

export const ProfileRepository = {
  async findByUserId(userId: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const profile = await SeekerProfile.findOne({ userId }).lean();
        if (profile) return profile;
      } catch {}
    }
    return memoryProfiles.find((p) => String(p.userId) === userId) || null;
  },

  async upsertByUserId(userId: string, data: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const profile = await SeekerProfile.findOneAndUpdate(
          { userId },
          { ...data, userId },
          { new: true, upsert: true }
        ).lean();
        return profile;
      } catch {}
    }
    const idx = memoryProfiles.findIndex((p) => String(p.userId) === userId);
    if (idx !== -1) {
      memoryProfiles[idx] = { ...memoryProfiles[idx], ...data };
      return memoryProfiles[idx];
    } else {
      const newProf = {
        userId,
        ...data,
        profileCompleteness: data.profileCompleteness || 60,
        streak: data.streak || { current: 1, longest: 1 },
        xp: data.xp || 50,
      };
      memoryProfiles.push(newProf);
      return newProf;
    }
  },

  async searchCandidates(filters: { skills?: string[]; role?: string; location?: string }) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const query: any = {};
        if (filters.skills && filters.skills.length > 0) {
          query.skills = { $in: filters.skills };
        }
        if (filters.location) {
          query.location = { $regex: filters.location, $options: "i" };
        }
        const profiles = await SeekerProfile.find(query).populate("userId").lean();
        if (profiles && profiles.length > 0) return profiles;
      } catch {}
    }

    // Memory filter
    let results = [...memoryProfiles];
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter((p) =>
        filters.skills!.some((s) =>
          p.skills?.some((ps: string) => ps.toLowerCase() === s.toLowerCase())
        )
      );
    }
    if (filters.location && filters.location !== "all") {
      results = results.filter((p) =>
        p.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    return results;
  },
};

// MCQ REPOSITORY
export const McqRepository = {
  async getAll() {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const questions = await MCQQuestion.find().lean();
        if (questions && questions.length > 0) return questions;
      } catch {}
    }
    return memoryMCQs;
  },

  async getTodayQuestion() {
    const all = await this.getAll();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const index = dayOfYear % all.length;
    return all[index] || all[0];
  },

  async findById(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const q = await MCQQuestion.findById(id).lean();
        if (q) return q;
      } catch {}
    }
    return memoryMCQs.find((q) => String(q._id) === id) || null;
  },

  async create(data: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const q = await MCQQuestion.create(data);
        return q.toObject();
      } catch {}
    }
    const newQ = {
      ...data,
      _id: `66e02b1111111111111111${Date.now().toString().slice(-4)}`,
    };
    memoryMCQs.push(newQ);
    return newQ;
  },
};

// APPLICATION REPOSITORY
export const ApplicationRepository = {
  async findByUser(userId: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const apps = await Application.find({ userId }).populate("jobId").lean();
        if (apps && apps.length > 0) return apps;
      } catch {}
    }
    return memoryApplications.filter((a) => String(a.userId) === userId);
  },

  async create(data: { userId: string; jobId: string; resumeUrlUsed?: string }) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const app = await Application.create(data);
        return app.toObject();
      } catch {}
    }
    const existing = memoryApplications.find(
      (a) => String(a.userId) === data.userId && String(a.jobId) === data.jobId
    );
    if (existing) return existing;

    const newApp = {
      _id: `66e03c1111111111111111${Date.now().toString().slice(-4)}`,
      ...data,
      status: "applied",
      appliedAt: new Date(),
    };
    memoryApplications.unshift(newApp);
    return newApp;
  },
};

