"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  FileCheck2,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
  Code2,
  Briefcase,
  TrendingUp,
  Award,
  Users,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"seeker" | "recruiter">("seeker");

  const faqs = [
    {
      q: "How does the AI Resume Parsing work?",
      a: "Upload your resume in PDF format. Our Groq-powered Llama 3.3 pipeline extracts your work history, skills, education, certifications, and target salary in under 3 seconds. You can review and edit every field before your profile goes live.",
    },
    {
      q: "What is the Daily MCQ and how do streaks work?",
      a: "Every day at midnight UTC, a new high-yield tech challenge drops (covering Data Structures & Algorithms, System Design, or Aptitude). Solving it increments your streak and earns XP. Miss a day, and your streak resets.",
    },
    {
      q: "How can recruiters discover my profile?",
      a: "Recruiters use TalentPulse's multi-tag skill filters to pinpoint candidates matching their exact stack, experience depth, and location. Your profile is surfaced organically based on verified skills and MCQ activity.",
    },
    {
      q: "Can admins ingest jobs from any external source?",
      a: "Yes. TalentPulse's Admin Ingestion Engine allows admins to paste raw JD text or external job URLs. Groq AI automatically extracts company, role, salary range, tags, and apply links into a structured draft for 1-click publishing.",
    },
    {
      q: "Is TalentPulse completely free for job seekers?",
      a: "Yes! Job seekers get unlimited resume parsing, daily MCQ practice, job applications, and profile visibility for free. Recruiters pay a flexible subscription for high-volume candidate search and direct outreach.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-alt">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-subtle backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Groq Llama-3.3 Extraction Engine Live</span>
              <span className="text-slate-300">•</span>
              <span className="text-text-secondary font-normal">Sub-second parsing</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-secondary leading-[1.1] text-balance">
              The AI-Powered Career Platform for{" "}
              <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                High-Impact Engineers
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto text-balance">
              Stop manually filling job forms. Upload your PDF resume for instant AI parsing, practice curated daily DSA challenges to build consistency, and let top tech recruiters discover you.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/signup?role=seeker" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-7">
                  <span>Get Discovered as a Seeker</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup?role=recruiter" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base gap-2 px-6">
                  <Search className="h-4 w-4 text-text-secondary" />
                  <span>Hire Tech Talent</span>
                </Button>
              </Link>
            </div>

            {/* Quick Demo Logins Note */}
            <div className="flex items-center justify-center gap-4 text-xs text-text-secondary pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No credit card required
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-accent" />
                Under 60s setup
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-accent" />
                Daily DSA Gamification
              </span>
            </div>
          </div>

          {/* Hero Interactive UI Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-border bg-white shadow-2xl overflow-hidden p-2 sm:p-4 transition-all">
            <div className="flex items-center justify-between border-b border-border pb-3 px-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-text-secondary">
                  talentpulse.ai/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Flame className="h-3.5 w-3.5 fill-accent" />
                  12-Day Streak
                </span>
              </div>
            </div>

            {/* Simulated Live UI inside the hero preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-alt/60 rounded-xl mt-3">
              {/* Card 1: AI Resume Parsing Status */}
              <div className="rounded-xl border border-border bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    AI Resume Intake
                  </span>
                  <Badge variant="success" size="sm">
                    Autofilled 98%
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm font-bold text-text-primary">
                    Senior Full-Stack Engineer
                  </div>
                  <div className="text-xs text-text-secondary">
                    Extracted from resume.pdf via Groq
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="outline" size="sm">Next.js</Badge>
                  <Badge variant="outline" size="sm">TypeScript</Badge>
                  <Badge variant="outline" size="sm">MongoDB</Badge>
                  <Badge variant="outline" size="sm">Redis</Badge>
                </div>
              </div>

              {/* Card 2: Daily Challenge */}
              <div className="rounded-xl border border-border bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Daily Challenge #142
                  </span>
                  <Badge variant="warning" size="sm">
                    DSA • Medium
                  </Badge>
                </div>
                <div className="text-xs font-medium text-text-primary line-clamp-2">
                  What is the amortized time complexity of rehashing in a dynamic hash map?
                </div>
                <div className="text-[11px] font-semibold text-success bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Correct! +25 XP & Streak +1</span>
                </div>
              </div>

              {/* Card 3: Instant Recruiter Match */}
              <div className="rounded-xl border border-border bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Live Job Matches
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    95% Match Score
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-text-primary">
                    Staff Infrastructure Engineer
                  </div>
                  <div className="text-xs text-text-secondary">
                    CloudScale Labs • $160k - $210k
                  </div>
                </div>
                <Button variant="primary" size="sm" className="w-full text-xs h-8">
                  Easy Apply with Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted By / Social Proof Logos */}
      <section className="border-y border-border bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-text-secondary mb-6">
            Engineers placed at top tech enterprises & high-growth startups
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            {["Vercel", "Stripe", "Linear", "Ramp", "Supabase", "Datadog"].map((brand) => (
              <span key={brand} className="text-base sm:text-lg font-extrabold tracking-tight text-secondary">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Pillars / Feature Highlights */}
      <section className="py-20 bg-surface-alt">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Billion-Dollar Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              Engineered for the Modern Tech Job Search
            </h2>
            <p className="text-text-secondary text-base">
              Every detail is calibrated to eliminate friction for both builders and hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-hover transition-all space-y-4">
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                1-Click AI Resume Parsing
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Drop your PDF resume. Groq Llama 3.3 extracts experience, education, skills, and certifications into an editable profile instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-hover transition-all space-y-4">
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-accent flex items-center justify-center">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Daily DSA & Streak Engine
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Solve one high-yield DSA or Aptitude challenge daily. Maintain your streak, track consistency on your activity heatmap, and earn XP.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-hover transition-all space-y-4">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Precision Recruiter Search
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Recruiters filter candidates with multi-skill tags, verified experience years, and location. Candidate discovery with zero noise.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-hover transition-all space-y-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-success flex items-center justify-center">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                AI Ingestion Engine
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Admins paste raw JD text or external job links. Groq automatically structures salary, role, tags, and apply links in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-20 bg-white border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Streamlined Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              How TalentPulse Works
            </h2>
            <div className="inline-flex rounded-xl bg-surface-alt p-1 border border-border mt-4">
              <button
                onClick={() => setActiveTab("seeker")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "seeker"
                    ? "bg-white text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                For Job Seekers
              </button>
              <button
                onClick={() => setActiveTab("recruiter")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "recruiter"
                    ? "bg-white text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                For Recruiters & Admins
              </button>
            </div>
          </div>

          {activeTab === "seeker" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-base">
                  1
                </div>
                <h4 className="text-lg font-bold text-text-primary">Upload Resume PDF</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Groq AI reads your PDF, extracts all work experiences, universities, and tech stack tags, and auto-fills your profile.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-base">
                  2
                </div>
                <h4 className="text-lg font-bold text-text-primary">Solve Daily MCQs</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Sharpen algorithms and aptitude daily. Maintain your flame streak to showcase consistency and problem-solving readiness.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-base">
                  3
                </div>
                <h4 className="text-lg font-bold text-text-primary">1-Click Easy Apply</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Apply directly to curated engineering roles with your verified profile, or link out to external portals with tailored metadata.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white font-bold text-base">
                  1
                </div>
                <h4 className="text-lg font-bold text-text-primary">Ingest Jobs via AI</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Paste raw text or job URLs. Groq AI normalizes company name, salary ranges, location, and key requirements automatically.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white font-bold text-base">
                  2
                </div>
                <h4 className="text-lg font-bold text-text-primary">Targeted Candidate Discovery</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Search active candidates by role, verified skills, and experience depth with sub-second MongoDB and Redis queries.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white font-bold text-base">
                  3
                </div>
                <h4 className="text-lg font-bold text-text-primary">Access Verified Profiles</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Inspect structured candidate details, download original resume PDFs, and reach out to high-performing candidates directly.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Pricing Placeholder Section */}
      <section className="py-20 bg-surface-alt border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Transparent Pricing
            </span>
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              Simple, Predictable Plans
            </h2>
            <p className="text-text-secondary text-base">
              Free forever for job seekers. Enterprise-grade recruitment capabilities for hiring teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border border-border bg-white p-8 shadow-card space-y-6">
              <div>
                <Badge variant="primary" size="sm">Job Seeker</Badge>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-secondary">$0</span>
                  <span className="text-sm text-text-secondary">/ forever free</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Everything you need to accelerate your career and land top tech offers.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-text-primary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Unlimited AI Resume Parsing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Daily DSA & System Design MCQs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Streak tracking & activity heatmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Unlimited Easy Apply applications
                </li>
              </ul>
              <Link href="/signup?role=seeker" className="block">
                <Button variant="outline" className="w-full">
                  Create Free Seeker Account
                </Button>
              </Link>
            </div>

            {/* Recruiter Pro Plan */}
            <div className="rounded-2xl border-2 border-primary bg-white p-8 shadow-hover space-y-6 relative">
              <div className="absolute -top-3.5 right-6 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular for Teams
              </div>
              <div>
                <Badge variant="secondary" size="sm">Recruiter Pro</Badge>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-secondary">$149</span>
                  <span className="text-sm text-text-secondary">/ month</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Full candidate search, resume downloads, and priority talent pipeline.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-text-primary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Direct multi-skill candidate search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Full profile & resume PDF downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Verified skill & streak activity insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Dedicated priority talent matching
                </li>
              </ul>
              <Link href="/signup?role=recruiter" className="block">
                <Button variant="primary" className="w-full">
                  Start Recruiter Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 bg-white border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              Got Questions? We’ve Got Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface p-4 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between text-left font-semibold text-text-primary text-base"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-text-secondary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-secondary" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action Banner */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.3),transparent_60%)] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Ready to Supercharge Your Tech Career?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers and recruiters on the fastest-growing AI career discovery platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 h-12 text-base">
                Get Started Free Now
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 h-12 text-base">
                Explore Tech Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

