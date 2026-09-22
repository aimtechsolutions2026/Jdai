"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Flame,
  FileText,
  User as UserIcon,
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
  Users,
  HelpCircle,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"seeker" | "recruiter" | "admin" | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionAndStreak() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUserRole(data.user.role);
            if (data.user.streak?.current !== undefined) {
              setStreakCount(data.user.streak.current);
            }
          } else {
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
      } catch (e) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }

      // Also ensure streak count is populated
      try {
        const streakRes = await fetch("/api/streak");
        if (streakRes.ok) {
          const streakData = await streakRes.json();
          if (streakData.currentStreak !== undefined) {
            setStreakCount(streakData.currentStreak);
          }
        }
      } catch (e) {
        // quiet fallback
      }
    }

    fetchSessionAndStreak();
  }, [pathname]);

  // Do not show bottom nav if loading, unauthenticated (without login), on auth pages, or on landing page
  if (loading || !userRole || pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null;
  }

  // Role-specific bottom navigation items
  let navItems: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
    badge?: string;
  }> = [];

  if (userRole === "admin") {
    navItems = [
      {
        label: "Ingest",
        href: "/admin/ingest",
        icon: Sparkles,
        active: pathname.startsWith("/admin/ingest"),
      },
      {
        label: "Jobs",
        href: "/admin/jobs",
        icon: Briefcase,
        active: pathname.startsWith("/admin/jobs"),
      },
      {
        label: "MCQ Bank",
        href: "/admin/mcq-bank",
        icon: HelpCircle,
        active: pathname.startsWith("/admin/mcq-bank"),
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        active: pathname.startsWith("/admin/users"),
      },
      {
        label: "Profile",
        href: "/profile",
        icon: UserIcon,
        active: pathname === "/profile",
      },
    ];
  } else if (userRole === "recruiter") {
    navItems = [
      {
        label: "Hub",
        href: "/recruiter/dashboard",
        icon: LayoutDashboard,
        active: pathname === "/recruiter/dashboard",
      },
      {
        label: "Candidates",
        href: "/recruiter/search",
        icon: Search,
        active: pathname.startsWith("/recruiter/search"),
      },
      {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,
        active: pathname.startsWith("/jobs"),
      },
      {
        label: "Home",
        href: "/",
        icon: Home,
        active: pathname === "/",
      },
      {
        label: "Profile",
        href: "/profile",
        icon: UserIcon,
        active: pathname === "/profile",
      },
    ];
  } else if (userRole === "seeker") {
    navItems = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        active: pathname === "/dashboard" || pathname === "/",
      },
      {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,
        active: pathname.startsWith("/jobs"),
      },
      {
        label: "MCQ",
        href: "/mcq",
        icon: Flame,
        active: pathname === "/mcq",
        badge: `${streakCount}d`,
      },
      {
        label: "Applied",
        href: "/applications",
        icon: FileText,
        active: pathname === "/applications",
      },
      {
        label: "Profile",
        href: "/profile",
        icon: UserIcon,
        active: pathname === "/profile",
      },
    ];
  }

  if (navItems.length === 0) return null;

  return (
    <>
      <div className="md:hidden h-16 w-full pointer-events-none" aria-hidden="true" />
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-2 py-1.5 shadow-lg">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors relative ${
                  item.active ? "text-primary font-semibold" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${item.active ? "text-primary" : "text-text-secondary"}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3.5 bg-accent text-white text-[9px] font-black px-1 py-0.2 rounded-full leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight text-center leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
