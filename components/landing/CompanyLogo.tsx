import React from "react";
import { Building2 } from "lucide-react";

export const COMPANY_ICONS: Record<string, React.ReactNode> = {
  google: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  ),
  microsoft: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
      <rect x="2" y="2" width="9.2" height="9.2" fill="#F25022" rx="1"/>
      <rect x="12.8" y="2" width="9.2" height="9.2" fill="#7FBA00" rx="1"/>
      <rect x="2" y="12.8" width="9.2" height="9.2" fill="#00A4EF" rx="1"/>
      <rect x="12.8" y="12.8" width="9.2" height="9.2" fill="#FFB900" rx="1"/>
    </svg>
  ),
  amazon: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
      <path d="M14.2 16.5c-3 .2-6.2-.8-8.5-2.4-.3-.2-.5.1-.3.3 2.5 1.9 6 3 9.4 2.8 1.8-.1 3.5-.6 5-1.5.3-.2.2-.6-.2-.5-1.7.7-3.6 1.1-5.4 1.3z" fill="#FF9900"/>
      <path d="M19.7 14.8c-.2-.3-1.4-.2-2-.1-.2 0-.2-.1-.1-.2 1-.8 2.6-.5 2.8-.2.2.3-.1 1.9-1 2.7-.2.1-.2 0-.2-.1.1-.5.5-1.8.5-2.1z" fill="#FF9900"/>
      <path d="M12.5 4C8.6 4 6 6.8 6 10c0 2 1.2 3.5 2.9 4.1.4.1.6-.1.7-.4l.4-1.1c.1-.3 0-.5-.3-.6-1-.5-1.5-1.3-1.5-2.4 0-2.1 1.9-3.8 4.2-3.8 2.1 0 3.7 1.4 3.7 3.4 0 1.1-.5 1.9-1.2 2.4-.7.5-1.6.7-2.5.7-.6 0-1.3-.2-1.7-.5-.4-.3-.5-.6-.5-.9 0-.6.5-1.2 1.5-1.2.7 0 1.4.2 2.1.5.3.1.5 0 .5-.2l.4-.7c.1-.2 0-.4-.2-.4-.9-.4-1.9-.6-2.9-.6-2.1 0-3.4 1.3-3.4 2.9 0 1.3.8 2.3 2.1 2.7.9.3 2 .4 3 .2 1.4-.3 2.5-1.1 3.2-2.2.5-.9.9-2.1.9-3.2 0-3.2-2.6-5.8-6.8-5.8z" fill="#1E293B"/>
    </svg>
  ),
  netflix: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#E50914">
      <path d="M4 2h4.5l5.5 13V2h4v20h-4.5L8 9v13H4V2z"/>
    </svg>
  ),
  meta: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#0081FB">
      <path d="M16.7 4c-2.3 0-4.3 1.3-5.2 3.1-.9-1.8-2.9-3.1-5.2-3.1C2.8 4 .5 6.3.5 9.7c0 4.7 5.1 9.4 10.3 12.1.3.2.7.2 1 0 5.2-2.7 10.3-7.4 10.3-12.1C22.1 6.3 19.8 4 16.7 4zm-9.3 9.4c-2 0-3.6-1.6-3.6-3.7s1.6-3.7 3.6-3.7 3.6 1.6 3.6 3.7-1.6 3.7-3.6 3.7zm9.3 0c-2 0-3.6-1.6-3.6-3.7s1.6-3.7 3.6-3.7 3.6 1.6 3.6 3.7-1.6 3.7-3.6 3.7z"/>
    </svg>
  ),
  github: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#24292F">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  stripe: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#635BFF">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.71 15.023.187 12.392.187 6.786.187 2.87 3.12 2.87 7.747c0 4.606 3.96 5.86 7.64 7.207 2.479.914 3.327 1.666 3.327 2.666 0 .973-.836 1.487-2.257 1.487-2.637 0-5.46-1.168-7.398-2.261l-.899 5.568c2.052 1.05 5.097 1.7 8.093 1.7 5.862 0 10.024-2.842 10.024-7.669 0-4.84-3.99-6.09-7.424-7.305z" />
    </svg>
  ),
  vercel: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#000000">
      <path d="M12 3.5L22.5 21.5H1.5L12 3.5Z" />
    </svg>
  ),
  airbnb: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#FF5A5F">
      <path d="M12 2c-3.1 0-5.4 2.4-5.4 5.5 0 3.7 4 9.1 5.4 10.9 1.4-1.8 5.4-7.2 5.4-10.9C17.4 4.4 15.1 2 12 2zm0 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
  ),
  supabase: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
      <path d="M21.362 9.354H12V.304a.6.6 0 00-1.024-.424L.67 10.186a1.2 1.2 0 00.849 2.048H12v9.05a.6.6 0 001.024.424l10.305-10.306a1.2 1.2 0 00-.967-2.048z" fill="#3ECF8E"/>
    </svg>
  ),
  linear: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#5E6AD2" fillOpacity="0.12" />
      <path d="M4 19L19 4M4 12L12 4M12 20L20 12M7 20L20 7" stroke="#5E6AD2" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  ramp: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#16A34A">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <circle cx="17.25" cy="17.25" r="3.75" />
    </svg>
  ),
  datadog: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#632CA6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" />
    </svg>
  ),
  shopify: (
    <svg className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="#95BF47">
      <path d="M15.8 4.2c-.1 0-.2.1-.3.2l-1.9 4.3 3.9.7-1.7-5.2zm-2.8 4.1L14.7 3c-.1-.3-.4-.5-.7-.5-.1 0-.3 0-.4.1L8.5 5.5l4.5 2.8zm-5.4-1.5l1.9-1.2-3.1-.7 1.2 1.9zm-.8.6l-3.3 2.1c-.2.1-.3.4-.2.6l4.1 13.1 3.8-2.4-4.4-13.4zm4.7 13.9l6.5-4.1-3.6-11.4-4.7 3 1.8 12.5z"/>
    </svg>
  ),
};

export interface CompanyLogoProps {
  name?: string;
  iconKey?: string;
  logoUrl?: string;
  className?: string;
  company?: {
    name: string;
    iconKey?: string;
    logoUrl?: string;
  };
}

export function CompanyLogo(props: CompanyLogoProps) {
  const name = props.company?.name ?? props.name ?? "";
  const iconKey = props.company?.iconKey ?? props.iconKey;
  const logoUrl = props.company?.logoUrl ?? props.logoUrl;
  const className = props.className;
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={className || "h-8 sm:h-9 w-auto object-contain max-w-[120px] transition-transform duration-200 group-hover:scale-105"}
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    );
  }

  const normalizedKey = (iconKey || name || "").toLowerCase().trim();
  const preset = COMPANY_ICONS[normalizedKey];
  if (preset) {
    return <>{preset}</>;
  }

  return (
    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200/80">
      <Building2 className="h-4 w-4 text-primary" />
      <span className="truncate max-w-[100px]">{name}</span>
    </div>
  );
}
