"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { CodifyProLogo } from "@/components/layout/CodifyProLogo";

function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      const msg =
        data.message ||
        "If your email is registered in our platform, you will get a new password in your email to login.";
      setNotificationMessage(msg);
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center mb-6 group">
          <CodifyProLogo withText size="md" />
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-secondary">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your registered email address to receive your new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {notificationMessage ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-secondary">Check Your Email</h3>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm leading-relaxed text-left">
                  <div className="flex items-start gap-2.5">
                    <Bell className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-950 mb-1">Notification:</p>
                      <p>{notificationMessage}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  onClick={handleModalClose}
                  size="lg"
                  className="w-full font-bold gap-2"
                >
                  <span>OK &bull; Go to Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationMessage(null);
                    setEmail("");
                  }}
                  className="text-xs text-text-secondary hover:text-primary transition-colors py-1"
                >
                  Enter a different email
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-rose-50 p-3.5 text-xs text-error border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Registered Email Address <span className="text-error">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    icon={<Mail className="h-4 w-4" />}
                  />
                  <p className="text-[11px] text-text-muted mt-1.5">
                    We will verify your account and send a new secure password directly to your inbox.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2 font-bold gap-2"
                  isLoading={loading}
                >
                  <span>Submit &bull; Get New Password</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="pt-5 mt-5 border-t border-border text-center">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Modal on Submit */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Notification"
        description="Password Recovery Notification"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{notificationMessage}</p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleModalClose}
              className="w-full sm:w-auto px-6 font-bold"
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-alt flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
