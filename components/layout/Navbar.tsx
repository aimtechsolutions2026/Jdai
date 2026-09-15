"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Flame,
  User as UserIcon,
  FileText,
  Search,
  LogOut,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "seeker" | "recruiter" | "admin";
  avatarUrl?: string;
  streak?: { current: number };
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [streakCount, setStreakCount] = useState<number>(3);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user?.streak?.current !== undefined) {
            setStreakCount(data.user.streak.current);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-secondary">
                  TalentPulse
                </span>
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-blue-200/60">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-medium text-text-secondary leading-none">
                by JDAI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/jobs"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname.startsWith("/jobs")
                  ? "text-primary bg-blue-50/60 font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
              }`}
            >
              Browse Jobs
            </Link>

            {(!user || user.role === "seeker") && (
              <>
                <Link
                  href="/mcq"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/mcq"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  <span>Daily MCQ</span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-accent bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/50">
                    <Flame className="h-3.5 w-3.5 fill-accent text-accent animate-flame-bounce" />
                    {streakCount}d
                  </span>
                </Link>
                {user && (
                  <>
                    <Link
                      href="/applications"
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        pathname === "/applications"
                          ? "text-primary bg-blue-50/60 font-semibold"
                          : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      My Applications
                    </Link>
                    <Link
                      href="/resume-center"
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        pathname === "/resume-center"
                          ? "text-primary bg-blue-50/60 font-semibold"
                          : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      Resume Center
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Recruiter Links */}
            {user?.role === "recruiter" && (
              <>
                <Link
                  href="/recruiter/dashboard"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/recruiter/dashboard"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  Recruiter Hub
                </Link>
                <Link
                  href="/recruiter/search"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/recruiter/search"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  Find Candidates
                </Link>
              </>
            )}

            {/* Admin Links */}
            {user?.role === "admin" && (
              <>
                <Link
                  href="/admin/ingest"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/admin/ingest"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  AI Ingestion
                </Link>
                <Link
                  href="/admin/jobs"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/admin/jobs"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  Manage Jobs
                </Link>
                <Link
                  href="/admin/mcq-bank"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/admin/mcq-bank"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  MCQ Bank
                </Link>
                <Link
                  href="/admin/users"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/admin/users"
                      ? "text-primary bg-blue-50/60 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  Users
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.role === "seeker" && (
                <Link href="/dashboard" className="hidden sm:inline-flex">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <UserIcon className="h-4 w-4 text-text-secondary" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              )}

              {user.role === "seeker" && (
                <Link href="/profile" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm">
                    My Profile
                  </Button>
                </Link>
              )}

              {/* Role badge */}
              <Badge
                variant={
                  user.role === "admin"
                    ? "warning"
                    : user.role === "recruiter"
                    ? "secondary"
                    : "primary"
                }
                size="sm"
                className="capitalize hidden sm:inline-flex"
              >
                {user.role}
              </Badge>

              {/* User Dropdown / Logout */}
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-slate-100 border border-border flex items-center justify-center font-bold text-sm text-text-primary overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-error h-9 px-2"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1 shadow-lg">
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
          >
            Browse Jobs
          </Link>
          <Link
            href="/mcq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
          >
            <span>Daily MCQ Challenge</span>
            <span className="text-xs font-bold text-accent bg-amber-50 px-2 py-0.5 rounded-full">
              {streakCount}d Streak 🔥
            </span>
          </Link>
          {user && (
            <>
              {user.role === "seeker" && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    Seeker Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    My Profile & Resume
                  </Link>
                  <Link
                    href="/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    My Applications
                  </Link>
                  <Link
                    href="/resume-center"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    Resume Center
                  </Link>
                </>
              )}
              {user.role === "recruiter" && (
                <>
                  <Link
                    href="/recruiter/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    Recruiter Dashboard
                  </Link>
                  <Link
                    href="/recruiter/search"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    Candidate Search
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <Link
                    href="/admin/ingest"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    AI Job Ingestion
                  </Link>
                  <Link
                    href="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    Job Management
                  </Link>
                  <Link
                    href="/admin/mcq-bank"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    MCQ Bank
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
                  >
                    User Management
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}

