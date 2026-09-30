"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "jobs" | "applications" | "streak">("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const serverNotifs: NotificationItem[] = data.notifications || [];
        setNotifications(serverNotifs);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    try {
      await fetch("/api/notifications/read-all", { method: "PUT" });
    } catch (err) {
      console.warn("Failed to mark all notifications read on server:", err);
    }
  };

  const toggleReadStatus = async (id: string, currentlyUnread: boolean) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: !currentlyUnread } : item))
    );
    try {
      if (currentlyUnread) {
        await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      }
    } catch (err) {
      console.warn("Failed to update notification read status on server:", err);
    }
  };

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

  const getBadgeStyle = (type: NotificationItem["type"]) => {
    switch (type) {
      case "application":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "job":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "streak":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "profile":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "activity":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return item.unread;
    if (filter === "jobs") return item.type === "job";
    if (filter === "applications") return item.type === "application";
    if (filter === "streak") return item.type === "streak";
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-alt pb-14">
      {/* Top Banner Header */}
      <div className="border-b border-border bg-white shadow-xs">
        <div className="mx-auto max-w-4xl px-3 sm:px-6 py-3.5 sm:py-4">
          {/* Back link */}
          <div className="mb-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Title & Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Icon + Title + Subtitle */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Bell className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-secondary truncate">
                    Notification Center
                  </h1>
                  {unreadCount > 0 ? (
                    <Badge variant="primary" size="sm" className="font-bold text-[10px] py-0 px-2 shrink-0">
                      {unreadCount} Unread
                    </Badge>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      Up to date
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Real-time updates on your job applications, opportunities, and skill streaks.
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNotifications}
                disabled={loading}
                className="h-8 gap-1.5 text-xs font-medium px-2.5"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin text-primary" : ""}`} />
                <span>Refresh</span>
              </Button>

              {unreadCount > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 gap-1.5 text-xs font-bold px-2.5"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </Button>
              )}
            </div>
          </div>

          {/* Responsive Horizontal Filter Tabs */}
          <div className="flex items-center gap-1.5 mt-3 sm:mt-4 overflow-x-auto scrollbar-none pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                filter === "all"
                  ? "bg-secondary text-white shadow-xs"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                filter === "unread"
                  ? "bg-secondary text-white shadow-xs"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-primary text-white text-[10px] font-bold inline-flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("jobs")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                filter === "jobs"
                  ? "bg-secondary text-white shadow-xs"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              Job Matches
            </button>
            <button
              onClick={() => setFilter("applications")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                filter === "applications"
                  ? "bg-secondary text-white shadow-xs"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setFilter("streak")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                filter === "streak"
                  ? "bg-secondary text-white shadow-xs"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              Daily MCQ Streak
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-3 sm:px-6 py-4 sm:py-5">
        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-8 text-center space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-semibold text-text-primary">Loading real-time notifications...</p>
            <p className="text-[11px] text-text-secondary">Retrieving your latest platform activity</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-8 text-center space-y-3 shadow-xs">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-text-primary">
                {filter === "unread" ? "No unread notifications" : "All caught up!"}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5 max-w-xs mx-auto">
                {filter === "unread"
                  ? "You have reviewed all your updates. Toggle 'All' to view previous notifications."
                  : "When matching jobs are posted or your application status changes, updates will appear here."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <Link href="/jobs">
                <Button variant="primary" size="sm" className="font-bold gap-1 text-xs h-8">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Explore Jobs</span>
                </Button>
              </Link>
              <Link href="/mcq">
                <Button variant="outline" size="sm" className="font-semibold gap-1 text-xs h-8">
                  <Flame className="h-3.5 w-3.5 text-accent fill-accent" />
                  <span>Daily MCQ Challenge</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`relative group bg-white rounded-xl border p-3 sm:p-4 shadow-xs transition-all hover:border-slate-300 ${
                  item.unread
                    ? "border-primary/40 bg-blue-50/20 ring-1 ring-primary/10"
                    : "border-border"
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3.5">
                  {/* Type Icon */}
                  <div
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg border flex items-center justify-center shrink-0 ${getBadgeStyle(
                      item.type
                    )}`}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                          {item.title}
                        </h4>
                        {item.unread && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" title="Unread" />
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-text-muted shrink-0">{item.timestamp}</span>
                    </div>

                    <p className="text-xs text-text-secondary leading-snug mb-2">
                      {item.description}
                    </p>

                    {/* Bottom Metadata & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {item.badgeText && (
                          <span className="text-[10px] font-semibold text-primary bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            {item.badgeText}
                          </span>
                        )}
                        <span className="text-[10px] text-text-muted capitalize">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleReadStatus(item.id, item.unread)}
                          className="text-[11px] text-text-secondary hover:text-text-primary px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                        >
                          {item.unread ? "Mark read" : "Mark unread"}
                        </button>

                        <Link href={item.actionUrl}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              if (item.unread) toggleReadStatus(item.id, true);
                            }}
                            className="h-7 text-[11px] font-bold gap-0.5 px-2.5 shadow-xs"
                          >
                            <span>Open</span>
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
