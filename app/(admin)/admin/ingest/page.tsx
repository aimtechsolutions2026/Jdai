"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Link2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Building2,
  DollarSign,
  MapPin,
  ExternalLink,
  Save,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

      setExtractedDraft(data.extracted);
      setSuccessMsg("AI extraction complete! Review and adjust fields below before publishing.");
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

      setExtractedDraft(data.extracted);
      setSuccessMsg("AI extraction complete! Review and adjust fields below before publishing.");
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

      setSuccessMsg("Job published live to the platform!");
      setTimeout(() => {
        router.push("/admin/jobs");
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish job");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="sm">
            Admin Workspace
          </Badge>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-secondary mt-2">
          AI Job Ingestion Engine
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Normalize raw job descriptions from external portals or plain text into structured opportunities using AI.
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
            <span>Paste Raw Text</span>
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
            <span>Paste External Link</span>
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
            <span>Apify Scraper Queue</span>
            <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5 font-normal ml-0.5">
              Phase 2
            </Badge>
          </button>
        </nav>
      </div>

      {/* Notification alerts */}
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
              placeholder="Paste raw JD here (e.g. from LinkedIn, Lever, Greenhouse, or internal notes)..."
              className="w-full rounded-xl border border-border bg-surface-alt p-3.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-text-secondary">
                AI will extract role, company, salary, experience, and key skills.
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
                placeholder="https://jobs.lever.co/company/job-id..."
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
              CodifyPro will scrape the external webpage, clean the HTML, and normalize structured fields via AI.
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
              Phase 2 Extension Stub Ready
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Interactive Review & Publish Form */}
      {extractedDraft && (
        <Card className="border-primary/40 bg-white shadow-xl space-y-6">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Review AI-Extracted Draft</span>
                </CardTitle>
                <p className="text-xs text-text-secondary mt-1">
                  Adjust any fields below before publishing to the live jobs catalog.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                isLoading={publishing}
                onClick={handlePublishJob}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Publish to Platform</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Role Title
                </label>
                <Input
                  value={extractedDraft.role || ""}
                  onChange={(e) =>
                    setExtractedDraft({ ...extractedDraft, role: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Company Name
                </label>
                <Input
                  value={extractedDraft.companyName || ""}
                  onChange={(e) =>
                    setExtractedDraft({ ...extractedDraft, companyName: e.target.value })
                  }
                />
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
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Job Type
                </label>
                <select
                  value={extractedDraft.jobType || "remote"}
                  onChange={(e) =>
                    setExtractedDraft({ ...extractedDraft, jobType: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-sm"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Min Salary ($ USD)
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
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Max Salary ($ USD)
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
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Apply Mode
                </label>
                <select
                  value={extractedDraft.applyMode || "easy-apply"}
                  onChange={(e) =>
                    setExtractedDraft({ ...extractedDraft, applyMode: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-sm"
                >
                  <option value="easy-apply">1-Click Easy Apply</option>
                  <option value="external">External Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  External Apply URL (if external)
                </label>
                <Input
                  value={extractedDraft.applyUrl || ""}
                  onChange={(e) =>
                    setExtractedDraft({ ...extractedDraft, applyUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Full Job Description (HTML / Rich Text)
              </label>
              <textarea
                rows={8}
                value={extractedDraft.jd || ""}
                onChange={(e) =>
                  setExtractedDraft({ ...extractedDraft, jd: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-white p-3.5 text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="md"
                onClick={() => setExtractedDraft(null)}
              >
                Discard Draft
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={publishing}
                onClick={handlePublishJob}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Confirm & Publish</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

