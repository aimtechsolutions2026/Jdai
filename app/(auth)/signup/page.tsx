"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Compass,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  AlertCircle,
  Briefcase,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as "seeker" | "recruiter") || "seeker";

  const [role, setRole] = useState<"seeker" | "recruiter">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      if (role === "seeker") {
        // Direct to profile for resume upload onboarding
        router.push("/profile?onboarding=true");
      } else {
        router.push("/recruiter/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
            <Compass className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-secondary">
              TalentPulse
            </span>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-blue-200">
              AI
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-secondary">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {/* Role selector pill */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-surface-alt p-1.5 border border-border">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === "seeker"
                  ? "bg-white text-primary shadow-sm border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === "recruiter"
                  ? "bg-white text-secondary shadow-sm border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Recruiter / Hiring</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-error border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                icon={<UserIcon className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Phone Number (optional)
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="h-4 w-4" />}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" isLoading={loading}>
              Create {role === "seeker" ? "Job Seeker" : "Recruiter"} Account
            </Button>
          </form>

          <p className="text-[11px] text-text-secondary text-center mt-4">
            By registering, you agree to TalentPulse&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-alt flex items-center justify-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}

