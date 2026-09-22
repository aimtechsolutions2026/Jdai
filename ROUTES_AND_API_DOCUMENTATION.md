# CodifyPro — Complete Route & API Architecture Documentation
**Platform**: CodifyPro by Aimtech Solutions  
**Framework**: Next.js 14 App Router (React 18 + Node.js 20 Serverless / Containerized Runtime)  
**Database**: MongoDB Atlas via Mongoose with in-memory cache fallback  
**Authentication**: Stateless JSON Web Tokens (JOSE) via HTTP-only cookie (`codifypro_token`)  
**AI Intelligence Engine**: Groq SDK (`llama-3.3-70b-versatile`) with dual-tier heuristic fallback  

---

## 1. System Architecture & Access Control Overview

CodifyPro implements a strict Role-Based Access Control (RBAC) model enforced at both the Edge middleware layer ([`middleware.ts`](./middleware.ts)) and internal API route handlers.

### User Roles & Permissions:
1. **Guest / Public**: Unauthenticated visitors can view landing pages, browse job listings, inspect job descriptions, and view public ATS resumes. Applications and profile actions require signing in.
2. **Job Seeker (`seeker`)**: Verified candidates who upload resumes, manage profiles, track job applications, solve daily technical MCQs, maintain streaks, and export ATS-optimized resumes.
3. **Recruiter (`recruiter`)**: Verified hiring managers who post jobs, search the verified candidate talent pool with multi-criteria filters, and review applicant submissions.
4. **Admin (`admin`)**: Platform administrators with access to system analytics, user account management, AI job ingestion tools (raw text & web URL scrapers), and the MCQ question bank.

---

## 2. Frontend Page Routes Index (`app/`)

