"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Trophy,
  HelpCircle,
  AlertCircle,
  Lock,
  LogIn,
  History,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DailyMcqPage() {
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [upcomingQuestions, setUpcomingQuestions] = useState<any[]>([]);
  const [historyAttempts, setHistoryAttempts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [streakData, setStreakData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);

  const handleOptionClick = (idx: number) => {
    if (!currentUser) {
      router.push("/login?returnUrl=/mcq");
      return;
    }
    if (!result) {
      setSelectedOption(idx);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qRes, sRes, meRes, histRes] = await Promise.all([
        fetch("/api/mcq/today"),
        fetch("/api/streak"),
        fetch("/api/auth/me"),
        fetch("/api/mcq/history"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.user) setCurrentUser(meData.user);
      }

      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestion(qData.question);
        setUpcomingQuestions(qData.upcomingQuestions || []);
        if (qData.currentUser) setCurrentUser(qData.currentUser);
        if (qData.question?.hasAttempted) {
          setResult(qData.question.previousAttempt || { isCorrect: true });
        }
      }

      if (sRes.ok) {
        const sData = await sRes.json();
        setStreakData(sData);
      }

      if (histRes.ok) {
        const hData = await histRes.json();
        setHistoryAttempts(hData.attempts || []);
      }
    } catch (e) {
      console.error("Error loading MCQ data:", e);
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

      // Refresh history attempts
      const histRes = await fetch("/api/mcq/history");
      if (histRes.ok) {
        const hData = await histRes.json();
        setHistoryAttempts(hData.attempts || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpandAttempt = (id: string) => {
    setExpandedAttemptId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-3 sm:px-6 py-6 space-y-4">
        <div className="h-8 w-60 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-64 w-full bg-slate-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Compact Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Badge variant="warning" size="sm" className="gap-1 font-bold text-[11px] py-0 px-2">
              <Flame className="h-3 w-3 fill-accent text-accent animate-flame-bounce" />
              <span>Daily Challenge</span>
            </Badge>
            <span className="text-[11px] text-text-secondary">• 1 Question Uploaded Daily by Admin</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-secondary mt-0.5">
            DSA &amp; Technical Problem of the Day
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Solve 1 question daily to boost algorithmic problem solving and maintain your streak.
          </p>
        </div>

        {/* Streak & XP Pills (only when logged in) */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-accent-dark shadow-sm">
              <Flame className="h-5 w-5 fill-accent text-accent animate-flame-bounce" />
              <div>
                <div className="text-sm font-black leading-tight">
                  {streakData?.currentStreak || currentUser?.streak?.current || 0} Days
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-amber-800">
                  Active Streak
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-primary shadow-sm">
              <Zap className="h-5 w-5 fill-primary text-primary" />
              <div>
                <div className="text-sm font-black leading-tight">
                  {streakData?.xp || currentUser?.xp || 0} XP
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-blue-800">
                  Total Earned
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/login?returnUrl=/mcq">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-bold h-9 border-blue-200 text-primary hover:bg-blue-50">
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In to Play</span>
            </Button>
          </Link>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-error border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Challenge Question + Sidebars */}
      {!question ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center shadow-sm space-y-3 max-w-xl mx-auto my-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary mx-auto">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary">No Question Currently Scheduled</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            The daily question bank is awaiting today&apos;s upload by the platform administrator.
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${currentUser ? "lg:grid-cols-3" : "max-w-3xl mx-auto"} gap-4`}>
          {/* Question Card */}
          <div className={`${currentUser ? "lg:col-span-2" : ""} space-y-4`}>
            <Card className="shadow-sm border-border">
              <CardHeader className="border-b border-border pb-3 pt-4 px-4 sm:px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm" className="uppercase font-bold text-[10px]">
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
                      className="capitalize font-semibold text-[10px]"
                    >
                      {question?.difficulty || "Medium"}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-medium text-text-secondary">
                    {result ? "Attempted for Today" : "1 Attempt • Locked on Submit"}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary pt-2 leading-snug">
                  {question?.question}
                </h2>
              </CardHeader>

              <CardContent className="space-y-3 pt-4 px-4 sm:px-5 pb-4">
                {/* 4 Options */}
                <div className="space-y-2">
                  {question?.options?.map((option: string, idx: number) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectAnswer =
                      result &&
                      (idx === result.correctIndex || idx === question.correctIndex);
                    const isWrongAnswer =
                      result && !result.isCorrect && isSelected;

                    let btnStyle =
                      "border-border bg-white text-text-primary hover:border-primary hover:bg-blue-50/20";

                    if (result) {
                      if (isCorrectAnswer) {
                        btnStyle =
                          "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                      } else if (isWrongAnswer) {
                        btnStyle =
                          "border-rose-500 bg-rose-50 text-rose-950 line-through opacity-85";
                      } else {
                        btnStyle = "border-border bg-slate-50/80 text-text-muted opacity-60";
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
                        onClick={() => handleOptionClick(idx)}
                        className={`group w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 border ${
                              isSelected && !result
                                ? "bg-primary text-white border-primary"
                                : "bg-slate-100 text-text-secondary border-slate-200"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </div>

                        {!currentUser ? (
                          <span className="text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1 text-[11px] font-medium shrink-0 ml-2">
                            <Lock className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Sign in to tick</span>
                          </span>
                        ) : result && isCorrectAnswer ? (
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0 ml-2" />
                        ) : result && isWrongAnswer ? (
                          <XCircle className="h-4 w-4 text-error shrink-0 ml-2" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Submission Action */}
                {!currentUser ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-blue-200 bg-blue-50/80 text-xs shadow-sm">
                    <div className="flex items-center gap-2.5 text-secondary font-medium">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs sm:text-sm">Sign in required to answer</span>
                        <span className="text-[11px] text-text-secondary">Please sign in to select an option, earn XP, and build your daily coding streak.</span>
                      </div>
                    </div>
                    <Link href="/login?returnUrl=/mcq" className="w-full sm:w-auto">
                      <Button size="sm" className="w-full sm:w-auto font-bold gap-1.5 shadow-sm text-xs h-9 px-4">
                        <LogIn className="h-3.5 w-3.5" />
                        <span>Sign In to Answer</span>
                      </Button>
                    </Link>
                  </div>
                ) : !result ? (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-text-secondary">
                      ⚠️ Once submitted, you cannot change your answer for today.
                    </span>
                    <Button
                      size="sm"
                      disabled={selectedOption === null}
                      isLoading={submitting}
                      onClick={handleSubmitAnswer}
                      className="px-6 font-bold text-xs h-8"
                    >
                      Submit Answer
                    </Button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <div
                      className={`rounded-xl p-3.5 border flex items-start gap-2.5 ${
                        result.isCorrect
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-amber-50 border-amber-200 text-amber-900"
                      }`}
                    >
                      {result.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="font-bold text-xs sm:text-sm">
                          {result.isCorrect
                            ? "Brilliant! That's correct (+25 XP)"
                            : "Good try! Keep learning (+5 XP for attempt)"}
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">
                          {result.explanation || question.explanation}
                        </p>
                        <div className="text-[10px] font-semibold text-text-muted flex items-center gap-1 pt-1">
                          <Lock className="h-3 w-3" />
                          <span>Answer locked for today. Next challenge arrives tomorrow!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right 1 Col: Streak Heatmap & Leaderboard (only shown when logged in) */}
          {currentUser && (
            <div className="space-y-4">
              {/* 14-Day Activity Heatmap */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 pt-3.5 px-4 border-b border-border">
                  <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-secondary">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>14-Day Consistency Matrix</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-3 px-4 pb-3">
                  <div className="grid grid-cols-7 gap-1.5">
                    {streakData?.days?.map((day: any, i: number) => (
                      <div
                        key={i}
                        title={day.date}
                        className={`h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                          day.active
                            ? "bg-accent text-white shadow-sm"
                            : "bg-slate-100 text-slate-400 border border-slate-200/60"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-secondary pt-0.5">
                    <span>14 Days Ago</span>
                    <span className="flex items-center gap-0.5 font-bold text-accent">
                      <Flame className="h-3 w-3 fill-accent" />
                      {streakData?.currentStreak || currentUser?.streak?.current || 0}d Current
                    </span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Leaderboard */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 pt-3.5 px-4 border-b border-border">
                  <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-secondary">
                    <Trophy className="h-3.5 w-3.5 text-accent" />
                    <span>Weekly Streak Leaders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-3 px-4 pb-3">
                  {streakData?.leaderboard && streakData.leaderboard.length > 0 ? (
                    streakData.leaderboard.slice(0, 4).map((entry: any) => (
                      <div
                        key={entry.rank}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              entry.rank === 1
                                ? "bg-amber-100 text-amber-800"
                                : entry.rank === 2
                                ? "bg-slate-200 text-slate-800"
                                : "bg-slate-100 text-text-secondary"
                            }`}
                          >
                            {entry.rank}
                          </span>
                          <span className="font-semibold text-text-primary text-[11px] truncate max-w-[100px]">
                            {entry.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] text-text-secondary">{entry.xp} XP</span>
                          <span className="flex items-center gap-0.5 font-bold text-accent text-[11px]">
                            <Flame className="h-3 w-3 fill-accent" />
                            {entry.streak}d
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-xs text-text-secondary">
                      No streak leaders yet. Answer today to climb rank #1!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Old Submitted Questions (User's Question History - only shown when logged in) */}
      {currentUser && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <h3 className="text-base sm:text-lg font-bold text-secondary tracking-tight">
                My Solved Questions History
              </h3>
              <Badge variant="outline" size="sm" className="text-[10px] font-bold">
                {historyAttempts.length} Submissions
              </Badge>
            </div>
            <span className="text-xs text-text-secondary hidden sm:inline">
              Review your past answers and explanations
            </span>
          </div>

          {historyAttempts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white p-6 text-center text-xs text-text-secondary shadow-sm space-y-1">
              <BookOpen className="h-6 w-6 text-slate-400 mx-auto mb-1" />
              <p className="font-semibold text-text-primary">No previous submissions yet</p>
              <p>Once you solve daily questions, your previous answers, explanations, and scores will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historyAttempts.map((attempt) => {
                const q = attempt.questionId || {};
                const isExpanded = expandedAttemptId === attempt._id;
                const selectedOptionText =
                  q.options && typeof attempt.selectedOption === "number"
                    ? q.options[attempt.selectedOption]
                    : `Option ${String.fromCharCode(65 + (attempt.selectedOption || 0))}`;
                const correctOptionText =
                  q.options && typeof q.correctIndex === "number"
                    ? q.options[q.correctIndex]
                    : null;

                return (
                  <div
                    key={attempt._id}
                    className="rounded-xl border border-border bg-white p-3.5 shadow-sm hover:border-slate-300 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                            attempt.isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {attempt.isCorrect ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-text-primary leading-tight">
                          {q.question || "Daily Coding Challenge"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={attempt.isCorrect ? "success" : "error"}
                          size="sm"
                          className="text-[10px] font-bold"
                        >
                          {attempt.isCorrect ? "Correct (+25 XP)" : "Incorrect (+5 XP)"}
                        </Badge>
                        <span className="text-[11px] text-text-secondary font-mono">
                          {attempt.date}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExpandAttempt(attempt._id)}
                          className="h-6 text-[10px] px-2 gap-1 ml-1"
                        >
                          <span>{isExpanded ? "Hide" : "Details"}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary pt-1">
                      <span className="font-medium text-text-primary">
                        Your Answer:{" "}
                        <span
                          className={
                            attempt.isCorrect
                              ? "text-emerald-700 font-semibold"
                              : "text-rose-700 font-semibold line-through"
                          }
                        >
                          {selectedOptionText}
                        </span>
                      </span>
                      {!attempt.isCorrect && correctOptionText && (
                        <span className="text-emerald-700 font-medium">
                          • Correct: <span className="font-semibold">{correctOptionText}</span>
                        </span>
                      )}
                      {q.category && (
                        <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5">
                          {q.category}
                        </Badge>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded-lg text-xs space-y-1">
                        <div className="font-bold text-text-primary flex items-center gap-1 text-[11px]">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span>Solution &amp; Explanation:</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed text-[11px]">
                          {attempt.explanation || q.explanation || "No extended explanation provided for this challenge."}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Upcoming Daily Questions Schedule (only shown when logged in) */}
      {currentUser && upcomingQuestions.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-base sm:text-lg font-bold text-secondary tracking-tight">
                  Upcoming Daily Challenges Schedule
                </h3>
              </div>
              <p className="text-xs text-text-secondary">
                Upcoming technical problems scheduled for the coming days. Unlocks automatically day-by-day.
              </p>
            </div>
            <Badge variant="outline" size="sm" className="w-fit gap-1 text-[10px] font-semibold text-text-secondary">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>Admin Daily Pipeline</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingQuestions.map((uq, idx) => (
              <div
                key={uq._id || idx}
                className="p-3.5 rounded-xl border border-border bg-white shadow-sm flex flex-col justify-between gap-2.5 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary text-[11px]">
                      {uq.dayOffset === 1
                        ? "Tomorrow"
                        : uq.dayOffset === 2
                        ? "In 2 Days"
                        : `Day +${uq.dayOffset}`}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {uq.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 pt-0.5">
                    <Badge variant="primary" size="sm" className="uppercase font-bold text-[9px] py-0 px-1.5">
                      {uq.category || "DSA"}
                    </Badge>
                    <Badge
                      variant={
                        uq.difficulty === "easy"
                          ? "success"
                          : uq.difficulty === "hard"
                          ? "error"
                          : "warning"
                      }
                      size="sm"
                      className="capitalize font-semibold text-[9px] py-0 px-1.5"
                    >
                      {uq.difficulty || "Medium"}
                    </Badge>
                  </div>

                  <p className="text-xs font-semibold text-text-primary line-clamp-3 leading-snug pt-0.5">
                    {uq.question}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-text-muted">
                  <span className="flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <Lock className="h-2.5 w-2.5" />
                    <span>Unlocks {uq.date}</span>
                  </span>
                  <span className="font-mono text-[9px]">4 Options</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
