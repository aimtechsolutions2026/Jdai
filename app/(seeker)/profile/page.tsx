"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileUp,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  DollarSign,
  User,
  X,
  Download,
  Loader2,
  FileText,
  FolderGit2,
  Globe,
  Languages,
  Linkedin,
  Github,
  Trophy,
  Coins,
  Share2,
  ChevronDown,
  Lock,
  Power,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AtsResumeModal } from "@/components/profile/AtsResumeModal";
import { printOrDownloadAtsResume } from "@/lib/ats-resume";
import { formatSalaryRange } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [parsingStatus, setParsingStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [socialLinks, setSocialLinks] = useState<{
    linkedin: string;
    github: string;
    portfolio: string;
  }>({
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [salaryMin, setSalaryMin] = useState(800000);
  const [salaryMax, setSalaryMax] = useState(1500000);
  const [currency, setCurrency] = useState("INR");

  const [experience, setExperience] = useState<
    { company: string; title: string; from: string; to: string; description: string }[]
  >([]);

  const [education, setEducation] = useState<
    { school: string; degree: string; year: string }[]
  >([]);

  const [certificates, setCertificates] = useState<
    { name: string; issuer: string; date: string; certificateId?: string; url?: string }[]
  >([]);

  const [projects, setProjects] = useState<
    { name: string; description: string; techStack?: string; url?: string }[]
  >([]);

  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState("");

  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState("");

  const [completeness, setCompleteness] = useState(50);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [candidateId, setCandidateId] = useState<string>("");

  // Collapsible accordion sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    summary: true,
    links: true,
    skills: true,
    salary: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
    achievements: true,
    languages: true,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const allSectionsOpen = Object.values(openSections).every(Boolean);

  const toggleAllSections = () => {
    const newState = !allSectionsOpen;
    setOpenSections({
      contact: newState,
      summary: newState,
      links: newState,
      skills: newState,
      salary: newState,
      experience: newState,
      projects: newState,
      education: newState,
      certifications: newState,
      achievements: newState,
      languages: newState,
      security: newState,
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");

      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          const p = data.profile;
          setCandidateId(p.userId || p._id || p.id || "");
          setName(p.name || "");
          setEmail(p.email || "");
          setPhone(p.phone || p.contact || "");
          setHeadline(p.headline || "");
          setSummary(p.summary || "");
          setLocation(p.location || "");
          setPincode(p.pincode || "");
          setSkills(p.skills || []);
          setExperience(p.experience || []);
          setEducation(p.education || []);
          setCertificates(p.certificates || []);
          setProjects(p.projects || []);
          setAchievements(p.achievements || []);
          setLanguages(p.languages || []);
          setSocialLinks({
            linkedin: p.socialLinks?.linkedin || "",
            github: p.socialLinks?.github || "",
            portfolio: p.socialLinks?.portfolio || "",
          });
          setSalaryMin(p.salaryExpectation?.min ?? 800000);
          setSalaryMax(p.salaryExpectation?.max ?? 1500000);
          setCurrency(p.salaryExpectation?.currency || "INR");
          setCompleteness(p.profileCompleteness || 50);
          setResumeUrl(p.resumeUrl || null);
        }
      } else if (res.status === 401) {
        router.push("/login?returnUrl=/profile");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF file only.");
      return;
    }

    setParsing(true);
    setParsingStatus("Uploading resume...");
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload resume");

      const jobId = data.jobId;
      setParsingStatus("Analyzing resume via automation in background...");

      // Poll status endpoint every 2 seconds until completed or failed
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds maximum timeout

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;

        const statusRes = await fetch(`/api/resume/status/${jobId}`);
        if (!statusRes.ok) {
          throw new Error("Failed to check resume extraction status");
        }

        const statusData = await statusRes.json();
        if (statusData.status === "completed") {
          const parsed = statusData.result?.parsedData || statusData.result;
          if (parsed) {
            if (parsed.name) setName(parsed.name);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.phone) setPhone(parsed.phone);
            if (parsed.headline) setHeadline(parsed.headline);
            if (parsed.summary) setSummary(parsed.summary);
            if (parsed.location) setLocation(parsed.location);
            if (parsed.pincode) setPincode(parsed.pincode);
            if (parsed.skills && parsed.skills.length > 0) setSkills(parsed.skills);
            if (parsed.experience && parsed.experience.length > 0) setExperience(parsed.experience);
            if (parsed.education && parsed.education.length > 0) setEducation(parsed.education);
            if (parsed.certificates && parsed.certificates.length > 0) setCertificates(parsed.certificates);
            if (parsed.achievements && parsed.achievements.length > 0) setAchievements(parsed.achievements);
            if (parsed.projects && parsed.projects.length > 0) setProjects(parsed.projects);
            if (parsed.socialLinks) {
              setSocialLinks({
                linkedin: parsed.socialLinks.linkedin || "",
                github: parsed.socialLinks.github || "",
                portfolio: parsed.socialLinks.portfolio || "",
              });
            }
            if (parsed.languages && parsed.languages.length > 0) setLanguages(parsed.languages);
            if (parsed.salaryExpectation?.min) setSalaryMin(parsed.salaryExpectation.min);
            if (parsed.salaryExpectation?.max) setSalaryMax(parsed.salaryExpectation.max);
            if (parsed.salaryExpectation?.currency) setCurrency(parsed.salaryExpectation.currency);
          }
          const profile = statusData.result?.profile;
          if (profile?.profileCompleteness) setCompleteness(profile.profileCompleteness);

          setSuccessMsg(
            "Extracted your resume details via automation! Name, contact, headline, summary, skills, experience, education, certificates, achievements, and projects have been populated below."
          );
          setParsing(false);
          setParsingStatus(null);
          return;
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "Resume extraction failed");
        } else {
          setParsingStatus(`Analyzing via automation... (${attempts * 2}s)`);
        }
      }

      throw new Error("Resume parsing timed out after 60 seconds. Please try again.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse resume");
    } finally {
      setParsing(false);
      setParsingStatus(null);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name,
        phone,
        headline,
        summary,
        location,
        pincode,
        skills,
        experience,
        education,
        certificates,
        achievements,
        projects,
        socialLinks,
        languages,
        salaryExpectation: { min: Number(salaryMin), max: Number(salaryMax), currency },
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");

      if (data.profile?.profileCompleteness) {
        setCompleteness(data.profile.profileCompleteness);
      }
      setSuccessMsg("Profile saved successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadAtsPdf = () => {
    printOrDownloadAtsResume({
      name,
      email,
      phone,
      headline,
      summary,
      location,
      skills,
      experience,
      education,
      certificates,
      projects,
      achievements,
      socialLinks,
    });
  };

  // Skill Helpers
  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Experience Helpers
  const addExperienceEntry = () => {
    setExperience([
      ...experience,
      { company: "", title: "", from: "", to: "Present", description: "" },
    ]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience];
    (updated[index] as any)[field] = value;
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Education Helpers
  const addEducationEntry = () => {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    (updated[index] as any)[field] = value;
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Certificate Helpers
  const addCertificateEntry = () => {
    setCertificates([
      ...certificates,
      { name: "", certificateId: "", issuer: "", date: "", url: "" },
    ]);
  };

  const updateCertificate = (index: number, field: string, value: string) => {
    const updated = [...certificates];
    (updated[index] as any)[field] = value;
    setCertificates(updated);
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // Project Helpers
  const addProjectEntry = () => {
    setProjects([
      ...projects,
      { name: "", description: "", techStack: "", url: "" },
    ]);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    (updated[index] as any)[field] = value;
    setProjects(updated);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Achievement Helpers
  const addAchievement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Language Helpers
  const addLanguage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-32 w-full bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-64 w-full bg-slate-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-20 space-y-4">
      {/* Header & Completeness Nudge */}
      <div className="border-b border-border pb-3.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-secondary">
          Candidate Profile
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Manage your verified details, skills, work history, projects, certifications, and automated parsed resume.
        </p>
      </div>

      {/* Completeness Progress Banner */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-3 sm:p-3.5 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary whitespace-nowrap">
              Profile Completeness
            </span>
            <Badge variant="primary" size="sm" className="text-[10px] font-bold py-0.5 px-2 shrink-0">
              {completeness}%
            </Badge>
            <span className="text-[11px] text-text-secondary hidden md:inline ml-1 truncate">
              {completeness >= 80 ? "• High Recruiter Visibility" : "• Complete all sections to reach 100%"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadAtsPdf}
              className="gap-1.5 border-blue-300 bg-white text-primary hover:bg-blue-50 h-8 px-3 text-xs font-bold shadow-xs whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-primary" />
              <span>Download ATS Resume (PDF)</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAtsModal(true)}
              className="text-[11px] text-primary hover:bg-blue-100/50 h-8 px-2 font-semibold whitespace-nowrap"
            >
              <Eye className="h-3 w-3 mr-1" />
              <span>Preview</span>
            </Button>
          </div>
        </div>

        <div className="h-1.5 sm:h-2 w-full rounded-full bg-blue-200/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs sm:text-sm text-success border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs sm:text-sm text-error border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sections Control Bar */}
      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Profile Details & Sections
        </span>
        <button
          type="button"
          onClick={toggleAllSections}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 transition-colors"
        >
          {allSectionsOpen ? "Collapse All Sections" : "Expand All Sections"}
        </button>
      </div>

      {/* Collapsible Sections Accordion Container */}
      <div className="space-y-2.5">
        {/* Section 1: Contact & Personal Info */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("contact")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.contact ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <User className="h-4 w-4 text-primary shrink-0" />
              <span>1. Contact & Basic Information</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                openSections.contact ? "rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </CardHeader>
          {openSections.contact && (
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Professional Headline / Title
                  </label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <Input value={email} disabled className="bg-slate-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Phone / Mobile
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru, Karnataka, India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Postal / PIN Code
                  </label>
                  <Input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 2: Professional Summary / Bio */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("summary")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.summary ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span>2. Professional Summary</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                openSections.summary ? "rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </CardHeader>
          {openSections.summary && (
            <CardContent className="p-4 sm:p-5 space-y-1.5">
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Highlight your core technical strengths, years of experience, primary tech stack, and standout achievements..."
                className="w-full rounded-xl border border-border bg-white p-3 text-xs sm:text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
              />
              <p className="text-[11px] text-text-secondary">
                Tip: A concise 2-4 sentence summary helps recruiters immediately understand your primary focus and domain expertise.
              </p>
            </CardContent>
          )}
        </Card>

        {/* Section 3: Online Profiles & Social Links */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("links")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.links ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span>3. Online Profiles & Portfolio Links</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                openSections.links ? "rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </CardHeader>
          {openSections.links && (
            <CardContent className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                  <span>LinkedIn Profile</span>
                </label>
                <Input
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Profile</span>
                </label>
                <Input
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Portfolio / Personal Site</span>
                </label>
                <Input
                  value={socialLinks.portfolio}
                  onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.dev"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 4: Skills */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("skills")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.skills ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <span>4. Technical Skills & Technologies</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                openSections.skills ? "rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </CardHeader>
          {openSections.skills && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                  Add Skill (type name and press Enter)
                </label>
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="e.g. TypeScript, React, Next.js, Docker, AWS, Redis, PostgreSQL..."
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="primary"
                    size="sm"
                    className="gap-1.5 py-1 px-2.5 text-xs bg-blue-50 text-primary border border-blue-200 font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-error transition-colors p-0.5"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <span className="text-xs text-text-secondary italic">
                    No skills added yet. Upload a resume to automatically extract your skills.
                  </span>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 5: Target Salary Expectation */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("salary")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.salary ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
                <Coins className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>5. Target Annual Compensation</span>
              </CardTitle>
              <Badge variant="success" size="sm" className="font-bold hidden sm:inline-flex text-[11px] py-0.5">
                {formatSalaryRange({ min: salaryMin, max: salaryMax, currency })}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="success" size="sm" className="font-bold sm:hidden text-[11px] py-0.5">
                {formatSalaryRange({ min: salaryMin, max: salaryMax, currency })}
              </Badge>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                  openSections.salary ? "rotate-180 text-primary" : "rotate-0"
                }`}
              />
            </div>
          </CardHeader>
          {openSections.salary && (
            <CardContent className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary font-semibold"
                >
                  <option value="INR">INR (₹ - Indian Rupee / LPA)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                  Minimum Expectation ({currency === "INR" ? "₹ INR" : "$ USD"})
                </label>
                <Input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  placeholder={currency === "INR" ? "800000" : "90000"}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                  Maximum Expectation ({currency === "INR" ? "₹ INR" : "$ USD"})
                </label>
                <Input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  placeholder={currency === "INR" ? "1500000" : "150000"}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 6: Work Experience */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("experience")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.experience ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <Briefcase className="h-4 w-4 text-primary shrink-0" />
              <span>6. Work Experience ({experience.length})</span>
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSections((prev) => ({ ...prev, experience: true }));
                  addExperienceEntry();
                }}
                className="gap-1 text-xs h-7 px-2.5"
              >
                <Plus className="h-3 w-3" />
                <span>Add Position</span>
              </Button>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                  openSections.experience ? "rotate-180 text-primary" : "rotate-0"
                }`}
              />
            </div>
          </CardHeader>
          {openSections.experience && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border p-3.5 bg-surface-alt space-y-2.5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-2.5 right-2.5 text-text-secondary hover:text-error transition-colors p-1"
                    title="Remove entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-7">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Company Name
                      </label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        placeholder="e.g. Razorpay, Swiggy, Stripe"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Role / Title
                      </label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(idx, "title", e.target.value)}
                        placeholder="e.g. Full Stack Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Start Date / Year
                      </label>
                      <Input
                        value={exp.from}
                        onChange={(e) => updateExperience(idx, "from", e.target.value)}
                        placeholder="e.g. Jul 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        End Date / Year
                      </label>
                      <Input
                        value={exp.to}
                        onChange={(e) => updateExperience(idx, "to", e.target.value)}
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                      Key Achievements & Responsibilities
                    </label>
                    <textarea
                      rows={2.5}
                      className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, "description", e.target.value)}
                      placeholder="Bullet points of architectural decisions, technologies used, and measurable results..."
                    />
                  </div>
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-xs text-text-secondary italic">
                  No work experience added yet. Upload a resume to automatically extract your employment history.
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Section 7: Key Projects */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("projects")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.projects ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <FolderGit2 className="h-4 w-4 text-primary shrink-0" />
              <span>7. Key Projects ({projects.length})</span>
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSections((prev) => ({ ...prev, projects: true }));
                  addProjectEntry();
                }}
                className="gap-1 text-xs h-7 px-2.5 shrink-0"
              >
                <Plus className="h-3 w-3" />
                <span>Add Project</span>
              </Button>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                  openSections.projects ? "rotate-180 text-primary" : "rotate-0"
                }`}
              />
            </div>
          </CardHeader>
          {openSections.projects && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border p-3.5 bg-surface-alt space-y-2.5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="absolute top-2.5 right-2.5 text-text-secondary hover:text-error transition-colors p-1"
                    title="Remove project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-7">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Project Name
                      </label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                        placeholder="e.g. Distributed Task Queue"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Tech Stack
                      </label>
                      <Input
                        value={proj.techStack || ""}
                        onChange={(e) => updateProject(idx, "techStack", e.target.value)}
                        placeholder="e.g. Next.js, Redis, Docker"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Project / Demo URL
                      </label>
                      <Input
                        value={proj.url || ""}
                        onChange={(e) => updateProject(idx, "url", e.target.value)}
                        placeholder="https://github.com/user/project"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                      Project Description
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
                      value={proj.description}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                      placeholder="Core problem solved, architecture details, performance metrics..."
                    />
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-xs text-text-secondary italic">
                  No projects added yet. Upload a resume or click &quot;Add Project&quot;.
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Section 8: Education */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("education")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.education ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <GraduationCap className="h-4 w-4 text-primary shrink-0" />
              <span>8. Education ({education.length})</span>
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSections((prev) => ({ ...prev, education: true }));
                  addEducationEntry();
                }}
                className="gap-1 text-xs h-7 px-2.5"
              >
                <Plus className="h-3 w-3" />
                <span>Add School</span>
              </Button>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                  openSections.education ? "rotate-180 text-primary" : "rotate-0"
                }`}
              />
            </div>
          </CardHeader>
          {openSections.education && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border p-3.5 bg-surface-alt space-y-2.5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-2.5 right-2.5 text-text-secondary hover:text-error transition-colors p-1"
                    title="Remove entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-7">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Institution / University
                      </label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(idx, "school", e.target.value)}
                        placeholder="e.g. NIT Karnataka, IIT Delhi"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Degree / Major
                      </label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        placeholder="e.g. B.Tech in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Graduation Year / Range
                      </label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(idx, "year", e.target.value)}
                        placeholder="e.g. 2018 - 2022"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {education.length === 0 && (
                <p className="text-xs text-text-secondary italic">
                  No education entries added yet. Upload a resume to automatically extract your degree.
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Section 9: Certifications & Verified Credentials */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("certifications")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.certifications ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <Award className="h-4 w-4 text-primary shrink-0" />
              <span>9. Certifications & Credentials ({certificates.length})</span>
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSections((prev) => ({ ...prev, certifications: true }));
                  addCertificateEntry();
                }}
                className="gap-1 text-xs h-7 px-2.5 shrink-0"
              >
                <Plus className="h-3 w-3" />
                <span>Add Certificate</span>
              </Button>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                  openSections.certifications ? "rotate-180 text-primary" : "rotate-0"
                }`}
              />
            </div>
          </CardHeader>
          {openSections.certifications && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              {certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border p-3.5 bg-surface-alt space-y-2.5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeCertificate(idx)}
                    className="absolute top-2.5 right-2.5 text-text-secondary hover:text-error transition-colors p-1"
                    title="Remove certificate"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-7">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Certification Name <span className="text-error">*</span>
                      </label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertificate(idx, "name", e.target.value)}
                        placeholder="e.g. AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Certificate / Credential ID
                      </label>
                      <Input
                        value={cert.certificateId || ""}
                        onChange={(e) => updateCertificate(idx, "certificateId", e.target.value)}
                        placeholder="e.g. AWS-SAA-992381"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Issuing Organization
                      </label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateCertificate(idx, "issuer", e.target.value)}
                        placeholder="e.g. Amazon Web Services (AWS)"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                        Issue Date / Year
                      </label>
                      <Input
                        value={cert.date}
                        onChange={(e) => updateCertificate(idx, "date", e.target.value)}
                        placeholder="e.g. 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                      Credential Verification URL (Optional)
                    </label>
                    <Input
                      value={cert.url || ""}
                      onChange={(e) => updateCertificate(idx, "url", e.target.value)}
                      placeholder="https://cp.certmetrics.com/amazon/public/verify/credential/..."
                    />
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="text-xs text-text-secondary italic">
                  No certifications added yet. Upload a resume or click &quot;Add Certificate&quot;.
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Section 10: Achievements & Honors */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("achievements")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.achievements ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <Trophy className="h-4 w-4 text-accent shrink-0" />
              <span>10. Achievements & Honors ({achievements.length})</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                openSections.achievements ? "rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </CardHeader>
          {openSections.achievements && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              <form onSubmit={addAchievement} className="flex items-center gap-2">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="e.g. 1st Place Winner at Smart India Hackathon 2020 out of 500+ teams..."
                  className="text-xs sm:text-sm h-9"
                />
                <Button type="submit" size="sm" className="gap-1 shrink-0 h-9 px-3 text-xs">
                  <Plus className="h-3 w-3" />
                  <span>Add</span>
                </Button>
              </form>

              <div className="space-y-1.5">
                {achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2.5 p-2.5 rounded-xl border border-border bg-surface-alt"
                  >
                    <div className="flex items-start gap-2">
                      <Trophy className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-text-primary">{ach}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAchievement(idx)}
                      className="text-text-secondary hover:text-error transition-colors p-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-xs text-text-secondary italic">
                    No achievements recorded yet. Add competitions, honors, or publications.
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 11: Languages Spoken */}
        <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs rounded-xl hover:border-slate-300 transition-colors">
          <CardHeader
            onClick={() => toggleSection("languages")}
            className={`cursor-pointer select-none hover:bg-slate-50 transition-colors px-4 py-2.5 sm:py-3 flex flex-row items-center justify-between space-y-0 ${
              openSections.languages ? "border-b border-border/70 bg-slate-50/50" : ""
            }`}
          >
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
              <Languages className="h-4 w-4 text-primary shrink-0" />
              <span>11. Languages ({languages.length})</span>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                openSections.languages ? "rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </CardHeader>
          {openSections.languages && (
            <CardContent className="p-4 sm:p-5 space-y-3">
              <form onSubmit={addLanguage} className="flex items-center gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="e.g. English, Hindi, Spanish..."
                  className="text-xs sm:text-sm h-9"
                />
                <Button type="submit" size="sm" className="gap-1 shrink-0 h-9 px-3 text-xs">
                  <Plus className="h-3 w-3" />
                  <span>Add Language</span>
                </Button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {languages.map((lang, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 py-1 px-2.5 text-xs font-semibold"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(idx)}
                      className="hover:text-error transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {languages.length === 0 && (
                  <p className="text-xs text-text-secondary italic">
                    No languages added yet.
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Account Security & Settings Link */}
        <div className="rounded-xl border border-border bg-slate-50/70 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary">Account Security &amp; Settings</div>
              <p className="text-[11px] text-text-secondary">Password management and account deletion (7-day grace period)</p>
            </div>
          </div>
          <Link href="/settings">
            <Button type="button" size="sm" variant="outline" className="text-xs h-7.5 px-3 font-semibold">
              Manage in Settings →
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-xl bg-white border border-border p-3.5 sm:p-4 shadow-card">
        <div className="text-xs text-text-secondary max-w-md leading-relaxed">
          All changes are saved to your verified candidate profile and immediately reflected in ATS exports.
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-col sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleDownloadAtsPdf}
            className="w-full sm:w-auto gap-2 border-blue-200 text-primary hover:bg-blue-50 font-semibold justify-center h-10 px-4 text-xs sm:text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download ATS Resume (PDF)</span>
          </Button>
          <Button
            onClick={handleSaveProfile}
            size="md"
            isLoading={saving}
            className="w-full sm:w-auto gap-2 justify-center h-10 px-5 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* ATS Resume Modal */}
      <AtsResumeModal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        profile={{
          id: candidateId,
          userId: candidateId,
          name,
          email,
          phone,
          headline,
          summary,
          location,
          skills,
          experience,
          education,
          certificates,
          projects,
          achievements,
          socialLinks,
          languages,
          salaryExpectation: {
            min: Number(salaryMin),
            max: Number(salaryMax),
            currency,
          },
        }}
      />
    </div>
  );
}
