"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Share2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ExternalLink,
  Linkedin,
  Github,
  Printer,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PublicResumeClient({ id: initialId }: { id?: string }) {
  const params = useParams();
  const id = initialId || (params?.id as string);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        setLoading(true);
        const res = await fetch(`/api/resume/public/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error loading resume:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadResume();
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = () => {
    if (!profile) return;
    const lines: string[] = [];
    lines.push(profile.name.toUpperCase());
    if (profile.headline) lines.push(profile.headline);
    const contactParts = [profile.email, profile.phone, profile.location].filter(Boolean);
    if (contactParts.length) lines.push(contactParts.join(" | "));
    lines.push("\n--------------------------------------------------");
    if (profile.summary) {
      lines.push("PROFESSIONAL SUMMARY");
      lines.push(profile.summary);
      lines.push("\n--------------------------------------------------");
    }
    if (profile.skills?.length) {
      lines.push("CORE SKILLS");
      lines.push(profile.skills.join(", "));
      lines.push("\n--------------------------------------------------");
    }
    if (profile.experience?.length) {
      lines.push("WORK EXPERIENCE");
      profile.experience.forEach((exp: any) => {
        const fromDate = exp.from || exp.startDate || "";
        const toDate = exp.to || exp.endDate || "Present";
        lines.push(`${exp.role || exp.title} - ${exp.company} (${fromDate} - ${toDate})`);
        if (exp.description) lines.push(exp.description);
      });
      lines.push("\n--------------------------------------------------");
    }
    if (profile.projects?.length) {
      lines.push("KEY PROJECTS");
      profile.projects.forEach((proj: any) => {
        lines.push(`${proj.name}${proj.techStack ? ` (${proj.techStack})` : ""}`);
        if (proj.description) lines.push(proj.description);
      });
      lines.push("\n--------------------------------------------------");
    }
    if (profile.education?.length) {
      lines.push("EDUCATION");
      profile.education.forEach((edu: any) => {
        const school = edu.school || edu.institution || "";
        const year = edu.year || edu.graduationYear || "";
        lines.push(`${edu.degree} - ${school} (${year})`);
      });
      lines.push("\n--------------------------------------------------");
    }

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-10 max-w-md w-full text-center space-y-3 shadow-card">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-base font-bold text-secondary">Loading Candidate Resume...</h2>
          <p className="text-xs text-text-secondary">Retrieving verified ATS profile details</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-8 max-w-md w-full text-center space-y-4 shadow-card">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-error mx-auto font-bold text-lg">
            !
          </div>
          <h2 className="text-xl font-bold text-secondary">Resume Not Found</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            The candidate profile you are looking for may have been removed or visibility set to private.
          </p>
          <Link href="/jobs">
            <Button variant="primary" size="sm" className="w-full mt-2 font-bold">
              Explore Tech Jobs on CodifyPro
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20 print:bg-white print:p-0 print:pb-0">
      {/* Top Banner & Action Controls (Hidden in Print) */}
      <div className="border-b border-border bg-white sticky top-0 z-30 shadow-subtle print:hidden">
        <div className="mx-auto max-w-4xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
              title="CodifyPro Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-secondary">{profile.name}&apos;s Resume</span>
              <Badge variant="primary" size="sm" className="text-[10px] font-bold">
                ATS Verified
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-success" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              {copiedText ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedText ? "Text Copied!" : "Copy Text"}</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs font-bold shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Resume Canvas (Standard ATS 8.5x11 Single-Column Layout) */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 sm:p-12 space-y-6 text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 text-center sm:text-left space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
              {profile.name}
            </h1>
            {profile.headline && (
              <p className="text-sm sm:text-base font-bold text-primary">
                {profile.headline}
              </p>
            )}

            {/* Contact Details */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 pt-2 text-xs text-slate-600">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{profile.location}{profile.pincode ? ` - ${profile.pincode}` : ""}</span>
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{profile.email}</span>
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{profile.phone}</span>
                </span>
              )}
            </div>

            {/* Social & Portfolio Links */}
            {(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.portfolio) && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-medium text-primary">
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.socialLinks.portfolio && (
                  <a
                    href={profile.socialLinks.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {profile.summary && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Core Technical Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Core Skills & Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.skills.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Work Experience
              </h2>
              <div className="space-y-3.5">
                {profile.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900">
                        {exp.role || exp.title}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500">
                        {exp.from || exp.startDate || ""} {exp.from || exp.startDate ? "–" : ""} {exp.to || exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-primary">
                      {exp.company}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-0.5">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Key Technical Projects
              </h2>
              <div className="space-y-3">
                {profile.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {proj.techStack && (
                        <span className="text-[11px] font-mono text-slate-500">{proj.techStack}</span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Education
              </h2>
              <div className="space-y-2">
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-slate-600"> — {edu.school || edu.institution}</span>
                    </div>
                    {(edu.year || edu.graduationYear) && (
                      <span className="font-semibold text-slate-500">{edu.year || edu.graduationYear}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certificates && profile.certificates.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Certifications & Credentials
              </h2>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                {profile.certificates.map((c: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    {c.issuer && <span> — {c.issuer}</span>}
                    {c.certificateId && (
                      <span className="ml-2 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        ID: {c.certificateId}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Achievements & Honors
              </h2>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                {profile.achievements.map((ach: string, idx: number) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900">Languages: </span>
              <span className="text-xs text-slate-600">{profile.languages.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Public Discovery Footer (Hidden in Print) */}
        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-subtle text-center space-y-3 print:hidden">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>CodifyPro AI Talent Profile</span>
          </div>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Interested in hiring this candidate, or looking to build your own verified ATS-friendly resume? Explore verified tech opportunities today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href="/jobs">
              <Button variant="primary" size="sm" className="font-bold gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Explore 500+ Jobs</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="sm" className="font-semibold">
                Create Free Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
