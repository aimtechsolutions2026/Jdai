"use client";

import React, { useState } from "react";
import {
  Eye,
  MousePointerClick,
  Download,
  Search,
  TrendingUp,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecruiterAnalyticsCardProps {
  profileName?: string;
  skillsCount?: number;
  experienceCount?: number;
}

export function RecruiterAnalyticsCard({
  profileName = "Developer",
  skillsCount = 8,
  experienceCount = 2,
}: RecruiterAnalyticsCardProps) {
  const [activeTab, setActiveTab] = useState<"views" | "clicks">("views");

  // Simulated 7-day data
  const viewsData = [
    { day: "Mon", count: 14 },
    { day: "Tue", count: 22 },
    { day: "Wed", count: 35 },
    { day: "Thu", count: 28 },
    { day: "Fri", count: 42 },
    { day: "Sat", count: 18 },
    { day: "Sun", count: 25 },
  ];

  const clicksData = [
    { day: "Mon", count: 3 },
    { day: "Tue", count: 6 },
    { day: "Wed", count: 9 },
    { day: "Thu", count: 7 },
    { day: "Fri", count: 12 },
    { day: "Sat", count: 4 },
    { day: "Sun", count: 6 },
  ];

  const currentDataset = activeTab === "views" ? viewsData : clicksData;
  const maxVal = Math.max(...currentDataset.map((d) => d.count), 1);
  const totalInWeek = currentDataset.reduce((acc, curr) => acc + curr.count, 0);

  const recentRecruiters = [
    {
      company: "Google",
      logoColor: "bg-blue-500",
      action: "Searched for Senior Full-Stack Engineers",
      time: "2h ago",
      type: "search",
    },
    {
      company: "Stripe",
      logoColor: "bg-indigo-600",
      action: "Downloaded your ATS Resume",
      time: "5h ago",
      type: "download",
    },
    {
      company: "Ramp",
      logoColor: "bg-emerald-600",
      action: "Viewed Work Experience & Skills",
      time: "Yesterday",
      type: "view",
    },
    {
      company: "Linear",
      logoColor: "bg-purple-600",
      action: "Shortlisted profile for Engineering Team",
      time: "2d ago",
      type: "shortlist",
    },
  ];

  return (
    <Card className="border-border bg-white shadow-sm overflow-hidden">
      {/* Header with Live Status */}
      <CardHeader className="border-b border-border bg-slate-50/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Recruiter Views &amp; Profile Activity</span>
              </CardTitle>
              <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                Live Analytics
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Real-time analytics on recruiters discovering, viewing, and downloading your profile.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Public to 500+ Tech Recruiters</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* 4 Quick Stat KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-border p-3.5 bg-surface-alt/70 space-y-1">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Profile Views</span>
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-slate-900">184</div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              <span>+28% this week</span>
            </div>
          </div>

          <div className="rounded-xl border border-border p-3.5 bg-surface-alt/70 space-y-1">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Recruiter Clicks</span>
              <MousePointerClick className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">47</div>
            <div className="text-[11px] font-medium text-text-secondary">
              Across 16 companies
            </div>
          </div>

          <div className="rounded-xl border border-border p-3.5 bg-surface-alt/70 space-y-1">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Resume Downloads</span>
              <Download className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">19</div>
            <div className="text-[11px] font-medium text-text-secondary">
              ATS format parsed
            </div>
          </div>

          <div className="rounded-xl border border-border p-3.5 bg-surface-alt/70 space-y-1">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Search Matches</span>
              <Search className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">92</div>
            <div className="text-[11px] font-semibold text-primary">
              Top 5% candidate rank
            </div>
          </div>
        </div>

        {/* 7-Day Performance Graph Section */}
        <div className="rounded-2xl border border-border p-4 sm:p-5 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>7-Day Recruiter Engagement Trend</span>
                <span className="text-xs font-normal text-text-secondary">
                  ({totalInWeek} total {activeTab})
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {activeTab === "views"
                  ? "Daily candidate profile impressions by verified tech recruiters."
                  : "Direct click-throughs from search listings to your full details."}
              </p>
            </div>

            {/* View / Click Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-border/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("views")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "views"
                    ? "bg-white text-primary shadow-xs"
                    : "text-text-secondary hover:text-slate-900"
                }`}
              >
                Profile Views
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("clicks")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "clicks"
                    ? "bg-white text-primary shadow-xs"
                    : "text-text-secondary hover:text-slate-900"
                }`}
              >
                Recruiter Clicks
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 h-40 items-end px-2">
              {currentDataset.map((item, idx) => {
                const heightPct = Math.round((item.count / maxVal) * 100);
                const isMax = item.count === maxVal;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Hover Value Tooltip */}
                    <div className="text-[11px] font-bold text-slate-700 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all font-mono">
                      {item.count}
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[38px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end relative h-28">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isMax
                            ? activeTab === "views"
                              ? "bg-gradient-to-t from-primary to-blue-400"
                              : "bg-gradient-to-t from-indigo-600 to-indigo-400"
                            : activeTab === "views"
                            ? "bg-primary/80 group-hover:bg-primary"
                            : "bg-indigo-500/80 group-hover:bg-indigo-600"
                        }`}
                      />
                    </div>

                    {/* Day Label */}
                    <span
                      className={`text-xs font-medium ${
                        isMax ? "text-primary font-bold" : "text-text-secondary"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-secondary pt-2 border-t border-slate-100">
            <span>Peak activity detected on Friday (42 views)</span>
            <span className="font-medium text-emerald-600">Avg. 26 views/day</span>
          </div>
        </div>

        {/* Bottom Split: Recent Recruiter Activity & Skill Strength */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Recruiter Interactions Feed */}
          <div className="rounded-2xl border border-border p-4 bg-surface-alt/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Recent Recruiter Activity</span>
              </span>
              <span className="text-[10px] text-text-secondary">Last 48 hrs</span>
            </div>

            <div className="space-y-2">
              {recentRecruiters.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-border/80 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-7 w-7 rounded-lg ${r.logoColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                    >
                      {r.company[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{r.company}</div>
                      <div className="text-[11px] text-text-secondary leading-tight line-clamp-1">
                        {r.action}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap pl-2">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill & Experience Depth Radar */}
          <div className="rounded-2xl border border-border p-4 bg-surface-alt/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Recruiter Match Strength</span>
              </span>
              <span className="text-[10px] font-semibold text-primary">AI Calibrated</span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-800">Frontend Systems (React, Next.js, TS)</span>
                  <span className="font-bold text-primary">96%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "96%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-800">Backend APIs &amp; Services (Node.js, Go)</span>
                  <span className="font-bold text-indigo-600">91%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "91%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-800">Data Architecture (MongoDB, Postgres, Redis)</span>
                  <span className="font-bold text-emerald-600">88%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-800">Cloud Infrastructure (Docker, AWS)</span>
                  <span className="font-bold text-amber-600">82%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "82%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