| Route URL | Component File | Access Level | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `/` | [`app/page.tsx`](./app/page.tsx) | **Public** | Marketing landing page, platform value proposition, feature highlights, and CTA. |
| `/login` | [`app/(auth)/login/page.tsx`](./app/(auth)/login/page.tsx) | **Public** (Redirects if auth) | User authentication supporting email or phone number + password with Brevo-backed "Forgot Password" flow. |
| `/reset-password` | [`app/(auth)/reset-password/page.tsx`](./app/(auth)/reset-password/page.tsx) | **Public** | Token-verified password reset interface with password complexity enforcement. |
| `/signup` | [`app/(auth)/signup/page.tsx`](./app/(auth)/signup/page.tsx) | **Public** (Redirects if auth) | Account creation with password constraints, mandatory phone, terms checkbox, and role selector. Clean "Enter" placeholders. |
| `/dashboard` | [`app/(seeker)/dashboard/page.tsx`](./app/(seeker)/dashboard/page.tsx) | **Seeker** | **My Dashboard**: Candidate command center featuring personal details editor, password security, account activation/deactivation, account deletion requests, streak counter, and automated recommendations. |
| `/jobs` | [`app/(seeker)/jobs/page.tsx`](./app/(seeker)/jobs/page.tsx) | **Public** (Next.js ISR `revalidate = 60`) | Searchable job discovery directory with keyword search, workplace filters, and pagination. Cached and revalidated at the edge. |
| `/jobs/[id]` | [`app/(seeker)/jobs/[id]/page.tsx`](./app/(seeker)/jobs/[id]/page.tsx) | **Public** (Next.js ISR `revalidate = 60`, `dynamicParams = true`) | Job description view, compensation, required skills, external link / 1-click apply, share button. Pre-rendered with on-demand ISR fallback. |
| `/profile` | [`app/(seeker)/profile/page.tsx`](./app/(seeker)/profile/page.tsx) | **Seeker** | Comprehensive candidate profile editor, dual-tier AI PDF resume parser, ATS modal trigger, share link. |
| `/resume-center` | [`app/(seeker)/resume-center/page.tsx`](./app/(seeker)/resume-center/page.tsx) | **Seeker** | Resume management hub: download original PDF, compile ATS format, public share link. |
| `/resume/[id]` | [`app/resume/[id]/page.tsx`](./app/resume/[id]/page.tsx) | **Public** (Next.js ISR `revalidate = 60`, `dynamicParams = true`) | Public shareable ATS resume viewer: clean layout, copy text, print/PDF export, guest CTA. On-demand ISR cached. |
| `/applications` | [`app/(seeker)/applications/page.tsx`](./app/(seeker)/applications/page.tsx) | **Seeker** | Real-time tracker for candidate submitted job applications and recruitment stages. |
| `/mcq` | [`app/(seeker)/mcq/page.tsx`](./app/(seeker)/mcq/page.tsx) | **Seeker** | Daily technical multiple-choice question challenge, explanation modal, streak increment. |
| `/notifications`| [`app/(seeker)/notifications/page.tsx`](./app/(seeker)/notifications/page.tsx) | **Seeker** | Dedicated notification center backed by precomputed MongoDB `notifications` collection with instant mark-read. |
| `/recruiter/dashboard` | [`app/(recruiter)/recruiter/dashboard/page.tsx`](./app/(recruiter)/recruiter/dashboard/page.tsx) | **Recruiter / Admin** | Recruiter pipeline: active job postings, candidate submissions, applicant review. |
| `/recruiter/search` | [`app/(recruiter)/recruiter/search/page.tsx`](./app/(recruiter)/recruiter/search/page.tsx) | **Recruiter / Admin** | Candidate search directory: filter by skills, experience, location, compensation. |
| `/admin` | [`app/(admin)/admin/page.tsx`](./app/(admin)/admin/page.tsx) | **Admin** | Administrator dashboard: system telemetry, user counts, application counts, active listings. |
| `/admin/jobs` | [`app/(admin)/admin/jobs/page.tsx`](./app/(admin)/admin/jobs/page.tsx) | **Admin** | Administrative job listings table: create, edit, activate, deactivate, or delete postings. |
| `/admin/ingest` | [`app/(admin)/admin/ingest/page.tsx`](./app/(admin)/admin/ingest/page.tsx) | **Admin** | **AI Job Ingestion Hub**: Extract jobs via raw text paste or URL scraper with Groq LLM. |
| `/admin/mcq-bank` | [`app/(admin)/admin/mcq-bank/page.tsx`](./app/(admin)/admin/mcq-bank/page.tsx) | **Admin** | Question repository management: add, edit, schedule, or retire daily MCQ challenges. |
| `/admin/users` | [`app/(admin)/admin/users/page.tsx`](./app/(admin)/admin/users/page.tsx) | **Admin** | User administration directory: view profiles, adjust roles, verify accounts. |
| `/terms` | [`app/terms/page.tsx`](./app/terms/page.tsx) | **Public** | Complete Terms and Conditions with all 17 legal sections. |
| `/privacy` | [`app/privacy/page.tsx`](./app/privacy/page.tsx) | **Public** | Complete Privacy Policy with all 12 sections and data disclosure table. |

---

## 3. Backend API Endpoints Index (`app/api/`)

### A. Authentication & Session APIs
| Endpoint | Method | Auth Required | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | None (Public) | Registers new user (`seeker` or `recruiter`). Enforces password constraints, mandatory phone, terms acceptance, hashes password with bcrypt, initializes profile, and sets JWT cookie. |
| `/api/auth/login` | `POST` | None (Public) | Authenticates user using **either email or phone number** + password. Issues signed JWT cookie (`codifypro_token`). |
| `/api/auth/logout` | `POST` | Authenticated | Clears the session cookie (`codifypro_token`), invalidating current browser session. |
| `/api/auth/me` | `GET` | Authenticated | Validates session token and returns active user's identity, role, phone, active status, deletion request state, and verified status. |
| `/api/auth/me` | `PUT` | Authenticated | Updates personal identity details (full name and phone number) in user record and candidate profile. |
| `/api/auth/forgot-password` | `POST` | None (Public) | Generates a 1-hour secure password reset token and sends an email via Brevo transactional mail API. |
| `/api/auth/reset-password` | `POST` | None (Public) | Validates reset token against database, checks expiry, validates new password complexity, and resets password hash. |
| `/api/auth/change-password` | `PUT` | Authenticated | Validates current password via bcrypt, verifies new password complexity rules, and updates password hash. |
| `/api/auth/account-status` | `PUT` | Authenticated | Toggles account discoverability status (`isActive = true | false`). Hides/shows candidate from recruiter search. |
| `/api/auth/account-status` | `POST` | Authenticated | Submits an account deletion request (`action: 'request_deletion'`) with optional reason or cancels a pending request (`action: 'cancel_deletion'`). |

