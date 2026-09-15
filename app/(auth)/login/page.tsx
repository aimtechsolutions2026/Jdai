"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, ArrowRight, Lock, Mail, AlertCircle, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      if (data.user.role === "admin") {
        router.push("/admin/ingest");
      } else if (data.user.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push(returnUrl);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: "seeker" | "recruiter" | "admin") => {
    setError(null);
    setLoading(true);
    const demoEmail =
      role === "admin"
        ? "admin@talentpulse.ai"
        : role === "recruiter"
        ? "recruiter@talentpulse.ai"
        : "seeker@talentpulse.ai";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "demopassword123" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (role === "admin") router.push("/admin/ingest");
      else if (role === "recruiter") router.push("/recruiter/dashboard");
      else router.push("/dashboard");
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-error border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-text-secondary cursor-pointer hover:text-primary">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" isLoading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                1-Click Instant Demo Access
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs py-2 h-auto flex-col gap-0.5"
                onClick={() => handleQuickDemoLogin("seeker")}
              >
                <span className="font-bold text-text-primary">Seeker</span>
                <span className="text-[10px] text-text-secondary">Profile/Jobs</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs py-2 h-auto flex-col gap-0.5"
                onClick={() => handleQuickDemoLogin("recruiter")}
              >
                <span className="font-bold text-text-primary">Recruiter</span>
                <span className="text-[10px] text-text-secondary">Search Talent</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs py-2 h-auto flex-col gap-0.5"
                onClick={() => handleQuickDemoLogin("admin")}
              >
                <span className="font-bold text-text-primary">Admin</span>
                <span className="text-[10px] text-text-secondary">AI Ingestion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-alt flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

