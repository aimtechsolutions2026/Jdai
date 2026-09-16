# CodifyPro AI (Aimtech Solutions)

> **Next-Generation AI Career & Job Discovery Platform**  
> Built for high-impact software engineers, modern tech recruiters, and engineering teams. Powered by AI, MongoDB, Redis, and Next.js App Router.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![AI Engine](https://img.shields.io/badge/AI-Inference%20Engine-orange?style=flat)](https://aimtechsolutions.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis%20%2F%20Upstash-red?style=flat&logo=redis)](https://upstash.com/)

---

## 🌟 Executive Overview

**CodifyPro AI** (developed by **Aimtech Solutions**) is an enterprise-grade SaaS platform engineered to eliminate friction in modern technical hiring:
- **For Job Seekers**: 1-click AI resume parsing (PDF to structured profile), daily high-yield DSA & aptitude challenges with streak gamification, 1-click Easy Apply, and ATS-optimized resume exports.
- **For Recruiters**: Multi-skill talent search filtering by verified tech stack, experience depth, continuous daily challenge activity, and direct resume PDF access.
- **For Admins**: Multi-source AI Job Ingestion engine supporting raw text and external job URLs with structured AI extraction and an interactive review/publish workflow.

---

## ✨ Core Feature Set

### 1. Job Seeker Hub
- **AI Resume Parsing (`/profile`)**: Drag-and-drop PDF-only intake. Server text extraction via `pdf-parse` and AI extraction validated strictly against `zod` schemas.
- **Profile Completeness Tracker**: Real-time completeness score (0–100%) nudging users toward verified candidate status.
- **Editable Profile Management**: Modular sections for work experience, education, interactive skill chips, certifications, and target salary ranges.
- **Resume Center (`/resume-center`)**: Direct download of original PDF resumes and instant generation/compilation of clean single-column ATS-friendly resumes.
- **Job Discovery & Easy Apply (`/jobs`, `/jobs/[id]`)**: Responsive catalog with workplace type filters (Remote, Hybrid, Onsite), location dropdown, salary slider, and 1-click application submission.
- **Application Tracking (`/applications`)**: Status timeline tracking (`Applied`, `Viewed`, `Shortlisted`).

### 2. Gamified Daily MCQ & Streak Engine (`/mcq`)
- **Daily Challenge**: Question of the day covering Data Structures, Algorithms, Complexity (Big-O), and System Design.
- **Interactive Feedback**: Instant evaluation with green/red status, detailed technical explanation, and +25 XP rewards.
- **Redis-Backed Attempt Lock**: Enforces a single daily attempt per user (`daily:{userId}:{YYYY-MM-DD}`).
- **Streak & Consistency**: Consecutive-day streak tracking with flame micro-animations, a 14-day activity heatmap, and a weekly XP leaderboard.

### 3. Recruiter Talent Discovery (`/recruiter/search`, `/recruiter/dashboard`)
- **Multi-Tag Skill Filtering**: Target candidates with specific stacks (e.g. React, Next.js, Go, Kubernetes, AWS, PostgreSQL).
- **Candidate Result Cards**: Summary of current role, experience depth, verified skills, and streak scores.
- **Candidate Profile Inspection Modal**: Read-only profile view with full employment timeline, education, and resume PDF download link.

### 4. Admin Job Ingestion & Management (`/admin/ingest`, `/admin/jobs`)
- **Multi-Source Ingestion**:
  - **Paste Raw Text**: Extracts role, company, salary, experience, and sanitized HTML descriptions from unstructured text.
  - **Paste External Link**: Scrapes job page HTML, cleans content, and normalizes fields via AI.
  - **Apify Scraper Queue**: Stubbed webhook receiver ready for scheduled scraper actors.
- **Review & Publish Workflow**: Admin can review and refine all AI-extracted fields before publishing live.
- **MCQ Question Bank (`/admin/mcq-bank`)**: Full CRUD management for challenge questions with category tags and difficulty levels.
- **User Moderation (`/admin/users`)**: Directory of registered job seekers, recruiters, and admins.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | Unified SSR/SSG frontend + server route handlers |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Design tokens matching `theme.md` (clean, zero clutter) |
| **Database** | MongoDB via Mongoose | Flexible document store for Users, Profiles, Jobs, Applications, MCQs |
| **Cache & Realtime** | Redis (Upstash / ioredis) | Daily attempt lockout, streak counters, and rate limiting |
| **AI Inference** | AI Inference Engine | Low-latency structured JSON resume parsing and job extraction |
| **Validation** | Zod | Runtime schema validation of all AI outputs and forms |
| **File Storage** | Cloudinary | Cloud PDF/image storage with local data URI fallback |
| **Authentication** | JWT (`jose`) + `bcryptjs` | Role-based route protection via Edge Middleware |

---

## 📁 Repository Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx               # Sign in + 1-click demo accounts
│   │   └── signup/page.tsx              # Role selection (Seeker vs Recruiter)
│   ├── (seeker)/
│   │   ├── dashboard/page.tsx           # Seeker KPI hub & recommendations
│   │   ├── profile/page.tsx             # Resume upload dropzone & profile editor
│   │   ├── jobs/
│   │   │   ├── page.tsx                 # Job search & filter sidebar
│   │   │   └── [id]/page.tsx            # Job detail, sanitized JD, Easy Apply
│   │   ├── applications/page.tsx        # Submitted applications tracking
│   │   ├── mcq/page.tsx                 # Daily challenge, streak flame, heatmap
│   │   └── resume-center/page.tsx       # Original & ATS resume downloads
│   ├── (recruiter)/
│   │   ├── recruiter/dashboard/page.tsx # Recruiter analytics & quick search
│   │   └── recruiter/search/page.tsx    # Candidate multi-skill search
│   ├── (admin)/
│   │   ├── admin/ingest/page.tsx        # Multi-source AI job intake
│   │   ├── admin/jobs/page.tsx          # Job management & status toggles
│   │   ├── admin/mcq-bank/page.tsx      # MCQ question bank CRUD
│   │   └── admin/users/page.tsx         # User moderation directory
│   ├── api/
│   │   ├── auth/                        # login, signup, me, logout
│   │   ├── profile/                     # GET / PUT seeker profile
│   │   ├── resume/upload/               # PDF upload & AI parsing
│   │   ├── jobs/                        # list, detail, ingest link/text
│   │   ├── applications/                # Easy Apply & my applications
│   │   ├── mcq/                         # today, submit, question bank
│   │   ├── streak/                      # streak stats & leaderboard
│   │   ├── recruiter/search/            # candidate search
│   │   └── seed/                        # database seeder endpoint
│   ├── layout.tsx                       # Root layout with Inter font & Navbars
│   ├── page.tsx                         # High-converting public landing page
│   └── globals.css                      # Custom scrollbar & design tokens
├── components/
│   ├── ui/                              # Button, Badge, Card, Input, Modal, Skeleton
│   ├── layout/                          # Desktop Navbar, MobileBottomNav, Footer
│   └── landing/                         # HeroSection, Features, FAQ, Pricing
├── lib/
│   ├── db.ts                            # Mongoose connection with caching
│   ├── redis.ts                         # Redis client with in-memory TTL fallback
│   ├── groq.ts                          # AI client & heuristic fallbacks
│   ├── auth.ts                          # JWT sign/verify with jose & bcryptjs
│   ├── zod-schemas.ts                   # Strict schemas for AI extraction
│   ├── repositories.ts                  # Repository layer bridging Mongo & memory
│   ├── seed-data.ts                     # Initial rich jobs, MCQs, and profiles
│   └── utils.ts                         # Formatting helpers & cn()
├── models/                              # User, SeekerProfile, Job, Application, MCQ, DailyAttempt
├── middleware.ts                        # Edge route guard for role-based access
├── tailwind.config.ts                   # Design system tokens from theme.md
└── package.json
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ (tested on Node v22)
- **npm** or **pnpm**

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root (see `.env.example`):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/codifypro

# Redis (Upstash or local Redis)
REDIS_URL=redis://localhost:6379
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Authentication
JWT_SECRET=super-secret-jwt-key-codifypro-2026
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Engine
GROQ_API_KEY=

# Cloudinary (Optional: data URI fallback active if unset)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **Note**: The application is built with zero-friction development in mind. If external keys (`GROQ_API_KEY`, `MONGODB_URI`, `REDIS_URL`) are omitted, smart local fallbacks and rich seed data automatically activate so the entire platform remains 100% interactive.

### 4. Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Demo Accounts & Quick Evaluation

To test all role workflows without registration, visit **`/login`** and use the **1-Click Instant Demo Access** buttons:

| Role | Email | Password | Primary Route | Capabilities |
|---|---|---|---|---|
| **Job Seeker** | `seeker@codifypro.ai` | `demopassword123` | `/dashboard` | Upload resume, view ATS format, browse jobs, Easy Apply, solve daily MCQ |
| **Recruiter** | `recruiter@codifypro.ai` | `demopassword123` | `/recruiter/dashboard` | Search candidates by skill tags, inspect verified profiles & resumes |
| **Admin** | `admin@codifypro.ai` | `demopassword123` | `/admin/ingest` | Paste job text/links for AI extraction, manage jobs & MCQ bank |

---

## 🔒 Route Protection & Middleware

Next.js Edge Middleware (`middleware.ts`) automatically enforces role-based access:
- `/dashboard`, `/profile`, `/applications`, `/resume-center` → Requires authenticated session.
- `/recruiter/*` → Strictly restricted to users with `recruiter` or `admin` roles.
- `/admin/*` → Strictly restricted to users with `admin` role.
- Unauthenticated visitors attempting to access guarded routes are redirected to `/login?returnUrl=...`.

---

## 📋 API Route Summary

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/signup` | POST | Public | User registration with role selection |
| `/api/auth/login` | POST | Public | User login & JWT cookie issuance |
| `/api/auth/me` | GET | Authenticated | Current user & profile metadata |
| `/api/auth/logout` | POST | Authenticated | Clears auth session cookie |
| `/api/profile` | GET / PUT | Seeker | Fetch and update candidate profile |
| `/api/resume/upload` | POST | Seeker | PDF upload, text extraction, AI parsing |
| `/api/jobs` | GET / POST | Public / Admin | Filter jobs (GET), create job (POST) |
| `/api/jobs/[id]` | GET / PUT / DELETE | Public / Admin | Retrieve, update, or archive specific job |
| `/api/jobs/ingest/paste` | POST | Admin | AI extraction from raw job description text |
| `/api/jobs/ingest/link` | POST | Admin | Web scraper & AI extraction from external URL |
| `/api/applications` | GET / POST | Seeker | List applications (GET), Easy Apply (POST) |
| `/api/mcq/today` | GET | Public / Seeker | Question of the day with attempt status |
| `/api/mcq/submit` | POST | Seeker | Answer evaluation & streak increment |
| `/api/mcq/bank` | GET / POST | Admin | MCQ question bank CRUD |
| `/api/streak` | GET | Public / Seeker | Streak stats, heatmap, and leaderboard |
| `/api/recruiter/search`| GET | Recruiter | Multi-skill candidate discovery |
| `/api/admin/users` | GET | Admin | User directory & verification statuses |
| `/api/seed` | GET | Public | Database seeder for demo data |

---

## 🗺️ Roadmap & Phase Phasing

- **Phase 1 (Completed MVP)**: Full Auth, AI Resume Parsing, Seeker Profile, Job Discovery & Easy Apply, Admin Ingestion (paste-text, paste-link), Daily MCQ & Redis streak tracking, Recruiter Candidate Search, Full Landing Page.
- **Phase 2 (Extension Stubs Ready)**: Automated Apify scraper actor integration, dynamic per-job tailored resume generator via `@react-pdf/renderer`, full XP leaderboard, analytics dashboard.
- **Phase 3**: In-app notifications, candidate bookmark shortlists, adaptive MCQ difficulty, dark mode toggle.

---

## 📄 License
This project is proprietary software developed for the CodifyPro AI platform by Aimtech Solutions.