---

### B. Job Management & Discovery APIs (Edge Cached)
| Endpoint | Method | Auth Required | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `/api/jobs` | `GET` | None (Public) | Returns paginated, searchable job listings with query filters: `search`, `role`, `location`, `jobType`, `page`, `limit`. **Cache-Control**: `public, s-maxage=60, stale-while-revalidate=300`. |
| `/api/jobs` | `POST` | Recruiter / Admin | Validates input against `JobCreateSchema` and creates a new live job posting in MongoDB. Dispatches `job_match` notifications to active seekers. |
| `/api/jobs/[id]` | `GET` | None (Public) | Retrieves complete job details including role, company, sanitized JD, salary range, and requirements. **Cache-Control**: `public, s-maxage=60, stale-while-revalidate=300`. |
| `/api/jobs/[id]` | `PUT` | Recruiter / Admin | Updates existing job listing fields, salary, or application mode. Uncached write endpoint. |
| `/api/jobs/[id]` | `DELETE` | Recruiter / Admin | Permanently removes or archives a job posting. Uncached write endpoint. |

---

### C. Artificial Intelligence Ingestion & Extraction APIs (Non-blocking Asynchronous Architecture)
| Endpoint | Method | Auth Required | AI Engine & Description |
| :--- | :--- | :--- | :--- |
| `/api/jobs/ingest/paste` | `POST` | Admin | **Asynchronous Job Ingestion**: Accepts raw pasted text, persists an `ingestion_jobs` record in MongoDB, dispatches background Groq LLM worker, and returns immediate HTTP 202 `{ success: true, jobId, status: "processing" }`. |
| `/api/jobs/ingest/link` | `POST` | Admin | **Asynchronous URL Ingestion**: Accepts external job URL, validates HTTP/HTTPS format, persists `ingestion_jobs` record, dispatches scraper + Groq worker, and returns immediate HTTP 202 `{ success: true, jobId, status: "processing" }`. |
| `/api/jobs/ingest/status/[jobId]` | `GET` | Admin | **Job Ingestion Status Polling**: Returns `{ success: true, jobId, type, status: "processing"|"completed"|"failed", result: { extracted }, error }`. Polled by frontend every 2-3s. |
| `/api/resume/upload` | `POST` | Seeker | **Asynchronous PDF Parser**: Receives uploaded PDF resume, extracts raw text completely in-memory (zero disk persistence), creates `ingestion_jobs` record, dispatches background Groq + heuristics worker, and returns immediate HTTP 202 `{ success: true, jobId, status: "processing" }`. |
| `/api/resume/status/[jobId]` | `GET` | Seeker | **Resume Status Polling**: Returns `{ success: true, jobId, type: "resume", status: "processing"|"completed"|"failed", result: { parsedData, profile }, error }`. Polled by profile frontend every 2s to auto-populate fields. |

---

### D. Candidate Profile & Resume APIs
| Endpoint | Method | Auth Required | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `/api/profile` | `GET` | Seeker | Retrieves the logged-in candidate's verified profile data, streak stats, and completeness score. |
| `/api/profile` | `PUT` | Seeker | Validates against `ProfileUpdateSchema` and persists profile updates, skills, history, and salary preferences. |
| `/api/resume/public/[id]` | `GET` | **None (Public)** | Publicly serves candidate summary, technical skills, experience history, projects, and credentials without requiring authentication. **Cache-Control**: `public, s-maxage=60, stale-while-revalidate=300`. |

---

