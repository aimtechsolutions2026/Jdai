"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileCheck2,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AtsResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id?: string;
    userId?: string;
    name?: string;
    email?: string;
    phone?: string;
    headline?: string;
    summary?: string;
    location?: string;
    skills?: string[];
    experience?: {
      company: string;
      title: string;
      from: string;
      to: string;
      description: string;
    }[];
    education?: {
      school: string;
      degree: string;
      year: string;
    }[];
    certificates?: {
      name: string;
      issuer: string;
      certificateId?: string;
      date?: string;
      url?: string;
    }[];
    achievements?: string[];
    projects?: {
      name: string;
      description: string;
      techStack?: string;
      url?: string;
    }[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
    languages?: string[];
    salaryExpectation?: {
      min: number;
      max: number;
      currency?: string;
    };
  };
}

export function AtsResumeModal({ isOpen, onClose, profile }: AtsResumeModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const candidateId = profile.id || profile.userId;

  const handleShareLink = () => {
    if (!candidateId && typeof window !== "undefined") return;
    const shareUrl = `${window.location.origin}/resume/${candidateId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const candidateName = profile.name || "Candidate";
  const candidateEmail = profile.email || "";
  const candidatePhone = profile.phone || "";
  const candidateLocation = profile.location || "";
  const candidateHeadline = profile.headline || "";
  const candidateSummary =
    profile.summary ||
    "Results-driven engineer with expertise in building scalable, secure, and resilient applications.";
  const candidateSkills = profile.skills || [];
  const candidateExperience = profile.experience || [];
  const candidateEducation = profile.education || [];
  const candidateCertificates = profile.certificates || [];
  const candidateProjects = profile.projects || [];
  const candidateAchievements = profile.achievements || [];
  const candidateSocialLinks = profile.socialLinks || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `================================================================================
${candidateName.toUpperCase()}${candidateHeadline ? ` - ${candidateHeadline.toUpperCase()}` : ""}
Email: ${candidateEmail} | Phone: ${candidatePhone} | Location: ${candidateLocation}
${candidateSocialLinks.linkedin ? `LinkedIn: ${candidateSocialLinks.linkedin} | ` : ""}${candidateSocialLinks.github ? `GitHub: ${candidateSocialLinks.github} | ` : ""}${candidateSocialLinks.portfolio ? `Portfolio: ${candidateSocialLinks.portfolio}` : ""}
================================================================================

PROFESSIONAL SUMMARY:
${candidateSummary}

--------------------------------------------------------------------------------
CORE TECHNICAL SKILLS:
--------------------------------------------------------------------------------
${candidateSkills.join(", ")}

--------------------------------------------------------------------------------
WORK EXPERIENCE:
--------------------------------------------------------------------------------
${candidateExperience
  .map(
    (exp) =>
      `${exp.title.toUpperCase()} | ${exp.company}\n${exp.from} - ${exp.to}\n${exp.description}`
  )
  .join("\n\n")}

${candidateProjects.length > 0 ? `--------------------------------------------------------------------------------
KEY PROJECTS:
--------------------------------------------------------------------------------
${candidateProjects
  .map(
    (p) =>
      `${p.name.toUpperCase()}${p.url ? ` (${p.url})` : ""}${p.techStack ? `\nTech Stack: ${p.techStack}` : ""}\n${p.description}`
  )
  .join("\n\n")}\n\n` : ""}--------------------------------------------------------------------------------
EDUCATION:
--------------------------------------------------------------------------------
${candidateEducation
  .map((edu) => `${edu.degree} - ${edu.school} (${edu.year})`)
  .join("\n")}

${candidateCertificates.length > 0 ? `--------------------------------------------------------------------------------
CERTIFICATIONS & CREDENTIALS:
--------------------------------------------------------------------------------
${candidateCertificates
  .map(
    (c) =>
      `- ${c.name} (${c.issuer})` +
      (c.certificateId ? ` | ID: ${c.certificateId}` : "") +
      (c.date ? ` | Issued: ${c.date}` : "") +
      (c.url ? ` | URL: ${c.url}` : "")
  )
  .join("\n")}\n\n` : ""}${candidateAchievements.length > 0 ? `--------------------------------------------------------------------------------
ACHIEVEMENTS & HONORS:
--------------------------------------------------------------------------------
${candidateAchievements.map((a) => `- ${a}`).join("\n")}\n\n` : ""}================================================================================
Generated via CodifyPro ATS Resume Engine by Aimtech Solutions
================================================================================`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${candidateName.replace(/\s+/g, "_")}_ATS_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const plainText = `${candidateName}${candidateHeadline ? ` (${candidateHeadline})` : ""}\n${candidateEmail} | ${candidatePhone} | ${candidateLocation}\n\nPROFESSIONAL SUMMARY:\n${candidateSummary}\n\nTECHNICAL SKILLS:\n${candidateSkills.join(
      ", "
    )}\n\nEXPERIENCE:\n${candidateExperience
      .map((e) => `${e.title} at ${e.company} (${e.from} - ${e.to})\n${e.description}`)
      .join("\n\n")}${candidateProjects.length > 0 ? `\n\nPROJECTS:\n${candidateProjects.map((p) => `${p.name}: ${p.description}`).join("\n")}` : ""}\n\nEDUCATION:\n${candidateEducation
      .map((e) => `${e.degree}, ${e.school} (${e.year})`)
      .join("\n")}${candidateCertificates.length > 0 ? `\n\nCERTIFICATIONS:\n${candidateCertificates
      .map(
        (c) =>
          `${c.name} - ${c.issuer}${c.certificateId ? ` (ID: ${c.certificateId})` : ""}${
            c.date ? ` (${c.date})` : ""
          }`
      )
      .join("\n")}` : ""}`;

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-border flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">ATS-Formatted Resume</h3>
                <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  100% ATS Ready
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Formatted directly from your filled profile details (Experience, Skills, Education &amp; Certifications).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {candidateId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLink}
                className="gap-1.5 text-xs border-blue-200 text-primary hover:bg-blue-50 font-semibold"
              >
                {copiedShare ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied Link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share Public Link</span>
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={handlePrint}
              size="sm"
              className="gap-1.5 text-xs font-semibold bg-primary text-white shadow-sm hover:bg-primary-dark"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTxt}
              className="gap-1.5 text-xs hidden sm:inline-flex"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .txt</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Resume Body */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100/60 flex-1">
          {/* Printable White Sheet */}
          <div
            id="ats-resume-document"
            className="mx-auto max-w-2xl bg-white p-6 sm:p-10 rounded-xl shadow-md border border-slate-200/80 font-sans text-slate-800 space-y-6 text-sm"
          >
            {/* 1. Header & Contact */}
            <div className="text-center border-b border-slate-300 pb-4 space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {candidateName}
              </h1>
              <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-2 font-medium">
                <span>{candidateEmail}</span>
                <span>•</span>
                <span>{candidatePhone}</span>
                <span>•</span>
                <span>{candidateLocation}</span>
              </div>
            </div>

            {/* 2. Core Technical Skills */}
            {candidateSkills.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Technical Skills
                </h2>
                <p className="text-xs leading-relaxed text-slate-700">
                  <span className="font-semibold text-slate-900">Core Technologies: </span>
                  {candidateSkills.join(", ")}
                </p>
              </div>
            )}

            {/* 3. Professional Experience */}
            {candidateExperience.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {candidateExperience.map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          {exp.title}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {exp.from} – {exp.to}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-primary">
                        {exp.company}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-0.5">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Education */}
            {candidateEducation.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                  Education
                </h2>
                <div className="space-y-2">
                  {candidateEducation.map((edu, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        <span className="text-slate-600"> — {edu.school}</span>
                      </div>
                      <span className="text-slate-500 font-medium">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Certifications & Licenses */}
            {candidateCertificates.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                  Certifications &amp; Credentials
                </h2>
                <div className="space-y-2.5">
                  {candidateCertificates.map((cert, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div>
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        <span className="text-slate-600"> • {cert.issuer}</span>
                        {cert.certificateId && (
                          <span className="ml-2 inline-flex items-center rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-700 border border-slate-200">
                            ID: {cert.certificateId}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 font-medium">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Watermark */}
            <div className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
              Verified Candidate Profile • CodifyPro by Aimtech Solutions
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-slate-50/80 shrink-0">
          <div className="text-xs text-text-secondary">
            Compatible with Greenhouse, Lever, Workday, and Taleo ATS parsers.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-1.5 font-semibold">
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
