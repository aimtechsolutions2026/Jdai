"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecruiterAnalyticsCard } from "@/components/profile/RecruiterAnalyticsCard";
import { AtsResumeModal } from "@/components/profile/AtsResumeModal";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [salaryMin, setSalaryMin] = useState(120000);
  const [salaryMax, setSalaryMax] = useState(180000);
  const [completeness, setCompleteness] = useState(50);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const [experience, setExperience] = useState<
    { company: string; title: string; from: string; to: string; description: string }[]
  >([]);

  const [education, setEducation] = useState<
    { school: string; degree: string; year: string }[]
  >([]);

  const [certificates, setCertificates] = useState<
    { name: string; issuer: string; date: string; certificateId?: string; url?: string }[]
  >([]);
  const [showAtsModal, setShowAtsModal] = useState(false);

  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setIsGuest(!!data.isGuest);
        if (data.profile) {
          const p = data.profile;
          setName(p.name || "");
          setEmail(p.email || "");
          setPhone(p.phone || "");
          setLocation(p.location || "");
          setPincode(p.pincode || "");
          setSkills(p.skills || []);
          setExperience(p.experience || []);
          setEducation(p.education || []);
          setCertificates(p.certificates || []);
          setSalaryMin(p.salaryExpectation?.min || 120000);
          setSalaryMax(p.salaryExpectation?.max || 180000);
          setCompleteness(p.profileCompleteness || 60);
          setResumeUrl(p.resumeUrl || null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "seeker@codifypro.ai", password: "demopassword123" }),
      });
      if (res.ok) {
        await fetchProfile();
        setSuccessMsg("Signed in as Seeker Demo! Your profile is now synced.");
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
      if (!res.ok) throw new Error(data.error || "Failed to parse resume");

      // Autofill fields from parsed output
      const parsed = data.parsedData;
      if (parsed.name) setName(parsed.name);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.phone) setPhone(parsed.phone);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.pincode) setPincode(parsed.pincode);
      if (parsed.skills?.length) setSkills(parsed.skills);
      if (parsed.experience?.length) setExperience(parsed.experience);
      if (parsed.education?.length) setEducation(parsed.education);
      if (parsed.certificates?.length) setCertificates(parsed.certificates);
      if (parsed.salaryExpectation?.min) setSalaryMin(parsed.salaryExpectation.min);
      if (parsed.salaryExpectation?.max) setSalaryMax(parsed.salaryExpectation.max);
      if (data.resumeUrl) setResumeUrl(data.resumeUrl);
      if (data.profile?.profileCompleteness) setCompleteness(data.profile.profileCompleteness);

      setSuccessMsg("Resume parsed successfully! Review and refine your details below.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse resume");
    } finally {
      setParsing(false);
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
        location,
        pincode,
        skills,
        experience,
        education,
        certificates,
        salaryExpectation: { min: Number(salaryMin), max: Number(salaryMax), currency: "USD" },
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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Guest Mode Notice */}
      {isGuest && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-amber-900 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-accent shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Candidate Profile Preview Mode:</span> You can test AI resume parsing, adjust technical skills, and review ATS formatting.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickDemoLogin}
              className="text-xs bg-white border-amber-300 hover:bg-amber-100"
            >
              1-Click Seeker Demo Login
            </Button>
            <Link href="/login">
              <Button type="button" variant="primary" size="sm" className="text-xs">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Header & Completeness Nudge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary">
            Candidate Profile
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your verified details, skills, work history, and AI-parsed resume.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setShowAtsModal(true)}
            className="gap-2 shrink-0 border-blue-200 text-primary hover:bg-blue-50 font-semibold"
          >
            <FileText className="h-4 w-4" />
            <span>Download ATS Resume</span>
          </Button>
          <Button
            onClick={handleSaveProfile}
            size="md"
            isLoading={saving}
            className="gap-2 shrink-0"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Completeness Progress Banner */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Profile Completeness
            </span>
            <Badge variant="primary" size="sm">
              {completeness}%
            </Badge>
          </div>
          <span className="text-xs text-text-secondary">
            {completeness >= 80 ? "High Recruiter Visibility" : "Upload resume to boost discovery"}
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-blue-200/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Recruiter Activity & Profile Views Analytics Graph */}
      <RecruiterAnalyticsCard
        profileName={name || "Candidate"}
        skillsCount={skills.length}
        experienceCount={experience.length}
      />

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-success border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-error border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AI Resume Upload Dropzone */}
      <Card className="border-dashed border-2 border-slate-300 bg-white hover:border-primary/60 transition-colors">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">
            {parsing ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <FileUp className="h-7 w-7" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary">
              {parsing
                ? "AI is parsing your resume..."
                : "Upload or Replace Resume (PDF Only)"}
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              Our AI pipeline will automatically extract and prefill your experience, education, skills, and target salary in seconds.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={parsing}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Select PDF Resume</span>
            </Button>

            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  <span>View Uploaded PDF</span>
                </Button>
              </a>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAtsModal(true)}
              className="gap-1.5 border-blue-200 text-primary hover:bg-blue-50"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Preview ATS Resume</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Contact & Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Full Name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Email Address
            </label>
            <Input value={email} disabled className="bg-slate-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Phone
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Location
            </label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Postal / Pincode
            </label>
            <Input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="94105" />
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Technical Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Add Skill (press Enter)
            </label>
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={addSkill}
              placeholder="e.g. Next.js, TypeScript, Go, Kubernetes..."
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="primary"
                size="md"
                className="gap-1.5 py-1 px-3 text-xs bg-blue-50 text-primary border border-blue-200"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-error transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-text-secondary italic">
                No skills added yet. Add skills or upload a resume to autofill.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Target Salary Expectation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success" />
            <span>Target Annual Salary (USD)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Minimum Salary ($)
            </label>
            <Input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
              Maximum Salary ($)
            </label>
            <Input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>Work Experience</span>
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperienceEntry}
            className="gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Position</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border p-4 bg-surface-alt space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="absolute top-3 right-3 text-text-secondary hover:text-error transition-colors"
                title="Remove entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Company
                  </label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, "company", e.target.value)}
                    placeholder="Stripe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Title / Role
                  </label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(idx, "title", e.target.value)}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    From
                  </label>
                  <Input
                    value={exp.from}
                    onChange={(e) => updateExperience(idx, "from", e.target.value)}
                    placeholder="2021"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    To
                  </label>
                  <Input
                    value={exp.to}
                    onChange={(e) => updateExperience(idx, "to", e.target.value)}
                    placeholder="Present"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                  Key Achievements & Responsibilities
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, "description", e.target.value)}
                  placeholder="Architected distributed event queue, improving throughput by 30%..."
                />
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <p className="text-xs text-text-secondary italic">
              No work experience added yet. Click &quot;Add Position&quot; or upload a resume.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Education</span>
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEducationEntry}
            className="gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add School</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border p-4 bg-surface-alt space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute top-3 right-3 text-text-secondary hover:text-error transition-colors"
                title="Remove entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Institution
                  </label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(idx, "school", e.target.value)}
                    placeholder="UC Berkeley"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Degree / Major
                  </label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                    placeholder="B.S. in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Graduation Year
                  </label>
                  <Input
                    value={edu.year}
                    onChange={(e) => updateEducation(idx, "year", e.target.value)}
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-xs text-text-secondary italic">
              No education entries added yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Certifications & Licenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Certifications & Verified Credentials</span>
            </CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Add verified certificate names and credential IDs to boost your ATS keyword matches and recruiter credibility.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCertificateEntry}
            className="gap-1 text-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Certificate</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {certificates.map((cert, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border p-4 bg-surface-alt space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeCertificate(idx)}
                className="absolute top-3 right-3 text-text-secondary hover:text-error transition-colors"
                title="Remove certificate"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Certification / License Name <span className="text-error">*</span>
                  </label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertificate(idx, "name", e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Certificate / Credential ID
                  </label>
                  <Input
                    value={cert.certificateId || ""}
                    onChange={(e) => updateCertificate(idx, "certificateId", e.target.value)}
                    placeholder="e.g. AWS-SAA-802319"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                    Issuing Organization / Authority
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
                    placeholder="e.g. 2024"
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
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-text-secondary space-y-2">
              <Award className="h-8 w-8 mx-auto text-slate-400" />
              <p className="text-xs font-medium">No certifications added yet.</p>
              <p className="text-[11px] text-text-muted">
                Add certifications like AWS, GCP, CKA, or PMP to boost your ATS keyword score.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCertificateEntry}
                className="gap-1 text-xs mt-2"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add First Certification</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-border p-4 shadow-xl">
        <div className="text-xs text-text-secondary">
          Keep your details updated so recruiters can match and discover your verified profile.
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setShowAtsModal(true)}
            className="gap-2 border-blue-200 text-primary hover:bg-blue-50 font-semibold"
          >
            <FileText className="h-4 w-4" />
            <span>Download ATS Resume</span>
          </Button>
          <Button onClick={handleSaveProfile} size="md" isLoading={saving} className="gap-2">
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
          name,
          email,
          phone,
          location,
          skills,
          experience,
          education,
          certificates,
          salaryExpectation: {
            min: Number(salaryMin),
            max: Number(salaryMax),
            currency: "USD",
          },
        }}
      />
    </div>
  );
}