### E. Applications, Gamification & Precomputed Event-Driven Notifications APIs
| Endpoint | Method | Auth Required | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `/api/applications` | `GET` | Authenticated | **Seeker**: Returns user's active job applications and statuses.<br>**Recruiter/Admin**: Returns candidates who applied to recruiter's jobs. |
| `/api/applications` | `POST` | Seeker | Submits application. Triggers `application_update` notification for candidate and `recruiter_update` for recruitment staff. |
| `/api/applications` | `PUT` | Recruiter / Admin | Updates application status. Triggers `application_update` status update notification for candidate. |
| `/api/mcq/today` | `GET` | Seeker | Delivers today's active technical multiple-choice challenge. |
| `/api/mcq/submit` | `POST` | Seeker | Evaluates submitted answer, records attempt, calculates accuracy, increments daily streak, and awards XP. Triggers `streak` notification when completed. |
| `/api/mcq/bank` | `GET` / `POST` | Admin | Admin endpoint to manage, add, or rotate the technical question repository. |
| `/api/streak` | `GET` | Seeker | Checks candidate's daily streak status, longest streak, and whether today's challenge is completed. |
| `/api/notifications` | `GET` | Authenticated | **Fast Indexed Read**: Reads precomputed notifications from MongoDB `notifications` collection (`userId`, sorted by `createdAt: -1`). Zero live join overhead. |
| `/api/notifications` | `PUT` | Authenticated | **Batch Mark All Read**: Marks all unread notifications for authenticated user as read. |
| `/api/notifications/[id]/read` | `PATCH` / `PUT` | Authenticated | Marks a specific notification as read in MongoDB. |
| `/api/notifications/read-all` | `PUT` / `POST` | Authenticated | Batch mark-all-read endpoint. |

---

### F. Recruiter & Admin Management APIs
| Endpoint | Method | Auth Required | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `/api/recruiter/search` | `GET` | Recruiter / Admin | Searches verified candidates with multi-facet filters: `skills`, `minExperience`, `maxSalary`, `location`. |
| `/api/admin/stats` | `GET` | Admin | Computes platform KPI metrics (total users, active seekers, verified recruiters, jobs, applications). Cached in Redis (`admin:stats`, TTL: 90s) with live DB fallback on outage. |
| `/api/admin/users` | `GET` / `PUT` | Admin | Lists all user accounts and allows administrators to modify roles or update verification statuses. |

---

### G. System Maintenance, Health & Cron APIs
| Endpoint | Method | Auth Required | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | None (Public) | Unauthenticated liveness probe returning HTTP 200, system uptime, and initializes the 10-minute recurring background cron. |
| `/api/cron` | `GET` / `POST` | None (Public/Webhook) | Executes the 10-minute recurring maintenance task immediately on demand (MongoDB ping, self-ping keep-alive) and ensures internal timers are active. Configured with Vercel Cron. |
| `/api/seed` | `GET` / `POST` | None | Permanently disabled endpoint returning `{ seeded: false }` to prevent demo data injection. |

---

## 4. In-Depth Endpoint Specifications

