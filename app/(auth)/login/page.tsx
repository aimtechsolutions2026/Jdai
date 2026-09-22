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

  // Forgot password flow state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email.");
      }

      setForgotSuccess(
        data.message ||
          "If an account with that email exists, a password reset link has been sent to your inbox."
      );
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center mb-6 group">
          <CodifyProLogo withText size="md" />
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-secondary">
          {forgotMode ? "Reset your password" : "Sign in to your account"}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {forgotMode ? (
            "We'll send a secure password reset link to your email."
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up for free
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {/* FORGOT PASSWORD FORM */}
          {forgotMode ? (
            <div className="space-y-4">
              {forgotSuccess && (
                <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-bold">Email Sent!</div>
                    <div className="mt-0.5 leading-relaxed">{forgotSuccess}</div>
                  </div>
                </div>
              )}

              {forgotError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-error border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {!forgotSuccess ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                      Your Registered Email
                    </label>
                    <Input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter email"
                      icon={<Mail className="h-4 w-4" />}
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-2 font-bold"
                    isLoading={forgotLoading}
                  >
                    Send Reset Link
                  </Button>
                </form>
              ) : null}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(false);
                    setForgotSuccess(null);
                    setForgotError(null);
                  }}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD LOGIN FORM */
            <>
              {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-error border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
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
                    placeholder="Enter email"
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setForgotEmail(email.includes("@") ? email : "");
                      }}
                      className="text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
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
            </>
          )}
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
