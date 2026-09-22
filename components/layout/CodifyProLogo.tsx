import React from "react";

interface CodifyProLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withText?: boolean;
}

export function CodifyProLogo({
  size = "md",
  className = "",
  withText = false,
}: CodifyProLogoProps) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-8 w-8 sm:h-9 sm:w-9",
    lg: "h-12 w-12 sm:h-14 sm:w-14",
    xl: "h-16 w-16 sm:h-20 sm:w-20",
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} flex items-center justify-center rounded-xl overflow-hidden shadow-sm bg-white border border-border/70 p-0.5 shrink-0 transition-transform group-hover:scale-105`}
      >
        <img
          src="/logo.png"
          alt="CodifyPro Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-secondary">
              CodifyPro
            </span>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary border border-blue-200/60 shrink-0">
              AI
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-medium text-text-secondary leading-none">
            by Aimtech Solutions
          </span>
        </div>
      )}
    </div>
  );
}

