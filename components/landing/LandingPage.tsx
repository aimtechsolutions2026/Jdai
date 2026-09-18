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

const TOP_COMPANIES = [
  {
    name: "Google",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
        <rect x="2" y="2" width="9.2" height="9.2" fill="#F25022" rx="1"/>
        <rect x="12.8" y="2" width="9.2" height="9.2" fill="#7FBA00" rx="1"/>
        <rect x="2" y="12.8" width="9.2" height="9.2" fill="#00A4EF" rx="1"/>
        <rect x="12.8" y="12.8" width="9.2" height="9.2" fill="#FFB900" rx="1"/>
      </svg>
    ),
  },
  {
    name: "Amazon",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <path d="M14.2 16.5c-3 .2-6.2-.8-8.5-2.4-.3-.2-.5.1-.3.3 2.5 1.9 6 3 9.4 2.8 1.8-.1 3.5-.6 5-1.5.3-.2.2-.6-.2-.5-1.7.7-3.6 1.1-5.4 1.3z" fill="#FF9900"/>
        <path d="M19.7 14.8c-.2-.3-1.4-.2-2-.1-.2 0-.2-.1-.1-.2 1-.8 2.6-.5 2.8-.2.2.3-.1 1.9-1 2.7-.2.1-.2 0-.2-.1.1-.5.5-1.8.5-2.1z" fill="#FF9900"/>
        <path d="M12.5 4C8.6 4 6 6.8 6 10c0 2 1.2 3.5 2.9 4.1.4.1.6-.1.7-.4l.4-1.1c.1-.3 0-.5-.3-.6-1-.5-1.5-1.3-1.5-2.4 0-2.1 1.9-3.8 4.2-3.8 2.1 0 3.7 1.4 3.7 3.4 0 1.1-.5 1.9-1.2 2.4-.7.5-1.6.7-2.5.7-.6 0-1.3-.2-1.7-.5-.4-.3-.5-.6-.5-.9 0-.6.5-1.2 1.5-1.2.7 0 1.4.2 2.1.5.3.1.5 0 .5-.2l.4-.7c.1-.2 0-.4-.2-.4-.9-.4-1.9-.6-2.9-.6-2.1 0-3.4 1.3-3.4 2.9 0 1.3.8 2.3 2.1 2.7.9.3 2 .4 3 .2 1.4-.3 2.5-1.1 3.2-2.2.5-.9.9-2.1.9-3.2 0-3.2-2.6-5.8-6.8-5.8z" fill="#1E293B"/>
      </svg>
    ),
  },
  {
    name: "Stripe",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#635BFF">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.71 15.023.187 12.392.187 6.786.187 2.87 3.12 2.87 7.747c0 4.606 3.96 5.86 7.64 7.207 2.479.914 3.327 1.666 3.327 2.666 0 .973-.836 1.487-2.257 1.487-2.637 0-5.46-1.168-7.398-2.261l-.899 5.568c2.052 1.05 5.097 1.7 8.093 1.7 5.862 0 10.024-2.842 10.024-7.669 0-4.84-3.99-6.09-7.424-7.305z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#000000">
        <path d="M12 3.5L22.5 21.5H1.5L12 3.5Z" />
      </svg>
    ),
  },
  {
    name: "Linear",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#5E6AD2" fillOpacity="0.12" />
        <path d="M4 19L19 4M4 12L12 4M12 20L20 12M7 20L20 7" stroke="#5E6AD2" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Ramp",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#16A34A">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
        <circle cx="17.25" cy="17.25" r="3.75" />
      </svg>
    ),
  },
  {
    name: "Supabase",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <path d="M21.362 9.354H12V.304a.6.6 0 00-1.024-.424L.67 10.186a1.2 1.2 0 00.849 2.048H12v9.05a.6.6 0 001.024.424l10.305-10.306a1.2 1.2 0 00-.967-2.048z" fill="#3ECF8E"/>
      </svg>
    ),
  },
  {
    name: "Datadog",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#632CA6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" />
      </svg>
    ),
  },
  {
    name: "Airbnb",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#FF5A5F">
        <path d="M12 2c-3.1 0-5.4 2.4-5.4 5.5 0 3.7 4 9.1 5.4 10.9 1.4-1.8 5.4-7.2 5.4-10.9C17.4 4.4 15.1 2 12 2zm0 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
    ),
  },
  {
    name: "Shopify",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#95BF47">
        <path d="M15.8 4.2c-.1 0-.2.1-.3.2l-1.9 4.3 3.9.7-1.7-5.2zm-2.8 4.1L14.7 3c-.1-.3-.4-.5-.7-.5-.1 0-.3 0-.4.1L8.5 5.5l4.5 2.8zm-5.4-1.5l1.9-1.2-3.1-.7 1.2 1.9zm-.8.6l-3.3 2.1c-.2.1-.3.4-.2.6l4.1 13.1 3.8-2.4-4.4-13.4zm4.7 13.9l6.5-4.1-3.6-11.4-4.7 3 1.8 12.5z"/>
      </svg>
    ),
  },
  {
    name: "Netflix",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#E50914">
        <path d="M4 2h4.5l5.5 13V2h4v20h-4.5L8 9v13H4V2z"/>
      </svg>
    ),
  },
  {
    name: "Meta",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#0081FB">
        <path d="M16.7 4c-2.3 0-4.3 1.3-5.2 3.1-.9-1.8-2.9-3.1-5.2-3.1C2.8 4 .5 6.3.5 9.7c0 4.7 5.1 9.4 10.3 12.1.3.2.7.2 1 0 5.2-2.7 10.3-7.4 10.3-12.1C22.1 6.3 19.8 4 16.7 4zm-9.3 9.4c-2 0-3.6-1.6-3.6-3.7s1.6-3.7 3.6-3.7 3.6 1.6 3.6 3.7-1.6 3.7-3.6 3.7zm9.3 0c-2 0-3.6-1.6-3.6-3.7s1.6-3.7 3.6-3.7 3.6 1.6 3.6 3.7-1.6 3.7-3.6 3.7z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#24292F">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"seeker" | "recruiter">("seeker");

  const faqs = [
    {
      q: "How does the AI Resume Parsing work?",
      a: "Upload your resume in PDF format. Our AI pipeline extracts your work history, skills, education, certifications, and target salary in under 3 seconds. You can review and edit every field before your profile goes live.",
    },
    {
      q: "What is the Daily MCQ and how do streaks work?",
      a: "Every day at midnight UTC, a new high-yield tech challenge drops (covering Data Structures & Algorithms, System Design, or Aptitude). Solving it increments your streak and earns XP. Miss a day, and your streak resets.",
    },
    {
      q: "How can recruiters discover my profile?",
      a: "Recruiters use CodifyPro's multi-tag skill filters to pinpoint candidates matching their exact stack, experience depth, and location. Your profile is surfaced organically based on verified skills and MCQ activity.",
    },
    {
      q: "Can admins ingest jobs from any external source?",
      a: "Yes. CodifyPro's Admin Ingestion Engine allows admins to paste raw JD text or external job URLs. AI automatically extracts company, role, salary range, tags, and apply links into a structured draft for 1-click publishing.",
    },
    {
      q: "Is CodifyPro completely free for job seekers?",
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
              <span>AI Extraction Engine Live</span>
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

            {/* Value Props & Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-4">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                  No credit card required
                </span>
              </div>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 shrink-0">
                  <Zap className="h-4 w-4 sm:h-4.5 sm:w-4.5 fill-amber-400 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Under 60s setup
                </span>
              </div>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-rose-50 text-rose-500 shrink-0">
                  <Flame className="h-4 w-4 sm:h-4.5 sm:w-4.5 fill-rose-500" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Daily DSA Gamification
                </span>
              </div>
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
                  codifypro.ai/dashboard
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
                    Extracted from resume.pdf via AI
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

      {/* 2. Trusted By / Social Proof Logos Marquee */}
      <section className="border-y border-border bg-white py-8 sm:py-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
              Hiring from Top Companies & High-Growth Startups
            </p>
          </div>
        </div>

        {/* Seamless Infinite Slider (Right to Left) */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] py-2">
          <div className="animate-marquee flex items-center gap-8 sm:gap-12 py-1">
            {TOP_COMPANIES.concat(TOP_COMPANIES).concat(TOP_COMPANIES).concat(TOP_COMPANIES).map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center justify-center w-12 sm:w-16 h-10 shrink-0 opacity-70 hover:opacity-100 transition-all cursor-default group select-none"
                title={company.name}
              >
                {company.icon}
              </div>
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
                Drop your PDF resume. AI extracts experience, education, skills, and certifications into an editable profile instantly.
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
                Admins paste raw JD text or external job links. AI automatically structures salary, role, tags, and apply links in seconds.
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
              How CodifyPro Works
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
                  AI reads your PDF, extracts all work experiences, universities, and tech stack tags, and auto-fills your profile.
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
                  Paste raw text or job URLs. AI normalizes company name, salary ranges, location, and key requirements automatically.
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

