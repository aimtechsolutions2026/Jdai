"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  AlertCircle,
  Briefcase,
  Search,
  CheckCircle2,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { DEFAULT_COUNTRY_CODE } from "@/lib/country-codes";
import { CodifyProLogo } from "@/components/layout/CodifyProLogo";

function SignUpForm() {
  const router = useRouter();
  // const initialRole = (searchParams.get("role") as "seeker" | "recruiter") || "seeker";
  const [role] = useState<"seeker">("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password constraint checks
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
    setPhoneError(null);

    // 1. Check phone number (required & exactly 10 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    // 2. Check password constraints
    if (!isPasswordValid) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, and a number."
      );
      return;
    }

    // 3. Check confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    // 4. Check Terms and Conditions acceptance
    if (!acceptTerms) {
      setError("You must accept the Terms and Conditions and Privacy Policy to proceed.");
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${countryCode} ${cleanPhone}`.trim();
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: fullPhone,
          password,
          name: name.trim() || email.split("@")[0] || "Candidate",
          role,
          termsAccepted: acceptTerms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to create account");
      }

      if (role === "seeker") {
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
        <Link href="/" className="inline-flex items-center mb-6 group">
          <CodifyProLogo withText size="md" />
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
          {/* Role selector pill - temporarily commented out, only seeker signup for now */}
          {/*
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
          */}

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
                    : "Registration Error"}
                </div>
                <div className="mt-0.5 leading-relaxed">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                icon={<UserIcon className="h-4 w-4" />}
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            {/* Phone Number (Required with 20% Country Code & 10 Digits) */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-error">*</span>
              </label>
              <PhoneInput
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  if (phoneError) setPhoneError(null);
                  if (error && error.includes("phone")) setError(null);
                }}
                error={phoneError}
                required
                id="signup-phone"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Password
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Live Password Constraint Checklist */}
              {password && (
                <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 space-y-1 text-[11px]">
                  <div className="font-semibold text-slate-700 pb-0.5">Password requirements:</div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasMinLength ? "text-emerald-600 font-medium" : "text-slate-500"
                    }`}
                  >
                    {hasMinLength ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasUppercase && hasLowercase
                        ? "text-emerald-600 font-medium"
                        : "text-slate-500"
                    }`}
                  >
                    {hasUppercase && hasLowercase ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span>Uppercase and lowercase letters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasNumber ? "text-emerald-600 font-medium" : "text-slate-500"
                    }`}
                  >
                    {hasNumber ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span>At least one number (0-9)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  icon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

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

            {/* Accept Terms & Conditions Checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer shrink-0"
              />
              <label
                htmlFor="acceptTerms"
                className="text-xs text-text-secondary leading-relaxed cursor-pointer select-none"
              >
                I accept and agree to CodifyPro&apos;s{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-primary font-semibold hover:underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-primary font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full mt-3 font-bold gap-2 text-sm shadow-sm"
              isLoading={loading}
            >
              <span>Let&apos;s Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-[11px] text-text-secondary text-center mt-4">
            Protected by CodifyPro Identity &amp; Security Services.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-alt flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
