import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors";

  const variantStyles = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-blue-50 text-primary border border-blue-100",
    secondary: "bg-secondary text-white",
    success: "bg-emerald-50 text-success border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    error: "bg-rose-50 text-error border border-rose-100",
    outline: "border border-border text-text-secondary bg-white",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
}

