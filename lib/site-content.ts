import { connectToDatabase } from "./db";
import { SiteContent, ISiteContent } from "@/models/SiteContent";

export const DEFAULT_SITE_CONTENT = {
  key: "landing",
  partners: {
    heading: "Hiring from Top Companies & High-Growth Startups",
    badge: "Top Tech Employers",
    companies: [
      { name: "Google", iconKey: "google", logoUrl: "", websiteUrl: "https://careers.google.com", enabled: true },
      { name: "Microsoft", iconKey: "microsoft", logoUrl: "", websiteUrl: "https://careers.microsoft.com", enabled: true },
      { name: "Amazon", iconKey: "amazon", logoUrl: "", websiteUrl: "https://amazon.jobs", enabled: true },
      { name: "Netflix", iconKey: "netflix", logoUrl: "", websiteUrl: "https://jobs.netflix.com", enabled: true },
      { name: "Meta", iconKey: "meta", logoUrl: "", websiteUrl: "https://metacareers.com", enabled: true },
      { name: "GitHub", iconKey: "github", logoUrl: "", websiteUrl: "https://github.com/about/careers", enabled: true },
      { name: "Stripe", iconKey: "stripe", logoUrl: "", websiteUrl: "https://stripe.com/jobs", enabled: true },
      { name: "Vercel", iconKey: "vercel", logoUrl: "", websiteUrl: "https://vercel.com/careers", enabled: true },
      { name: "Airbnb", iconKey: "airbnb", logoUrl: "", websiteUrl: "https://careers.airbnb.com", enabled: true },
      { name: "Supabase", iconKey: "supabase", logoUrl: "", websiteUrl: "https://supabase.com/careers", enabled: true },
      { name: "Linear", iconKey: "linear", logoUrl: "", websiteUrl: "https://linear.app/careers", enabled: true },
      { name: "Ramp", iconKey: "ramp", logoUrl: "", websiteUrl: "https://ramp.com/careers", enabled: true },
      { name: "Datadog", iconKey: "datadog", logoUrl: "", websiteUrl: "https://careers.datadoghq.com", enabled: true },
      { name: "Shopify", iconKey: "shopify", logoUrl: "", websiteUrl: "https://shopify.com/careers", enabled: true },
    ],
  },
  hero: {
    badge: "AI Extraction Engine Live • Sub-second parsing",
    title: "The AI-Powered Career Platform for High-Impact Engineers",
    subtitle:
      "Stop manually filling job forms. Upload your PDF resume for instant AI parsing, practice curated daily DSA challenges to build consistency, and let top tech recruiters discover you.",
    primaryCtaText: "Get Discovered as a Seeker",
    primaryCtaLink: "/signup?role=seeker",
    secondaryCtaText: "Hire Tech Talent",
    secondaryCtaLink: "/signup?role=recruiter",
    featureBadges: [
      "No credit card required",
      "Under 60s setup",
      "Daily DSA Gamification",
    ],
  },
  features: {
    heading: "Engineered for the Modern Tech Job Search",
    subheading: "Billion-Dollar Architecture",
    description:
      "Every detail is calibrated to eliminate friction for both builders and hiring managers.",
    items: [
      {
        title: "1-Click AI Resume Parsing",
        description:
          "Drop your PDF resume. AI extracts experience, education, skills, and certifications into an editable profile instantly.",
        iconKey: "fileCheck",
        badge: "Instant Extraction",
      },
      {
        title: "Daily DSA & Streak Engine",
        description:
          "Solve one high-yield DSA or Aptitude challenge daily. Maintain your streak, track consistency on your activity heatmap, and earn XP.",
        iconKey: "flame",
        badge: "Gamified Practice",
      },
      {
        title: "Precision Recruiter Search",
        description:
          "Recruiters filter candidates with multi-skill tags, verified experience years, and location. Candidate discovery with zero noise.",
        iconKey: "search",
        badge: "Zero Noise",
      },
      {
        title: "AI Ingestion Engine",
        description:
          "Admins paste raw JD text or external job links. AI automatically structures salary, role, tags, and apply links in seconds.",
        iconKey: "cpu",
        badge: "Automated Pipeline",
      },
    ],
  },
  howItWorks: {
    heading: "How CodifyPro Works",
    subheading: "Streamlined Workflow",
    seekerSteps: [
      {
        stepNumber: 1,
        title: "Upload Resume PDF",
        description:
          "AI reads your PDF, extracts all work experiences, universities, and tech stack tags, and auto-fills your profile.",
      },
      {
        stepNumber: 2,
        title: "Solve Daily MCQs",
        description:
          "Sharpen algorithms and aptitude daily. Maintain your flame streak to showcase consistency and problem-solving readiness.",
      },
      {
        stepNumber: 3,
        title: "1-Click Easy Apply",
        description:
          "Apply directly to curated engineering roles with your verified profile, or link out to external portals with tailored metadata.",
      },
    ],
    recruiterSteps: [
      {
        stepNumber: 1,
        title: "Ingest Jobs via AI",
        description:
          "Paste raw text or job URLs. AI normalizes company name, salary ranges, location, and key requirements automatically.",
      },
      {
        stepNumber: 2,
        title: "Targeted Candidate Discovery",
        description:
          "Search active candidates by role, verified skills, and experience depth with sub-second MongoDB and Redis queries.",
      },
      {
        stepNumber: 3,
        title: "Access Verified Profiles",
        description:
          "Inspect structured candidate details, download original resume PDFs, and reach out to high-performing candidates directly.",
      },
    ],
  },
  faqs: {
    heading: "Got Questions? We've Got Answers.",
    subheading: "Frequently Asked Questions",
    items: [
      {
        q: "How does the AI Resume Parsing work?",
        a: "Upload your resume in PDF format. Our AI pipeline extracts your work history, skills, education, certifications, and target salary in under 3 seconds. You can review and edit every field before your profile goes live.",
      },
      {
        q: "What is the Daily MCQ and how do streaks work?",
        a: "Every day at midnight UTC, a new high-yield tech challenge drops (covering Data Structures & Algorithms, System Design, or Aptitude). Solving it increments your streak and earns XP. Miss a day, and your streak resets.",
      },
      {
        q: "How can recruiters discover my profile?",
        a: "Recruiters use CodifyPro's multi-tag skill filters to pinpoint candidates matching their exact stack, experience depth, and location. Your profile is surfaced organically based on verified skills and MCQ activity.",
      },
      {
        q: "Can admins ingest jobs from any external source?",
        a: "Yes. CodifyPro's Admin Ingestion Engine allows admins to paste raw JD text or external job URLs. AI automatically extracts company, role, salary range, tags, and apply links into a structured draft for 1-click publishing.",
      },
      {
        q: "Is CodifyPro completely free for job seekers?",
        a: "Yes! Job seekers get unlimited resume parsing, daily MCQ practice, job applications, and profile visibility for free. Recruiters pay a flexible subscription for high-volume candidate search and direct outreach.",
      },
    ],
  },
  ctaBanner: {
    heading: "Ready to Supercharge Your Tech Career?",
    subheading:
      "Join thousands of developers and recruiters on the fastest-growing AI career discovery platform.",
    primaryButtonText: "Get Started Free Now",
    primaryButtonLink: "/signup",
    secondaryButtonText: "Explore Tech Jobs",
    secondaryButtonLink: "/jobs",
  },
  footer: {
    description:
      "Empowering engineering talent with verified skills, AI-tailored career tools, and direct employer visibility.",
    supportEmail: "support@codifypro.ai",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      discord: "https://discord.com",
    },
  },
};

