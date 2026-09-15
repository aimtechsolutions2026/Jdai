# architecture.md — System Architecture

## 1. High-Level Architecture

```
                         ┌─────────────────────────┐
                         │        Next.js App       │
                         │ (App Router, SSR + API   │
                         │  routes / route handlers)│
                         └───────────┬──────────────┘
                                     │
        ┌────────────────────────────┼─────────────────────────────┐
        │                            │                              │
        ▼                            ▼                              ▼
┌───────────────┐          ┌──────────────────┐           ┌──────────────────┐
│   MongoDB      │          │      Redis        │           │  Cloudinary       │
│ (Users, Jobs,  │          │ (sessions/JWT      │           │ (resume PDFs,     │
│  Applications, │          │  blacklist, streak │           │  avatars,          │
│  MCQ, Profiles)│          │  counters, cache,   │           │  certificates,     │
│                │          │  rate limiting)     │           │  company logos)    │
└───────────────┘          └──────────────────┘           └──────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────────────────┐
│                        External Services Layer                      │
│  - Groq API (resume parsing, job-detail extraction, tailored resume  │
│    generation, ATS keyword optimization)                             │
│  - Apify / scraper actors (job source ingestion)                     │
│  - External job link fetcher (server-side fetch + HTML parse)        │
└────────────────────────────────────────────────────────────────────┘
```

## 2. Tech Stack Mapping
- **Frontend + Backend**: Next.js (App Router) — SSR for SEO on job pages, API routes/route handlers for backend logic.
- **Styling**: Tailwind CSS (+ shadcn/ui components).
- **Database**: MongoDB (via Mongoose) — flexible schema for varied resume/profile fields, job postings, MCQ bank.
- **Cache/Realtime counters**: Redis — streaks, daily-question-attempted flags, rate limiting (login, AI calls), session/JWT blacklist, leaderboard (sorted sets).
- **File storage**: Cloudinary — resume PDFs, profile photos, certificates, company logos (auto-optimized delivery, PDF preview thumbnails).
- **AI**: Groq API — fast LLM inference for structured extraction (resume → JSON profile, raw job text → JSON job fields) and resume tailoring/generation.
- **Auth**: NextAuth.js (credentials + optional Google OAuth) or custom JWT (access + refresh token in httpOnly cookies).
- **Job scraping ingestion**: Apify actors (or custom scrapers) → webhook/cron pushes raw data → Groq normalizes → Admin review queue.

## 3. Data Models (high-level)

### User
```
{
  _id, email, passwordHash, role: "seeker" | "recruiter" | "admin",
  name, phone, avatarUrl, createdAt, isVerified
}
```

### SeekerProfile
```
{
  userId, resumeUrl (Cloudinary), parsedResumeRaw (Groq output),
  experience: [{ company, title, from, to, description }],
  education: [{ school, degree, year }],
  skills: [String],
  certificates: [{ name, issuer, url, date }],
  salaryExpectation: { min, max, currency },
  location, pincode, contact,
  profileCompleteness: Number,
  streak: { current, longest, lastSolvedDate },
  xp: Number
}
```

### Job
```
{
  _id, source: "apify" | "link" | "manual-paste",
  companyName, companyLogoUrl, role, jd (rich text),
  salaryRange: { min, max, currency },
  location, pincode, experienceRequired: { min, max },
  jobType: "remote"|"onsite"|"hybrid",
  applyUrl, applyMode: "external" | "easy-apply",
  status: "pending-review" | "published" | "archived",
  postedAt, rawExtractedByAI (audit trail)
}
```

### Application
```
{ userId, jobId, resumeUrlUsed (tailored version), status, appliedAt }
```

### MCQQuestion
```
{ _id, category: "dsa" | "aptitude" | "general",
  question, options: [String], correctIndex, difficulty, explanation }
```

### DailyAttempt
```
{ userId, date, questionId, isCorrect, answeredAt }
```

## 4. Key Backend Flows

