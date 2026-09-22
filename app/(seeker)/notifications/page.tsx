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
  Trash2,
  Filter,
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
        return <Briefcase className="h-5 w-5 text-emerald-600" />;
      case "job":
        return <Sparkles className="h-5 w-5 text-primary" />;
      case "streak":
        return <Flame className="h-5 w-5 text-accent fill-accent" />;
      case "profile":
        return <User className="h-5 w-5 text-indigo-600" />;
      case "activity":
        return <Activity className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
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
    <div className="min-h-screen bg-surface-alt pb-16">
      {/* Top Banner */}
      <div className="border-b border-border bg-white shadow-subtle">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-secondary">
                    Notification Center
                  </h1>
                  {unreadCount > 0 ? (
                    <Badge variant="primary" size="sm" className="font-bold">
                      {unreadCount} Unread
                    </Badge>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Up to date
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Real-time updates on your job applications, tailored opportunities, and skill streaks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNotifications}
                disabled={loading}
                className="h-9 gap-1.5 text-xs font-medium"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
                <span>Refresh</span>
              </Button>

              {unreadCount > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-9 gap-1.5 text-xs font-bold"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                filter === "all"
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                filter === "unread"
                  ? "bg-secondary text-white shadow-sm"
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
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                filter === "jobs"
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              Job Matches
            </button>
            <button
              onClick={() => setFilter("applications")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                filter === "applications"
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setFilter("streak")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                filter === "streak"
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary"
              }`}
            >
              Daily MCQ Streak
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm font-semibold text-text-primary">Loading real-time notifications...</p>
            <p className="text-xs text-text-secondary">Retrieving your latest updates from the platform</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-4 shadow-card">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                {filter === "unread" ? "No unread notifications" : "All caught up!"}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                {filter === "unread"
                  ? "You have read all your notifications. Toggle 'All' to review previous updates."
                  : "When new matching jobs are posted or your application status changes, you will receive instant updates here."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Link href="/jobs">
                <Button variant="primary" size="sm" className="font-bold gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Explore Jobs</span>
                </Button>
              </Link>
              <Link href="/mcq">
                <Button variant="outline" size="sm" className="font-semibold gap-1.5">
                  <Flame className="h-4 w-4 text-accent fill-accent" />
                  <span>Daily MCQ Challenge</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`relative group bg-white rounded-2xl border p-4 sm:p-5 shadow-subtle transition-all hover:shadow-card ${
                  item.unread
                    ? "border-primary/30 bg-blue-50/15 ring-1 ring-primary/10"
                    : "border-border"
                }`}
              >
                <div className="flex items-start gap-3.5 sm:gap-4">
                  {/* Type Icon */}
                  <div
                    className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl border flex items-center justify-center shrink-0 ${getBadgeStyle(
                      item.type
                    )}`}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-text-primary">
                          {item.title}
                        </h4>
                        {item.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" title="Unread" />
                        )}
                      </div>
                      <span className="text-[11px] text-text-muted">{item.timestamp}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Bottom Metadata & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {item.badgeText && (
                          <span className="text-[10px] sm:text-xs font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {item.badgeText}
                          </span>
                        )}
                        <span className="text-[11px] text-text-muted capitalize">
                          {item.type} notification
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleReadStatus(item.id, item.unread)}
                          className="text-[11px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          {item.unread ? "Mark as read" : "Mark unread"}
                        </button>

                        <Link href={item.actionUrl}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              if (item.unread) toggleReadStatus(item.id, true);
                            }}
                            className="h-8 text-xs font-bold gap-1 px-3 shadow-sm"
                          >
                            <span>Open</span>
                            <ChevronRight className="h-3.5 w-3.5" />
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