// In-memory fallback cache
let memorySiteContent: any = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));

export const SiteContentRepository = {
  async get(): Promise<any> {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const found = await SiteContent.findOne({ key: "landing" }).lean();
        if (found) {
          memorySiteContent = found;
          return found;
        }

        // Initialize default in database
        try {
          const created = await SiteContent.create(DEFAULT_SITE_CONTENT);
          const plain = created.toObject();
          memorySiteContent = plain;
          return plain;
        } catch {
          // ignore duplicate key or creation collision
        }
      } catch (err) {
        console.warn("DB read error in SiteContentRepository, using memory fallback:", err);
      }
    }
    return memorySiteContent || DEFAULT_SITE_CONTENT;
  },

  async update(data: any): Promise<any> {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const updated = await SiteContent.findOneAndUpdate(
          { key: "landing" },
          { $set: data },
          { new: true, upsert: true }
        ).lean();
        if (updated) {
          memorySiteContent = updated;
          return updated;
        }
      } catch (err) {
        console.warn("DB update error in SiteContentRepository, updating memory:", err);
      }
    }

    // Memory fallback
    memorySiteContent = {
      ...memorySiteContent,
      ...data,
      updatedAt: new Date(),
    };
    return memorySiteContent;
  },

  async reset(): Promise<any> {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        await SiteContent.deleteOne({ key: "landing" });
        const created = await SiteContent.create(DEFAULT_SITE_CONTENT);
        const plain = created.toObject();
        memorySiteContent = plain;
        return plain;
      } catch (err) {
        console.warn("DB reset error in SiteContentRepository, resetting memory:", err);
      }
    }
    memorySiteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    return memorySiteContent;
  },
};
