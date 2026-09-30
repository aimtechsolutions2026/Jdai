"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodifyProLogo } from "@/components/layout/CodifyProLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

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
        throw new Error(data.message || data.error || "Failed to sign in");
      }

      if (data.user.role === "admin") {
        router.push(returnUrl && returnUrl.startsWith("/admin") ? returnUrl : "/admin");
      } else if (data.user.role === "recruiter") {
        router.push(returnUrl && returnUrl.startsWith("/recruiter") ? returnUrl : "/recruiter/dashboard");
      } else {
        router.push(returnUrl || "/dashboard");
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
        <Link href="/" className="inline-flex items-center mb-6 group">
          <CodifyProLogo withText size="md" />
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
            <div
              className={`mb-5 flex items-start gap-2.5 rounded-xl p-3.5 text-xs border ${
                error.toLowerCase().includes("database") || error.toLowerCase().includes("unavailable")
                  ? "bg-amber-50 text-amber-900 border-amber-300 shadow-sm"
                  : "bg-rose-50 text-error border-rose-200"
              }`}
            >
              <AlertCircle
                className={`h-4 w-4 shrink-0 mt-0.5 ${
                  error.toLowerCase().includes("database") || error.toLowerCase().includes("unavailable")
                    ? "text-amber-600"
                    : "text-error"
                }`}
              />
              <div>
                <div className="font-bold">
                  {error.toLowerCase().includes("database") || error.toLowerCase().includes("unavailable")
                    ? "Database Service Unavailable"
                    : "Sign In Error"}
                </div>
                <div className="mt-0.5 leading-relaxed">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Email or Phone Number
              </label>
              <Input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or phone number"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-text-secondary hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2 font-bold" isLoading={loading}>
              Sign In
            </Button>
          </form>
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
