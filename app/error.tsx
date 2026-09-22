"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client-side or SSR rendering error
    console.error("Render / Application error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-border shadow-card">
        <div className="h-16 w-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            The page encountered a temporary issue while loading. You can retry loading or return to the home page.
          </p>
        </div>

        {error?.digest && (
          <p className="text-[11px] text-text-muted font-mono bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
              <Home className="h-3.5 w-3.5" />
              <span>Back Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

