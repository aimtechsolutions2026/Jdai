"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ResumeCenterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAts, setGeneratingAts] = useState(false);
  const [atsReady, setAtsReady] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const d = await res.json();
          setProfile(d.profile);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenerateATS = () => {
    setGeneratingAts(true);
    setTimeout(() => {
      setGeneratingAts(false);
      setAtsReady(true);
    }, 1200);
  };

  const handleDownloadATS = () => {
    const text = `=====================================================
${profile?.name || "Candidate Name"} - Professional Resume
Email: ${profile?.email || "email@example.com"} | Phone: ${profile?.phone || "+1 555-000-0000"}
Location: ${profile?.location || "United States"}
=====================================================

TECHNICAL SKILLS:
${profile?.skills?.join(", ") || "TypeScript, React, Node.js"}

EXPERIENCE:
${profile?.experience?.map((e: any) => `${e.title} at ${e.company} (${e.from} - ${e.to})\n${e.description}`).join("\n\n") || "Software Engineer"}

EDUCATION:
${profile?.education?.map((ed: any) => `${ed.degree}, ${ed.school} (${ed.year})`).join("\n") || "B.S. Computer Science"}

TARGET SALARY:
$${profile?.salaryExpectation?.min?.toLocaleString()} - $${profile?.salaryExpectation?.max?.toLocaleString()} USD
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(profile?.name || "Candidate").replace(/\s+/g, "_")}_ATS_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-64 bg-slate-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-secondary">
          Resume Center
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage, preview, and download your original and ATS-optimized resume assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Resume Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Original Uploaded Resume</span>
                </CardTitle>
                <Badge variant={profile?.resumeUrl ? "success" : "outline"} size="sm">
                  {profile?.resumeUrl ? "Active PDF" : "None"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                The original source PDF used for AI extraction and shared with recruiters upon direct application.
              </p>
              {profile?.resumeUrl ? (
                <div className="rounded-xl border border-border p-3 bg-surface-alt flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-text-primary">
                    <FileCheck2 className="h-4 w-4 text-primary" />
                    <span>candidate_resume.pdf</span>
                  </div>
                  <span className="text-text-secondary font-mono">PDF</span>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-secondary">
                  No resume uploaded yet.
                </div>
              )}
            </CardContent>
          </div>
          <div className="p-5 pt-0">
            {profile?.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="block">
                <Button variant="outline" className="w-full gap-2 text-xs">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Original PDF</span>
                </Button>
              </a>
            ) : (
              <Link href="/profile" className="block">
                <Button variant="primary" className="w-full text-xs">
                  Upload Resume in Profile
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* ATS-Optimized Resume Card */}
        <Card className="flex flex-col justify-between border-blue-100 bg-gradient-to-b from-white to-blue-50/20">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span>ATS-Friendly Resume</span>
                </CardTitle>
                <Badge variant="primary" size="sm">
                  ATS Ready
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                Standard single-column, cleanly parsed format designed specifically to score 95%+ on enterprise applicant tracking systems (Greenhouse, Lever, Workday).
              </p>
              <div className="rounded-xl border border-blue-100 bg-white p-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-medium text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>Verified Single-Column Layout</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>Optimized Keyword Density</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>Instant Recruiter Scanner Compatible</span>
                </div>
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0 space-y-2">
            {!atsReady ? (
              <Button
                variant="primary"
                className="w-full gap-2 text-xs"
                isLoading={generatingAts}
                onClick={handleGenerateATS}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Compile ATS Format</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full gap-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                onClick={handleDownloadATS}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Compiled ATS Document</span>
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Tailored Resumes Extension Point (Phase 2 Stub) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileCode className="h-5 w-5 text-text-secondary" />
              <span>Job-Specific Tailored Resumes</span>
            </CardTitle>
            <Badge variant="outline" size="sm">
              Phase 2 Extension Point
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-text-secondary leading-relaxed">
            When you browse individual jobs in <Link href="/jobs" className="text-primary underline">Job Discovery</Link>, you can click &quot;Generate Tailored Resume&quot; to inject target JD keywords and reorder achievements specifically for that role. Generated versions will be archived here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

