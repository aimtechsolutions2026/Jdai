"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  FileCheck2,
  Briefcase,
  Eye,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export default function SeekerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profRes, jobsRes, appsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/jobs?limit=4"),
          fetch("/api/applications"),
        ]);

        if (profRes.ok) {
          const p = await profRes.json();
          setProfile(p.profile);
        }
        if (jobsRes.ok) {
          const j = await jobsRes.json();
          setJobs(j.jobs || []);
        }
        if (appsRes.ok) {
          const a = await appsRes.json();
          setApplicationsCount(a.applications?.length || 0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const completeness = profile?.profileCompleteness || 60;
  const streak = profile?.streak?.current || 3;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary">
            Welcome back, {profile?.name || "Developer"} 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your applications, daily streak, and AI-curated engineering matches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/jobs">
            <Button size="sm" className="gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>Explore Jobs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <Link href="/mcq" className="block group">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card transition-all group-hover:border-amber-400 group-hover:shadow-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-dark">
                Daily Streak
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-accent">
                <Flame className="h-5 w-5 fill-accent" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-secondary">{streak}</span>
              <span className="text-xs font-semibold text-accent-dark">Days Active</span>
            </div>
            <div className="mt-2 text-xs text-text-secondary flex items-center gap-1 group-hover:text-accent-dark">
              <span>Solve today&apos;s challenge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>

        {/* Applications Sent */}
        <Link href="/applications" className="block group">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all group-hover:border-primary group-hover:shadow-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Applications
              </span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-secondary">{applicationsCount}</span>
              <span className="text-xs text-text-secondary">Submitted</span>
            </div>
            <div className="mt-2 text-xs text-text-secondary flex items-center gap-1 group-hover:text-primary">
              <span>View status timeline</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>

        {/* Recruiter Views */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Profile Views
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-success">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary">18</span>
            <span className="text-xs text-success font-semibold">+6 this week</span>
          </div>
          <div className="mt-2 text-xs text-text-secondary">
            Recruiters searched your skills
          </div>
        </div>

        {/* Profile Completeness */}
        <Link href="/profile" className="block group">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all group-hover:border-primary group-hover:shadow-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Profile Health
              </span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-secondary">{completeness}%</span>
              <span className="text-xs text-text-secondary">Complete</span>
            </div>
            <div className="mt-2 text-xs text-text-secondary flex items-center gap-1 group-hover:text-primary">
              <span>Refine resume & skills</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Profile Completeness Nudge Banner (if < 90%) */}
      {completeness < 90 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-secondary">
                Your profile is {completeness}% complete
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Upload your latest PDF resume or add 3 more skills to unlock top-tier candidate ranking.
            </p>
          </div>
          <Link href="/profile">
            <Button size="sm" variant="primary">
              Complete Profile Now
            </Button>
          </Link>
        </div>
      )}

      {/* Recommended Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-secondary">
              Recommended for Your Skills
            </h2>
            <p className="text-xs text-text-secondary">
              Matched based on your tech stack: {profile?.skills?.slice(0, 4).join(", ") || "Full Stack"}
            </p>
          </div>
          <Link href="/jobs" className="text-xs font-semibold text-primary hover:underline">
            View all jobs →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-xs text-text-secondary shadow-card">
            No active jobs found. New engineering positions posted by recruiters will appear here automatically!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-border bg-white p-5 shadow-card hover:shadow-hover hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 border border-border flex items-center justify-center font-bold text-sm text-secondary">
                        {job.companyName?.[0] || "C"}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-primary hover:text-primary">
                          <Link href={`/jobs/${job._id}`}>{job.role}</Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                          <span className="font-semibold text-text-primary">{job.companyName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {job.jobType}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills?.slice(0, 4).map((skill: string) => (
                      <Badge key={skill} variant="outline" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs font-bold text-secondary">
                    {formatSalaryRange(job.salaryRange)}
                  </span>
                  <Link href={`/jobs/${job._id}`}>
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

