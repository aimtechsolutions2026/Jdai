"use client";

import * as React from "react";
import { Check, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/country-codes";

export interface PhoneInputProps {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  showHelper?: boolean;
}

export function PhoneInput({
  countryCode = DEFAULT_COUNTRY_CODE,
  onCountryCodeChange,
  value = "",
  onChange,
  onBlur,
  error,
  placeholder = "9876543210",
  disabled = false,
  required = false,
  id = "phone-input",
  className,
  showHelper = true,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isTouched, setIsTouched] = React.useState(false);

  // Clean non-digits
  const cleanDigits = value.replace(/\D/g, "");
  const isComplete = cleanDigits.length === 10;
  const isInvalid = isTouched && cleanDigits.length > 0 && cleanDigits.length < 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric characters up to 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(digitsOnly);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
    if (onBlur) onBlur();
  };

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.dialCode === countryCode) || COUNTRY_CODES[0];

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {/* Input container */}
      <div
        className={cn(
          "flex w-full items-stretch rounded-xl border bg-white transition-all overflow-hidden",
          error || isInvalid
            ? "border-red-400 ring-1 ring-red-400"
            : isFocused
            ? "border-primary ring-1 ring-primary"
            : "border-border hover:border-slate-300",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50"
        )}
      >
        {/* Country code selector - exactly 20% width */}
        <div className="relative w-[20%] min-w-[76px] shrink-0 border-r border-border bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex items-center justify-between px-2.5">
          <span className="text-xs sm:text-sm font-medium text-text-primary flex items-center gap-1.5 pointer-events-none truncate">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.dialCode}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 text-text-muted shrink-0 pointer-events-none ml-0.5" />
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            disabled={disabled}
            aria-label="Select Country Code"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                {c.flag} {c.dialCode} ({c.name})
              </option>
            ))}
          </select>
        </div>

        {/* 10-digit Phone input - remaining 80% width */}
        <div className="relative flex-1 flex items-center">
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            disabled={disabled}
            required={required}
            value={cleanDigits}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full h-10 px-3.5 text-sm text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none disabled:cursor-not-allowed font-mono tracking-wider"
          />

          {/* Right Status Badge: Count or Checkmark */}
          <div className="pr-3 flex items-center shrink-0">
            {isComplete ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                10/10
              </span>
            ) : cleanDigits.length > 0 ? (
              <span
                className={cn(
                  "text-[11px] font-medium font-mono px-1.5 py-0.5 rounded border",
                  cleanDigits.length < 10
                    ? "text-amber-700 bg-amber-50 border-amber-200"
                    : "text-slate-400 bg-slate-50 border-slate-200"
                )}
              >
                {cleanDigits.length}/10
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Error messaging (only shown when there is an error or invalid length) */}
      {(error || isInvalid) && (
        <div className="flex items-center text-[11px] px-1">
          {error ? (
            <p className="text-red-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {error}
            </p>
          ) : (
            <p className="text-red-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              Please enter 10 digits (currently {cleanDigits.length}/10).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
