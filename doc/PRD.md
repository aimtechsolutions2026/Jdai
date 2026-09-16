# PRD.md — CodifyPro Job Seeker Platform by Aimtech Solutions

## 1. Overview
A modern AI-powered job-seeking and recruitment platform connecting **Job Seekers**, **Recruiters**, and **Admins**. The platform leverages high-performance AI to auto-parse resumes and job postings, gamifies the job-search/skill-building journey with daily MCQs and streaks, and generates ATS-friendly, tailored resumes for each job application.

## 2. Problem Statement
- Job seekers spend too much time manually filling profiles and tailoring resumes per application.
- Recruiters struggle to search and filter relevant candidate profiles quickly.
- Job seekers lose motivation/consistency in skill-building during their job search.
- Job listings are scattered across multiple sources (job boards, scraped links, manual postings) with inconsistent formatting.

## 3. Goals
1. Reduce profile creation time via AI resume parsing (upload PDF → autofill profile).
2. Provide recruiters a fast way to discover candidates by role/skills.
3. Aggregate jobs from multiple sources (Apify scrapers, external links, manually pasted text) into one normalized format using AI extraction.
4. Increase seeker engagement/retention via daily MCQ gamification + streaks.
5. Let seekers generate a tailored, ATS-friendly resume per job in one click.

## 4. User Roles
| Role | Description |
|---|---|
| **Job Seeker** | Creates profile, uploads resume, browses/searches jobs, applies, plays daily MCQ, builds streak, downloads tailored resumes |
| **Recruiter** | Searches seeker profiles by role/skills, views profiles, (future: contacts candidates) |
| **Admin** | Uploads/manages job postings (via scraper source, external link, or pasted text parsed by AI), manages MCQ question bank, moderates users |

## 5. Core User Flows

### 5.1 Job Seeker
1. Sign up / Log in (email+password, optionally OAuth later)
2. Upload resume (PDF only) → AI parses → profile auto-filled (editable)
3. Complete/edit profile: experience, skills, salary expectation, contact, certificates, education, projects
4. Browse Jobs page → filter (location, pincode, role, experience, salary) → Job Card → Job Detail
5. Apply to job (Easy Apply — uses stored profile/resume) or via external apply link
6. Generate tailored + ATS-friendly resume for a specific job (AI-assisted) → download PDF
7. Solve Daily MCQ (general aptitude / DSA-related) → maintain streak → earn XP/badges

### 5.2 Admin
1. Add job via:
   - Apify (or other) scraper source integration
   - Paste external job link → system fetches content
   - Paste raw job text → AI extracts structured fields
2. Review/edit AI-extracted fields (company name, salary range, JD, location, apply link) before publishing
3. Manage MCQ question bank (add/edit/categorize DSA & aptitude questions)
4. View basic analytics (jobs posted, applications, active users)

### 5.3 Recruiter
1. Log in to recruiter dashboard
2. Search candidate profiles by role + skills (+ experience/location filters)
3. View shortlisted profile details (resume, skills, experience)

## 6. Key Features (summary — see features.md for detail)
- AI Resume Parsing & Autofill
- AI Job Detail Extraction from pasted text/links/scraper payloads
- Job Search & Filters (location, pincode, role, experience, salary)
- Easy Apply + external apply link support
- Tailored & ATS-friendly resume generation/download
- Daily MCQ gamification (general + DSA) with streaks, XP, leaderboard
- Recruiter candidate search
- Fully responsive (mobile web + app-like PWA)

## 7. Non-Goals (v1)
- In-app messaging/chat between recruiter and seeker
- Payment/subscription billing
- Native iOS/Android apps (v1 is responsive web / PWA)
- Video resumes / interview scheduling

## 8. Success Metrics
- % resumes successfully auto-parsed without manual correction
- Daily Active Users (DAU) / streak retention rate (D1, D7, D30)
- Jobs posted per day, applications per job
- Recruiter search-to-profile-view conversion
- Resume download → apply conversion rate

## 9. Assumptions & Constraints
- Resume upload restricted to PDF only (v1)
- AI engine used for all extraction/generation tasks (resume parsing, job parsing, tailored resume generation)
- MongoDB as primary datastore; Redis for caching, streaks, sessions/rate-limiting; Cloudinary for file storage (resumes, avatars, certificates)
