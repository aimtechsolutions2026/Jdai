import { connectToDatabase } from "./db";
import { User, IUser } from "@/models/User";
import { Job, IJob } from "@/models/Job";
import { SeekerProfile, ISeekerProfile } from "@/models/SeekerProfile";
import { Application, IApplication } from "@/models/Application";
import { IngestionJob, IIngestionJob } from "@/models/IngestionJob";
import { Notification, INotification, NotificationType } from "@/models/Notification";
import { MCQQuestion, IMCQQuestion } from "@/models/MCQQuestion";
import { DailyAttempt } from "@/models/DailyAttempt";
import { SEED_JOBS, SEED_MCQS, SEED_CANDIDATES } from "./seed-data";

// In-memory runtime cache stores
let memoryJobs: any[] = [];
let memoryMCQs: any[] = [];
let memoryNotifications: any[] = [];
let memoryUsers: any[] = [
  {
    _id: "66e000000000000000000001",
    email: "seeker@codifypro.ai",
    passwordHash: "$2a$10$wJjK...mockhash",
    name: "Candidate Seeker",
    role: "seeker",
    phone: "",
    avatarUrl: "",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    _id: "66e000000000000000000002",
    email: "recruiter@codifypro.ai",
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
    email: "admin@codifypro.ai",
    passwordHash: "$2a$10$wJjK...mockhash",
    name: "System Admin",
    role: "admin",
    phone: "+1 (555) 000-1111",
    avatarUrl: "",
    isVerified: true,
    createdAt: new Date(),
  },
];

let memoryProfiles: any[] = [];

let memoryApplications: any[] = [];
let memoryAttempts: any[] = [];
let memoryIngestionJobs: any[] = [];

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
          query.$text = { $search: filters.search };
        }
        if (filters.salaryMin && filters.salaryMin > 0) {
          query["salaryRange.max"] = { $gte: filters.salaryMin };
        }
        if (filters.experienceMin !== undefined && filters.experienceMin > 0) {
          query["experienceRequired.min"] = { $gte: filters.experienceMin };
        }
        const jobs = await Job.find(query).sort({ postedAt: -1 }).lean();
        return jobs;
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
    if (filters.salaryMin && filters.salaryMin > 0) {
      result = result.filter(
        (j) =>
          (j.salaryRange?.max || 0) >= filters.salaryMin! ||
          (j.salaryRange?.min || 0) >= filters.salaryMin!
      );
    }
    if (filters.experienceMin !== undefined && filters.experienceMin > 0) {
      result = result.filter(
        (j) => (j.experienceRequired?.min || 0) >= filters.experienceMin!
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

  async findByPhone(phone: string) {
    if (!phone || !phone.trim()) return null;
    const clean = phone.trim();
    const digits = clean.replace(/[^0-9]/g, "");
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.findOne({
          $or: [
            { phone: clean },
            ...(digits.length >= 8 ? [{ phone: { $regex: digits } }] : []),
          ],
        }).lean();
        if (user) return user;
      } catch {}
    }
    return (
      memoryUsers.find((u) => {
        if (!u.phone) return false;
        const uDigits = u.phone.replace(/[^0-9]/g, "");
        return u.phone === clean || (digits.length >= 8 && uDigits.includes(digits));
      }) || null
    );
  },

  async findByEmailOrPhone(identifier: string) {
    if (!identifier || !identifier.trim()) return null;
    const clean = identifier.trim();
    if (clean.includes("@")) {
      return UserRepository.findByEmail(clean);
    }
    const byEmail = await UserRepository.findByEmail(clean);
    if (byEmail) return byEmail;
    return UserRepository.findByPhone(clean);
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

  async updateUser(id: string, updateData: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.findByIdAndUpdate(
          id,
          { ...updateData },
          { new: true }
        ).lean();
        if (user) return user;
      } catch {}
    }
    const idx = memoryUsers.findIndex((u) => String(u._id) === id);
    if (idx !== -1) {
      memoryUsers[idx] = { ...memoryUsers[idx], ...updateData, updatedAt: new Date() };
      return memoryUsers[idx];
    }
    return null;
  },

  async findByResetToken(token: string) {
    if (!token) return null;
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: new Date() },
        }).lean();
        if (user) return user;
      } catch {}
    }
    return (
      memoryUsers.find(
        (u: any) =>
          u.resetPasswordToken === token &&
          u.resetPasswordExpires &&
          new Date(u.resetPasswordExpires) > new Date()
      ) || null
    );
  },

  async findAll() {
    return UserRepository.getAllUsers();
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

  async update(id: string, updates: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (user) return user;
      } catch {}
    }
    const idx = memoryUsers.findIndex((u) => String(u._id) === id);
    if (idx !== -1) {
      memoryUsers[idx] = { ...memoryUsers[idx], ...updates };
      return memoryUsers[idx];
    }
    return null;
  },

  async delete(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await User.findByIdAndDelete(id);
        await SeekerProfile.deleteOne({ userId: id });
      } catch {}
    }
    memoryUsers = memoryUsers.filter((u) => String(u._id) !== id);
    memoryProfiles = memoryProfiles.filter((p) => String(p.userId) !== id);
    return true;
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

  async findByIdOrUserId(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        let profile = await SeekerProfile.findOne({
          $or: [{ userId: id }, { _id: id }],
        }).lean();
        if (profile) return profile;
      } catch {}
    }
    return (
      memoryProfiles.find(
        (p) => String(p.userId) === id || String(p._id) === id
      ) || null
    );
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
        return profiles || [];
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

  async getLeaderboard(limit = 5) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const top = await SeekerProfile.find({ "streak.current": { $gt: 0 } })
          .sort({ "streak.current": -1, xp: -1 })
          .limit(limit)
          .populate("userId")
          .lean();
        return top.map((p: any, idx: number) => ({
          rank: idx + 1,
          name: p.name || p.userId?.name || "Anonymous",
          streak: p.streak?.current || 0,
          xp: p.xp || 0,
        }));
      } catch {}
    }
    return memoryProfiles
      .filter((p) => (p.streak?.current || 0) > 0)
      .sort((a, b) => (b.streak?.current || 0) - (a.streak?.current || 0))
      .slice(0, limit)
      .map((p, idx) => ({
        rank: idx + 1,
        name: p.name || "Anonymous",
        streak: p.streak?.current || 0,
        xp: p.xp || 0,
      }));
  },
};

