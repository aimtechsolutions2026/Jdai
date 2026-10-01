"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  Zap,
  HelpCircle,
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  Eye,
  Save,
  ArrowRight,
  Flame,
  Search,
  Cpu,
  Layers,
  Globe,
  Settings,
  ShieldCheck,
  Check,
  X,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CompanyLogo, COMPANY_ICONS } from "@/components/landing/CompanyLogo";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

const PRESET_ICONS = [
  "google",
  "microsoft",
  "amazon",
  "netflix",
  "meta",
  "github",
  "stripe",
  "vercel",
  "airbnb",
  "supabase",
  "linear",
  "ramp",
  "datadog",
  "shopify",
  "custom",
];

export default function AdminContentManagerPage() {
  const [activeTab, setActiveTab] = useState<
    "partners" | "hero" | "features" | "howItWorks" | "faqs" | "ctaFooter"
  >("partners");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Content State
  const [content, setContent] = useState<any>(DEFAULT_SITE_CONTENT);

  // New partner company form modal/inline
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    iconKey: "google",
    logoUrl: "",
    websiteUrl: "",
    enabled: true,
  });

  // New FAQ form
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/site-content");
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
        }
      }
    } catch (err) {
      console.error("Failed to load content:", err);
      setFeedback({ type: "error", message: "Failed to load site content from server." });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save content.");
      }

      setContent(data.content);
      setFeedback({
        type: "success",
        message: "Website content saved and published successfully!",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to save content." });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all website content to platform defaults? Any custom edits will be replaced."
      )
    ) {
      return;
    }

    setResetting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset content.");
      }

      setContent(data.content);
      setFeedback({
        type: "success",
        message: "Website content has been reset to default values!",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to reset content." });
    } finally {
      setResetting(false);
    }
  };

  // Partner company management
  const handleAddPartner = () => {
    if (!newPartner.name.trim()) return;
    const updatedCompanies = [
      ...(content.partners?.companies || []),
      { ...newPartner, name: newPartner.name.trim() },
    ];
    setContent({
      ...content,
      partners: {
        ...content.partners,
        companies: updatedCompanies,
      },
    });
    setNewPartner({
      name: "",
      iconKey: "custom",
      logoUrl: "",
      websiteUrl: "",
      enabled: true,
    });
    setShowAddPartner(false);
  };

  const handleTogglePartner = (index: number) => {
    const updated = [...(content.partners?.companies || [])];
    updated[index].enabled = !updated[index].enabled;
    setContent({
      ...content,
      partners: { ...content.partners, companies: updated },
    });
  };

  const handleDeletePartner = (index: number) => {
    const updated = [...(content.partners?.companies || [])];
    updated.splice(index, 1);
    setContent({
      ...content,
      partners: { ...content.partners, companies: updated },
    });
  };

  // FAQ management
  const handleAddFaq = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return;
    const updatedFaqs = [...(content.faqs?.items || []), { ...newFaq }];
    setContent({
      ...content,
      faqs: { ...content.faqs, items: updatedFaqs },
    });
    setNewFaq({ q: "", a: "" });
    setShowAddFaq(false);
  };

  const handleDeleteFaq = (index: number) => {
    const updated = [...(content.faqs?.items || [])];
    updated.splice(index, 1);
    setContent({
      ...content,
      faqs: { ...content.faqs, items: updated },
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-72 bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-32 w-full bg-slate-200 animate-pulse rounded-2xl" />
        <div className="h-96 w-full bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-secondary tracking-tight">
              Website Content Manager
            </h1>
            <Badge variant="primary" size="sm" className="font-bold text-[10px]">
              Admin CMS
            </Badge>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Update landing page sections, partner company logos, hero copy, and FAQs in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <Link href="/" target="_blank">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold h-9"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live Site</span>
            </Button>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetToDefaults}
            isLoading={resetting}
            className="text-xs text-slate-500 hover:text-rose-600 h-9"
            title="Reset to initial landing copy"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveAll}
            isLoading={saving}
            className="gap-1.5 text-xs font-bold bg-primary hover:bg-primary-dark text-white h-9 px-4 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save &amp; Publish</span>
          </Button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("partners")}
          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "partners"
              ? "bg-secondary text-white shadow-sm"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Partners &amp; Companies ({content.partners?.companies?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "hero"
              ? "bg-secondary text-white shadow-sm"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Hero Section</span>
        </button>

        <button
          onClick={() => setActiveTab("features")}
          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "features"
              ? "bg-secondary text-white shadow-sm"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Core Features</span>
        </button>

        <button
          onClick={() => setActiveTab("howItWorks")}
          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "howItWorks"
              ? "bg-secondary text-white shadow-sm"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>How It Works</span>
        </button>

        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "faqs"
              ? "bg-secondary text-white shadow-sm"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>FAQs ({content.faqs?.items?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("ctaFooter")}
          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "ctaFooter"
              ? "bg-secondary text-white shadow-sm"
              : "text-text-secondary hover:bg-slate-100"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>CTA Banner &amp; Footer</span>
        </button>
      </div>

      {/* TAB 1: PARTNER COMPANIES & HIRING CAROUSEL */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Hiring Partner Logos &amp; Section Header</span>
                  </CardTitle>
                  <p className="text-xs text-text-secondary mt-0.5">
                    This section powers the live animated ticker banner on the homepage.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddPartner(!showAddPartner)}
                  className="gap-1.5 text-xs font-bold h-8"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Company Logo</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Header Text Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-border">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Section Heading Text
                  </label>
                  <Input
                    type="text"
                    value={content.partners?.heading || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        partners: { ...content.partners, heading: e.target.value },
                      })
                    }
                    placeholder="e.g. Hiring from Top Companies & High-Growth Startups"
                    className="text-xs sm:text-sm h-9"
                  />
                  <p className="text-[11px] text-text-secondary mt-1">
                    Shown right above the logo marquee on the homepage.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <Input
                    type="text"
                    value={content.partners?.badge || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        partners: { ...content.partners, badge: e.target.value },
                      })
                    }
                    placeholder="e.g. Top Tech Employers"
                    className="text-xs sm:text-sm h-9"
                  />
                  <p className="text-[11px] text-text-secondary mt-1">
                    Subtle identifier for internal categorization.
                  </p>
                </div>
              </div>

              {/* Add New Company Form */}
              {showAddPartner && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-blue-900 uppercase">
                      New Partner Company
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddPartner(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Company Name *
                      </label>
                      <Input
                        type="text"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                        placeholder="e.g. OpenAI, Uber, Flipkart"
                        className="text-xs h-8 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Icon Preset
                      </label>
                      <select
                        value={newPartner.iconKey}
                        onChange={(e) => setNewPartner({ ...newPartner, iconKey: e.target.value })}
                        className="w-full text-xs h-8 rounded-lg border border-border bg-white px-2 focus:ring-1 focus:ring-primary focus:outline-none capitalize"
                      >
                        {PRESET_ICONS.map((key) => (
                          <option key={key} value={key}>
                            {key === "custom" ? "Custom Image URL" : key}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Careers / Website URL
                      </label>
                      <Input
                        type="text"
                        value={newPartner.websiteUrl}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, websiteUrl: e.target.value })
                        }
                        placeholder="https://company.com/careers"
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                  </div>

                  {newPartner.iconKey === "custom" && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Custom Logo Image URL (PNG/SVG/WebP)
                      </label>
                      <Input
                        type="text"
                        value={newPartner.logoUrl}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, logoUrl: e.target.value })
                        }
                        placeholder="https://example.com/logo.svg"
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">Preview:</span>
                      <div className="h-8 w-20 flex items-center justify-center p-1 bg-white border border-border rounded-md">
                        <CompanyLogo
                          name={newPartner.name || "Preview"}
                          iconKey={newPartner.iconKey}
                          logoUrl={newPartner.logoUrl}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddPartner(false)}
                        className="h-8 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddPartner}
                        disabled={!newPartner.name.trim()}
                        className="h-8 text-xs font-bold"
                      >
                        Add to Ticker
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Preview Strip */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Live Marquee Ticker Preview
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    {content.partners?.companies?.filter((c: any) => c.enabled)?.length || 0} active
                    logos
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-slate-50/50 p-4 overflow-hidden">
                  <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{content.partners?.heading}</span>
                  </div>
                  <div className="flex items-center justify-center gap-8 flex-wrap py-2">
                    {content.partners?.companies
                      ?.filter((c: any) => c.enabled)
                      ?.map((comp: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center h-10 w-16 opacity-85 hover:opacity-100 transition-opacity"
                          title={comp.name}
                        >
                          <CompanyLogo
                            name={comp.name}
                            iconKey={comp.iconKey}
                            logoUrl={comp.logoUrl}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Companies Grid List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Manage Partner Companies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {content.partners?.companies?.map((company: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        company.enabled
                          ? "bg-white border-border shadow-sm"
                          : "bg-slate-50/80 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-12 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 p-1">
                          <CompanyLogo
                            name={company.name}
                            iconKey={company.iconKey}
                            logoUrl={company.logoUrl}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text-primary truncate">
                            {company.name}
                          </div>
                          <div className="text-[10px] text-text-muted capitalize">
                            {company.iconKey || "custom"} preset
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePartner(index)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-colors ${
                            company.enabled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {company.enabled ? "Active" : "Hidden"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePartner(index)}
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                          title="Remove company"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: HERO SECTION */}
      {activeTab === "hero" && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Hero Headline, CTAs &amp; Announcement Badge</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Announcement Pill Badge
              </label>
              <Input
                type="text"
                value={content.hero?.badge || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, badge: e.target.value },
                  })
                }
                placeholder="e.g. AI-Powered Career Discovery"
                className="text-xs sm:text-sm h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Main Headline
              </label>
              <Input
                type="text"
                value={content.hero?.title || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value },
                  })
                }
                placeholder="Land Your Dream Engineering Role with AI Precision"
                className="text-xs sm:text-sm h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Subheadline / Description
              </label>
              <textarea
                rows={3}
                value={content.hero?.subtitle || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value },
                  })
                }
                placeholder="Describe what CodifyPro offers to job seekers and builders"
                className="w-full text-xs sm:text-sm rounded-xl border border-border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Primary CTA Button Text
                </label>
                <Input
                  type="text"
                  value={content.hero?.primaryCtaText || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCtaText: e.target.value },
                    })
                  }
                  placeholder="Browse Engineering Jobs"
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Primary CTA Destination Link
                </label>
                <Input
                  type="text"
                  value={content.hero?.primaryCtaLink || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCtaLink: e.target.value },
                    })
                  }
                  placeholder="/jobs"
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Secondary CTA Button Text
                </label>
                <Input
                  type="text"
                  value={content.hero?.secondaryCtaText || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, secondaryCtaText: e.target.value },
                    })
                  }
                  placeholder="Upload Resume (ATS)"
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Secondary CTA Destination Link
                </label>
                <Input
                  type="text"
                  value={content.hero?.secondaryCtaLink || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, secondaryCtaLink: e.target.value },
                    })
                  }
                  placeholder="/profile"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Highlight Badges (Comma-separated)
              </label>
              <Input
                type="text"
                value={(content.hero?.featureBadges || []).join(", ")}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      featureBadges: e.target.value.split(",").map((s) => s.trim()),
                    },
                  })
                }
                placeholder="Zero Noise Applications, Verified Salaries, Daily DSA Gamification"
                className="text-xs h-9"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: CORE FEATURES */}
      {activeTab === "features" && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span>Core Value Propositions &amp; Feature Cards</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Section Subheading Tag
                </label>
                <Input
                  type="text"
                  value={content.features?.subheading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      features: { ...content.features, subheading: e.target.value },
                    })
                  }
                  placeholder="Billion-Dollar Architecture"
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Section Main Heading
                </label>
                <Input
                  type="text"
                  value={content.features?.heading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      features: { ...content.features, heading: e.target.value },
                    })
                  }
                  placeholder="Engineered for the Modern Tech Job Search"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Section Description
              </label>
              <Input
                type="text"
                value={content.features?.description || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    features: { ...content.features, description: e.target.value },
                  })
                }
                placeholder="Every detail is calibrated to eliminate friction..."
                className="text-xs h-9"
              />
            </div>

            {/* Feature Cards Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Feature Cards ({content.features?.items?.length || 0})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.features?.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-slate-50/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-primary">
                        Card #{idx + 1}
                      </span>
                      <Input
                        type="text"
                        value={item.badge || ""}
                        onChange={(e) => {
                          const updated = [...content.features.items];
                          updated[idx].badge = e.target.value;
                          setContent({
                            ...content,
                            features: { ...content.features, items: updated },
                          });
                        }}
                        placeholder="Badge (optional)"
                        className="text-[10px] h-6 w-32 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Card Title
                      </label>
                      <Input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const updated = [...content.features.items];
                          updated[idx].title = e.target.value;
                          setContent({
                            ...content,
                            features: { ...content.features, items: updated },
                          });
                        }}
                        className="text-xs h-8 bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Card Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updated = [...content.features.items];
                          updated[idx].description = e.target.value;
                          setContent({
                            ...content,
                            features: { ...content.features, items: updated },
                          });
                        }}
                        className="w-full text-xs rounded-lg border border-border p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: HOW IT WORKS */}
      {activeTab === "howItWorks" && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>How CodifyPro Works (Seeker &amp; Recruiter Workflows)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Section Subheading Tag
                </label>
                <Input
                  type="text"
                  value={content.howItWorks?.subheading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      howItWorks: { ...content.howItWorks, subheading: e.target.value },
                    })
                  }
                  placeholder="Streamlined Workflow"
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Section Main Heading
                </label>
                <Input
                  type="text"
                  value={content.howItWorks?.heading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      howItWorks: { ...content.howItWorks, heading: e.target.value },
                    })
                  }
                  placeholder="How CodifyPro Works"
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Seeker 3 Steps */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                For Job Seekers (3 Steps)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.howItWorks?.seekerSteps?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-slate-50/60 space-y-2"
                  >
                    <span className="text-[11px] font-bold text-primary">Step {step.stepNumber}</span>
                    <Input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) => {
                        const updated = [...content.howItWorks.seekerSteps];
                        updated[idx].title = e.target.value;
                        setContent({
                          ...content,
                          howItWorks: { ...content.howItWorks, seekerSteps: updated },
                        });
                      }}
                      placeholder="Step Title"
                      className="text-xs h-8 bg-white font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={step.description || ""}
                      onChange={(e) => {
                        const updated = [...content.howItWorks.seekerSteps];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          howItWorks: { ...content.howItWorks, seekerSteps: updated },
                        });
                      }}
                      placeholder="Step Description"
                      className="w-full text-xs rounded-lg border border-border p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter 3 Steps */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
                For Recruiters &amp; Admins (3 Steps)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.howItWorks?.recruiterSteps?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-slate-50/60 space-y-2"
                  >
                    <span className="text-[11px] font-bold text-secondary">
                      Step {step.stepNumber}
                    </span>
                    <Input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) => {
                        const updated = [...content.howItWorks.recruiterSteps];
                        updated[idx].title = e.target.value;
                        setContent({
                          ...content,
                          howItWorks: { ...content.howItWorks, recruiterSteps: updated },
                        });
                      }}
                      placeholder="Step Title"
                      className="text-xs h-8 bg-white font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={step.description || ""}
                      onChange={(e) => {
                        const updated = [...content.howItWorks.recruiterSteps];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          howItWorks: { ...content.howItWorks, recruiterSteps: updated },
                        });
                      }}
                      placeholder="Step Description"
                      className="w-full text-xs rounded-lg border border-border p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === "faqs" && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <p className="text-xs text-text-secondary mt-0.5">
                  Manage the Q&amp;A accordion on the landing page.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddFaq(!showAddFaq)}
                className="gap-1.5 text-xs font-bold h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add FAQ</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Section Subheading Tag
                </label>
                <Input
                  type="text"
                  value={content.faqs?.subheading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqs: { ...content.faqs, subheading: e.target.value },
                    })
                  }
                  placeholder="Frequently Asked Questions"
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Section Main Heading
                </label>
                <Input
                  type="text"
                  value={content.faqs?.heading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      faqs: { ...content.faqs, heading: e.target.value },
                    })
                  }
                  placeholder="Got Questions? We've Got Answers."
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Add FAQ inline form */}
            {showAddFaq && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-blue-900 uppercase">
                    New FAQ Item
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddFaq(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Question
                  </label>
                  <Input
                    type="text"
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    placeholder="e.g. Is CodifyPro free forever?"
                    className="text-xs h-8 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    rows={2}
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    placeholder="Provide a concise answer..."
                    className="w-full text-xs rounded-lg border border-border p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddFaq(false)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddFaq}
                    disabled={!newFaq.q.trim() || !newFaq.a.trim()}
                    className="h-8 text-xs font-bold"
                  >
                    Add FAQ
                  </Button>
                </div>
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
              {content.faqs?.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="text-[11px] font-bold text-primary">Question #{idx + 1}</div>
                      <Input
                        type="text"
                        value={item.q || ""}
                        onChange={(e) => {
                          const updated = [...content.faqs.items];
                          updated[idx].q = e.target.value;
                          setContent({
                            ...content,
                            faqs: { ...content.faqs, items: updated },
                          });
                        }}
                        className="text-xs sm:text-sm h-8 bg-white font-semibold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors mt-4"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      Answer
                    </label>
                    <textarea
                      rows={2}
                      value={item.a || ""}
                      onChange={(e) => {
                        const updated = [...content.faqs.items];
                        updated[idx].a = e.target.value;
                        setContent({
                          ...content,
                          faqs: { ...content.faqs, items: updated },
                        });
                      }}
                      className="w-full text-xs rounded-lg border border-border p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: CTA BANNER & FOOTER */}
      {activeTab === "ctaFooter" && (
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Bottom Call to Action Banner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Banner Heading
                </label>
                <Input
                  type="text"
                  value={content.ctaBanner?.heading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ctaBanner: { ...content.ctaBanner, heading: e.target.value },
                    })
                  }
                  placeholder="Ready to Supercharge Your Tech Career?"
                  className="text-xs sm:text-sm h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Banner Subheading
                </label>
                <textarea
                  rows={2}
                  value={content.ctaBanner?.subheading || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ctaBanner: { ...content.ctaBanner, subheading: e.target.value },
                    })
                  }
                  placeholder="Join thousands of developers and recruiters..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Primary Button Text
                  </label>
                  <Input
                    type="text"
                    value={content.ctaBanner?.primaryButtonText || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaBanner: {
                          ...content.ctaBanner,
                          primaryButtonText: e.target.value,
                        },
                      })
                    }
                    placeholder="Get Started Free Now"
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Primary Button Destination Link
                  </label>
                  <Input
                    type="text"
                    value={content.ctaBanner?.primaryButtonLink || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaBanner: {
                          ...content.ctaBanner,
                          primaryButtonLink: e.target.value,
                        },
                      })
                    }
                    placeholder="/signup"
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Secondary Button Text
                  </label>
                  <Input
                    type="text"
                    value={content.ctaBanner?.secondaryButtonText || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaBanner: {
                          ...content.ctaBanner,
                          secondaryButtonText: e.target.value,
                        },
                      })
                    }
                    placeholder="Explore Tech Jobs"
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Secondary Button Destination Link
                  </label>
                  <Input
                    type="text"
                    value={content.ctaBanner?.secondaryButtonLink || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaBanner: {
                          ...content.ctaBanner,
                          secondaryButtonLink: e.target.value,
                        },
                      })
                    }
                    placeholder="/jobs"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Settings */}
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span>Footer &amp; Support Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Footer Description
                </label>
                <textarea
                  rows={2}
                  value={content.footer?.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, description: e.target.value },
                    })
                  }
                  placeholder="Empowering engineering talent with verified skills..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Support Email
                </label>
                <Input
                  type="email"
                  value={content.footer?.supportEmail || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, supportEmail: e.target.value },
                    })
                  }
                  placeholder="support@codifypro.ai"
                  className="text-xs h-9"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md border border-border p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="text-xs text-text-secondary hidden sm:block">
          Changes will be immediately visible on the public landing page upon publishing.
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link href="/" target="_blank">
            <Button type="button" variant="outline" size="sm" className="h-9 text-xs font-semibold gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveAll}
            isLoading={saving}
            className="h-9 text-xs font-bold gap-1.5 bg-primary hover:bg-primary-dark text-white px-5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save &amp; Publish Content</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
