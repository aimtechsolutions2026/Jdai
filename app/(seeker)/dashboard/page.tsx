"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Flame,
  FileCheck2,
  Briefcase,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  Eye,
  Download,
  Check,
  Award,
  Zap,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AtsResumeModal } from "@/components/profile/AtsResumeModal";
import { printOrDownloadAtsResume } from "@/lib/ats-resume";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export default function MyDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [streakData, setStreakData] = useState<any>(null);
  const [mcqAttempts, setMcqAttempts] = useState<any[]>([]);
  const [todayQuestion, setTodayQuestion] = useState<any>(null);

  // Resume Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showAtsModal, setShowAtsModal] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [meRes, jobsRes, appsRes, streakRes, mcqHistRes, todayMcqRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/jobs?limit=4"),
          fetch("/api/applications"),
          fetch("/api/streak"),
          fetch("/api/mcq/history"),
          fetch("/api/mcq/today"),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
          setProfile(meData.profile);
        }

        if (jobsRes.ok) {
          const j = await jobsRes.json();
          setJobs(j.jobs || []);
        }

        if (appsRes.ok) {
          const a = await appsRes.json();
          setApplications(a.applications || []);
        }

        if (streakRes.ok) {
          const s = await streakRes.json();
          setStreakData(s);
        }

        if (mcqHistRes.ok) {
          const mh = await mcqHistRes.json();
          setMcqAttempts(mh.attempts || []);
        }

        if (todayMcqRes.ok) {
          const tq = await todayMcqRes.json();
          setTodayQuestion(tq.question || null);
        }
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Resume Upload Handler with automated polling
  const handleResumeFile = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setUploadError("Please upload a PDF format resume only.");
      return;
    }

    setUploadingResume(true);
    setUploadStatus("Uploading PDF resume...");
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload resume.");

      const jobId = data.jobId;
      setUploadStatus("Extracting skills & profile details via automated parsing...");

      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;

        const statusRes = await fetch(`/api/resume/status/${jobId}`);
        if (!statusRes.ok) continue;

        const statusData = await statusRes.json();
        if (statusData.status === "completed") {
          const updatedProfile = statusData.result?.profile || statusData.result;
          if (updatedProfile) {
            setProfile(updatedProfile);
          }
          setUploadSuccess("Resume successfully parsed and profile synced!");
          setUploadingResume(false);
          setUploadStatus(null);
          setTimeout(() => setUploadSuccess(null), 5000);
          return;
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "Automated resume parsing failed.");
        }
      }

      setUploadSuccess("Resume uploaded. Processing will finish in background.");
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload resume.");
    } finally {
      setUploadingResume(false);
      setUploadStatus(null);
    }
  };

  // Applications Status Breakdown
  const appStatusCounts = {
    applied: 0,
    viewed: 0,
    shortlisted: 0,
    interview: 0,
    rejected: 0,
  };

  applications.forEach((app) => {
    const s = (app.status || "applied").toLowerCase();
    if (s.includes("interview")) appStatusCounts.interview++;
    else if (s.includes("shortlist")) appStatusCounts.shortlisted++;
    else if (s.includes("view")) appStatusCounts.viewed++;
    else if (s.includes("reject")) appStatusCounts.rejected++;
    else appStatusCounts.applied++;
  });

  const totalApps = applications.length;

  // MCQ Stats Breakdown
  const totalMcqSolved = mcqAttempts.length;
  const correctMcqCount = mcqAttempts.filter((a) => a.isCorrect).length;
  const mcqAccuracy =
    totalMcqSolved > 0 ? Math.round((correctMcqCount / totalMcqSolved) * 100) : 0;
  const streak = streakData?.currentStreak || user?.streak?.current || 0;
  const xp = streakData?.xp || user?.xp || 0;
  const completeness = profile?.profileCompleteness || 50;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-4">
        <div className="h-8 w-60 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
          <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Compact Top Header */}
      <div className="border-b border-border pb-3 sm:pb-3.5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-secondary">
            Welcome back, {user?.name?.split(" ")[0] || "Developer"}
          </h1>
          <Badge variant="primary" size="sm" className="capitalize text-[11px] font-bold">
            {user?.role || "Seeker"}
          </Badge>
        </div>
        <p className="text-xs text-text-secondary mt-0.5">
          Your application pipeline, daily DSA consistency, and resume health overview.
        </p>
      </div>

      {/* Account Deletion Notice (if pending) */}
      {user?.deletionRequested && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 flex items-center justify-between gap-3 text-xs">
          <div className="text-rose-900 font-medium">
            Account deletion request is pending review. You can manage or cancel this request inside your{" "}
            <Link href="/profile" className="font-bold underline text-rose-950">
              Profile Settings
            </Link>.
          </div>
          <Link href="/profile">
            <Button size="sm" variant="outline" className="border-rose-300 text-rose-800 text-[11px] h-7">
              Manage in Profile
            </Button>
          </Link>
        </div>
      )}

      {/* 4 Compact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Daily Streak */}
        <Link href="/mcq" className="group">
          <div className="rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-3.5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                DSA Streak
              </span>
              <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center text-accent">
                <Flame className="h-4 w-4 fill-accent" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-secondary">{streak}</span>
              <span className="text-[11px] font-semibold text-accent-dark">Days Continuous</span>
            </div>
            <div className="mt-1 text-[11px] text-text-secondary flex items-center gap-1 group-hover:text-accent-dark">
              <span>{todayQuestion?.hasAttempted ? "Solved today" : "Ready for today"}</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </Link>

        {/* Metric 2: Applications */}
        <Link href="/applications" className="group">
          <div className="rounded-xl border border-border bg-white p-3.5 shadow-sm hover:border-primary hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Applications
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-secondary">{totalApps}</span>
              <span className="text-[11px] text-text-secondary">Submitted</span>
            </div>
            <div className="mt-1 text-[11px] text-text-secondary flex items-center gap-1 group-hover:text-primary">
              <span>{appStatusCounts.shortlisted} Shortlisted</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </Link>

        {/* Metric 3: MCQ Accuracy */}
        <Link href="/mcq" className="group">
          <div className="rounded-xl border border-border bg-white p-3.5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                DSA Solved
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-secondary">{totalMcqSolved}</span>
              <span className="text-[11px] text-emerald-700 font-semibold">{mcqAccuracy}% Accuracy</span>
            </div>
            <div className="mt-1 text-[11px] text-text-secondary flex items-center gap-1 group-hover:text-emerald-700">
              <span>{xp} XP Earned</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </Link>

        {/* Metric 4: Profile & Resume ATS */}
        <Link href="/profile" className="group">
          <div className="rounded-xl border border-border bg-white p-3.5 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Profile Health
              </span>
              <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-secondary">{completeness}%</span>
              <span className="text-[11px] text-text-secondary">ATS Ready</span>
            </div>
            <div className="mt-1 text-[11px] text-text-secondary flex items-center gap-1 group-hover:text-primary">
              <span>{profile?.skills?.length || 0} Skills indexed</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </Link>
      </div>

      {/* Visual Graphs & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* GRAPH 1: Job Applications Funnel & Pipeline */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Applied Jobs Pipeline</h2>
                  <p className="text-[11px] text-text-secondary">Real-time status tracking across recruiters</p>
                </div>
              </div>
              <Link href="/applications" className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5">
                <span>View all</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Pipeline Visual Bar */}
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Status Distribution</span>
                <span className="font-semibold text-secondary">{totalApps} Total Applications</span>
              </div>

              {totalApps === 0 ? (
                <div className="py-6 text-center text-xs text-text-secondary border border-dashed rounded-lg bg-slate-50/50">
                  You haven&apos;t applied to any jobs yet. Browse recommended positions below!
                </div>
              ) : (
                <>
                  {/* Segmented Pipeline Progress Bar */}
                  <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    {appStatusCounts.applied > 0 && (
                      <div
                        style={{ width: `${(appStatusCounts.applied / totalApps) * 100}%` }}
                        className="bg-blue-500 hover:bg-blue-600 transition-all"
                        title={`Applied: ${appStatusCounts.applied}`}
                      />
                    )}
                    {appStatusCounts.viewed > 0 && (
                      <div
                        style={{ width: `${(appStatusCounts.viewed / totalApps) * 100}%` }}
                        className="bg-amber-400 hover:bg-amber-500 transition-all"
                        title={`Under Review: ${appStatusCounts.viewed}`}
                      />
                    )}
                    {appStatusCounts.shortlisted > 0 && (
                      <div
                        style={{ width: `${(appStatusCounts.shortlisted / totalApps) * 100}%` }}
                        className="bg-emerald-500 hover:bg-emerald-600 transition-all"
                        title={`Shortlisted: ${appStatusCounts.shortlisted}`}
                      />
                    )}
                    {appStatusCounts.interview > 0 && (
                      <div
                        style={{ width: `${(appStatusCounts.interview / totalApps) * 100}%` }}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-all"
                        title={`Interview: ${appStatusCounts.interview}`}
                      />
                    )}
                    {appStatusCounts.rejected > 0 && (
                      <div
                        style={{ width: `${(appStatusCounts.rejected / totalApps) * 100}%` }}
                        className="bg-slate-300 hover:bg-slate-400 transition-all"
                        title={`Archived: ${appStatusCounts.rejected}`}
                      />
                    )}
                  </div>

                  {/* Stage Metrics Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                    <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                      <div className="font-black text-blue-700 text-sm">{appStatusCounts.applied}</div>
                      <div className="text-slate-600 text-[10px]">Applied</div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                      <div className="font-black text-amber-700 text-sm">{appStatusCounts.viewed}</div>
                      <div className="text-slate-600 text-[10px]">In Review</div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <div className="font-black text-emerald-700 text-sm">{appStatusCounts.shortlisted}</div>
                      <div className="text-slate-600 text-[10px]">Shortlisted</div>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                      <div className="font-black text-indigo-700 text-sm">{appStatusCounts.interview}</div>
                      <div className="text-slate-600 text-[10px]">Interview</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Applications List */}
          {applications.length > 0 && (
            <div className="pt-3 border-t border-border mt-3 space-y-1.5">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                Recent Applications
              </span>
              {applications.slice(0, 2).map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-text-primary block truncate">
                      {app.job?.role || "Software Engineer"}
                    </span>
                    <span className="text-[10px] text-text-secondary truncate">
                      {app.job?.companyName || "Tech Enterprise"} • {formatRelativeTime(app.appliedAt)}
                    </span>
                  </div>
                  <Badge
                    size="sm"
                    variant={
                      app.status === "shortlisted"
                        ? "success"
                        : app.status === "interview"
                        ? "primary"
                        : app.status === "viewed"
                        ? "warning"
                        : "outline"
                    }
                    className="capitalize text-[10px] shrink-0 font-bold"
                  >
                    {app.status || "Applied"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GRAPH 2: Daily DSA & Practice Consistency Graph */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-50 text-accent flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">DSA Practice Consistency</h2>
                  <p className="text-[11px] text-text-secondary">Daily question activity &amp; retention rate</p>
                </div>
              </div>
              <Link href="/mcq" className="text-[11px] font-bold text-accent-dark hover:underline flex items-center gap-0.5">
                <span>Solve Today</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 14-Day Activity Dots Matrix */}
            <div className="pt-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>14-Day Consistency Activity</span>
                <span className="font-bold text-accent flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 fill-accent" />
                  {streak} Days Active Streak
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {streakData?.days?.map((day: any, i: number) => (
                  <div
                    key={i}
                    title={day.date}
                    className={`h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                      day.active
                        ? "bg-accent text-white shadow-sm"
                        : "bg-slate-100 text-slate-400 border border-slate-200/60"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Accuracy & Solved Progress Stats */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-black text-secondary text-sm">{totalMcqSolved}</div>
                  <div className="text-slate-600 text-[10px]">Questions Solved</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="font-black text-emerald-700 text-sm">{mcqAccuracy}%</div>
                  <div className="text-emerald-800 text-[10px]">Accuracy Rate</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="font-black text-primary text-sm">{xp}</div>
                  <div className="text-blue-800 text-[10px]">Skill XP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Question Status Badge */}
          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-text-secondary">Today&apos;s Challenge:</span>
              {todayQuestion?.hasAttempted ? (
                <Badge variant="success" size="sm" className="text-[10px] gap-1 font-bold">
                  <Check className="h-3 w-3" /> Attempted
                </Badge>
              ) : (
                <Badge variant="warning" size="sm" className="text-[10px] gap-1 font-bold">
                  <Clock className="h-3 w-3" /> Awaiting Submission
                </Badge>
              )}
            </div>
            <Link href="/mcq">
              <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5 font-bold">
                {todayQuestion?.hasAttempted ? "Review Solution" : "Answer Now"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded Resume Upload & ATS Section (Inside Dashboard) */}
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">Resume Management &amp; ATS Score</h2>
              <p className="text-[11px] text-text-secondary">
                Upload your latest PDF resume to update ATS score, skills, and candidate profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (profile) printOrDownloadAtsResume(profile);
              }}
              className="h-8 text-xs font-bold gap-1.5 border-blue-200 text-primary hover:bg-blue-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download ATS Resume (PDF)</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAtsModal(true)}
              className="h-8 text-xs font-semibold gap-1 text-text-secondary hover:text-text-primary"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </Button>
            <Link href="/profile">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                Edit Details
              </Button>
            </Link>
          </div>
        </div>

        {uploadSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200">
            <span className="font-bold">Error:</span>
            <span>{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Resume Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) {
                handleResumeFile(e.dataTransfer.files[0]);
              }
            }}
            className="md:col-span-2 border-2 border-dashed border-slate-300 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20 group flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleResumeFile(e.target.files[0]);
                }
              }}
            />
            <div className="h-10 w-10 rounded-xl bg-blue-50 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-colors shrink-0">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-text-primary group-hover:text-primary">
                {uploadingResume ? "Processing Resume..." : "Click or drag & drop to update PDF Resume"}
              </div>
              <div className="text-[11px] text-text-secondary mt-0.5">
                {uploadStatus || "PDF format supported • Automated AI skill and experience extraction"}
              </div>
            </div>
          </div>

          {/* Current Resume Info Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Current Resume
              </span>
              <Badge variant={profile?.resumeUrl ? "success" : "outline"} size="sm" className="text-[10px]">
                {profile?.resumeUrl ? "Uploaded" : "No File"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-text-primary truncate">
                {profile?.resumeName || (profile?.resumeUrl ? "Candidate_Resume.pdf" : "Upload to verify")}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1 border-t border-slate-200/60">
              <span>ATS Readiness:</span>
              <span className="font-bold text-emerald-700">{completeness}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-secondary">
              Recommended Job Matches
            </h2>
            <p className="text-[11px] text-text-secondary">
              Matched for your skill profile: {profile?.skills?.slice(0, 5).join(", ") || "Full Stack Engineer"}
            </p>
          </div>
          <Link href="/jobs" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
            <span>Browse all jobs</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-6 text-center text-xs text-text-secondary shadow-sm">
            No active jobs match currently. Check back soon or refine your profile skills!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-border bg-white p-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 border border-border flex items-center justify-center font-bold text-xs text-secondary shrink-0">
                        {job.companyName?.[0] || "C"}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-primary hover:text-primary leading-tight">
                          <Link href={`/jobs/${job._id}`}>{job.role}</Link>
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-0.5">
                          <span className="font-semibold text-text-primary">{job.companyName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm" className="text-[10px] shrink-0">
                      {job.jobType}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {job.skills?.slice(0, 4).map((skill: string) => (
                      <Badge key={skill} variant="outline" size="sm" className="text-[10px] py-0 px-1.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <span className="font-bold text-secondary text-[11px]">
                    {formatSalaryRange(job.salaryRange)}
                  </span>
                  <Link href={`/jobs/${job._id}`}>
                    <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                      View Position
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ATS Resume Modal for Preview */}
      {showAtsModal && profile && (
        <AtsResumeModal
          isOpen={showAtsModal}
          onClose={() => setShowAtsModal(false)}
          profile={profile}
        />
      )}
    </div>
  );
}
