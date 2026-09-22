"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Trash2,
  Archive,
  Eye,
  Edit,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Search,
  Sparkles,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobModalMode, setJobModalMode] = useState<"create" | "edit">("create");
  const [jobForm, setJobForm] = useState<any>({
    id: "",
    role: "",
    companyName: "",
    location: "Bengaluru, India (Hybrid)",
    jobType: "full-time",
    currency: "INR",
    salaryMin: 1200000,
    salaryMax: 1800000,
    skills: "TypeScript, React, Next.js, Node.js",
    description: "",
    status: "published",
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error(e);
      showFeedback("error", "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setJobModalMode("create");
    setJobForm({
      id: "",
      role: "",
      companyName: "",
      location: "Bengaluru, India (Hybrid)",
      jobType: "full-time",
      currency: "INR",
      salaryMin: 1200000,
      salaryMax: 1800000,
      skills: "TypeScript, React, Next.js, Node.js",
      description: "We are seeking an exceptional engineer to design and scale cloud services...",
      status: "published",
    });
    setJobModalOpen(true);
  };

  const openEditModal = (job: any) => {
    setJobModalMode("edit");
    setJobForm({
      id: job._id,
      role: job.role || "",
      companyName: job.companyName || "",
      location: job.location || "Remote",
      jobType: job.jobType || "full-time",
      currency: job.salaryRange?.currency || "INR",
      salaryMin: job.salaryRange?.min ?? 1200000,
      salaryMax: job.salaryRange?.max ?? 1800000,
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      description: job.jd || job.description || "",
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
          currency: jobForm.currency || "INR",
        },
        skills: skillsArray,
        jd: jobForm.description,
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
      await fetchJobs();
    } catch (err: any) {
      showFeedback("error", err.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "archived" : "published";
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showFeedback("success", `Job status switched to ${newStatus}`);
        setJobs(jobs.map((j) => (String(j._id) === id ? { ...j, status: newStatus } : j)));
      }
    } catch (e) {
      showFeedback("error", "Failed to update job status");
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/jobs/${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("success", `Job ${deleteTarget.role} deleted successfully!`);
        await fetchJobs();
      } else {
        showFeedback("error", "Failed to delete job");
      }
    } catch (e) {
      showFeedback("error", "Error executing delete");
    } finally {
      setActionLoading(false);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchesSearch =
      j.role?.toLowerCase().includes(q) ||
      j.companyName?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" || (j.status || "published") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to Master Dashboard */}
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Master Admin Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm">
              Admin Workspace
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-secondary mt-1">
            Job Management & Inventory
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of all active, draft, and archived opportunities with full edit, toggle, and deletion authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={openCreateModal} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Job</span>
          </Button>
          <Link href="/admin/ingest">
            <Button size="sm" variant="outline" className="gap-2 text-xs">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI Ingestion</span>
            </Button>
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-xl border text-sm font-medium ${
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

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="max-w-xs w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role, company, location..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {["all", "published", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-text-secondary hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-full bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-alt border-b border-border text-xs uppercase font-bold text-text-secondary">
                <tr>
                  <th className="py-3.5 px-6">Role & Company</th>
                  <th className="py-3.5 px-6">Location / Type</th>
                  <th className="py-3.5 px-6">Salary Range</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Posted</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{job.role}</div>
                      <div className="text-xs text-text-secondary">{job.companyName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-text-primary text-xs">{job.location}</div>
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
                        <Button variant="ghost" size="sm" className="h-8 px-2" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-text-secondary"
                        title="Edit Job"
                        onClick={() => openEditModal(job)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-text-secondary"
                        title="Toggle Status"
                        onClick={() => handleToggleStatus(job._id, job.status || "published")}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-error hover:bg-rose-50"
                        title="Delete"
                        onClick={() => {
                          setDeleteTarget(job);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-text-secondary">
                      No jobs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Job Modal */}
      <Modal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        title={jobModalMode === "create" ? "Create Job Posting" : "Edit Job Posting"}
        description="Update hiring criteria and compensation details."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveJob} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Role / Title <span className="text-error">*</span>
              </label>
              <Input
                required
                value={jobForm.role}
                onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}
                placeholder="Senior Full-Stack Engineer"
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
                placeholder="Stripe, Vercel"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Location
              </label>
              <Input
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="San Francisco, CA or Remote"
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
                Currency
              </label>
              <select
                value={jobForm.currency || "INR"}
                onChange={(e) => setJobForm({ ...jobForm, currency: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary font-semibold"
              >
                <option value="INR">INR (₹ - Indian Rupee / LPA)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-text-secondary">
                  Min Salary ({jobForm.currency === "INR" ? "₹" : "$"})
                </label>
              </div>
              <Input
                type="number"
                value={jobForm.salaryMin}
                onChange={(e) => setJobForm({ ...jobForm, salaryMin: Number(e.target.value) })}
                placeholder={jobForm.currency === "INR" ? "1200000" : "120000"}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-text-secondary">
                  Max Salary ({jobForm.currency === "INR" ? "₹" : "$"})
                </label>
              </div>
              <Input
                type="number"
                value={jobForm.salaryMax}
                onChange={(e) => setJobForm({ ...jobForm, salaryMax: Number(e.target.value) })}
                placeholder={jobForm.currency === "INR" ? "1800000" : "180000"}
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-border rounded-xl px-3 py-2">
            <span className="text-xs text-text-secondary">
              {jobForm.currency === "INR"
                ? "💡 1200000 = ₹12 LPA. System auto-converts to LPA."
                : "💡 Annual compensation in US Dollars."}
            </span>
            <Badge variant="primary" size="sm" className="font-bold">
              {formatSalaryRange({ min: jobForm.salaryMin, max: jobForm.salaryMax, currency: jobForm.currency })}
            </Badge>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Required Skills (comma separated)
            </label>
            <Input
              value={jobForm.skills}
              onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
              placeholder="TypeScript, React, Next.js, Node.js"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              className="w-full rounded-xl border border-border p-3 text-xs text-text-primary"
              placeholder="Responsibilities, requirements, perks..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Status
            </label>
            <select
              value={jobForm.status}
              onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
            >
              <option value="published">Published</option>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Job Deletion"
        description="Are you sure you want to permanently delete this job posting?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-primary">
            You are deleting: <span className="font-bold text-error">{deleteTarget?.role}</span> at {deleteTarget?.companyName}
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
