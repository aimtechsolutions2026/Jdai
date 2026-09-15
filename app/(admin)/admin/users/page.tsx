"use client";

import React, { useState, useEffect } from "react";
import { Users, ShieldCheck, CheckCircle2, Search, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm">
              Admin Workspace
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-secondary mt-1">
            User Moderation & Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            View registered job seekers, recruiters, and platform administrators.
          </p>
        </div>

        <div className="max-w-xs w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-alt border-b border-border text-xs uppercase font-bold text-text-secondary">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 border border-border flex items-center justify-center font-bold text-xs text-secondary shrink-0">
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-semibold text-text-primary">{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-text-secondary">
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "warning"
                            : u.role === "recruiter"
                            ? "secondary"
                            : "primary"
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-text-secondary">
                      {formatRelativeTime(u.createdAt || new Date())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

