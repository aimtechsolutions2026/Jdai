"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Flame, FileText, User as UserIcon, Home } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [streakCount, setStreakCount] = useState<number>(3);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch("/api/streak");
        if (res.ok) {
          const data = await res.json();
          if (data.currentStreak !== undefined) {
            setStreakCount(data.currentStreak);
          }
        }
      } catch (e) {
        // quiet fallback
      }
    }
    fetchStreak();
  }, [pathname]);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  const navItems = [
    { label: "Home", href: "/", icon: Home, active: pathname === "/" },
    { label: "Jobs", href: "/jobs", icon: Briefcase, active: pathname.startsWith("/jobs") },
    {
      label: "MCQ",
      href: "/mcq",
      icon: Flame,
      active: pathname === "/mcq",
      badge: `${streakCount}d`,
    },
    {
      label: "Applications",
      href: "/applications",
      icon: FileText,
      active: pathname === "/applications",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserIcon,
      active: pathname === "/profile" || pathname === "/dashboard",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-2 py-1.5 shadow-lg">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative ${
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
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

