"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Briefcase,
  Bookmark,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [skillSearch, setSkillSearch] = useState("");
  const [topCandidates, setTopCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        setLoading(true);
        const res = await fetch("/api/recruiter/search");
        if (res.ok) {
          const data = await res.json();
          setTopCandidates((data.candidates || []).slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillSearch.trim()) {
      router.push(`/recruiter/search?skills=${encodeURIComponent(skillSearch.trim())}`);
    } else {
      router.push("/recruiter/search");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="sm">
              Recruiter Hub
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-secondary mt-1">
            Talent Discovery Command Center
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Discover verified engineers, review parsed resumes, and filter candidates by technical stack.
          </p>
        </div>
        <Link href="/recruiter/search">
          <Button size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            <span>Search Candidates</span>
          </Button>
        </Link>
      </div>

      {/* Quick Search Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="max-w-xl space-y-1">
          <h2 className="text-xl font-bold">Search Engineers by Stack & Experience</h2>
          <p className="text-xs text-slate-300">
            Enter technical skills or roles to find candidates with verified GitHub/resume experience.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
          <Input
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder="e.g. React, Next.js, Go, Kubernetes, TypeScript..."
            icon={<Search className="h-4 w-4" />}
            className="bg-white text-text-primary h-12 text-sm"
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto px-6 h-12 shrink-0">
            Find Talent
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
          <span>Popular searches:</span>
          {["TypeScript", "React", "Node.js", "Go", "Kubernetes", "AWS"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => router.push(`/recruiter/search?skills=${s}`)}
              className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Active Candidates
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-secondary">1,420+</div>
          <div className="mt-1 text-xs text-text-secondary">
            Verified technical profiles
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Recent Applications
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-success">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-secondary">38</div>
          <div className="mt-1 text-xs text-text-secondary">
            Incoming applicants this week
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              High-Streak Engineers
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-accent">
              <Flame className="h-4 w-4 fill-accent" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-secondary">89%</div>
          <div className="mt-1 text-xs text-text-secondary">
            Solve daily DSA challenges
          </div>
        </div>
      </div>

      {/* Top Candidate Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-secondary">
            Active Engineering Spotlight
          </h2>
          <Link href="/recruiter/search" className="text-xs font-semibold text-primary hover:underline">
            View full talent directory →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCandidates.map((cand, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-slate-100 border border-border overflow-hidden flex items-center justify-center font-bold text-sm text-secondary">
                        {cand.avatarUrl ? (
                          <img
                            src={cand.avatarUrl}
                            alt={cand.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          cand.name?.[0] || "C"
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary text-sm">
                          {cand.name}
                        </div>
                        <div className="text-xs text-text-secondary flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {cand.location || "San Francisco, CA"}
                        </div>
                      </div>
                    </div>
                    <Badge variant="warning" size="sm" className="gap-0.5">
                      <Flame className="h-3 w-3 fill-accent" />
                      <span>{cand.streak?.current || 12}d</span>
                    </Badge>
                  </div>

                  <div className="text-xs font-medium text-text-primary line-clamp-1">
                    {cand.experience?.[0]?.title || "Senior Software Engineer"}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {cand.skills?.slice(0, 4).map((s: string) => (
                      <Badge key={s} variant="outline" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link href={`/recruiter/search`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Inspect Full Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

