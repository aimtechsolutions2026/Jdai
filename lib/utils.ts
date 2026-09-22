import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

export function formatSalaryRange(
  salary?: { min?: number; max?: number; currency?: string } | null
): string {
  if (!salary || (!salary.min && !salary.max)) return "Competitive Salary";
  const curr = (salary.currency || "USD").toUpperCase();
  const sym = curr === "USD" ? "$" : curr === "INR" ? "₹" : curr === "EUR" ? "€" : curr === "GBP" ? "£" : `${curr} `;

  // Indian Rupee (INR) Formatting (support LPA - Lakhs Per Annum)
  if (curr === "INR") {
    if (salary.min && salary.max) {
      if (salary.min >= 100000 || salary.max >= 100000) {
        const minLpa = (salary.min / 100000).toFixed(salary.min % 100000 === 0 ? 0 : 1);
        const maxLpa = (salary.max / 100000).toFixed(salary.max % 100000 === 0 ? 0 : 1);
        return `₹${minLpa} - ₹${maxLpa} LPA`;
      }
      return `₹${salary.min.toLocaleString("en-IN")} - ₹${salary.max.toLocaleString("en-IN")}`;
    }
    if (salary.min) {
      if (salary.min >= 100000) {
        return `From ₹${(salary.min / 100000).toFixed(salary.min % 100000 === 0 ? 0 : 1)} LPA`;
      }
      return `From ₹${salary.min.toLocaleString("en-IN")}`;
    }
    if (salary.max) {
      if (salary.max >= 100000) {
        return `Up to ₹${(salary.max / 100000).toFixed(salary.max % 100000 === 0 ? 0 : 1)} LPA`;
      }
      return `Up to ₹${salary.max.toLocaleString("en-IN")}`;
    }
  }

  // Standard USD and international formatting
  if (salary.min && salary.max) {
    if (salary.min >= 1000 && salary.max >= 1000) {
      return `${sym}${Math.round(salary.min / 1000)}k - ${sym}${Math.round(salary.max / 1000)}k`;
    }
    return `${sym}${salary.min.toLocaleString()} - ${sym}${salary.max.toLocaleString()}`;
  }
  if (salary.min) return `From ${sym}${Math.round(salary.min / 1000)}k`;
  if (salary.max) return `Up to ${sym}${Math.round(salary.max / 1000)}k`;
  return "Competitive Salary";
}

export function formatRelativeTime(dateStringOrDate: string | Date): string {
  const date = new Date(dateStringOrDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

