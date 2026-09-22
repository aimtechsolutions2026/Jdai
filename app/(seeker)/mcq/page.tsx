"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DailyMcqPage() {
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [streakData, setStreakData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qRes, sRes] = await Promise.all([
        fetch("/api/mcq/today"),
        fetch("/api/streak"),
      ]);

      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestion(qData.question);
        if (qData.question?.hasAttempted) {
          setResult(qData.question.previousAttempt || { isCorrect: true });
        }
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setStreakData(sData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !question) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/mcq/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question._id,
          selectedIndex: selectedOption,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit answer");
      }

      setResult(data);
      if (streakData) {
        setStreakData({
          ...streakData,
          currentStreak: data.currentStreak,
          xp: data.totalXp,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-72 w-full bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with Flame Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" className="gap-1 font-bold">
              <Flame className="h-3.5 w-3.5 fill-accent text-accent animate-flame-bounce" />
              <span>Daily Challenge</span>
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-secondary mt-1">
            Question of the Day
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Sharpen DSA concepts, algorithms, and system design in under 2 minutes every day.
          </p>
        </div>

        {/* Streak & XP Counter Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-accent-dark shadow-sm">
            <Flame className="h-6 w-6 fill-accent text-accent animate-flame-bounce" />
            <div>
              <div className="text-base font-black leading-none">
                {streakData?.currentStreak || 3} Days
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Active Streak
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-primary shadow-sm">
            <Zap className="h-6 w-6 fill-primary text-primary" />
            <div>
              <div className="text-base font-black leading-none">
                {streakData?.xp || 150} XP
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Total Earned
              </div>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-error border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Challenge Question + Sidebars */}
      {!question ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center shadow-card space-y-4 max-w-2xl mx-auto my-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary mx-auto">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No Questions Currently Scheduled</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            The question bank is currently empty. New technical and aptitude challenges can be added directly by administrators.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Question Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm" className="uppercase font-bold">
                    {question?.category || "DSA"}
                  </Badge>
                  <Badge
                    variant={
                      question?.difficulty === "easy"
                        ? "success"
                        : question?.difficulty === "hard"
                        ? "error"
                        : "warning"
                    }
                    size="sm"
                    className="capitalize font-semibold"
                  >
                    {question?.difficulty || "Medium"}
                  </Badge>
                </div>
                <span className="text-xs text-text-secondary">
                  {result ? "Attempted Today" : "1 Attempt Per Day"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary pt-3 leading-snug">
                {question?.question}
              </h2>
            </CardHeader>

            <CardContent className="space-y-4 pt-5">
              {/* 4 Options */}
              <div className="space-y-2.5">
                {question?.options?.map((option: string, idx: number) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer =
                    result &&
                    (idx === result.correctIndex || idx === question.correctIndex);
                  const isWrongAnswer =
                    result && !result.isCorrect && isSelected;

                  let btnStyle =
                    "border-border bg-white text-text-primary hover:border-primary hover:bg-blue-50/30";

                  if (result) {
                    if (isCorrectAnswer) {
                      btnStyle =
                        "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                    } else if (isWrongAnswer) {
                      btnStyle =
                        "border-rose-500 bg-rose-50 text-rose-950 line-through opacity-80";
                    } else {
                      btnStyle = "border-border bg-slate-50 text-text-muted opacity-60";
                    }
                  } else if (isSelected) {
                    btnStyle =
                      "border-primary bg-blue-50 text-primary ring-2 ring-primary/20 font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!!result}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm transition-all ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                            isSelected && !result
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-text-secondary border-border"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </div>

                      {result && isCorrectAnswer && (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0 ml-2" />
                      )}
                      {result && isWrongAnswer && (
                        <XCircle className="h-5 w-5 text-error shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Submit */}
              {!result ? (
                <div className="flex items-center justify-end pt-3">
                  <Button
                    size="lg"
                    disabled={selectedOption === null}
                    isLoading={submitting}
                    onClick={handleSubmitAnswer}
                    className="w-full sm:w-auto px-8"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <div
                    className={`rounded-xl p-4 border flex items-start gap-3 ${
                      result.isCorrect
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-sm">
                        {result.isCorrect
                          ? "Brilliant! That's correct (+25 XP)"
                          : "Not quite right this time (+5 XP for attempt)"}
                      </div>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">
                        {result.explanation || question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Streak Heatmap & Leaderboard */}
        <div className="space-y-6">
          {/* 14-Day Activity Heatmap */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>14-Day Consistency Graph</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-7 gap-1.5">
                {streakData?.days?.map((day: any, i: number) => (
                  <div
                    key={i}
                    title={day.date}
                    className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                      day.active
                        ? "bg-accent text-white shadow-sm"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
                <span>14 Days Ago</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  <Flame className="h-3 w-3 fill-accent" />
                  {streakData?.currentStreak || 0}d Current
                </span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                <span>Weekly Top Streaks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {streakData?.leaderboard && streakData.leaderboard.length > 0 ? (
                streakData.leaderboard.map((entry: any) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-alt border border-border text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          entry.rank === 1
                            ? "bg-amber-100 text-amber-700"
                            : entry.rank === 2
                            ? "bg-slate-200 text-slate-700"
                            : "bg-slate-100 text-text-secondary"
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <span className="font-semibold text-text-primary">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-secondary">{entry.xp} XP</span>
                      <span className="flex items-center gap-0.5 font-bold text-accent">
                        <Flame className="h-3.5 w-3.5 fill-accent" />
                        {entry.streak}d
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-text-secondary">
                  No streak leaders yet. Solve today&apos;s challenge to claim rank #1!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}