### 1. `POST /api/auth/signup`
- **Purpose**: Creates an account with strict security validation.
- **Request Body**:
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "phone": "+15550001234",
    "password": "Password123",
    "role": "seeker",
    "termsAccepted": true
  }
  ```
- **Validation Rules**:
  - `email`: Valid RFC email, checked against existing accounts in database.
  - `phone`: Required, minimum 8 digits, checked against existing accounts.
  - `password`: Minimum 8 characters, at least one uppercase `[A-Z]`, one lowercase `[a-z]`, and one number `[0-9]`.
  - `termsAccepted`: Must be `true`.
- **Response**: Sets HTTP-only `codifypro_token` cookie and returns `{ success: true, user: { id, email, name, role } }`.

---

### 2. `POST /api/auth/login`
- **Purpose**: Authenticates users with dual-identifier support.
- **Request Body**:
  ```json
  {
    "email": "alex@example.com", // Or mobile number: "+15550001234"
    "password": "Password123"
  }
  ```
- **Execution**: Uses `UserRepository.findByEmailOrPhone(identifier)`. If identifier contains `@`, searches email; otherwise, cleans digits and matches phone number.
- **Response**: Sets HTTP-only `codifypro_token` cookie and returns user session object.

---

### 3. `POST /api/resume/upload` & `GET /api/resume/status/[jobId]` (Async AI Dual-Tier Parser)
- **Purpose**: High-precision, non-blocking extraction of candidate resume into structured database format.
- **Request**: Multipart form data with `file` (PDF format only, maximum 10MB).
- **Processing Architecture**:
  1. In-memory buffer extraction via `pdf-parse` (memory-safe, raw file is never persisted to disk, buffer is garbage-collected immediately).
  2. Creates a job record in MongoDB `ingestion_jobs` (`type: "resume"`, `status: "processing"`, `userId`, `inputRef: "resume.pdf"`).
  3. Returns immediate HTTP 202 `{ success: true, jobId, status: "processing" }` within <100ms.
  4. Triggers background worker `processResumeJob(jobId, extractedText, session)`.
  5. **Tier 1 (Groq LLM)**: Calls `llama-3.3-70b-versatile` with an explicit JSON schema prompt instructing strict extraction without summarizing. Automatically detects salary in `INR` (LPA) or `USD`.
  6. **Tier 2 (Heuristic Engine)**: If Groq encounters rate limits or network latency, regex/lexical scanner extracts name, emails, phone numbers, LinkedIn/GitHub links, 130+ tech skills, job roles, date ranges, institutions, and certifications.
  7. **Intelligent Merge**: Merges AI output with heuristics to ensure zero empty arrays, computes profile completeness score, updates candidate profile, and sets `ingestion_jobs` status to `"completed"`.
- **Status Polling (`GET /api/resume/status/[jobId]`)**:
  - Frontend polls every 2 seconds.
  - Returns:
    ```json
    {
      "success": true,
      "jobId": "664f...",
      "type": "resume",
      "status": "completed",
      "result": {
        "parsedData": {
          "name": "Jane Doe",
          "headline": "Senior Full-Stack Engineer",
          "skills": ["React", "TypeScript", "Node.js", "MongoDB", "AWS"],
          "experience": [...],
          "education": [...],
          "projects": [...],
          "certificates": [...]
        },
        "profile": { ... }
      }
    }
    ```

---

### 4. `POST /api/jobs/ingest/paste`, `POST /api/jobs/ingest/link` & `GET /api/jobs/ingest/status/[jobId]`
- **Purpose**: Automated, non-blocking structuring of unstructured job requisitions.
- **Payload (`paste`)**: `{ "text": "Full job description text..." }` (minimum 20 chars).
- **Payload (`link`)**: `{ "url": "https://company.com/careers/role-123" }`.
- **Immediate Response**: HTTP 202 `{ success: true, jobId, status: "processing" }`.
- **Background Worker**:
  - For text paste: Runs Groq LLM `extractJobWithGroq` + heuristic fallback.
  - For link: Scrapes webpage HTML, extracts textual body, runs Groq LLM + heuristic fallback.
  - Extracts: `companyName`, `role`, `salaryRange` (min, max, currency), `experienceRequired` (min, max), `location`, `jobType` (`remote`/`onsite`/`hybrid`), `applyMode`, and `skills`.
  - Updates job status to `"completed"` with `result: { extracted: { ... } }`.
- **Status Polling (`GET /api/jobs/ingest/status/[jobId]`)**:
  - Admin UI polls every 2 seconds and displays a live spinner.
  - Once completed, loads `extractedDraft` into the Review & Verify panel.

---

### 5. `GET /api/resume/public/[id]`
- **Purpose**: Direct public access to candidate profile without authentication.
- **URL Parameter**: `id` can be either the MongoDB `_id` or candidate `userId`.
- **Return**: Sanitized public portfolio payload: candidate headline, summary, core skills, projects, work experience, education, certifications, and social links. Excludes sensitive account credentials.

---

### 6. `GET /api/cron` & 10-Minute Recurring Service
- **Purpose**: Prevents free-tier hosting (Render) from sleeping after 15 minutes of inactivity and preserves MongoDB connection pools.
- **Implementation**:
  - Node.js runtime starts a persistent 10-minute (`600,000ms`) `setInterval` via `timer.unref()`.
  - Pings `/api/health` and verifies `connectToDatabase()`.
  - Also triggered natively by Vercel Cron via `vercel.json` (`*/10 * * * *`).
- **Response**:
  ```json
  {
    "success": true,
    "message": "10-minute cron task executed successfully",
    "schedule": "every 10 minutes",
    "intervalMs": 600000,
    "lastRun": "2026-09-22T06:33:00.000Z",
    "status": {
      "timestamp": "2026-09-22T06:33:00.000Z",
      "dbConnected": true,
      "pingStatus": "ok (200)"
    }
  }
  ```

---

## 5. Security & Edge Middleware Matrix ([`middleware.ts`](./middleware.ts))

The Next.js edge middleware evaluates every incoming HTTP request matching route patterns:

```
Matcher: [
  "/dashboard/:path*",
  "/applications/:path*",
  "/resume-center/:path*",
  "/profile/:path*",
  "/notifications/:path*",
  "/recruiter/:path*",
  "/admin/:path*",
  "/login",
  "/signup"
]
```

1. **Guest Isolation**: Any unauthenticated request to `/dashboard`, `/profile`, `/applications`, `/resume-center`, `/notifications`, `/recruiter/*`, or `/admin/*` is immediately redirected to `/login?returnUrl=<target-path>`.
2. **Role Isolation**:
   - `seeker` attempting to enter `/recruiter/*` $\rightarrow$ Redirected to `/dashboard`.
   - `seeker` or `recruiter` attempting to enter `/admin/*` $\rightarrow$ Redirected to respective dashboard.
3. **Public Access Guaranteed**:
   - `/`, `/jobs`, `/jobs/[id]`, `/resume/[id]`, `/terms`, `/privacy`, `/api/health`, `/api/cron`, and `/api/resume/public/*` are completely open and bypass authentication barriers.

---

## 6. MongoDB Indexing Architecture & Query Optimization Matrix

To guarantee sub-10ms query execution across read-heavy endpoints and eliminate unanchored `$regex` table scans (`COLLSCAN`), the schema indexing layer was overhauled:

### 1. Authentication (`POST /api/auth/login` via `UserRepository.findByEmailOrPhone`)
- **Index Definitions**:
  - `UserSchema.index({ email: 1 }, { unique: true });`
  - `UserSchema.index({ phone: 1 }, { unique: true, sparse: true });`
- **Optimization Rationale**:
  - `email` guarantees $O(1)$ unique lookup.
  - The `sparse: true` modifier on `phone` prevents duplicate key errors (`E11000`) for legacy records or users without phone numbers, while strictly enforcing uniqueness for all provided phone numbers.

### 2. Job Discovery & Full-Text Search (`GET /api/jobs` via `JobRepository.findMany`)
- **Weighted Text Search Index**:
  ```typescript
  JobSchema.index(
    { role: "text", skills: "text", companyName: "text", jd: "text" },
    { weights: { role: 10, skills: 5, companyName: 3, jd: 1 }, name: "JobTextSearchIndex" }
  );
  ```
- **Compound ESR Filter & Sort Indexes**:
  - `{ status: 1, postedAt: -1 }` — Feed browse sorted by recency.
  - `{ status: 1, jobType: 1, postedAt: -1 }` — Workplace filter + sort.
  - `{ status: 1, location: 1, postedAt: -1 }` — Location filter + sort.
  - `{ status: 1, jobType: 1, location: 1, postedAt: -1 }` — Multi-facet filter + sort.
- **Scan Elimination**:
  Replaced unanchored $O(N)$ `$regex` collection scan on `$or: [{ role }, { companyName }, { skills }]` with index-backed MongoDB `$text: { $search: filters.search }`. Eliminates in-memory sort buffering (`SORT_KEY_GENERATOR`).
- **Pagination Strategy Note**:
  For extreme scale ($N > 10,000$ records), cursor-based keyset pagination `{ postedAt: { $lt: cursorDate }, _id: { $lt: cursorId } }` is recommended to prevent offset skipping overhead (`.skip().limit()`).

### 3. Recruiter Candidate Search (`GET /api/recruiter/search` via `ProfileRepository.searchCandidates`)
- **Compound Multikey Indexes**:
  - `SeekerProfileSchema.index({ skills: 1, location: 1 });`
  - `SeekerProfileSchema.index({ skills: 1, location: 1, "salaryExpectation.max": 1 });`
  - `SeekerProfileSchema.index({ skills: 1, location: 1, minExperience: 1 }, { sparse: true });`
- **Atlas Search vs. Compound B-Tree Index Evaluation**:
  - **Compound B-Tree Indexes (Current)**:
    - Zero external dependency; functions across local MongoDB Community, Docker, and MongoDB Atlas.
    - Synchronous write-to-read consistency (no indexing lag).
    - Single-digit millisecond latency for exact match candidate queries with candidate pools $< 50,000$.
  - **MongoDB Atlas Search ($search with Lucene)**:
    - Recommended for Phase 2 when talent pools exceed 50,000 candidates.
    - Provides native Levenshtein typo-tolerance (`fuzzy`), synonym dictionaries (e.g., "Golang" = "Go", "k8s" = "Kubernetes"), and dynamic faceted count badges.

---

## 7. Account Management, Security & Brevo Email Service

### 1. Brevo Transactional Email Integration (`lib/brevo.ts`)
- **Protocol**: Direct HTTPS REST calls to Brevo API v3 (`https://api.brevo.com/v3/smtp/email`) with `api-key` authentication.
- **Zero-Dependency Architecture**: Uses standard native `fetch`, eliminating bulky external SMTP or SDK dependencies.
- **Simulation Mode**: When `BREVO_API_KEY` is omitted or empty in `.env`, the service automatically falls back to secure simulation mode, logging the generated password reset link to the server console for local testing.

### 2. Password Recovery Lifecycle
1. **Request Reset (`POST /api/auth/forgot-password`)**:
   - Accepts user email.
   - Generates a cryptographically secure 32-byte hexadecimal token (`crypto.randomBytes(32)`).
   - Persists `resetPasswordToken` and `resetPasswordExpires` (1 hour) on the `User` document.
   - Dispatches HTML & plain-text reset email via `sendPasswordResetEmail`.
   - Returns generic success message to prevent user enumeration attacks.
2. **Execute Reset (`POST /api/auth/reset-password`)**:
   - Accepts token and new password.
   - Enforces 4-point password complexity: $\ge 8$ characters, uppercase, lowercase, and numbers.
   - Hashes new password using `bcryptjs` (salt rounds: 10).
   - Clears the token and expiration dates upon successful update.

### 3. Job Seeker "My Dashboard" & Account Lifecycle
- **Personal Details Management**:
  - `GET /api/auth/me` outputs full identity: name, email, phone, role, verified status, active status, deletion state, and creation date.
  - `PUT /api/auth/me` synchronizes name and phone across both `User` and `SeekerProfile` records.
- **In-App Password Change (`PUT /api/auth/change-password`)**:
  - Authenticated candidates can change their password directly from My Dashboard by verifying their current password with `bcrypt.compare`.
- **Account Discoverability (`PUT /api/auth/account-status`)**:
  - Toggles `isActive`. Setting `isActive: false` immediately hides the candidate from recruiter talent search while preserving all application history and streak XP.
- **Account Deletion Request (`POST /api/auth/account-status`)**:
  - Candidates can submit an account deletion request with an optional exit reason (`action: 'request_deletion'`), flagging the record for administrator review.
  - Candidates can cancel a pending request at any time (`action: 'cancel_deletion'`).

### 4. Terminology Modernization & Resume Privacy
- **Automation Terminology**: Replaced all user-facing "AI" labels across the seeker dashboard, job details, profile dropzone, and resume center with **"Automation"** and **"Automated"**.
- **Resume Sharing Removal**: Removed public share links and share buttons from candidate profile and resume center interfaces to uphold candidate privacy and adhere to authenticated recruiter discovery.


