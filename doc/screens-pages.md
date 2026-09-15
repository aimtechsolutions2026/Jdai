# screens-pages.md — Screens & Page Flows

## 1. Public / Auth
| Screen | Description |
|---|---|
| Landing Page | Value prop, CTA to sign up as Seeker or Recruiter |
| Sign Up | Role selection (Seeker/Recruiter), email/password (or OAuth) |
| Login | Email/password login, forgot password flow |
| Onboarding (post-signup, Seeker) | Prompt to upload resume immediately → triggers AI autofill |

## 2. Job Seeker Screens

### 2.1 Dashboard
- Profile completeness bar + CTA to complete missing fields
- Streak widget (current streak, flame icon) + link to today's MCQ
- Quick stats: applications sent, saved jobs, profile views (if recruiter viewed)
- Recommended jobs (based on profile skills/role)

### 2.2 Profile / "My Details"
- Sections (editable, auto-filled from resume, user can edit):
  - Basic info: name, contact, location
  - Experience (add/edit/remove entries: company, title, duration, description)
  - Education
  - Skills (tag input)
  - Certificates (upload file per certificate → Cloudinary)
  - Salary expectation (min–max range)
  - Resume file (view/replace uploaded PDF)
- "Re-parse resume" action if user uploads a new version

### 2.3 Jobs Page
- **Left sidebar (filters)**: Location, Pincode, Role, Experience range, Salary range, Job type (Remote/Onsite/Hybrid) — collapsible on mobile into a filter drawer/bottom sheet
- **Main area**: search bar (role/company keyword) + sorted job card list (Newest / Best Match)
- Pagination or infinite scroll

### 2.4 Job Card (list item)
- Company logo, role title, company name
- Salary range badge
- Location, pincode, experience required, job type tags
- Posted X days ago
- Save/bookmark icon
- "Easy Apply" or "Apply" (external) button
- Click → Job Detail page

### 2.5 Job Detail Page
- Full JD, company name, salary range, location, experience required
- "Generate Tailored Resume for this Job" button → AI generates → preview → download PDF
- "Download ATS-Friendly Resume" (generic, non-job-specific optimized version)
- Apply button (Easy Apply using stored/tailored resume, or redirect to external `applyUrl`)
- Similar jobs section

### 2.6 My Applications
- List of applied jobs with status (Applied, Viewed, Shortlisted — if tracked), applied date, resume version used (downloadable)

### 2.7 Saved/Bookmarked Jobs
- List of bookmarked job cards

### 2.8 Daily MCQ / Gamification Hub
- Today's Question card (category tag: DSA / Aptitude / General)
- Answer options → instant feedback (correct/incorrect + explanation)
- Streak counter, XP earned
- Streak calendar (visual — which days solved, like a heatmap/contribution graph)
- Leaderboard (top streaks / XP this week)
- Question history / past attempts

### 2.9 Resume Center
- View/download: Original uploaded resume, ATS-friendly generic resume, list of previously tailored resumes (per job, with job name tag)

## 3. Recruiter Screens

### 3.1 Recruiter Dashboard
- Quick search bar (role + skills)
- Recent searches, saved candidate lists (v2)

### 3.2 Candidate Search Page
- Filters: Role, Skills (multi-select tags), Experience range, Location
- Result list: candidate cards (name, current/last role, top skills, experience years, location) — contact info gated/visible per privacy rules
- Click → Candidate Profile View (read-only version of seeker profile + resume download)

## 4. Admin Screens

### 4.1 Job Ingestion Hub
- Tabs: "From Apify/Source", "Paste Link", "Paste Text"
- **Paste Link/Text flow**: input box → "Extract with AI" button → Groq-parsed structured preview form (editable: company name, salary range, JD, location, apply link) → "Publish" button
- **Apify/Source tab**: list of pending scraped jobs (queue) awaiting the same review-and-publish step

### 4.2 Job Management
- Table of all jobs (Published / Pending / Archived) with edit/archive/delete actions

### 4.3 MCQ Question Bank
- Add/edit MCQ questions (category: DSA/Aptitude/General, difficulty, options, correct answer, explanation)
- Bulk import (CSV/JSON) option

### 4.4 User Management
- List of users (seekers/recruiters), search, suspend/verify actions

### 4.5 Analytics Dashboard
- Jobs posted over time, applications per job, DAU/streak retention, top searched skills (recruiter side)

## 5. Shared/Global Components
- Top Navbar (desktop) — logo, nav links (Jobs, Applications, MCQ, Profile), avatar dropdown
- Bottom Nav Bar (mobile, app-like) — Home, Jobs, MCQ (with streak badge), Applications, Profile
- Notification bell (application status updates, streak reminders)
- Global search (jobs, on desktop navbar)

## 6. Responsive Behavior Notes
- Job Page filters: sidebar (desktop) → slide-up bottom sheet triggered by "Filters" button (mobile)
- Job Card: 3-column grid (desktop) → 2-column (tablet) → 1-column stacked (mobile)
- Profile sections: tabbed layout (desktop) → accordion/stacked sections (mobile)
- All primary actions (Apply, Generate Resume, Submit MCQ) as fixed bottom action bar on mobile for thumb reachability
