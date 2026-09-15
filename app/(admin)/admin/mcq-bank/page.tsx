"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/dialog";

export default function AdminMcqBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [category, setCategory] = useState<"dsa" | "aptitude" | "general">("dsa");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/mcq/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          difficulty,
          question: questionText,
          options: options.filter(Boolean),
          correctIndex,
          explanation,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions([...questions, data.question]);
        setShowAddModal(false);
        // Reset form
        setQuestionText("");
        setOptions(["", "", "", ""]);
        setExplanation("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

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
            MCQ Question Bank
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage daily challenges covering Data Structures, Algorithms, and Aptitude.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Challenge Question</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
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
                      <CheckCircle2 className="h-3.5 w-3.5 text-success ml-auto shrink-0" />
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
        </div>
      )}

      {/* Add Question Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Daily MCQ Challenge"
        description="Insert a new problem into the question bank rotation."
      >
        <form onSubmit={handleCreateQuestion} className="space-y-4">
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
              Question Text
            </label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="What is the amortized complexity of inserting into a dynamic array?"
              className="w-full rounded-xl border border-border p-2.5 text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-text-secondary">
              Options & Correct Answer
            </label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  className="h-4 w-4 text-primary focus:ring-primary"
                  title="Mark as correct answer"
                />
                <Input
                  value={opt}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = e.target.value;
                    setOptions(next);
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="text-xs h-9"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
              Detailed Explanation
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why the correct option is right..."
              className="w-full rounded-xl border border-border p-2.5 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

