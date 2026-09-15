"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Trash2,
  Archive,
  Eye,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => String(j._id) !== id));
      }
    } catch (e) {
      console.error(e);
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
        setJobs(
          jobs.map((j) => (String(j._id) === id ? { ...j, status: newStatus } : j))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm">
              Admin Workspace
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-secondary mt-1">
            Job Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of all active and archived opportunities on the platform.
          </p>
        </div>
        <Link href="/admin/ingest">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Ingest New Job</span>
          </Button>
        </Link>
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
                {jobs.map((job) => (
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
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link href={`/jobs/${job._id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

