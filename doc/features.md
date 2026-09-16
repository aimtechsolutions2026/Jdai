# features.md — CodifyPro Feature Breakdown (Aimtech Solutions)

## 1. Authentication & Onboarding
- Sign up / login (email+password; OAuth optional v1.1)
- Role-based accounts: Job Seeker, Recruiter, Admin
- Post-signup onboarding nudging resume upload

## 2. AI Resume Parsing & Profile Autofill
- PDF-only resume upload (validated client + server side)
- Text extraction from PDF + AI structured-JSON parsing
- Auto-fill profile: experience, education, skills, contact, certificates
- User can review/edit all AI-extracted fields before saving
- Re-upload/re-parse supported

## 3. Job Seeker Profile ("My Details")
- Experience entries (multiple, add/edit/remove)
- Education entries
- Skills (tag-based)
- Certificates (file upload per certificate, Cloudinary-hosted)
- Salary expectation range
- Contact info & location/pincode
- Profile completeness indicator

## 4. Job Discovery
- Job listing with filters: Location, Pincode, Role, Experience range, Salary range, Job type
- Keyword search (role/company)
- Sort: Newest, Best Match (skill-overlap score with profile)
- Save/bookmark jobs
- Job Card: company, role, salary, location, experience, posted date, apply CTA
- Job Detail page with full JD

## 5. Job Ingestion (Admin) — Multi-Source
- **Apify/scraper integration**: scheduled pull of listings from external sources into a review queue
- **Paste external link**: server fetches page content → AI extracts structured fields
- **Paste raw text**: Admin pastes JD text directly → AI extracts structured fields
- Extracted fields: company name, salary range, JD, location, experience required, apply URL
- Admin review/edit step before publishing (AI output is a draft, not auto-published)
- Job status lifecycle: pending-review → published → archived

## 6. Apply Flow
- **Easy Apply**: uses stored profile + resume, one-click apply, tracked in Applications
- **External Apply**: redirects to original job posting's apply link
- Application status tracking (Applied / Viewed / Shortlisted — status field ready for future ATS integration)

## 7. AI Resume Generation
- **ATS-Friendly Resume**: generic, keyword-optimized, clean single-column format, generated once from profile
- **Tailored Resume (per job)**: AI reorders/emphasizes relevant experience & injects JD keywords for a specific job
- Downloadable as PDF; history of previously generated tailored resumes kept in Resume Center

## 8. Gamification — Daily MCQ & Streaks
- Daily Question of the Day (categories: DSA, Aptitude, General knowledge/soft skills)
- One attempt per day per user (enforced via Redis flag)
- Instant feedback with explanation
- Streak tracking (current streak, longest streak) — Redis-backed counters, persisted to profile
- XP system tied to correct answers/streak milestones
- Streak calendar/heatmap visualization
- Leaderboard (weekly/all-time, by XP or streak length)
- (v2 idea, not committed) Badges for milestones (7-day streak, 30-day streak, DSA master, etc.)

## 9. DSA-Focused MCQs
- Separate category within MCQ bank specifically for DSA concepts (time complexity, data structures, algorithms) in multiple-choice format (no code execution required — conceptual/output-prediction questions)
- Difficulty tagging (Easy/Medium/Hard)

## 10. Recruiter Tools
- Candidate search by role + skills (multi-select) + experience/location filters
- Candidate result cards → full profile view (read-only) + resume download
- (v2 idea, not committed) Save candidate shortlists, contact/unlock credits

## 11. Admin Tools
- Job ingestion hub (3 source tabs) with AI-assisted review-and-publish workflow
- Job management table (edit/archive/delete)
- MCQ question bank management (CRUD + bulk import)
- User management (view/search/suspend/verify)
- Basic analytics dashboard

## 12. Platform-Wide
- Fully responsive layout (mobile web acts as app-like PWA — installable, bottom nav)
- Notifications (application status changes, "your streak is at risk" reminder)
- Search across job listings (global)

## 13. Feature Prioritization (Suggested Phasing)
**MVP (Phase 1)**
- Auth (seeker/admin/recruiter roles)
- Resume upload + AI autofill
- Profile management
- Job listing + filters + job detail
- Admin: paste-text/paste-link job ingestion with AI extraction + review/publish
- Easy Apply + external apply
- Daily MCQ + streak (basic)
- Recruiter search (basic)

**Phase 2**
- Apify/scraper source ingestion
- Tailored resume generation per job
- ATS-friendly resume generator
- Leaderboard + XP + badges
- Analytics dashboard

**Phase 3 (nice-to-have)**
- Notifications system, saved candidate shortlists (recruiter), personalized MCQ difficulty (adaptive), dark mode
