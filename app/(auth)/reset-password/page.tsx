"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, AlertCircle, CheckCircle2, Check, X, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodifyProLogo } from "@/components/layout/CodifyProLogo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Constraint checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;
  const doPasswordsMatch = Boolean(
    password && confirmPassword && password === confirmPassword
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing or invalid. Please request a new password reset link.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters long and contain uppercase, lowercase, and a number.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          Set New Password
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Create a strong, secure password for your CodifyPro account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Password Reset Successfully!</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your password has been updated. Redirecting you to the sign-in page...
              </p>
              <Link href="/login" className="block pt-2">
                <Button size="sm" className="w-full font-bold gap-2">
                  <span>Sign In Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
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
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 space-y-1 text-[11px]">
                      <div className="font-semibold text-slate-700 pb-0.5">Password requirements:</div>
                      <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                        {hasMinLength ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasUppercase && hasLowercase ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                        {hasUppercase && hasLowercase ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                        <span>Uppercase and lowercase letters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                        {hasNumber ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                        <span>At least one number (0-9)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    icon={<Lock className="h-4 w-4" />}
                  />
                  {confirmPassword && (
                    <div className="mt-1.5 text-[11px] font-medium">
                      {doPasswordsMatch ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full mt-2 font-bold" isLoading={loading}>
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-alt flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

