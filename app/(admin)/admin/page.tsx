"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  BookOpen,
  ClipboardList,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  ShieldCheck,
  Archive,
  RefreshCw,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  Check,
  X,
  GraduationCap,
  Award,
  DollarSign,
  Building2,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { formatRelativeTime, formatSalaryRange } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "jobs" | "mcqs" | "applications">("overview");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Stats & Entities
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Search & Filters
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [mcqCategoryFilter, setMcqCategoryFilter] = useState("all");

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "edit">("create");
  const [userForm, setUserForm] = useState<any>({
    id: "",
    name: "",
    email: "",
    role: "seeker",
    phone: "",
    password: "",
    location: "San Francisco, CA",
    skills: "React, TypeScript, Next.js",
    isVerified: true,
  });

  const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobModalMode, setJobModalMode] = useState<"create" | "edit">("create");
  const [jobForm, setJobForm] = useState<any>({
    id: "",
    role: "",
    companyName: "",
    location: "San Francisco, CA (Hybrid)",
    jobType: "full-time",
    salaryMin: 130000,
    salaryMax: 180000,
    skills: "TypeScript, React, Node.js",
    description: "",
    status: "published",
  });

  const [mcqModalOpen, setMcqModalOpen] = useState(false);
  const [mcqModalMode, setMcqModalMode] = useState<"create" | "edit">("create");
  const [mcqForm, setMcqForm] = useState<any>({
    id: "",
    category: "dsa",
    difficulty: "medium",
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "user" | "job" | "mcq" | "application";
    id: string;
    title: string;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, jobsRes, mcqsRes, appsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/jobs"),
        fetch("/api/mcq/bank"),
        fetch("/api/applications?all=true"),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsers(d.users || []);
      }
      if (jobsRes.ok) {
        const d = await jobsRes.json();
        setJobs(d.jobs || []);
      }
      if (mcqsRes.ok) {
        const d = await mcqsRes.json();
        setMcqs(d.questions || []);
      }
      if (appsRes.ok) {
        const d = await appsRes.json();
        setApplications(d.applications || []);
      }
    } catch (e) {
      console.error(e);
      showFeedback("error", "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // USER CRUD
  const openCreateUserModal = () => {
    setUserModalMode("create");
    setUserForm({
      id: "",
      name: "",
      email: "",
      role: "seeker",
      phone: "+1 (555) 000-0000",
      password: "password123",
      location: "San Francisco, CA",
      skills: "React, TypeScript, Node.js",
      isVerified: true,
    });
    setUserModalOpen(true);
  };

  const openEditUserModal = (u: any) => {
    setUserModalMode("edit");
    setUserForm({
      id: u._id,
      name: u.name || "",
      email: u.email || "",
      role: u.role || "seeker",
      phone: u.phone || "",
      password: "",
      location: u.location || "San Francisco, CA",
      skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
      isVerified: u.isVerified !== undefined ? u.isVerified : true,
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const skillsArray = userForm.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      if (userModalMode === "create") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userForm.name,
            email: userForm.email,
            password: userForm.password,
            role: userForm.role,
            phone: userForm.phone,
            location: userForm.location,
            skills: skillsArray,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user");
        showFeedback("success", `User ${userForm.name} created successfully!`);
      } else {
        const res = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userForm.id,
            name: userForm.name,
            email: userForm.email,
            role: userForm.role,
            phone: userForm.phone,
            isVerified: userForm.isVerified,
            location: userForm.location,
            skills: skillsArray,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update user");
        showFeedback("success", `User ${userForm.name} updated successfully!`);
      }

      setUserModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      showFeedback("error", err.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  // JOB CRUD
  const openCreateJobModal = () => {
    setJobModalMode("create");
    setJobForm({
      id: "",
      role: "",
      companyName: "",
      location: "San Francisco, CA (Hybrid)",
      jobType: "full-time",
      salaryMin: 140000,
      salaryMax: 190000,
      skills: "TypeScript, React, Next.js, Node.js",
      description: "We are seeking a high-caliber engineer to architect distributed, scalable cloud services...",
      status: "published",
    });
    setJobModalOpen(true);
  };

  const openEditJobModal = (job: any) => {
    setJobModalMode("edit");
    setJobForm({
      id: job._id,
      role: job.role || "",
      companyName: job.companyName || "",
      location: job.location || "Remote",
      jobType: job.jobType || "full-time",
      salaryMin: job.salaryRange?.min || 130000,
      salaryMax: job.salaryRange?.max || 180000,
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      description: job.description || "",
      status: job.status || "published",
    });
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const skillsArray = jobForm.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      const payload = {
        role: jobForm.role,
        companyName: jobForm.companyName,
        location: jobForm.location,
        jobType: jobForm.jobType,
        salaryRange: {
          min: Number(jobForm.salaryMin),
          max: Number(jobForm.salaryMax),
          currency: "USD",
        },
        skills: skillsArray,
        description: jobForm.description,
        status: jobForm.status,
      };

      if (jobModalMode === "create") {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create job");
        showFeedback("success", `Job "${jobForm.role}" posted successfully!`);
      } else {
        const res = await fetch(`/api/jobs/${jobForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update job");
        showFeedback("success", `Job "${jobForm.role}" updated successfully!`);
      }

      setJobModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      showFeedback("error", err.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleJobStatus = async (job: any) => {
    const newStatus = job.status === "published" ? "archived" : "published";
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showFeedback("success", `Job status switched to ${newStatus}`);
        await fetchAllData();
      }
    } catch (e) {
      showFeedback("error", "Failed to update job status");
    }
  };

  // MCQ CRUD
  const openCreateMcqModal = () => {
    setMcqModalMode("create");
    setMcqForm({
      id: "",
      category: "dsa",
      difficulty: "medium",
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    });
    setMcqModalOpen(true);
  };

  const openEditMcqModal = (q: any) => {
    setMcqModalMode("edit");
    setMcqForm({
      id: q._id,
      category: q.category || "dsa",
      difficulty: q.difficulty || "medium",
      question: q.question || "",
      options: q.options?.length === 4 ? [...q.options] : [q.options?.[0] || "", q.options?.[1] || "", q.options?.[2] || "", q.options?.[3] || ""],
      correctIndex: q.correctIndex || 0,
      explanation: q.explanation || "",
    });
    setMcqModalOpen(true);
  };

  const handleSaveMcq = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const validOptions = mcqForm.options.filter(Boolean);
      if (validOptions.length < 2) {
        throw new Error("Please provide at least 2 options");
      }

      const payload = {
        category: mcqForm.category,
        difficulty: mcqForm.difficulty,
        question: mcqForm.question,
        options: validOptions,
        correctIndex: Number(mcqForm.correctIndex),
        explanation: mcqForm.explanation,
      };

      if (mcqModalMode === "create") {
        const res = await fetch("/api/mcq/bank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create question");
        showFeedback("success", "MCQ Challenge created successfully!");
      } else {
        const res = await fetch("/api/mcq/bank", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: mcqForm.id, ...payload }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update question");
        showFeedback("success", "MCQ Challenge updated successfully!");
      }

      setMcqModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      showFeedback("error", err.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  // APPLICATION STATUS UPDATE
  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
      if (res.ok) {
        showFeedback("success", `Application status updated to ${newStatus}`);
        await fetchAllData();
      } else {
        showFeedback("error", "Failed to update status");
      }
    } catch (e) {
      showFeedback("error", "Failed to update status");
    }
  };

  // DELETE HANDLERS
  const confirmDelete = (type: "user" | "job" | "mcq" | "application", id: string, title: string) => {
    setDeleteTarget({ type, id, title });
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      let res: Response | null = null;
      if (deleteTarget.type === "user") {
        res = await fetch(`/api/admin/users?id=${deleteTarget.id}`, { method: "DELETE" });
      } else if (deleteTarget.type === "job") {
        res = await fetch(`/api/jobs/${deleteTarget.id}`, { method: "DELETE" });
      } else if (deleteTarget.type === "mcq") {
        res = await fetch(`/api/mcq/bank?id=${deleteTarget.id}`, { method: "DELETE" });
      } else if (deleteTarget.type === "application") {
        res = await fetch(`/api/applications?id=${deleteTarget.id}`, { method: "DELETE" });
      }

      if (res && res.ok) {
        showFeedback("success", `${deleteTarget.title} deleted successfully!`);
        await fetchAllData();
      } else {
        showFeedback("error", "Failed to delete item");
      }
    } catch (e) {
      showFeedback("error", "Error executing delete");
    } finally {
      setActionLoading(false);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  // FILTERED LISTS
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.location?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchesQuery && matchesRole;
  });

  const filteredJobs = jobs.filter((j) => {
    const matchesQuery =
      j.role?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location?.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus =
      jobStatusFilter === "all" || (j.status || "published") === jobStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredMcqs = mcqs.filter((m) => {
    if (mcqCategoryFilter === "all") return true;
    return m.category === mcqCategoryFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" className="font-bold uppercase tracking-wider">
              Admin Command Center
            </Badge>
            <span className="text-xs text-text-secondary">CodifyPro by Aimtech Solutions</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-secondary mt-1">
            Data Management & Operations Hub
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Full governance across candidate profiles, job postings, MCQ challenges, and active hiring pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={openCreateUserModal} size="sm" variant="outline" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add User</span>
          </Button>
          <Button onClick={openCreateJobModal} size="sm" variant="outline" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Job</span>
          </Button>
          <Button onClick={openCreateMcqModal} size="sm" variant="outline" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add MCQ</span>
          </Button>
          <Link href="/admin/ingest">
            <Button size="sm" variant="primary" className="gap-1.5 text-xs font-semibold shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Ingestion</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <Card
          onClick={() => setActiveTab("users")}
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "users" ? "ring-2 ring-primary border-primary" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Registered Users
              </span>
              <div className="text-2xl font-black text-secondary">
                {stats?.totalUsers || users.length}
              </div>
              <div className="text-[11px] text-text-secondary">
                {stats?.usersByRole?.seeker || 0} Seekers • {stats?.usersByRole?.recruiter || 0} Recruiters
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Jobs Card */}
        <Card
          onClick={() => setActiveTab("jobs")}
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "jobs" ? "ring-2 ring-primary border-primary" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Job Postings
              </span>
              <div className="text-2xl font-black text-secondary">
                {stats?.totalJobs || jobs.length}
              </div>
              <div className="text-[11px] text-text-secondary">
                {stats?.jobsByStatus?.published || 0} Active • {stats?.jobsByStatus?.archived || 0} Archived
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* MCQ Bank Card */}
        <Card
          onClick={() => setActiveTab("mcqs")}
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "mcqs" ? "ring-2 ring-primary border-primary" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                MCQ Question Bank
              </span>
              <div className="text-2xl font-black text-secondary">
                {stats?.totalMcqs || mcqs.length}
              </div>
              <div className="text-[11px] text-text-secondary">
                {stats?.mcqsByCategory?.dsa || 0} DSA • {stats?.mcqsByCategory?.aptitude || 0} Aptitude
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-accent flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Applications Card */}
        <Card
          onClick={() => setActiveTab("applications")}
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "applications" ? "ring-2 ring-primary border-primary" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Hiring Applications
              </span>
              <div className="text-2xl font-black text-secondary">
                {stats?.totalApplications || applications.length}
              </div>
              <div className="text-[11px] text-text-secondary">
                {stats?.applicationsByStatus?.applied || 0} Applied • {stats?.applicationsByStatus?.shortlisted || 0} Shortlisted
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ClipboardList className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-secondary text-white"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          Overview & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "users"
              ? "bg-secondary text-white"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          Users & Candidates ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "jobs"
              ? "bg-secondary text-white"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          Job Postings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab("mcqs")}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "mcqs"
              ? "bg-secondary text-white"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          MCQ Challenge Bank ({mcqs.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "applications"
              ? "bg-secondary text-white"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          Application Pipeline ({applications.length})
        </button>
      </div>

      {/* ===================== TAB 1: OVERVIEW ===================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <Card className="md:col-span-1 border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Administrative Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  onClick={openCreateUserModal}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs"
                >
                  <Users className="h-4 w-4 text-primary" />
                  <span>Create User Account</span>
                </Button>
                <Button
                  onClick={openCreateJobModal}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs"
                >
                  <Briefcase className="h-4 w-4 text-emerald-600" />
                  <span>Post Verified Job</span>
                </Button>
                <Button
                  onClick={openCreateMcqModal}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs"
                >
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span>Add MCQ Challenge Question</span>
                </Button>
                <Link href="/admin/ingest" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                  >
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Run AI Job Ingestion</span>
                  </Button>
                </Link>
                <Button
                  onClick={fetchAllData}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs text-text-secondary"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Platform State</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Applications Pipeline */}
            <Card className="md:col-span-2 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-purple-600" />
                  <span>Recent Applications Activity</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("applications")}
                  className="text-xs text-primary"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => (
                    <div
                      key={app._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-surface-alt border border-border gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-text-primary">
                          {app.user?.name || "Candidate"} &rarr; {app.job?.role || "Software Engineer"}
                        </div>
                        <div className="text-[11px] text-text-secondary">
                          {app.job?.companyName} • {formatRelativeTime(app.appliedAt || new Date())}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            app.status === "shortlisted"
                              ? "success"
                              : app.status === "reviewing"
                              ? "warning"
                              : "primary"
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {app.status}
                        </Badge>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                          className="text-xs rounded-lg border border-border bg-white px-2 py-1 text-text-primary"
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-xs text-text-secondary py-4 text-center">No applications recorded yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: USERS & CANDIDATES ===================== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-72">
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, email, location..."
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {["all", "seeker", "recruiter", "admin"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      userRoleFilter === role
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-text-secondary hover:bg-slate-50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={openCreateUserModal} size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              <span>Add New User</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-alt border-b border-border text-xs uppercase font-bold text-text-secondary">
                  <tr>
                    <th className="py-3.5 px-6">Candidate / User</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Location</th>
                    <th className="py-3.5 px-6">Skills / Profile</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-bold text-text-primary">{u.name}</div>
                            <div className="text-xs text-text-secondary">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={
                            u.role === "admin"
                              ? "warning"
                              : u.role === "recruiter"
                              ? "secondary"
                              : "primary"
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-text-secondary">
                        {u.location || "San Francisco, CA"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.skills?.slice(0, 3).map((s: string) => (
                            <span
                              key={s}
                              className="text-[10px] bg-slate-100 text-text-secondary px-1.5 py-0.5 rounded"
                            >
                              {s}
                            </span>
                          ))}
                          {u.skills?.length > 3 && (
                            <span className="text-[10px] text-text-muted">
                              +{u.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-primary"
                          title="View Full Profile Details"
                          onClick={() => {
                            setSelectedUserDetail(u);
                            setUserDetailModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-text-secondary"
                          title="Edit User"
                          onClick={() => openEditUserModal(u)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-error hover:bg-rose-50"
                          title="Delete User"
                          onClick={() => confirmDelete("user", u._id, u.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-text-secondary">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: JOBS ===================== */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-72">
                <Input
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search role, company, location..."
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {["all", "published", "archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setJobStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      jobStatusFilter === st
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-text-secondary hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={openCreateJobModal} size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              <span>Create New Job</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-alt border-b border-border text-xs uppercase font-bold text-text-secondary">
                  <tr>
                    <th className="py-3.5 px-6">Role & Company</th>
                    <th className="py-3.5 px-6">Location & Type</th>
                    <th className="py-3.5 px-6">Salary Range</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Posted</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-text-primary">{job.role}</div>
                        <div className="text-xs text-text-secondary">{job.companyName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-text-primary">{job.location}</div>
                        <Badge variant="outline" size="sm" className="capitalize mt-1">
                          {job.jobType}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-secondary">
                        {formatSalaryRange(job.salaryRange)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={job.status === "published" ? "success" : "default"}
                          size="sm"
                          className="capitalize"
                        >
                          {job.status || "published"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-text-secondary">
                        {formatRelativeTime(job.postedAt || new Date())}
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <Link href={`/jobs/${job._id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2" title="Preview Job">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-text-secondary"
                          title="Edit Job Details"
                          onClick={() => openEditJobModal(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-text-secondary"
                          title="Toggle Active / Archive"
                          onClick={() => handleToggleJobStatus(job)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-error hover:bg-rose-50"
                          title="Delete Job"
                          onClick={() => confirmDelete("job", job._id, `${job.role} at ${job.companyName}`)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-text-secondary">
                        No job postings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: MCQs ===================== */}
      {activeTab === "mcqs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {["all", "dsa", "aptitude", "general"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMcqCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase transition-colors ${
                    mcqCategoryFilter === cat
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text-secondary hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Button onClick={openCreateMcqModal} size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              <span>Add Challenge Question</span>
            </Button>
          </div>

          <div className="space-y-4">
            {filteredMcqs.map((q, idx) => (
              <div
                key={q._id || idx}
                className="rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-hover transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm" className="uppercase font-bold">
                        {q.category}
                      </Badge>
                      <Badge
                        variant={
                          q.difficulty === "easy"
                            ? "success"
                            : q.difficulty === "hard"
                            ? "error"
                            : "warning"
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-text-primary pt-1">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-text-secondary"
                      title="Edit Question"
                      onClick={() => openEditMcqModal(q)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-error hover:bg-rose-50"
                      title="Delete Question"
                      onClick={() => confirmDelete("mcq", q._id, q.question)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options?.map((opt: string, i: number) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-2.5 text-xs flex items-center gap-2 ${
                        i === q.correctIndex
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                          : "bg-surface-alt border-border text-text-secondary"
                      }`}
                    >
                      <span className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold border shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                      {i === q.correctIndex && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-xs text-text-secondary">
                    <span className="font-bold text-text-primary">Explanation:</span> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: APPLICATIONS ===================== */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary">
              Candidate Application Pipeline
            </h2>
            <Badge variant="primary" size="sm">
              {applications.length} Active Submissions
            </Badge>
          </div>

          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-alt border-b border-border text-xs uppercase font-bold text-text-secondary">
                  <tr>
                    <th className="py-3.5 px-6">Candidate</th>
                    <th className="py-3.5 px-6">Target Role & Company</th>
                    <th className="py-3.5 px-6">Applied Date</th>
                    <th className="py-3.5 px-6">Current Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-text-primary">{app.user?.name || "Candidate"}</div>
                        <div className="text-xs text-text-secondary">{app.user?.email || "applicant@codifypro.ai"}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-text-primary">{app.job?.role || "Software Engineer"}</div>
                        <div className="text-xs text-text-secondary">{app.job?.companyName} • {app.job?.location}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-text-secondary">
                        {formatRelativeTime(app.appliedAt || new Date())}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                          className="text-xs font-semibold rounded-lg border border-border bg-white px-2.5 py-1.5 text-text-primary capitalize focus:ring-1 focus:ring-primary"
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-error hover:bg-rose-50"
                          title="Delete Application"
                          onClick={() => confirmDelete("application", app._id, `Application for ${app.job?.role}`)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-text-secondary">
                        No applications recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== USER CREATE / EDIT MODAL ===================== */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={userModalMode === "create" ? "Create New User Account" : "Edit User Account"}
        description="Configure account credentials, platform role, and candidate profile information."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveUser} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Full Name <span className="text-error">*</span>
              </label>
              <Input
                required
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Email Address <span className="text-error">*</span>
              </label>
              <Input
                required
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="alex@codifypro.ai"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Platform Role
              </label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
              >
                <option value="seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Phone Number
              </label>
              <Input
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {userModalMode === "create" && (
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Temporary Password
              </label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="Min 6 characters"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Location
              </label>
              <Input
                value={userForm.location}
                onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Skills (comma separated)
              </label>
              <Input
                value={userForm.skills}
                onChange={(e) => setUserForm({ ...userForm, skills: e.target.value })}
                placeholder="TypeScript, React, AWS"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={actionLoading}>
              {userModalMode === "create" ? "Create Account" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ===================== USER DETAIL DRAWER / MODAL ===================== */}
      <Modal
        isOpen={userDetailModalOpen}
        onClose={() => setUserDetailModalOpen(false)}
        title="Candidate Full Profile Details"
        description="Comprehensive verification details, work history, and skills inventory."
        maxWidth="2xl"
      >
        {selectedUserDetail && (
          <div className="space-y-6 pt-2">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-border">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xl text-primary shrink-0">
                {selectedUserDetail.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-secondary">{selectedUserDetail.name}</h3>
                  <Badge variant="primary" size="sm" className="capitalize">
                    {selectedUserDetail.role}
                  </Badge>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>
                <div className="text-xs text-text-secondary">
                  {selectedUserDetail.email} • {selectedUserDetail.phone || "No phone"} • {selectedUserDetail.location || "San Francisco, CA"}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase text-text-secondary mb-2">
                Verified Technical Skills ({selectedUserDetail.skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedUserDetail.skills?.map((s: string) => (
                  <Badge key={s} variant="outline" size="sm" className="bg-white">
                    {s}
                  </Badge>
                ))}
                {(!selectedUserDetail.skills || selectedUserDetail.skills.length === 0) && (
                  <span className="text-xs text-text-muted italic">No skills listed yet</span>
                )}
              </div>
            </div>

            {/* Work History */}
            <div>
              <h4 className="text-xs font-bold uppercase text-text-secondary mb-2 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span>Work Experience History</span>
              </h4>
              <div className="space-y-2">
                {selectedUserDetail.profileData?.experience?.map((exp: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl border border-border bg-surface-alt space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">{exp.title}</span>
                      <span className="text-[11px] text-text-secondary">{exp.from} - {exp.to}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{exp.company}</div>
                    {exp.description && (
                      <p className="text-[11px] text-text-muted">{exp.description}</p>
                    )}
                  </div>
                ))}
                {(!selectedUserDetail.profileData?.experience || selectedUserDetail.profileData.experience.length === 0) && (
                  <p className="text-xs text-text-muted italic">No work experience logged yet.</p>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-xs font-bold uppercase text-text-secondary mb-2 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" />
                <span>Certifications & Credential IDs</span>
              </h4>
              <div className="space-y-2">
                {selectedUserDetail.profileData?.certificates?.map((cert: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl border border-border bg-surface-alt flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-text-primary">{cert.name}</div>
                      <div className="text-[11px] text-text-secondary">
                        {cert.issuer} • ID: <span className="font-mono text-primary font-semibold">{cert.certificateId || "N/A"}</span>
                      </div>
                    </div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                        <span>Verify</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
                {(!selectedUserDetail.profileData?.certificates || selectedUserDetail.profileData.certificates.length === 0) && (
                  <p className="text-xs text-text-muted italic">No certificates recorded.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setUserDetailModalOpen(false);
                  openEditUserModal(selectedUserDetail);
                }}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                <span>Edit This User</span>
              </Button>
              <Button size="sm" onClick={() => setUserDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ===================== JOB CREATE / EDIT MODAL ===================== */}
      <Modal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        title={jobModalMode === "create" ? "Post New Job Opportunity" : "Edit Job Opportunity"}
        description="Define hiring specifications, required competencies, and salary ranges."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveJob} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Job Title / Role <span className="text-error">*</span>
              </label>
              <Input
                required
                value={jobForm.role}
                onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Company Name <span className="text-error">*</span>
              </label>
              <Input
                required
                value={jobForm.companyName}
                onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                placeholder="e.g. Stripe, Vercel"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Location
              </label>
              <Input
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="e.g. Remote, San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Employment Type
              </label>
              <select
                value={jobForm.jobType}
                onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Min Salary ($)
              </label>
              <Input
                type="number"
                value={jobForm.salaryMin}
                onChange={(e) => setJobForm({ ...jobForm, salaryMin: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Max Salary ($)
              </label>
              <Input
                type="number"
                value={jobForm.salaryMax}
                onChange={(e) => setJobForm({ ...jobForm, salaryMax: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Required Skills (comma separated)
            </label>
            <Input
              value={jobForm.skills}
              onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
              placeholder="TypeScript, React, Node.js, AWS"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={4}
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              className="w-full rounded-xl border border-border p-3 text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Outline role responsibilities, team structure, and qualifications..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Publication Status
            </label>
            <select
              value={jobForm.status}
              onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
            >
              <option value="published">Published (Active)</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setJobModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={actionLoading}>
              {jobModalMode === "create" ? "Post Job" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ===================== MCQ CREATE / EDIT MODAL ===================== */}
      <Modal
        isOpen={mcqModalOpen}
        onClose={() => setMcqModalOpen(false)}
        title={mcqModalMode === "create" ? "Add Challenge Question" : "Edit Challenge Question"}
        description="Craft MCQ challenges for daily engineering streaks and skill verification."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveMcq} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Category
              </label>
              <select
                value={mcqForm.category}
                onChange={(e) => setMcqForm({ ...mcqForm, category: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary uppercase"
              >
                <option value="dsa">DSA (Data Structures & Algorithms)</option>
                <option value="aptitude">Aptitude & Logic</option>
                <option value="general">General Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Difficulty
              </label>
              <select
                value={mcqForm.difficulty}
                onChange={(e) => setMcqForm({ ...mcqForm, difficulty: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Question Prompt <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={mcqForm.question}
              onChange={(e) => setMcqForm({ ...mcqForm, question: e.target.value })}
              placeholder="e.g. What is the time complexity of searching in a Balanced Binary Search Tree?"
              className="w-full rounded-xl border border-border p-3 text-xs text-text-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-text-secondary">
              Options & Correct Selection
            </label>
            {mcqForm.options.map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={mcqForm.correctIndex === i}
                  onChange={() => setMcqForm({ ...mcqForm, correctIndex: i })}
                  className="h-4 w-4 text-primary"
                  title="Mark as correct answer"
                />
                <span className="text-xs font-bold text-text-secondary w-6">
                  {String.fromCharCode(65 + i)}:
                </span>
                <Input
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...mcqForm.options];
                    newOpts[i] = e.target.value;
                    setMcqForm({ ...mcqForm, options: newOpts });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Answer Explanation (Optional)
            </label>
            <textarea
              rows={2}
              value={mcqForm.explanation}
              onChange={(e) => setMcqForm({ ...mcqForm, explanation: e.target.value })}
              placeholder="Provide context on why this answer is correct..."
              className="w-full rounded-xl border border-border p-3 text-xs text-text-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMcqModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={actionLoading}>
              {mcqModalMode === "create" ? "Add Question" : "Save Question"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Permanent Deletion"
        description="This action cannot be undone. Are you sure you want to proceed?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-primary">
            You are about to permanently delete:{" "}
            <span className="font-bold text-error">{deleteTarget?.title}</span>
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={actionLoading}
              onClick={executeDelete}
              className="bg-error hover:bg-rose-700 text-white"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

