"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  FileCheck2,
  Briefcase,
  ArrowRight,
  Sparkles,
  MapPin,
  Lock,
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  X,
  Calendar,
  Save,
  Trash2,
  Power,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

export default function MyDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"account" | "overview">("account");

  // Personal Details Edit State
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Password Edit State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Account Status & Deletion State
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [deletionProcessing, setDeletionProcessing] = useState(false);

  // Password constraints
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isNewPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;
  const doPasswordsMatch = Boolean(
    newPassword && confirmPassword && newPassword === confirmPassword
  );

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [meRes, jobsRes, appsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/jobs?limit=4"),
          fetch("/api/applications"),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
          setProfile(meData.profile);
          setEditName(meData.user?.name || "");
          setEditPhone(meData.user?.phone || meData.profile?.phone || "");
        }

        if (jobsRes.ok) {
          const j = await jobsRes.json();
          setJobs(j.jobs || []);
        }

        if (appsRes.ok) {
          const a = await appsRes.json();
          setApplicationsCount(a.applications?.length || 0);
        }
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Handler: Save Personal Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError(null);
    setDetailsSuccess(null);
    setDetailsSaving(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update personal details.");
      }

      setUser((prev: any) => ({ ...prev, name: data.user.name, phone: data.user.phone }));
      setDetailsSuccess("Personal details updated successfully.");
      setTimeout(() => setDetailsSuccess(null), 4000);
    } catch (err: any) {
      setDetailsError(err.message);
    } finally {
      setDetailsSaving(false);
    }
  };

  // Handler: Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!isNewPasswordValid) {
      setPasswordError(
        "New password must be at least 8 characters long and contain uppercase, lowercase, and a number."
      );
      return;
    }

    if (!doPasswordsMatch) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordUpdating(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Handler: Toggle Account Status (Activate / Deactivate)
  const handleToggleAccountStatus = async () => {
    setStatusMessage(null);
    setStatusUpdating(true);
    const targetStatus = !(user?.isActive ?? true);

    try {
      const res = await fetch("/api/auth/account-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: targetStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update account status.");
      }

      setUser((prev: any) => ({ ...prev, isActive: targetStatus }));
      setStatusMessage(data.message);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handler: Request Deletion
  const handleSubmitDeletionRequest = async () => {
    setDeletionProcessing(true);
    try {
      const res = await fetch("/api/auth/account-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_deletion", reason: deletionReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit deletion request.");
      }

      setUser((prev: any) => ({
        ...prev,
        deletionRequested: true,
        deletionRequestedAt: data.deletionRequestedAt || new Date(),
      }));
      setShowDeleteModal(false);
      setDeletionReason("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletionProcessing(false);
    }
  };

  // Handler: Cancel Deletion Request
  const handleCancelDeletionRequest = async () => {
    setDeletionProcessing(true);
    try {
      const res = await fetch("/api/auth/account-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel_deletion" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel deletion request.");
      }

      setUser((prev: any) => ({
        ...prev,
        deletionRequested: false,
        deletionRequestedAt: null,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletionProcessing(false);
    }
  };

  const completeness = profile?.profileCompleteness || 0;
  const streak = profile?.streak?.current || user?.streak?.current || 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight text-secondary">
              My Dashboard
            </h1>
            <Badge variant="primary" size="sm" className="capitalize">
              {user?.role || "Seeker"}
            </Badge>
            {user?.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Manage your personal details, password security, account settings, and automated recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
              <UserIcon className="h-3.5 w-3.5" />
              <span>Full Profile &amp; Resume</span>
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="sm" className="gap-1.5 text-xs font-bold">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Browse Jobs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Deletion Request Alert (if active) */}
      {user?.deletionRequested && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  Account Deletion Request Pending
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  You requested account deletion on{" "}
                  {user.deletionRequestedAt ? new Date(user.deletionRequestedAt).toLocaleDateString() : "recently"}.
                  Our administrative team will process your request within 48 hours.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelDeletionRequest}
              isLoading={deletionProcessing}
              className="border-rose-300 text-rose-800 hover:bg-rose-100 text-xs shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Cancel Deletion Request
            </Button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "account"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-slate-100"
          }`}
        >
          <UserIcon className="h-4 w-4" />
          <span>Account &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "overview"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-slate-100"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Activity &amp; Recommendations</span>
        </button>
      </div>

      {/* TAB 1: ACCOUNT & SECURITY */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Personal Details Card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary">Personal Details</h2>
                    <p className="text-xs text-text-secondary">View and update your contact identity</p>
                  </div>
                </div>
                <span className="text-[11px] text-text-secondary flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2026"}
                </span>
              </div>

              {detailsSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{detailsSuccess}</span>
                </div>
              )}

              {detailsError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{detailsError}</span>
                </div>
              )}

              <form onSubmit={handleSaveDetails} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    icon={<UserIcon className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Registered Email Address
                  </label>
                  <Input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    placeholder="Enter email"
                    icon={<Mail className="h-4 w-4 text-slate-400" />}
                    className="bg-slate-50 cursor-not-allowed text-slate-500"
                  />
                  <span className="text-[10px] text-text-secondary mt-1 block">
                    Email is locked to your account identity.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    icon={<Phone className="h-4 w-4" />}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Changes reflect across applications automatically.
                  </span>
                  <Button type="submit" size="sm" isLoading={detailsSaving} className="gap-1.5 font-bold">
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Details</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* 2. Password Edit Card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-4">
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-text-primary">Password Security</h2>
                  <p className="text-xs text-text-secondary">Update your account authentication password</p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password constraint checklist */}
                  {newPassword && (
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
                    placeholder="Confirm new password"
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

                <div className="pt-2 flex items-center justify-end">
                  <Button type="submit" size="sm" isLoading={passwordUpdating} className="font-bold">
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* 3. Account Status & Deletion Request Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Power className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">Account Status &amp; Deletion Request</h2>
                <p className="text-xs text-text-secondary">Control visibility to recruiters or request complete account removal</p>
              </div>
            </div>

            {statusMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Activation / Deactivation */}
              <div className="rounded-xl border border-border bg-slate-50/50 p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Profile Discoverability
                    </span>
                    <Badge variant={user?.isActive ?? true ? "primary" : "outline"} size="sm">
                      {user?.isActive ?? true ? "Active" : "Deactivated"}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                    When active, your profile is discoverable in candidate search. If deactivated, your profile is hidden from recruiters, but all your applications and MCQ streak remain preserved.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant={user?.isActive ?? true ? "outline" : "primary"}
                    onClick={handleToggleAccountStatus}
                    isLoading={statusUpdating}
                    className="w-full text-xs font-bold"
                  >
                    {user?.isActive ?? true ? "Deactivate Account" : "Activate Account"}
                  </Button>
                </div>
              </div>

              {/* Account Deletion Request */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
                      Permanent Deletion
                    </span>
                    <Badge variant="outline" size="sm" className="border-rose-300 text-rose-700">
                      Irreversible
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                    Submit an account deletion request to permanently erase your profile, applications, MCQ streaks, and account credentials from CodifyPro.
                  </p>
                </div>

                <div className="pt-2">
                  {user?.deletionRequested ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelDeletionRequest}
                      isLoading={deletionProcessing}
                      className="w-full text-xs font-bold border-rose-300 text-rose-800 hover:bg-rose-100"
                    >
                      Cancel Deletion Request
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full text-xs font-bold border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Request Account Deletion
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & RECOMMENDATIONS */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Streak Card */}
            <Link href="/mcq" className="block group">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card transition-all group-hover:border-amber-400 group-hover:shadow-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-dark">
                    Daily Streak
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-accent">
                    <Flame className="h-5 w-5 fill-accent" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-secondary">{streak}</span>
                  <span className="text-xs font-semibold text-accent-dark">Days Active</span>
                </div>
                <div className="mt-2 text-xs text-text-secondary flex items-center gap-1 group-hover:text-accent-dark">
                  <span>Solve today&apos;s challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>

            {/* Applications Sent */}
            <Link href="/applications" className="block group">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all group-hover:border-primary group-hover:shadow-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Applications
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                    <Briefcase className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-secondary">{applicationsCount}</span>
                  <span className="text-xs text-text-secondary">Submitted</span>
                </div>
                <div className="mt-2 text-xs text-text-secondary flex items-center gap-1 group-hover:text-primary">
                  <span>View status timeline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>

            {/* Profile Completeness */}
            <Link href="/profile" className="block group">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all group-hover:border-primary group-hover:shadow-hover">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Profile Health
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-secondary">{completeness}%</span>
                  <span className="text-xs text-text-secondary">Complete</span>
                </div>
                <div className="mt-2 text-xs text-text-secondary flex items-center gap-1 group-hover:text-primary">
                  <span>Refine resume &amp; skills</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          </div>

          {/* Profile Completeness Nudge Banner (if < 90%) */}
          {completeness < 90 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-secondary">
                    Your profile is {completeness}% complete
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Upload your latest PDF resume or add 3 more skills to unlock top candidate ranking.
                </p>
              </div>
              <Link href="/profile">
                <Button size="sm" variant="primary">
                  Complete Profile Now
                </Button>
              </Link>
            </div>
          )}

          {/* Recommended Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-secondary">
                  Automated Job Recommendations
                </h2>
                <p className="text-xs text-text-secondary">
                  Matched via automated skill parsing: {profile?.skills?.slice(0, 4).join(", ") || "Full Stack"}
                </p>
              </div>
              <Link href="/jobs" className="text-xs font-semibold text-primary hover:underline">
                View all jobs →
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-xs text-text-secondary shadow-card">
                No active jobs found. New engineering positions posted by recruiters will appear here automatically!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.slice(0, 4).map((job) => (
                  <div
                    key={job._id}
                    className="rounded-xl border border-border bg-white p-5 shadow-card hover:shadow-hover hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-border flex items-center justify-center font-bold text-sm text-secondary">
                            {job.companyName?.[0] || "C"}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-text-primary hover:text-primary">
                              <Link href={`/jobs/${job._id}`}>{job.role}</Link>
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                              <span className="font-semibold text-text-primary">{job.companyName}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="primary" size="sm">
                          {job.jobType}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills?.slice(0, 4).map((skill: string) => (
                          <Badge key={skill} variant="outline" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs font-bold text-secondary">
                        {formatSalaryRange(job.salaryRange)}
                      </span>
                      <Link href={`/jobs/${job._id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Deletion Request Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Request Account Deletion</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Are you sure you want to request account deletion? This action will permanently remove your profile, applications, and account access.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Reason for leaving (Optional)
              </label>
              <textarea
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                placeholder="Let us know how we can improve..."
                className="w-full rounded-xl border border-border p-3 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletionReason("");
                }}
                disabled={deletionProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitDeletionRequest}
                isLoading={deletionProcessing}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Submit Deletion Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
