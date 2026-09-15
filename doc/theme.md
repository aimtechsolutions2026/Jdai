# theme.md — Design System

## 1. Design Principles
- **Clarity first**: job data (salary, role, company) must be scannable in <3 seconds per card.
- **Trustworthy & professional**: this is a career tool — avoid overly playful visuals except in gamification areas (streaks, MCQ, badges).
- **Mobile-first**: majority of job seekers will browse on phones.
- **Fast perceived performance**: skeleton loaders everywhere data is fetched (job lists, profile, AI parsing).

## 2. Color Palette (Tailwind config tokens)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#2563EB` (blue-600) | Primary buttons, links, active states |
| `primary-dark` | `#1D4ED8` | Hover states |
| `secondary` | `#0F172A` (slate-900) | Headings, nav |
| `accent` | `#F59E0B` (amber-500) | Streak flame, gamification highlights, badges |
| `success` | `#16A34A` (green-600) | Applied status, correct MCQ answer |
| `error` | `#DC2626` (red-600) | Errors, wrong MCQ answer |
| `surface` | `#FFFFFF` | Cards |
| `surface-alt` | `#F8FAFC` (slate-50) | Page background |
| `border` | `#E2E8F0` (slate-200) | Card borders, dividers |
| `text-primary` | `#0F172A` | Main text |
| `text-secondary` | `#64748B` (slate-500) | Meta text (posted date, location) |

Dark mode (v1.1, optional): invert surface/background tokens, keep primary/accent same for brand consistency.

## 3. Typography
- Font: **Inter** (via next/font, self-hosted) — clean, highly legible for data-dense UI.
- Scale:
  - `text-3xl / font-bold` — Page titles (Dashboard, Job Detail company/role)
  - `text-xl / font-semibold` — Section headers, Job Card title
  - `text-base` — Body text
  - `text-sm` — Meta info (location, posted X days ago)
  - `text-xs` — Tags/badges (skill chips, filters)

## 4. Spacing & Layout
- Base spacing unit: 4px (Tailwind default scale).
- Max content width: `max-w-7xl` for desktop; full-bleed with `px-4` padding on mobile.
- Job listing layout: `grid` — 25% filter sidebar (collapsible drawer on mobile) + 75% job card list on desktop; single column stacked on mobile with filters in a bottom-sheet/modal.
- Card radius: `rounded-xl` (12px), subtle `shadow-sm`, `border border-border`.

## 5. Components (Tailwind + shadcn/ui recommended)
- **Job Card**: company logo, role title, company name, salary range badge, location + experience tags, "Easy Apply" button, save/bookmark icon.
- **Filter Sidebar**: accordion sections (Location, Pincode, Role, Experience, Salary), applied-filter chips at top with clear-all.
- **Profile Progress Bar**: shows % profile completeness to nudge completion after resume upload.
- **Streak Widget**: flame icon (`accent` color) + streak count, shown on dashboard header.
- **MCQ Card**: question, 4 options as selectable buttons, timer bar (optional), instant feedback (green/red).
- **Resume Upload Dropzone**: drag-and-drop, PDF-only validation, upload progress, "Parsing with AI..." loading state.
- **Badge/Chip**: skill tags, experience level, job type (Remote/Onsite/Hybrid).

## 6. Iconography
- Use `lucide-react` icon set throughout (consistent stroke style, lightweight).

## 7. Motion
- Subtle transitions only: `transition-all duration-150` on hover/focus.
- Streak increment: small celebratory micro-animation (scale/pulse on flame icon) — keep tasteful, not distracting.
- Skeleton loaders (pulse animation) for job list, profile, and AI-parsing states — never a blank screen.

## 8. Responsiveness Breakpoints (Tailwind defaults)
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px
- Bottom navigation bar (mobile only, app-like) for: Home/Jobs, Applications, Daily MCQ, Profile.
- Desktop: top navbar + sidebar layout.
