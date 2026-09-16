"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";

export default function AdminMcqBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form state
  const [currentId, setCurrentId] = useState("");
  const [category, setCategory] = useState<"dsa" | "aptitude" | "general">("dsa");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    fetchBank();
  }, []);

  const fetchBank = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mcq/bank");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (e) {
      console.error(e);
      showFeedback("error", "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentId("");
    setCategory("dsa");
    setDifficulty("medium");
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
    setShowModal(true);
  };

  const openEditModal = (q: any) => {
    setModalMode("edit");
    setCurrentId(q._id);
    setCategory(q.category || "dsa");
    setDifficulty(q.difficulty || "medium");
    setQuestionText(q.question || "");
    setOptions(
      q.options?.length === 4
        ? [...q.options]
        : [q.options?.[0] || "", q.options?.[1] || "", q.options?.[2] || "", q.options?.[3] || ""]
    );
    setCorrectIndex(q.correctIndex || 0);
    setExplanation(q.explanation || "");
    setShowModal(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const validOptions = options.filter(Boolean);
      if (validOptions.length < 2) {
        throw new Error("Please provide at least 2 options");
      }

      const payload = {
        category,
        difficulty,
        question: questionText,
        options: validOptions,
        correctIndex: Number(correctIndex),
        explanation,
      };

      if (modalMode === "create") {
        const res = await fetch("/api/mcq/bank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create question");
        showFeedback("success", "MCQ Challenge created successfully!");
      } else {
        const res = await fetch("/api/mcq/bank", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentId, ...payload }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update question");
        showFeedback("success", "MCQ Challenge updated successfully!");
      }

      setShowModal(false);
      await fetchBank();
    } catch (err: any) {
      showFeedback("error", err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/mcq/bank?id=${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("success", "MCQ Question deleted successfully!");
        await fetchBank();
      } else {
        showFeedback("error", "Failed to delete question");
      }
    } catch (e) {
      showFeedback("error", "Error executing delete");
    } finally {
      setSaving(false);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const filtered = questions.filter((q) => {
    if (categoryFilter === "all") return true;
    return q.category === categoryFilter;
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
            MCQ Question Bank
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage daily engineering challenges covering Data Structures, Algorithms, and Aptitude.
          </p>
        </div>
        <Button onClick={openCreateModal} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Challenge Question</span>
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

      {/* Category filter pills */}
      <div className="flex items-center gap-2">
        {["all", "dsa", "aptitude", "general"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase transition-colors ${
              categoryFilter === cat
                ? "bg-primary text-white"
                : "bg-white border border-border text-text-secondary hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q, idx) => (
            <div
              key={q._id || idx}
              className="rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-hover transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm" className="uppercase font-bold">
                      {q.category}
                    </Badge>
                    <Badge
                      variant={
                        q.difficulty === "easy"
                          ? "success"
                          : q.difficulty === "hard"
                          ? "error"
                          : "warning"
                      }
                      size="sm"
                      className="capitalize"
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-text-primary pt-1">
                    {q.question}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-text-secondary"
                    title="Edit Question"
                    onClick={() => openEditModal(q)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-error hover:bg-rose-50"
                    title="Delete Question"
                    onClick={() => {
                      setDeleteTarget(q);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {q.options?.map((opt: string, i: number) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-2.5 text-xs flex items-center gap-2 ${
                      i === q.correctIndex
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                        : "bg-surface-alt border-border text-text-secondary"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold border shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                    {i === q.correctIndex && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-text-secondary mt-2">
                  <span className="font-bold text-text-primary">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-text-secondary py-8 text-center">No questions found.</p>
          )}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "create" ? "Add Daily MCQ Challenge" : "Edit MCQ Challenge"}
        description="Configure question rotation and verified explanation."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border p-2.5 text-xs bg-white"
              >
                <option value="dsa">DSA (Algorithms / Data Structures)</option>
                <option value="aptitude">Aptitude & Math</option>
                <option value="general">System Design / General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border border-border p-2.5 text-xs bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Question Statement <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full rounded-xl border border-border p-2.5 text-xs focus:ring-1 focus:ring-primary"
              placeholder="What is the worst-case space complexity of QuickSort?"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-text-secondary">
              Options (Select Radio for Correct Answer)
            </label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOpt"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  className="h-4 w-4 text-primary shrink-0"
                />
                <span className="text-xs font-bold text-text-secondary w-5">
                  {String.fromCharCode(65 + i)}:
                </span>
                <Input
                  required={i < 2}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Solution Explanation (Optional)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full rounded-xl border border-border p-2.5 text-xs focus:ring-1 focus:ring-primary"
              placeholder="Explain why this answer is correct..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              {modalMode === "create" ? "Add to Bank" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm MCQ Deletion"
        description="Are you sure you want to permanently delete this challenge question?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-primary">
            You are deleting: <span className="font-bold text-error">{deleteTarget?.question}</span>
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
              isLoading={saving}
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
