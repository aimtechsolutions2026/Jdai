"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  FileCheck2,
  Eye,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-28 bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-28 bg-slate-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary">
            My Applications
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time status tracking for roles you have applied to on CodifyPro.
          </p>
        </div>
        <Link href="/jobs">
          <Button size="sm">Browse More Jobs</Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-secondary">
            No applications submitted yet
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            You haven&apos;t applied to any roles yet. Use 1-click Easy Apply to send your profile directly to top engineering teams.
          </p>
          <Link href="/jobs">
            <Button variant="primary" size="sm">
              Discover Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-card hover:shadow-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 border border-border flex items-center justify-center font-bold text-base text-secondary overflow-hidden shrink-0">
                  {app.job?.companyName?.[0] || "C"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {app.job?.role || "Software Engineer"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-1">
                    <span className="font-semibold text-text-primary">
                      {app.job?.companyName || "Company"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {app.job?.location || "Remote"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Applied {formatRelativeTime(app.appliedAt || new Date())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                {/* Status Badge */}
                <Badge
                  variant={
                    app.status === "shortlisted"
                      ? "success"
                      : app.status === "viewed"
                      ? "warning"
                      : "primary"
                  }
                  size="md"
                  className="capitalize font-semibold"
                >
                  {app.status || "Applied"}
                </Badge>

                {app.jobId?._id || app.job?._id ? (
                  <Link href={`/jobs/${app.jobId?._id || app.job?._id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Posting
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

