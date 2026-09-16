# techstack.md — CodifyPro Technology Stack (Aimtech Solutions)

## 1. Frontend
| Tech | Purpose |
|---|---|
| **Next.js (App Router)** | Unified frontend + backend (route handlers), SSR/SSG for SEO on job listing/detail pages |
| **Tailwind CSS** | Utility-first styling, matches `theme.md` design tokens |
| **shadcn/ui** | Accessible pre-built components (dialogs, dropdowns, forms) on top of Tailwind |
| **lucide-react** | Icon set |
| **React Hook Form + Zod** | Form handling + schema validation (profile forms, job ingestion review form) |
| **TanStack Query (React Query)** | Client-side data fetching/caching for jobs list, applications, etc. |

## 2. Backend
| Tech | Purpose |
|---|---|
| **Next.js Route Handlers (API routes)** | REST-style backend endpoints |
| **Mongoose** | MongoDB ODM — schema definitions for User, Profile, Job, Application, MCQ, DailyAttempt |
| **NextAuth.js** (or custom JWT with httpOnly cookies) | Authentication & session management, role-based access |
| **zod** | Runtime validation of AI JSON outputs before persisting (never trust raw model output) |
| **pdf-parse** (or similar) | Extract raw text from uploaded PDF resumes server-side |
| **sanitize-html** | Sanitize AI-extracted JD/HTML content before storing/rendering |
| **@react-pdf/renderer** (or Puppeteer/HTML-to-PDF) | Generate tailored/ATS resume PDFs from structured JSON |

## 3. Database & Storage
| Tech | Purpose |
|---|---|
| **MongoDB (Atlas)** | Primary datastore — users, profiles, jobs, applications, MCQ bank, attempts |
| **MongoDB Atlas Search** (optional) | Full-text/fuzzy search for recruiter candidate search & job search |
| **Redis (Upstash / Redis Cloud)** | Streak counters, daily-attempt flags, leaderboard (sorted sets), job-list query caching, rate limiting, session/JWT blacklist |
| **Cloudinary** | Resume PDFs, profile avatars, certificate files, company logos — auto-optimized delivery + PDF thumbnail previews |

## 4. AI / External Services
| Tech | Purpose |
|---|---|
| **AI Engine** | - Resume text → structured JSON profile extraction  <br> - Raw job text/HTML → structured JSON job fields  <br> - Tailored resume generation (JD-aware reordering + keyword injection)  <br> - ATS-friendly resume generation |
| **Apify** | Scheduled scraper actors to pull job listings from external job boards into an ingestion queue |
| Server-side `fetch` + a readability/HTML-parsing lib (e.g., `@mozilla/readability` + `jsdom`) | Extract clean main content from a pasted external job link before sending to AI Engine |

## 5. Infrastructure & DevOps
| Tech | Purpose |
|---|---|
| **Vercel** | Hosting for Next.js app (or self-hosted Node server as alternative) |
| **Vercel Cron / external scheduler** | Trigger Apify pulls, daily MCQ rotation, streak-risk reminder checks |
| **GitHub Actions** | CI (lint, type-check, test) on PRs |
| **Sentry** (optional) | Error monitoring in production |

## 6. Why This Stack
- **Next.js**: single codebase for frontend + backend, strong SEO for public job pages, easy Vercel deployment.
- **MongoDB**: flexible document schema suits varied/optional resume & job fields (experience arrays, dynamic AI-extracted fields) better than rigid relational tables.
- **Redis**: purpose-built for the high-frequency, ephemeral operations here — daily streak flags, leaderboards, caching hot job-list queries, and rate-limiting expensive AI calls.
- **Cloudinary**: offloads file storage/CDN delivery and gives free PDF/image transformations (thumbnails for resume previews, avatar resizing).
- **AI Engine**: chosen for fast low-latency inference — good fit for interactive flows like "parse my resume now" or "generate my tailored resume now" where the user is waiting on the result.

## 7. Suggested Repo Structure
```
/app
  /(auth)/login, /signup
  /(seeker)/dashboard, /profile, /jobs, /jobs/[id], /applications, /mcq, /resume-center
  /(recruiter)/dashboard, /search
  /(admin)/ingest, /jobs, /mcq-bank, /users, /analytics
  /api/...
/components
/lib          → db connection, redis client, cloudinary client, AI client, zod schemas
/models       → Mongoose schemas
/hooks
/styles
```