### 4.1 Resume Upload → Autofill
1. Client uploads PDF → validated (type/size) → stored in Cloudinary.
2. Server extracts raw text from PDF (e.g., `pdf-parse`) → sends text to Groq with a structured-JSON extraction prompt (schema: experience, education, skills, contact, certificates).
3. Groq JSON response validated (schema check) → saved as `parsedResumeRaw` and mapped into `SeekerProfile` fields (editable by user before save).

### 4.2 Job Ingestion (Admin)
1. **Apify/source route**: scheduled job (cron) pulls new listings via Apify API → raw payloads queued.
2. **Link route**: Admin pastes URL → server fetches HTML → extracts main content (readability parser) → sent to Groq.
3. **Paste-text route**: Admin pastes raw JD text directly → sent to Groq.
4. In all cases, Groq returns structured JSON (companyName, salaryRange, JD, location, applyUrl) → shown to Admin in a review form → Admin edits/confirms → job saved with `status: published`.

### 4.3 Tailored Resume Generation
1. User selects a job → clicks "Generate Tailored Resume".
2. Server sends: base profile JSON + target job JD to Groq with prompt to (a) reorder/emphasize relevant experience & skills, (b) inject ATS keywords from JD, (c) return structured resume JSON.
3. Server renders JSON → PDF (e.g., via `@react-pdf/renderer` or HTML-to-PDF) → uploads to Cloudinary → returns download link.

### 4.4 Daily MCQ & Streak
1. Cron/rotation picks "Question of the Day" (per category or global) — could be same for all users or personalized by weak areas (v2).
2. Redis key `daily:{userId}:{date}` tracks attempt status to prevent re-attempts.
3. On correct/submit: update `DailyAttempt` in Mongo; update streak counter in Redis (`INCR`/reset logic based on `lastSolvedDate`); sync `streak` back to `SeekerProfile` periodically or on read.
4. Leaderboard: Redis sorted set (`ZADD leaderboard:xp userId score`).

### 4.5 Recruiter Search
1. Recruiter submits role + skills (+ filters).
2. MongoDB query with text index / compound index on `skills`, `role`, `location`, `experience`.
3. Consider Atlas Search (if MongoDB Atlas) for fuzzy/full-text relevance ranking on skills+role.

## 5. API Route Structure (Next.js route handlers, example)
```
/api/auth/*                 - login, signup, session
/api/profile                - GET/PUT seeker profile
/api/resume/upload          - POST PDF → Cloudinary + Groq parse
/api/resume/tailor          - POST { jobId } → tailored resume PDF
/api/jobs                   - GET (list+filters), POST (admin create)
/api/jobs/[id]              - GET detail
/api/jobs/ingest/link       - POST admin paste-link
/api/jobs/ingest/paste      - POST admin paste-text
/api/jobs/ingest/apify      - webhook receiver
/api/applications           - POST apply, GET my applications
/api/mcq/today              - GET today's question
/api/mcq/submit             - POST answer
/api/streak                 - GET current streak/leaderboard
/api/recruiter/search       - GET profiles by role/skills
```

## 6. Caching & Rate Limiting (Redis)
- Cache published job list queries (short TTL, e.g., 60s) keyed by filter hash.
- Rate-limit Groq API calls per user (e.g., resume upload: 5/day; tailored resume: 10/day) to control cost/abuse.
- Rate-limit login attempts (brute-force protection).

## 7. Security Considerations
- PDF-only validation both client (MIME/extension) and server (magic-byte check).
- Sanitize AI-extracted HTML/JD content before rendering (prevent stored XSS) — use a sanitizer (e.g., `sanitize-html`).
- Signed, expiring Cloudinary URLs for private documents (resumes) if not meant to be public.
- Role-based route guards (middleware) for `/admin/*` and `/recruiter/*`.
- Validate/whitelist all Groq JSON outputs against a strict schema (e.g., zod) before persisting — never trust raw LLM output blindly.

## 8. Deployment
- Next.js app → Vercel (or self-hosted Node server).
- MongoDB Atlas (managed).
- Redis via Upstash (serverless-friendly, works well with Vercel) or Redis Cloud.
- Cloudinary managed service.
- Cron jobs: Vercel Cron / external scheduler for Apify pulls + daily MCQ rotation.
