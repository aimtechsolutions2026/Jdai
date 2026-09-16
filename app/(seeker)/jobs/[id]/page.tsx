"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Building2,
  DollarSign,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Share2,
  FileCheck2,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";
import { sanitizeJD } from "@/lib/sanitize";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [applied, setApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Tailored resume generation state (Phase 2 stub)
  const [tailoring, setTailoring] = useState(false);
  const [tailoredReady, setTailoredReady] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
        }

        // Fetch similar jobs
        const simRes = await fetch("/api/jobs?limit=3");
        if (simRes.ok) {
          const simData = await simRes.json();
          setSimilarJobs(
            (simData.jobs || []).filter((j: any) => String(j._id) !== jobId).slice(0, 3)
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) loadJob();
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        setApplied(true);
        setShowApplyModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplying(false);
    }
  };

  const handleGenerateTailoredResume = () => {
    setTailoring(true);
    setTimeout(() => {
      setTailoring(false);
      setTailoredReady(true);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-44 w-full bg-slate-200 animate-pulse rounded-2xl" />
        <div className="h-96 w-full bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-secondary">Job not found</h2>
        <p className="text-sm text-text-secondary">
          The job listing you are looking for may have been filled or archived.
        </p>
        <Link href="/jobs">
          <Button variant="primary">Browse Available Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Jobs</span>
      </Link>

      {/* Top Job Banner Card */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-border flex items-center justify-center font-black text-2xl text-secondary overflow-hidden shrink-0">
              {job.companyName?.[0] || "C"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                {job.role}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-1">
                <span className="font-bold text-text-primary text-base">
                  {job.companyName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatRelativeTime(job.postedAt || new Date())}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {applied ? (
              <Button
                variant="outline"
                size="lg"
                disabled
                className="w-full sm:w-auto text-success bg-emerald-50 border-emerald-200"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span>Applied Successfully</span>
              </Button>
            ) : job.applyMode === "external" && job.applyUrl ? (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <span>Apply on Company Site</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => setShowApplyModal(true)}
              >
                Easy Apply Now
              </Button>
            )}
          </div>
        </div>

        {/* Highlight Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-border pt-6">
          <div className="p-3 rounded-xl bg-surface-alt border border-border">
            <span className="text-[11px] font-bold uppercase text-text-secondary">
              Salary Range
            </span>
            <div className="text-sm font-bold text-secondary mt-0.5">
              {formatSalaryRange(job.salaryRange)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border">
            <span className="text-[11px] font-bold uppercase text-text-secondary">
              Workplace Type
            </span>
            <div className="text-sm font-bold text-secondary capitalize mt-0.5">
              {job.jobType}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border">
            <span className="text-[11px] font-bold uppercase text-text-secondary">
              Experience Level
            </span>
            <div className="text-sm font-bold text-secondary mt-0.5">
              {job.experienceRequired?.min || 2} - {job.experienceRequired?.max || 6} yrs
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border">
            <span className="text-[11px] font-bold uppercase text-text-secondary">
              Application Mode
            </span>
            <div className="text-sm font-bold text-secondary capitalize mt-0.5">
              {job.applyMode === "easy-apply" ? "1-Click Easy Apply" : "External Portal"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description + AI Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Sanitized Job Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-secondary border-b border-border pb-3">
              About the Position
            </h2>
            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: sanitizeJD(job.jd) }}
            />
          </div>

          {/* Key Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">
                Required Tech Stack & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s: string) => (
                  <Badge key={s} variant="primary" size="md">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: AI Assistance & Tailored Resume */}
        <div className="space-y-6">
          {/* AI Tailoring Card */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="text-base font-bold text-secondary">
                AI Resume Tailoring
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Let AI re-align your profile achievements and inject keywords from this specific JD to maximize your interview odds.
            </p>

            {!tailoredReady ? (
              <Button
                variant="outline"
                className="w-full text-xs gap-1.5 bg-white border-blue-200 hover:bg-blue-50"
                isLoading={tailoring}
                onClick={handleGenerateTailoredResume}
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Tailor Resume for this Role</span>
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-success flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Resume tailored with 98% keyword match!</span>
                </div>
                <Link href="/resume-center">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    View in Resume Center
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Similar Roles */}
          {similarJobs.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">
                Similar Tech Roles
              </h3>
              <div className="space-y-3">
                {similarJobs.map((sim) => (
                  <Link
                    key={sim._id}
                    href={`/jobs/${sim._id}`}
                    className="block p-3 rounded-xl border border-border hover:border-primary hover:bg-surface-alt transition-all group"
                  >
                    <div className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      {sim.role}
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      {sim.companyName} • {sim.location}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Easy Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to ${job.companyName}`}
        description={`Position: ${job.role}`}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4 bg-surface-alt space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Company:</span>
              <span className="font-semibold text-text-primary">{job.companyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Location:</span>
              <span className="font-semibold text-text-primary">{job.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Resume:</span>
              <span className="font-semibold text-text-primary">Profile Verified PDF</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            Your application will be sent immediately to {job.companyName}&apos;s talent acquisition pipeline.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" isLoading={isApplying} onClick={handleApply}>
              Confirm & Apply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

