"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Flame,
  CheckCircle2,
  Download,
  Briefcase,
  GraduationCap,
  Sparkles,
  User,
  SlidersHorizontal,
  X,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";

const POPULAR_SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Go",
  "Python",
  "Kubernetes",
  "Docker",
  "AWS",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
];

function CandidateSearchContent() {
  const searchParams = useSearchParams();
  const initialSkill = searchParams.get("skills");

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialSkill ? [initialSkill] : []
  );
  const [roleQuery, setRoleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("all");

  // Profile detail modal
  const [inspectingCandidate, setInspectingCandidate] = useState<any | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, [selectedSkills, locationQuery]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSkills.length > 0) {
        params.set("skills", selectedSkills.join(","));
      }
      if (roleQuery) params.set("role", roleQuery);
      if (locationQuery !== "all") params.set("location", locationQuery);

      const res = await fetch(`/api/recruiter/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-secondary">
          Engineering Talent Search
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Target candidates with verified experience, continuous daily challenge streaks, and clean Groq-parsed resumes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            value={roleQuery}
            onChange={(e) => setRoleQuery(e.target.value)}
            placeholder="Search by role or keyword (e.g. Full-Stack, DevOps)..."
            icon={<Search className="h-4 w-4" />}
            className="w-full"
          />
          <Button onClick={fetchCandidates} size="md" className="w-full sm:w-auto px-6">
            Apply Filters
          </Button>
        </div>

        {/* Skill Tag Toggles */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Filter by Technical Stack
            </span>
            {selectedSkills.length > 0 && (
              <button
                onClick={() => setSelectedSkills([])}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear all tags
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-alt border border-border text-text-secondary hover:border-primary hover:text-text-primary"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            {candidates.length} Candidate Profiles Found
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-3">
            <User className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-secondary">
              No candidates found matching selected skills
            </h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Try deselecting some skill tags to broaden your candidate discovery.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSkills([])}
            >
              Clear Selected Skills
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((cand, idx) => (
              <div
                key={cand._id || idx}
                className="rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-hover hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-border overflow-hidden flex items-center justify-center font-bold text-base text-secondary shrink-0">
                        {cand.avatarUrl ? (
                          <img
                            src={cand.avatarUrl}
                            alt={cand.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          cand.name?.[0] || "C"
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-primary">
                          {cand.name}
                        </h3>
                        <div className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{cand.location || "San Francisco, CA"}</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant="warning" size="sm" className="gap-1">
                      <Flame className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span>{cand.streak?.current || 3}d</span>
                    </Badge>
                  </div>

                  <div className="text-xs font-semibold text-secondary">
                    {cand.experience?.[0]?.title || "Senior Software Engineer"}
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {cand.experience?.[0]?.description ||
                      "Full-stack engineer with expertise in distributed architectures and modern frontend design."}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {cand.skills?.slice(0, 5).map((s: string) => (
                      <Badge key={s} variant="outline" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[11px] font-semibold text-primary">
                    Profile: {cand.profileCompleteness || 85}% complete
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setInspectingCandidate(cand)}
                  >
                    View Full Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Profile Detail Modal */}
      <Modal
        isOpen={!!inspectingCandidate}
        onClose={() => setInspectingCandidate(null)}
        title={inspectingCandidate?.name}
        description={`Verified Candidate Profile • ${inspectingCandidate?.location || "Remote"}`}
        maxWidth="2xl"
      >
        <div className="space-y-5">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-alt border border-border">
            <div className="space-y-1">
              <div className="text-xs text-text-secondary flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{inspectingCandidate?.email || "candidate@talentpulse.ai"}</span>
              </div>
              <div className="text-xs text-text-secondary flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>{inspectingCandidate?.phone || "+1 (555) 349-2041"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm" className="gap-1">
                <Flame className="h-3 w-3 fill-accent" />
                <span>{inspectingCandidate?.streak?.current || 3}-Day Streak</span>
              </Badge>
              <Badge variant="primary" size="sm">
                {inspectingCandidate?.profileCompleteness || 85}% Verified
              </Badge>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Technical Stack & Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {inspectingCandidate?.skills?.map((s: string) => (
                <Badge key={s} variant="primary" size="sm">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Work History
            </h4>
            {inspectingCandidate?.experience?.map((exp: any, i: number) => (
              <div key={i} className="rounded-xl border border-border p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-text-primary">
                    {exp.title}
                  </div>
                  <span className="text-xs text-text-secondary font-mono">
                    {exp.from} - {exp.to}
                  </span>
                </div>
                <div className="text-xs font-semibold text-primary">{exp.company}</div>
                <p className="text-xs text-text-secondary leading-relaxed pt-1">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          {/* Education */}
          {inspectingCandidate?.education?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Education
              </h4>
              {inspectingCandidate.education.map((edu: any, i: number) => (
                <div key={i} className="text-xs text-text-secondary">
                  <span className="font-bold text-text-primary">{edu.degree}</span> •{" "}
                  {edu.school} ({edu.year})
                </div>
              ))}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-xs text-text-secondary">
              Target Salary: $
              {inspectingCandidate?.salaryExpectation?.min?.toLocaleString() || "120,000"}{" "}
              - $
              {inspectingCandidate?.salaryExpectation?.max?.toLocaleString() || "175,000"}
            </div>
            <div className="flex items-center gap-2">
              {inspectingCandidate?.resumeUrl ? (
                <a
                  href={inspectingCandidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Resume PDF</span>
                  </Button>
                </a>
              ) : (
                <Button variant="primary" size="sm" className="text-xs">
                  Contact Candidate
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function CandidateSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-alt flex items-center justify-center">Loading search...</div>}>
      <CandidateSearchContent />
    </Suspense>
  );
}

