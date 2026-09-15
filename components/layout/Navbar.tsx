"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Briefcase,
  Flame,
  User as UserIcon,
  FileText,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  FileCheck2,
  Sparkles,
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [streakCount, setStreakCount] = useState<number>(3);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setProfileDropdownOpen(false);
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

            {/* Always-visible Profile Link */}
            <Link
              href="/profile"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/profile"
                  ? "text-primary bg-blue-50/60 font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </Link>

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
            <div className="relative" ref={dropdownRef}>
              {/* Clickable Profile Trigger Button */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-alt transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="User profile menu"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-text-primary leading-tight line-clamp-1 max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-text-secondary capitalize leading-tight">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-white shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-3 border-b border-border mb-1">
                    <div className="font-bold text-sm text-text-primary">{user.name}</div>
                    <div className="text-xs text-text-secondary truncate">{user.email}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "warning"
                            : user.role === "recruiter"
                            ? "secondary"
                            : "primary"
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                      <span className="text-xs font-bold text-accent flex items-center gap-1">
                        <Flame className="h-3 w-3 fill-accent" />
                        {streakCount}d Streak
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-text-secondary" />
                      <span>My Profile & Resume</span>
                    </Link>

                    {user.role === "seeker" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-text-secondary" />
                        <span>Seeker Dashboard</span>
                      </Link>
                    )}

                    <Link
                      href="/applications"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
                    >
                      <Briefcase className="h-4 w-4 text-text-secondary" />
                      <span>My Applications</span>
                    </Link>

                    <Link
                      href="/resume-center"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
                    >
                      <FileCheck2 className="h-4 w-4 text-text-secondary" />
                      <span>ATS Resume Center</span>
                    </Link>
                  </div>

                  <div className="border-t border-border mt-2 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-error hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-text-secondary hover:text-primary">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Profile Preview</span>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
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
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
          >
            <UserIcon className="h-4 w-4 text-primary" />
            <span>Candidate Profile & Resume</span>
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
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-alt"
              >
                Dashboard
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
              <div className="border-t border-border pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">Get Started Free</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
