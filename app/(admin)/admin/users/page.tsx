"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  Award,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { formatRelativeTime } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "edit">("create");
  const [userForm, setUserForm] = useState<any>({
    id: "",
    name: "",
    email: "",
    role: "seeker",
    phone: "",
    password: "",
    location: "San Francisco, CA",
    skills: "React, TypeScript",
    isVerified: true,
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
      showFeedback("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setUserModalMode("create");
    setUserForm({
      id: "",
      name: "",
      email: "",
      role: "seeker",
      phone: "+1 (555) 000-0000",
      password: "password123",
      location: "San Francisco, CA",
      skills: "React, TypeScript, Next.js",
      isVerified: true,
    });
    setUserModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setUserModalMode("edit");
    setUserForm({
      id: u._id,
      name: u.name || "",
      email: u.email || "",
      role: u.role || "seeker",
      phone: u.phone || "",
      password: "",
      location: u.location || "San Francisco, CA",
      skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
      isVerified: u.isVerified !== undefined ? u.isVerified : true,
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const skillsArray = userForm.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      if (userModalMode === "create") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userForm.name,
            email: userForm.email,
            password: userForm.password,
            role: userForm.role,
            phone: userForm.phone,
            location: userForm.location,
            skills: skillsArray,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user");
        showFeedback("success", `User ${userForm.name} created successfully!`);
      } else {
        const res = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userForm.id,
            name: userForm.name,
            email: userForm.email,
            role: userForm.role,
            phone: userForm.phone,
            isVerified: userForm.isVerified,
            location: userForm.location,
            skills: skillsArray,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update user");
        showFeedback("success", `User ${userForm.name} updated successfully!`);
      }

      setUserModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      showFeedback("error", err.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users?id=${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("success", `User ${deleteTarget.name} deleted successfully!`);
        await fetchUsers();
      } else {
        showFeedback("error", "Failed to delete user");
      }
    } catch (e) {
      showFeedback("error", "Error executing delete");
    } finally {
      setActionLoading(false);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.location?.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to Master Dashboard */}
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Master Admin Dashboard</span>
        </Link>
      </div>

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
            Manage registered candidates, recruiters, and platform administrators with full edit and deletion authority.
          </p>
        </div>

        <Button onClick={openCreateModal} size="sm" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-xl border text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="max-w-xs w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {["all", "seeker", "recruiter", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                roleFilter === r
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-text-secondary hover:bg-slate-50"
              }`}
            >
              {r}
            </button>
          ))}
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
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Registered</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 border border-border flex items-center justify-center font-bold text-xs text-secondary shrink-0">
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <span className="font-semibold text-text-primary block">{u.name}</span>
                        <span className="text-xs text-text-secondary">{u.email}</span>
                      </div>
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
                    <td className="py-4 px-6 text-xs text-text-secondary">
                      {u.location || "San Francisco, CA"}
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
                    <td className="py-4 px-6 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-primary"
                        title="View Profile Details"
                        onClick={() => {
                          setSelectedUser(u);
                          setDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-text-secondary"
                        title="Edit User"
                        onClick={() => openEditModal(u)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-error hover:bg-rose-50"
                        title="Delete User"
                        onClick={() => {
                          setDeleteTarget(u);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-text-secondary">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Create / Edit Modal */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={userModalMode === "create" ? "Add Platform User" : "Edit User Details"}
        description="Configure permissions and user profile attributes."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveUser} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Full Name <span className="text-error">*</span>
              </label>
              <Input
                required
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Email Address <span className="text-error">*</span>
              </label>
              <Input
                required
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="alex@codifypro.ai"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Role
              </label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
              >
                <option value="seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Phone
              </label>
              <Input
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {userModalMode === "create" && (
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Password
              </label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="Min 6 characters"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Location
              </label>
              <Input
                value={userForm.location}
                onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Skills (comma separated)
              </label>
              <Input
                value={userForm.skills}
                onChange={(e) => setUserForm({ ...userForm, skills: e.target.value })}
                placeholder="React, TypeScript"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={actionLoading}>
              {userModalMode === "create" ? "Create Account" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* User Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Candidate Profile Information"
        description="Comprehensive user profile records."
        maxWidth="xl"
      >
        {selectedUser && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary shrink-0">
                {selectedUser.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-secondary">{selectedUser.name}</h3>
                  <Badge variant="primary" size="sm" className="capitalize">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div className="text-xs text-text-secondary">
                  {selectedUser.email} • {selectedUser.location || "San Francisco, CA"}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-text-secondary mb-1.5">
                Skills ({selectedUser.skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.skills?.map((s: string) => (
                  <Badge key={s} variant="outline" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(selectedUser);
                }}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                <span>Edit User</span>
              </Button>
              <Button size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm User Deletion"
        description="Are you sure you want to permanently delete this user?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-primary">
            You are deleting: <span className="font-bold text-error">{deleteTarget?.name}</span> ({deleteTarget?.email})
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={actionLoading}
              onClick={executeDelete}
              className="bg-error hover:bg-rose-700 text-white"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
