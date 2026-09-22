"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  Clock,
  Bookmark,
  CheckCircle2,
  X,
  ExternalLink,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export default function JobsClient() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Easy Apply modal state
  const [applyingJob, setApplyingJob] = useState<any | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [selectedJobType, selectedLocation, minSalary, minExperience]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedJobType !== "all") params.set("jobType", selectedJobType);
      if (selectedLocation !== "all") params.set("location", selectedLocation);
      if (minSalary > 0) params.set("salaryMin", minSalary.toString());
      if (minExperience > 0) params.set("experienceMin", minExperience.toString());

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const toggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((j) => j !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const handleEasyApplySubmit = async () => {
    if (!applyingJob) return;
    setApplyLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: applyingJob._id }),
      });

      if (res.ok) {
        setAppliedJobs([...appliedJobs, applyingJob._id]);
        setApplySuccess(true);
        setTimeout(() => {
          setApplySuccess(false);
          setApplyingJob(null);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApplyLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedJobType("all");
    setSelectedLocation("all");
    setMinSalary(0);
    setMinExperience(0);
    setSearch("");
  };

  const hasActiveFilters =
    selectedJobType !== "all" ||
    selectedLocation !== "all" ||
    minSalary > 0 ||
    minExperience > 0 ||
    Boolean(search);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary">
            Find Engineering Roles
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse verified opportunities from category-defining tech companies.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, or stack..."
            icon={<Search className="h-4 w-4" />}
            className="w-full bg-white"
          />
          <Button type="submit" size="md">
            Search
          </Button>
        </form>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="flex md:hidden items-center justify-between">
        <span className="text-xs text-text-secondary font-medium">
          {jobs.length} jobs available
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="gap-1.5 text-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters (Location, Exp, Salary)</span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-primary ml-1" />
          )}
        </Button>
      </div>

      {/* Main Layout: 25% Sticky Sidebar + 75% Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar - Static / Sticky on page scroll */}
        <aside className="hidden md:block md:sticky md:top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Workplace Type */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Job Type
              </label>
              <div className="space-y-1.5 text-sm">
                {[
                  { label: "All Types", val: "all" },
                  { label: "Remote", val: "remote" },
                  { label: "Hybrid", val: "hybrid" },
                  { label: "Onsite", val: "onsite" },
                ].map((item) => (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-primary transition-colors"
                  >
                    <input
                      type="radio"
                      name="jobType"
                      checked={selectedJobType === item.val}
                      onChange={() => setSelectedJobType(item.val)}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-2.5 border-t border-border pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Location
              </label>
              <div className="space-y-1.5 text-sm">
                {[
                  { label: "Anywhere", val: "all" },
                  { label: "San Francisco, CA", val: "San Francisco" },
                  { label: "New York, NY", val: "New York" },
                  { label: "Austin, TX", val: "Austin" },
                  { label: "Remote Only", val: "Remote" },
                ].map((item) => (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-primary transition-colors"
                  >
                    <input
                      type="radio"
                      name="location"
                      checked={selectedLocation === item.val}
                      onChange={() => setSelectedLocation(item.val)}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div className="space-y-2.5 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Experience
                </label>
                <span className="text-xs font-bold text-primary">
                  {minExperience > 0 ? `${minExperience}+ yrs` : "Any"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { label: "Any Exp", val: 0 },
                  { label: "1+ Years", val: 1 },
                  { label: "3+ Years", val: 3 },
                  { label: "5+ Years", val: 5 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setMinExperience(item.val)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                      minExperience === item.val
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-alt border-border text-text-secondary hover:border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Salary Slider */}
            <div className="space-y-2.5 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Min Salary
                </label>
                <span className="text-xs font-bold text-primary">
                  {minSalary > 0 ? `$${minSalary / 1000}k+` : "Any"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={25000}
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-secondary">
                <span>$0</span>
                <span>$100k</span>
                <span>$200k+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 75% Job Cards Column */}
        <div className="md:col-span-3 space-y-4">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-text-secondary">Active:</span>
              {selectedJobType !== "all" && (
                <Badge variant="primary" size="sm" className="gap-1">
                  <span>Type: {selectedJobType}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedJobType("all")}
                  />
                </Badge>
              )}
              {selectedLocation !== "all" && (
                <Badge variant="primary" size="sm" className="gap-1">
                  <span>Loc: {selectedLocation}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedLocation("all")}
                  />
                </Badge>
              )}
              {minExperience > 0 && (
                <Badge variant="primary" size="sm" className="gap-1">
                  <span>Exp: {minExperience}+ yrs</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMinExperience(0)} />
                </Badge>
              )}
              {minSalary > 0 && (
                <Badge variant="primary" size="sm" className="gap-1">
                  <span>Min ${minSalary / 1000}k</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMinSalary(0)} />
                </Badge>
              )}
              {search && (
                <Badge variant="primary" size="sm" className="gap-1">
                  <span>&quot;{search}&quot;</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
                </Badge>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-text-secondary hover:text-error ml-2"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Job Cards List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-36 w-full bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                No jobs match your current filters
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Try widening your location, experience, or salary criteria to discover more engineering opportunities.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const isSaved = savedJobs.includes(job._id);
                const isApplied = appliedJobs.includes(job._id);

                return (
                  <div
                    key={job._id}
                    className="rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-hover hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Company & Role info */}
                      <div className="flex items-start gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-border flex items-center justify-center font-black text-base text-secondary overflow-hidden shrink-0">
                          {job.companyLogoUrl ? (
                            <img
                              src={job.companyLogoUrl}
                              alt={job.companyName}
                              className="h-full w-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            job.companyName?.[0] || "C"
                          )}
                        </div>
                        <div>
                          <Link href={`/jobs/${job._id}`}>
                            <h3 className="text-base sm:text-lg font-bold text-text-primary hover:text-primary transition-colors">
                              {job.role}
                            </h3>
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-1">
                            <span className="font-semibold text-text-primary">
                              {job.companyName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-text-secondary" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-text-secondary" />
                              {formatRelativeTime(job.postedAt || new Date())}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => toggleSaveJob(job._id, e)}
                        className={`p-2 rounded-xl border border-border transition-colors ${
                          isSaved
                            ? "bg-amber-50 text-accent border-amber-200"
                            : "bg-surface text-text-secondary hover:text-text-primary hover:bg-slate-50"
                        }`}
                        title={isSaved ? "Saved" : "Save Job"}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-accent" : ""}`} />
                      </button>
                    </div>

                    {/* Skill Badges & Salary Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="primary" size="sm" className="capitalize">
                          {job.jobType}
                        </Badge>
                        {job.experienceRequired?.min !== undefined && (
                          <Badge variant="outline" size="sm">
                            {job.experienceRequired.min}+ yrs exp
                          </Badge>
                        )}
                        {job.skills?.slice(0, 4).map((s: string) => (
                          <Badge key={s} variant="outline" size="sm">
                            {s}
                          </Badge>
                        ))}
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-secondary">
                        {formatSalaryRange(job.salaryRange)}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <Link href={`/jobs/${job._id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          View Job Details →
                        </Button>
                      </Link>

                      <div className="flex items-center gap-2">
                        {job.applyMode === "external" && job.applyUrl ? (
                          <a href={job.applyUrl} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="text-xs gap-1">
                              <span>External Apply</span>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        ) : isApplied ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="text-xs text-success bg-emerald-50 border-emerald-200"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            <span>Applied</span>
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs"
                            onClick={() => setApplyingJob(job)}
                          >
                            Easy Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Easy Apply Confirmation Modal */}
      <Modal
        isOpen={!!applyingJob}
        onClose={() => setApplyingJob(null)}
        title={`Apply to ${applyingJob?.companyName}`}
        description={`Position: ${applyingJob?.role}`}
      >
        {applySuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-secondary">Application Submitted!</h4>
            <p className="text-xs text-text-secondary">
              Your profile and resume were forwarded to the hiring team at {applyingJob?.companyName}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-4 bg-surface-alt space-y-2 text-xs">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Application Type:</span>
                <span className="font-semibold text-text-primary">1-Click Easy Apply</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Resume:</span>
                <span className="font-semibold text-text-primary">Profile Stored PDF</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Salary Expectations:</span>
                <span className="font-semibold text-text-primary">Included</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary">
              By confirming, your profile details, verified skills, and resume PDF will be made accessible to the recruiters managing this role.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setApplyingJob(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={applyLoading}
                onClick={handleEasyApplySubmit}
              >
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Mobile Filters Slide-over / Modal containing Location, Experience, and Salary */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Opportunities"
        description="Filter by location, required experience, salary range, and workplace type."
      >
        <div className="space-y-5">
          {/* 1. Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Location</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Anywhere", val: "all" },
                { label: "San Francisco, CA", val: "San Francisco" },
                { label: "New York, NY", val: "New York" },
                { label: "Austin, TX", val: "Austin" },
                { label: "Remote Only", val: "Remote" },
              ].map((loc) => (
                <button
                  key={loc.val}
                  type="button"
                  onClick={() => setSelectedLocation(loc.val)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-left truncate transition-colors ${
                    selectedLocation === loc.val
                      ? "bg-primary text-white border-primary font-bold"
                      : "bg-surface-alt border-border text-text-primary hover:border-slate-300"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Experience Filter */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span>Experience Level</span>
              </label>
              <span className="text-xs font-bold text-primary">
                {minExperience > 0 ? `${minExperience}+ years` : "Any"}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "Any", val: 0 },
                { label: "1+ yr", val: 1 },
                { label: "3+ yr", val: 3 },
                { label: "5+ yr", val: 5 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setMinExperience(item.val)}
                  className={`py-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                    minExperience === item.val
                      ? "bg-primary text-white border-primary font-bold"
                      : "bg-surface-alt border-border text-text-secondary hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Salary Range Filter */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                <span>Minimum Annual Salary</span>
              </label>
              <span className="text-xs font-bold text-primary">
                {minSalary > 0 ? `$${minSalary / 1000}k+` : "Any"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={25000}
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary">
              <span>Any</span>
              <span>$100k+</span>
              <span>$200k+</span>
            </div>
          </div>

          {/* 4. Workplace Type */}
          <div className="space-y-2 border-t border-border pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Workplace Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {["all", "remote", "hybrid", "onsite"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedJobType(t)}
                  className={`py-2 rounded-xl text-xs capitalize font-medium border text-center transition-colors ${
                    selectedJobType === t
                      ? "bg-primary text-white border-primary font-bold"
                      : "bg-surface-alt border-border text-text-secondary hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-1/3 text-xs"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-2/3 text-xs"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply ({jobs.length} Results)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
