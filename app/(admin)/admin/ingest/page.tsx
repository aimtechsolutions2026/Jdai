"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Link2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  MapPin,
  ExternalLink,
  Save,
  Radio,
  Eye,
  Code2,
  Tag,
  Briefcase,
  Clock,
  Plus,
  X,
  Coins,
  GraduationCap,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatSalaryRange } from "@/lib/utils";
import { sanitizeJD } from "@/lib/sanitize";

export default function AdminIngestPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"paste-text" | "paste-link" | "apify">(
    "paste-text"
  );
  const [pasteText, setPasteText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Review and publish state
  const [extractedDraft, setExtractedDraft] = useState<any | null>(null);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [jdViewMode, setJdViewMode] = useState<"preview" | "edit">("preview");

  const normalizeExtracted = (raw: any) => {
    return {
      role: raw.role || "Software Engineer",
      companyName: raw.companyName || "Tech Company",
      companyLogoUrl: raw.companyLogoUrl || "",
      location: raw.location || "Remote",
      pincode: raw.pincode || "",
      jobType: raw.jobType || "remote",
      salaryRange: {
        min: raw.salaryRange?.min ?? 0,
        max: raw.salaryRange?.max ?? 0,
        currency: raw.salaryRange?.currency || "INR",
      },
      experienceRequired: {
        min: raw.experienceRequired?.min ?? 0,
        max: raw.experienceRequired?.max ?? 5,
      },
      skills: Array.isArray(raw.skills) ? raw.skills : [],
      applyMode: raw.applyMode || "easy-apply",
      applyUrl: raw.applyUrl || "",
      jd: raw.jd || "",
    };
  };

  const handleExtractText = async () => {
    if (!pasteText || pasteText.trim().length < 20) {
      setErrorMsg("Please paste at least 20 characters of job text.");
      return;
    }
    setExtracting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/jobs/ingest/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");

      setExtractedDraft(normalizeExtracted(data.extracted));
      setSuccessMsg("AI extraction complete! Review and verify profile details below before publishing.");
    } catch (err: any) {
      setErrorMsg(err.message || "Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  const handleExtractLink = async () => {
    if (!linkUrl || !linkUrl.startsWith("http")) {
      setErrorMsg("Please provide a valid URL starting with http:// or https://");
      return;
    }
    setExtracting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/jobs/ingest/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");

      setExtractedDraft(normalizeExtracted(data.extracted));
      setSuccessMsg("AI extraction complete! Review and verify profile details below before publishing.");
    } catch (err: any) {
      setErrorMsg(err.message || "Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  const handlePublishJob = async () => {
    if (!extractedDraft) return;
    setPublishing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...extractedDraft,
          source: activeTab === "paste-link" ? "link" : "manual-paste",
          status: "published",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish job");

      setSuccessMsg("Job published live to the platform catalog!");
      setTimeout(() => {
        router.push("/admin/jobs");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish job");
    } finally {
      setPublishing(false);
    }
  };

  const applySalaryPreset = (min: number, max: number, currency?: string) => {
    if (!extractedDraft) return;
    setExtractedDraft({
      ...extractedDraft,
      salaryRange: {
        ...extractedDraft.salaryRange,
        min,
        max,
        currency: currency || extractedDraft.salaryRange?.currency || "INR",
      },
    });
  };

  const applyExpPreset = (min: number, max: number) => {
    if (!extractedDraft) return;
    setExtractedDraft({
      ...extractedDraft,
      experienceRequired: { min, max },
    });
  };

  const handleAddSkill = (skill?: string) => {
    const s = (skill || newSkillInput).trim();
    if (!s || !extractedDraft) return;
    if (!extractedDraft.skills?.includes(s)) {
      setExtractedDraft({
        ...extractedDraft,
        skills: [...(extractedDraft.skills || []), s],
      });
    }
    if (!skill) setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!extractedDraft) return;
    setExtractedDraft({
      ...extractedDraft,
      skills: extractedDraft.skills?.filter((s: string) => s !== skillToRemove) || [],
    });
  };

  const suggestedSkills = [
    "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "Go",
    "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "GraphQL"
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="sm">
            Admin Workspace
          </Badge>
          <Badge variant="secondary" size="sm">
            AI Ingestion Engine
          </Badge>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-secondary mt-2">
          AI Job Ingestion & Profile Verification
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Normalize raw job descriptions, parse INR/USD salary ranges, verify company profile details, and preview the listing before publishing live.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto no-scrollbar">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max" aria-label="Ingestion Source Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("paste-text")}
            className={`inline-flex items-center gap-2 pb-3.5 pt-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === "paste-text"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300"
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Paste Raw JD Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("paste-link")}
            className={`inline-flex items-center gap-2 pb-3.5 pt-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === "paste-link"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300"
            }`}
          >
            <Link2 className="h-4 w-4 shrink-0" />
            <span>Ingest from External URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("apify")}
            className={`inline-flex items-center gap-2 pb-3.5 pt-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap shrink-0 ${
              activeTab === "apify"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300"
            }`}
          >
            <Radio className="h-4 w-4 shrink-0" />
            <span>Apify Batch Queue</span>
            <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5 font-normal ml-0.5">
              Phase 2
            </Badge>
          </button>
        </nav>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-error border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-success border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab 1: Paste Raw Text */}
      {activeTab === "paste-text" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Paste Job Description Text</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste raw JD here (e.g. from LinkedIn, Naukri, Lever, Greenhouse, or recruiter notes)..."
              className="w-full rounded-xl border border-border bg-surface-alt p-3.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-text-secondary">
                AI extracts role, company, salary in USD / INR (LPA), experience, tech stack, and sanitized HTML description.
              </span>
              <Button
                variant="primary"
                onClick={handleExtractText}
                isLoading={extracting}
                className="w-full sm:w-auto gap-2 shrink-0"
              >
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Extract with AI</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Paste External Link */}
      {activeTab === "paste-link" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              <span>Ingest from External URL</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://jobs.lever.co/company/job-id or company careers link..."
                icon={<Link2 className="h-4 w-4" />}
                className="w-full"
              />
              <Button
                variant="primary"
                onClick={handleExtractLink}
                isLoading={extracting}
                className="w-full sm:w-auto shrink-0 gap-2"
              >
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Fetch & Extract</span>
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              CodifyPro scrapes the page, strips noise, parses USD or INR compensation, and normalizes structured fields.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Apify Scraper Queue */}
      {activeTab === "apify" && (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Radio className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-secondary">
              Apify Automated Ingestion Pipeline
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              Per Phase 2 architecture, scheduled scraper actors run on cron to ingest batches of raw listings into this queue for admin review.
            </p>
            <Badge variant="outline" size="sm">
              Phase 2 Extension Ready
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* ======================================================== */}
      {/* COMPREHENSIVE AI INGESTION PROFILE & DETAILS CHECK */}
      {/* ======================================================== */}
      {extractedDraft && (
        <div className="space-y-6 pt-4 border-t-2 border-primary/20">
          {/* Top Bar for Review */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 rounded-2xl border border-primary/30">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  AI Profile Check Ready
                </Badge>
                <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                  Detected Currency: {extractedDraft.salaryRange?.currency || "INR"}
                </Badge>
              </div>
              <h2 className="text-xl font-black text-secondary mt-1.5">
                Review & Verify Ingested Job Details
              </h2>
              <p className="text-xs text-text-secondary">
                Ensure compensation currency (USD / INR), skills, logo, and candidate description meet platform standards.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExtractedDraft(null)}
                className="gap-1.5 text-xs text-text-secondary hover:text-error"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Discard</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={publishing}
                onClick={handlePublishJob}
                className="gap-2 shadow-md"
              >
                <Save className="h-4 w-4" />
                <span>Publish to Platform</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS: Profile Details Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Role & Company Identity */}
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>1. Role & Company Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Role Title <span className="text-error">*</span>
                      </label>
                      <Input
                        value={extractedDraft.role || ""}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, role: e.target.value })
                        }
                        placeholder="e.g. Senior Backend Engineer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Company Name <span className="text-error">*</span>
                      </label>
                      <Input
                        value={extractedDraft.companyName || ""}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, companyName: e.target.value })
                        }
                        placeholder="e.g. Acme Tech Solutions"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Company Logo URL
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={extractedDraft.companyLogoUrl || ""}
                          onChange={(e) =>
                            setExtractedDraft({ ...extractedDraft, companyLogoUrl: e.target.value })
                          }
                          placeholder="https://logo.clearbit.com/company.com"
                          className="flex-1"
                        />
                        <div className="h-10 w-10 rounded-xl bg-slate-100 border border-border flex items-center justify-center font-bold text-xs text-secondary overflow-hidden shrink-0">
                          {extractedDraft.companyLogoUrl ? (
                            <img
                              src={extractedDraft.companyLogoUrl}
                              alt="Logo preview"
                              className="h-full w-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            extractedDraft.companyName?.[0] || "C"
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Location
                      </label>
                      <Input
                        value={extractedDraft.location || ""}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, location: e.target.value })
                        }
                        placeholder="e.g. Bengaluru, Karnataka, India"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Job Type
                      </label>
                      <select
                        value={extractedDraft.jobType || "remote"}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, jobType: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-text-primary"
                      >
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">Onsite</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Application Mode
                      </label>
                      <select
                        value={extractedDraft.applyMode || "easy-apply"}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, applyMode: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-text-primary"
                      >
                        <option value="easy-apply">1-Click Easy Apply</option>
                        <option value="external">External Job Portal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Pincode / Postal (Opt)
                      </label>
                      <Input
                        value={extractedDraft.pincode || ""}
                        onChange={(e) =>
                          setExtractedDraft({ ...extractedDraft, pincode: e.target.value })
                        }
                        placeholder="e.g. 560001"
                      />
                    </div>
                  </div>

                  {extractedDraft.applyMode === "external" && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        External Application URL
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={extractedDraft.applyUrl || ""}
                          onChange={(e) =>
                            setExtractedDraft({ ...extractedDraft, applyUrl: e.target.value })
                          }
                          placeholder="https://company.greenhouse.io/..."
                          className="flex-1"
                        />
                        {extractedDraft.applyUrl && (
                          <a
                            href={extractedDraft.applyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl border border-border text-primary hover:bg-slate-50 transition-colors shrink-0"
                            title="Test Apply Link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 2: Compensation & Currency Intelligence */}
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Coins className="h-4 w-4 text-emerald-600" />
                      <span>2. Compensation & Currency Settings</span>
                    </CardTitle>
                    {/* Live Formatted Badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-text-secondary">Preview:</span>
                      <Badge variant="success" size="sm" className="font-bold text-xs px-2.5 py-1">
                        {formatSalaryRange(extractedDraft.salaryRange)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Currency
                      </label>
                      <select
                        value={extractedDraft.salaryRange?.currency || "INR"}
                        onChange={(e) =>
                          setExtractedDraft({
                            ...extractedDraft,
                            salaryRange: {
                              ...extractedDraft.salaryRange,
                              currency: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl border border-border bg-white p-2.5 text-sm font-semibold text-text-primary"
                      >
                        <option value="INR">INR (₹ - Indian Rupee / LPA)</option>
                        <option value="USD">USD ($ - US Dollar)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                        <option value="GBP">GBP (£ - British Pound)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Min Salary ({extractedDraft.salaryRange?.currency === "INR" ? "₹ INR" : "$ USD"})
                      </label>
                      <Input
                        type="number"
                        value={extractedDraft.salaryRange?.min || 0}
                        onChange={(e) =>
                          setExtractedDraft({
                            ...extractedDraft,
                            salaryRange: {
                              ...extractedDraft.salaryRange,
                              min: Number(e.target.value),
                            },
                          })
                        }
                        placeholder={extractedDraft.salaryRange?.currency === "INR" ? "1200000" : "120000"}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Max Salary ({extractedDraft.salaryRange?.currency === "INR" ? "₹ INR" : "$ USD"})
                      </label>
                      <Input
                        type="number"
                        value={extractedDraft.salaryRange?.max || 0}
                        onChange={(e) =>
                          setExtractedDraft({
                            ...extractedDraft,
                            salaryRange: {
                              ...extractedDraft.salaryRange,
                              max: Number(e.target.value),
                            },
                          })
                        }
                        placeholder={extractedDraft.salaryRange?.currency === "INR" ? "1800000" : "160000"}
                      />
                    </div>
                  </div>

                  {/* Helper Tip */}
                  <div className="text-xs text-text-secondary bg-slate-50 p-2.5 rounded-xl border border-border">
                    {extractedDraft.salaryRange?.currency === "INR" ? (
                      <span>
                        💡 <strong>Indian Rupee (LPA) Mode:</strong> Enter annual amount in rupees (e.g. <code>1200000</code> = ₹12 LPA, <code>1850000</code> = ₹18.5 LPA). System automatically formats as <strong>₹12 - ₹18.5 LPA</strong>.
                      </span>
                    ) : (
                      <span>
                        💡 <strong>USD / International Mode:</strong> Enter full annual salary in dollars (e.g. <code>140000</code> = $140k). System automatically displays as <strong>$140k / year</strong>.
                      </span>
                    )}
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-text-secondary mb-1.5">
                      Quick Salary Presets:
                    </span>
                    {extractedDraft.salaryRange?.currency === "INR" ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(300000, 600000, "INR")}
                          className="text-xs py-1 h-auto"
                        >
                          ₹3 - 6 LPA
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(600000, 1000000, "INR")}
                          className="text-xs py-1 h-auto"
                        >
                          ₹6 - 10 LPA
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(1000000, 1800000, "INR")}
                          className="text-xs py-1 h-auto"
                        >
                          ₹10 - 18 LPA
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(1800000, 3000000, "INR")}
                          className="text-xs py-1 h-auto"
                        >
                          ₹18 - 30 LPA
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(3000000, 5000000, "INR")}
                          className="text-xs py-1 h-auto"
                        >
                          ₹30 - 50 LPA
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(60000, 90000, "USD")}
                          className="text-xs py-1 h-auto"
                        >
                          $60k - $90k
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(90000, 130000, "USD")}
                          className="text-xs py-1 h-auto"
                        >
                          $90k - $130k
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(130000, 180000, "USD")}
                          className="text-xs py-1 h-auto"
                        >
                          $130k - $180k
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySalaryPreset(180000, 250000, "USD")}
                          className="text-xs py-1 h-auto"
                        >
                          $180k - $250k
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Experience & Technical Competencies */}
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>3. Experience & Skills Checklist</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Min Experience (Years)
                      </label>
                      <Input
                        type="number"
                        value={extractedDraft.experienceRequired?.min || 0}
                        onChange={(e) =>
                          setExtractedDraft({
                            ...extractedDraft,
                            experienceRequired: {
                              ...extractedDraft.experienceRequired,
                              min: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                        Max Experience (Years)
                      </label>
                      <Input
                        type="number"
                        value={extractedDraft.experienceRequired?.max || 0}
                        onChange={(e) =>
                          setExtractedDraft({
                            ...extractedDraft,
                            experienceRequired: {
                              ...extractedDraft.experienceRequired,
                              max: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Experience Presets */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyExpPreset(0, 2)}
                      className="text-xs py-1 h-auto"
                    >
                      Entry Level (0 - 2 yrs)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyExpPreset(2, 5)}
                      className="text-xs py-1 h-auto"
                    >
                      Mid Level (2 - 5 yrs)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyExpPreset(5, 8)}
                      className="text-xs py-1 h-auto"
                    >
                      Senior (5 - 8 yrs)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyExpPreset(8, 12)}
                      className="text-xs py-1 h-auto"
                    >
                      Staff / Lead (8+ yrs)
                    </Button>
                  </div>

                  {/* Skills Tag Management */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-text-secondary mb-1.5">
                      Extracted Required Skills ({extractedDraft.skills?.length || 0})
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-border bg-surface-alt min-h-[50px] mb-2">
                      {extractedDraft.skills && extractedDraft.skills.length > 0 ? (
                        extractedDraft.skills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1 font-semibold"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="p-0.5 rounded-full hover:bg-slate-300 text-slate-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-text-secondary">
                          No skills added yet. Type below or pick suggestions.
                        </span>
                      )}
                    </div>

                    {/* Add Custom Skill input */}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add skill (e.g. Next.js, Redis, Docker)..."
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddSkill()}
                        className="gap-1 shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>

                    {/* Quick suggested chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-[11px] text-text-secondary mr-1">Suggestions:</span>
                      {suggestedSkills
                        .filter((s) => !extractedDraft.skills?.includes(s))
                        .slice(0, 6)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleAddSkill(s)}
                            className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-border bg-white hover:border-primary hover:text-primary transition-colors text-text-secondary"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Full Job Description (Sanitized HTML & Edit Mode) */}
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>4. Job Description & Candidate View</span>
                    </CardTitle>
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setJdViewMode("preview")}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          jdViewMode === "preview"
                            ? "bg-white text-primary shadow-xs"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Candidate Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setJdViewMode("edit")}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          jdViewMode === "edit"
                            ? "bg-white text-primary shadow-xs"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        <span>Edit HTML</span>
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {jdViewMode === "preview" ? (
                    <div className="rounded-xl border border-border bg-white p-5 max-h-96 overflow-y-auto space-y-3">
                      <div
                        className="text-xs sm:text-sm text-text-primary leading-relaxed prose prose-slate max-w-none [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-secondary [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-0.5"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeJD(extractedDraft.jd || "<p>No description available.</p>"),
                        }}
                      />
                    </div>
                  ) : (
                    <textarea
                      rows={10}
                      value={extractedDraft.jd || ""}
                      onChange={(e) =>
                        setExtractedDraft({ ...extractedDraft, jd: e.target.value })
                      }
                      placeholder="<h3>About Role</h3><p>Description...</p>"
                      className="w-full rounded-xl border border-border bg-slate-900 text-slate-100 p-3.5 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  )}
                  <p className="text-[11px] text-text-secondary mt-2">
                    Formatted using safe HTML tags (<code>&lt;h3&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>).
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Live Candidate Card Preview */}
            <div className="space-y-6">
              <div className="sticky top-6 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>Public Job Board Preview</span>
                </div>

                {/* Candidate Feed Card Mockup */}
                <div className="rounded-2xl border-2 border-primary/40 bg-white p-5 shadow-xl space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-border flex items-center justify-center font-black text-base text-secondary overflow-hidden shrink-0">
                        {extractedDraft.companyLogoUrl ? (
                          <img
                            src={extractedDraft.companyLogoUrl}
                            alt="Logo"
                            className="h-full w-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          extractedDraft.companyName?.[0] || "C"
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-primary line-clamp-1">
                          {extractedDraft.role || "Role Title"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                          <span className="font-semibold text-text-primary">
                            {extractedDraft.companyName || "Company Name"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-text-secondary" />
                            {extractedDraft.location || "Remote"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge variant="primary" size="sm" className="capitalize shrink-0">
                      {extractedDraft.jobType || "remote"}
                    </Badge>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {extractedDraft.experienceRequired?.min !== undefined && (
                        <Badge variant="outline" size="sm" className="text-[10px]">
                          {extractedDraft.experienceRequired.min}-{extractedDraft.experienceRequired.max || 5} yrs
                        </Badge>
                      )}
                      {extractedDraft.skills?.slice(0, 3).map((s: string) => (
                        <Badge key={s} variant="outline" size="sm" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                      {(extractedDraft.skills?.length || 0) > 3 && (
                        <Badge variant="outline" size="sm" className="text-[10px]">
                          +{(extractedDraft.skills?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>

                    <span className="text-xs font-bold text-secondary">
                      {formatSalaryRange(extractedDraft.salaryRange)}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs font-semibold"
                      disabled
                    >
                      {extractedDraft.applyMode === "external" ? "Apply Externally →" : "1-Click Easy Apply"}
                    </Button>
                  </div>
                </div>

                {/* Audit Checklist Box */}
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="p-4 space-y-2.5">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                      Profile Audit Checklist:
                    </span>
                    <ul className="text-xs space-y-1.5 text-text-secondary">
                      <li className="flex items-center gap-2">
                        {extractedDraft.role ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                        )}
                        <span>Role Title defined</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {extractedDraft.companyName ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                        )}
                        <span>Company Name defined</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {extractedDraft.salaryRange?.min > 0 || extractedDraft.salaryRange?.max > 0 ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                        )}
                        <span>
                          Salary verified: {formatSalaryRange(extractedDraft.salaryRange)}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {extractedDraft.skills?.length > 0 ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                        )}
                        <span>Skills tagged ({extractedDraft.skills?.length || 0})</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Final Publish Button */}
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={publishing}
                    onClick={handlePublishJob}
                    className="w-full gap-2 text-sm font-bold shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    <span>Confirm & Publish Live</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