// MCQ REPOSITORY
export const McqRepository = {
  async getAll() {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const questions = await MCQQuestion.find().lean();
        return questions;
      } catch {}
    }
    return memoryMCQs;
  },

  async getTodayQuestion() {
    const all = await this.getAll();
    if (!all || all.length === 0) return null;
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const index = dayOfYear % all.length;
    return all[index] || all[0] || null;
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

  async update(id: string, updates: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const q = await MCQQuestion.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (q) return q;
      } catch {}
    }
    const idx = memoryMCQs.findIndex((q) => String(q._id) === id);
    if (idx !== -1) {
      memoryMCQs[idx] = { ...memoryMCQs[idx], ...updates };
      return memoryMCQs[idx];
    }
    return null;
  },

  async delete(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await MCQQuestion.findByIdAndDelete(id);
      } catch {}
    }
    memoryMCQs = memoryMCQs.filter((q) => String(q._id) !== id);
    return true;
  },
};

// APPLICATION REPOSITORY
export const ApplicationRepository = {
  async findAll() {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const apps = await Application.find()
          .populate("jobId")
          .populate("userId")
          .sort({ appliedAt: -1 })
          .lean();
        if (apps && apps.length > 0) return apps;
      } catch {}
    }
    // Memory fallback populated
    return memoryApplications.map((app) => {
      const job = memoryJobs.find((j) => String(j._id) === String(app.jobId)) || {
        role: "Software Engineer",
        companyName: "Tech Corp",
        location: "Remote",
      };
      const user = memoryUsers.find((u) => String(u._id) === String(app.userId)) || {
        name: "Applicant",
        email: "candidate@codifypro.ai",
      };
      return { ...app, job, user };
    });
  },

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

  async update(id: string, updates: any) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const app = await Application.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (app) return app;
      } catch {}
    }
    const idx = memoryApplications.findIndex((a) => String(a._id) === id);
    if (idx !== -1) {
      memoryApplications[idx] = { ...memoryApplications[idx], ...updates };
      return memoryApplications[idx];
    }
    return null;
  },

  async delete(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await Application.findByIdAndDelete(id);
      } catch {}
    }
    memoryApplications = memoryApplications.filter((a) => String(a._id) !== id);
    return true;
  },
};

