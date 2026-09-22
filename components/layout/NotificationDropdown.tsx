"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Briefcase,
  Flame,
  CheckCheck,
  Sparkles,
  ChevronRight,
  User,
  Activity,
  RefreshCw,
  ArrowLeft,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "jobs" | "activity">("all");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch real notifications from database API
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const serverNotifs: NotificationItem[] = data.notifications || [];

        // Check read status from localStorage
        let readIds: string[] = [];
        try {
          const stored = localStorage.getItem("codifypro_read_notifs");
          if (stored) readIds = JSON.parse(stored);
        } catch {}

        const readSet = new Set(readIds);
        const updated = serverNotifs.map((item) => ({
          ...item,
          unread: item.unread && !readSet.has(item.id),
        }));

        setNotifications(updated);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-refresh notifications every 30 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll on mobile when full screen is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on outside click (on desktop screens)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        window.innerWidth >= 640 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    try {
      localStorage.setItem("codifypro_read_notifs", JSON.stringify(allIds));
    } catch {}
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const markAsRead = (id: string) => {
    try {
      const stored = localStorage.getItem("codifypro_read_notifs");
      const readIds = stored ? JSON.parse(stored) : [];
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem("codifypro_read_notifs", JSON.stringify(readIds));
      }
    } catch {}

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "jobs") return item.type === "job";
    if (filter === "activity")
      return (
        item.type === "application" ||
        item.type === "streak" ||
        item.type === "profile" ||
        item.type === "activity"
      );
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "application":
        return <Briefcase className="h-4 w-4 text-emerald-600" />;
      case "job":
        return <Sparkles className="h-4 w-4 text-primary" />;
      case "streak":
        return <Flame className="h-4 w-4 text-accent fill-accent" />;
      case "profile":
        return <User className="h-4 w-4 text-indigo-600" />;
      case "activity":
        return <Activity className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getBgColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "application":
        return "bg-emerald-50 border-emerald-200/70";
      case "job":
        return "bg-blue-50 border-blue-200/70";
      case "streak":
        return "bg-amber-50 border-amber-200/70";
      case "profile":
        return "bg-indigo-50 border-indigo-200/70";
      case "activity":
        return "bg-slate-50 border-slate-200/70";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className={`relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isOpen ? "bg-slate-100 text-primary" : ""
        }`}
        aria-label="Notifications"
        title="View Real-Time Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal: Full screen on mobile, dropdown on desktop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[540px] sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl animate-in fade-in sm:zoom-in-95 duration-150 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 sm:p-4 border-b border-border bg-slate-50/90 shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Back button on Mobile */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1.5 -ml-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-200/60 transition-colors"
                aria-label="Back"
                title="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary hidden sm:block" />
                <h2 className="font-bold text-base sm:text-sm text-secondary">
                  Notifications
                </h2>
                {unreadCount > 0 ? (
                  <Badge variant="primary" size="sm" className="text-[10px] px-1.5 py-0.5 font-bold">
                    {unreadCount} new
                  </Badge>
                ) : (
                  <span className="text-[10px] text-text-muted font-medium bg-slate-200/60 px-1.5 py-0.5 rounded">
                    Live
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={fetchNotifications}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-200/60 transition-colors"
                title="Refresh updates"
              >
                <RefreshCw className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs sm:text-[11px] font-medium text-primary hover:text-primary-hover px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  <span>Mark all</span>
                </button>
              )}

              {/* Close Button on Desktop */}
              <button
                onClick={() => setIsOpen(false)}
                className="hidden sm:block p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-200/60 transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-white shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === "all"
                    ? "bg-secondary text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-alt"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("jobs")}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === "jobs"
                    ? "bg-secondary text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-alt"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setFilter("activity")}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === "activity"
                    ? "bg-secondary text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-alt"
                }`}
              >
                Activity
              </button>
            </div>

            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:text-primary-hover whitespace-nowrap inline-flex items-center gap-0.5"
            >
              <span>Full page</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Notification List with Full Screen scrolling on mobile */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60 overscroll-contain px-2 sm:px-0">
            {loading && notifications.length === 0 ? (
              <div className="py-16 text-center text-text-secondary space-y-3">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
                <p className="text-sm font-medium">Fetching real-time notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-20 px-4 text-center text-text-secondary space-y-3">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                  <Bell className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-bold text-text-primary">No notifications yet</h3>
                <p className="text-xs text-text-secondary max-w-xs mx-auto">
                  You are completely up to date! Real-time alerts for job applications, matches, and streaks will appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.actionUrl}
                  onClick={() => {
                    markAsRead(item.id);
                    setIsOpen(false);
                  }}
                  className={`block p-4 sm:p-3.5 hover:bg-slate-50 transition-colors active:bg-slate-100 ${
                    item.unread ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5 sm:gap-3">
                    <div
                      className={`h-9 w-9 sm:h-8 sm:w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getBgColor(
                        item.type
                      )}`}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-sm sm:text-xs font-bold text-text-primary line-clamp-1">
                          {item.title}
                        </span>
                        {item.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-0.5">
                        <span className="text-[11px] sm:text-[10px] text-text-muted">{item.timestamp}</span>
                        {item.badgeText && (
                          <span className="text-[10px] font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {item.badgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer with Dedicated Screen Link */}
          <div className="p-3 sm:p-2.5 px-4 sm:px-3 border-t border-border bg-slate-50/90 flex items-center justify-between shrink-0">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-text-secondary hover:text-text-primary"
            >
              Activity Hub
            </Link>
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-primary hover:text-primary-hover inline-flex items-center gap-1"
            >
              <span>Notification Center</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
