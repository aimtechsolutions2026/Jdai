"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Briefcase,
  Download,
  Eye,
  Flame,
  CheckCheck,
  ExternalLink,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface NotificationItem {
  id: string;
  type: "job" | "download" | "view" | "streak";
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  actionUrl: string;
  badgeText?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "download",
    title: "Resume Downloaded",
    description: "A Senior Technical Recruiter at Stripe downloaded your verified ATS Resume.",
    timestamp: "12m ago",
    unread: true,
    actionUrl: "/profile",
    badgeText: "Stripe",
  },
  {
    id: "notif-2",
    type: "job",
    title: "New Job Match: Staff Platform Engineer",
    description: "Vercel posted a high-match position (94% skill affinity, $180k - $210k).",
    timestamp: "45m ago",
    unread: true,
    actionUrl: "/jobs",
    badgeText: "94% Match",
  },
  {
    id: "notif-3",
    type: "view",
    title: "Recruiter Viewed Profile",
    description: "Talent Acquisition lead from Google Cloud reviewed your skills and experience.",
    timestamp: "2h ago",
    unread: true,
    actionUrl: "/profile",
    badgeText: "Google",
  },
  {
    id: "notif-4",
    type: "streak",
    title: "Daily MCQ Streak Reminder",
    description: "Solve today's question to keep your learning streak burning strong!",
    timestamp: "4h ago",
    unread: false,
    actionUrl: "/mcq",
    badgeText: "Streak Active",
  },
  {
    id: "notif-5",
    type: "job",
    title: "New Job Match: Senior Full-Stack Engineer",
    description: "Linear posted a remote role matching your React & TypeScript credentials.",
    timestamp: "1d ago",
    unread: false,
    actionUrl: "/jobs",
    badgeText: "Linear",
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "jobs" | "activity">("all");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "jobs") return item.type === "job";
    if (filter === "activity") return item.type === "download" || item.type === "view";
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "download":
        return <Download className="h-4 w-4 text-emerald-600" />;
      case "job":
        return <Briefcase className="h-4 w-4 text-primary" />;
      case "view":
        return <Eye className="h-4 w-4 text-indigo-600" />;
      case "streak":
        return <Flame className="h-4 w-4 text-accent fill-accent" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getBgColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "download":
        return "bg-emerald-50 border-emerald-200/70";
      case "job":
        return "bg-blue-50 border-blue-200/70";
      case "view":
        return "bg-indigo-50 border-indigo-200/70";
      case "streak":
        return "bg-amber-50 border-amber-200/70";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Notifications"
        title="View Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:-right-4 md:right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 rounded-2xl border border-border bg-white shadow-2xl p-0 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="font-bold text-sm text-secondary flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-primary" />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <Badge variant="primary" size="sm" className="text-[10px] px-1.5 py-0.5">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary-hover transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 border-b border-border/50 bg-white">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface-alt"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("jobs")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                filter === "jobs"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface-alt"
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setFilter("activity")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                filter === "activity"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface-alt"
              }`}
            >
              Recruiter Activity
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/60">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center text-text-secondary space-y-1">
                <p className="text-xs font-semibold">No notifications in this tab</p>
                <p className="text-[11px]">You are completely up to date!</p>
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
                  className={`block p-3.5 hover:bg-slate-50 transition-colors ${
                    item.unread ? "bg-blue-50/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getBgColor(
                        item.type
                      )}`}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-text-primary line-clamp-1">
                          {item.title}
                        </span>
                        {item.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 pt-0.5">
                        <span className="text-[10px] text-text-muted">{item.timestamp}</span>
                        {item.badgeText && (
                          <span className="text-[10px] font-semibold text-primary bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
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

          {/* Footer */}
          <div className="p-2.5 border-t border-border bg-slate-50/70 text-center">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-primary hover:text-primary-hover inline-flex items-center gap-1"
            >
              <span>Manage notifications & ATS visibility</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