// INGESTION JOB REPOSITORY
export const IngestionJobRepository = {
  async create(data: {
    type: "resume" | "jd_paste" | "jd_link";
    status?: "processing" | "completed" | "failed";
    inputRef?: string;
    userId?: string;
    result?: any;
    error?: string | null;
  }) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const job = await IngestionJob.create({
          status: "processing",
          ...data,
        });
        return job.toObject();
      } catch (e) {
        console.warn("MongoDB IngestionJob.create failed, falling back to memory:", e);
      }
    }
    const newJob = {
      _id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: data.type,
      status: data.status || "processing",
      inputRef: data.inputRef || "",
      userId: data.userId || null,
      result: data.result || null,
      error: data.error || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryIngestionJobs.unshift(newJob);
    return newJob;
  },

  async findById(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const job = await IngestionJob.findById(id).lean();
        if (job) return job;
      } catch {}
    }
    return memoryIngestionJobs.find((j) => String(j._id) === String(id)) || null;
  },

  async update(
    id: string,
    updates: {
      status?: "processing" | "completed" | "failed";
      result?: any;
      error?: string | null;
    }
  ) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const job = await IngestionJob.findByIdAndUpdate(
          id,
          { ...updates, updatedAt: new Date() },
          { new: true }
        ).lean();
        if (job) return job;
      } catch {}
    }
    const idx = memoryIngestionJobs.findIndex((j) => String(j._id) === String(id));
    if (idx !== -1) {
      memoryIngestionJobs[idx] = {
        ...memoryIngestionJobs[idx],
        ...updates,
        updatedAt: new Date(),
      };
      return memoryIngestionJobs[idx];
    }
    return null;
  },
};

export const NotificationRepository = {
  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    relatedEntityId?: string;
    actionUrl?: string;
    badgeText?: string;
    read?: boolean;
    createdAt?: Date;
  }) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const notif = await Notification.create({
          userId: data.userId,
          type: data.type,
          title: data.title,
          body: data.body,
          relatedEntityId: data.relatedEntityId,
          actionUrl: data.actionUrl,
          badgeText: data.badgeText,
          read: data.read ?? false,
          createdAt: data.createdAt || new Date(),
        });
        return notif.toObject();
      } catch (err) {
        console.warn("MongoDB Notification.create failed, using memory store:", err);
      }
    }
    const newNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: String(data.userId),
      type: data.type,
      title: data.title,
      body: data.body,
      relatedEntityId: data.relatedEntityId,
      actionUrl: data.actionUrl,
      badgeText: data.badgeText,
      read: data.read ?? false,
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
    };
    memoryNotifications.unshift(newNotif);
    return newNotif;
  },

  async findByUser(
    userId: string,
    options?: { page?: number; limit?: number; read?: boolean }
  ) {
    const page = Math.max(1, options?.page || 1);
    const limit = Math.min(100, Math.max(1, options?.limit || 20));
    const skip = (page - 1) * limit;

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const query: any = { userId };
        if (options?.read !== undefined) {
          query.read = options.read;
        }
        const notifs = await Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        return notifs;
      } catch (err) {
        console.warn("MongoDB Notification.find failed, using memory store:", err);
      }
    }

    return memoryNotifications
      .filter((n) => {
        if (String(n.userId) !== String(userId)) return false;
        if (options?.read !== undefined && n.read !== options.read) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(skip, skip + limit);
  },

  async countUnread(userId: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        return await Notification.countDocuments({ userId, read: false });
      } catch {}
    }
    return memoryNotifications.filter(
      (n) => String(n.userId) === String(userId) && !n.read
    ).length;
  },

  async countByUser(userId: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        return await Notification.countDocuments({ userId });
      } catch {}
    }
    return memoryNotifications.filter((n) => String(n.userId) === String(userId)).length;
  },

  async findById(id: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const notif = await Notification.findById(id).lean();
        if (notif) return notif;
      } catch {}
    }
    return memoryNotifications.find((n) => String(n._id) === String(id)) || null;
  },

  async markAsRead(id: string, userId?: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const query: any = { _id: id };
        if (userId) query.userId = userId;
        const updated = await Notification.findOneAndUpdate(
          query,
          { read: true },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch {}
    }
    const idx = memoryNotifications.findIndex(
      (n) => String(n._id) === String(id) && (!userId || String(n.userId) === String(userId))
    );
    if (idx !== -1) {
      memoryNotifications[idx].read = true;
      memoryNotifications[idx].updatedAt = new Date();
      return memoryNotifications[idx];
    }
    return null;
  },

  async markAllAsRead(userId: string) {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const res = await Notification.updateMany({ userId, read: false }, { read: true });
        return res.modifiedCount;
      } catch {}
    }
    let count = 0;
    for (const n of memoryNotifications) {
      if (String(n.userId) === String(userId) && !n.read) {
        n.read = true;
        n.updatedAt = new Date();
        count++;
      }
    }
    return count;
  },
};



