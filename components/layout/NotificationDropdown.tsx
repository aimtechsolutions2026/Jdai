"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "job" | "application" | "streak" | "profile" | "activity";
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  actionUrl: string;
  badgeText?: string;
  createdAt?: string;
}

export function NotificationDropdown() {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const count =
          typeof data.unreadCount === "number"
            ? data.unreadCount
            : (data.notifications || []).filter((n: any) => n.unread).length;
        setUnreadCount(count);
      }
    } catch {
      // silently ignore network issues
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      aria-label="Notification Center"
      title="View All Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
