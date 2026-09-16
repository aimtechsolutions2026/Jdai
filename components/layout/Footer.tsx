import Link from "next/link";
import { Compass, Github, Twitter, Linkedin, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white pt-14 pb-20 md:pb-12 text-text-secondary text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-secondary">
                    CodifyPro
                  </span>
                  <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-blue-200/60">
                    AI
                  </span>
                </div>
                <span className="text-[10px] font-medium text-text-secondary leading-none">
                  by Aimtech Solutions
                </span>
              </div>
            </Link>
            <p className="text-text-secondary max-w-sm text-sm leading-relaxed">
              The AI-first career acceleration platform. AI-powered resume parsing, daily DSA & aptitude practice, and rapid recruiter discovery.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Engine Live
              </span>
            </div>
          </div>

          {/* Col 2 - For Job Seekers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Job Seekers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-primary transition-colors">
                  Browse Tech Jobs
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  AI Resume Parser
                </Link>
              </li>
              <li>
                <Link href="/mcq" className="hover:text-primary transition-colors">
                  Daily DSA Practice
                </Link>
              </li>
              <li>
                <Link href="/resume-center" className="hover:text-primary transition-colors">
                  ATS Resume Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - For Recruiters & Teams */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Recruiters
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recruiter/search" className="hover:text-primary transition-colors">
                  Candidate Search
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="hover:text-primary transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/signup?role=recruiter" className="hover:text-primary transition-colors">
                  Post Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 - Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/ingest" className="hover:text-primary transition-colors">
                  Admin AI Ingestion
                </Link>
              </li>
              <li>
                <Link href="/admin/mcq-bank" className="hover:text-primary transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} CodifyPro (Aimtech Solutions Platform). All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-text-secondary">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

