import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Sparkles, AlertCircle, Mail, MapPin } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Terms and Conditions | CodifyPro AI",
  description: "Terms and conditions governing the use of the CodifyPro AI platform by Aimtech Solutions.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-between">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 w-full">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm" className="font-bold">
              Legal Agreement
            </Badge>
            <span className="text-xs text-text-muted">Last Updated: September 21, 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-secondary">
            Terms and Conditions — CodifyPro
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-2 leading-relaxed">
            Please read these Terms and Conditions (&quot;Terms&quot;) carefully before using the CodifyPro website and platform (the &quot;Service&quot;), operated by CodifyPro by Aimtech Solutions (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an account, uploading a resume, applying for jobs, posting jobs, or otherwise using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-card space-y-8 text-sm sm:text-base text-text-primary leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">1.</span>
              <span>Eligibility</span>
            </h2>
            <p className="text-text-secondary">
              You must be at least 18 years old (or the age of majority in your jurisdiction) and legally able to enter into a binding contract to use the Service. By using CodifyPro, you represent and warrant that you meet this requirement.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">2.</span>
              <span>Account Registration</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li>You must provide accurate, current, and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity conducted under your account.</li>
              <li>You must notify us immediately of any unauthorized use or security breach of your account.</li>
              <li>
                We support three distinct account types: <strong>Job Seeker</strong>, <strong>Recruiter</strong>, and <strong>Admin</strong>. Each account role is subject to the role-specific terms set forth below.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">3.</span>
              <span>Job Seeker Terms</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>
                You may upload your resume (PDF format only) to your profile. By uploading, you confirm that the content is accurate, truthful, and either your own original work or content you possess the legitimate right to submit.
              </li>
              <li>
                You authorize CodifyPro to process your resume using third-party artificial intelligence services (including Groq) to extract information and auto-populate your profile. You are solely responsible for reviewing and correcting any AI-extracted data before relying on or submitting it.
              </li>
              <li>
                You may use the Service to generate tailored or ATS-optimized resume versions. These are provided as a digital convenience; CodifyPro does not guarantee that any resume format will result in interview calls, shortlisting, or employment offers.
              </li>
              <li>
                Applying to a job through CodifyPro (&quot;Easy Apply&quot;) or via an external employer link does not guarantee a response from the employer or recruiter. CodifyPro is not a party to any employment relationship formed between you and any employer.
              </li>
              <li>
                Daily quizzes, streaks, XP, badges, and related gamification features are provided strictly for engagement and skill-practice purposes. They carry zero monetary value, offer no cash-out options, and guarantee no specific employment outcomes.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">4.</span>
              <span>Recruiter Terms</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>
                Recruiter accounts may search and view job seeker profiles made available on the platform strictly for legitimate hiring and recruiting purposes.
              </li>
              <li>
                You agree not to use candidate data for any purpose other than bona fide recruitment activity, and agree not to sell, rent, license, or redistribute candidate data to third parties.
              </li>
              <li>
                You are responsible for complying with all applicable employment, anti-discrimination, and data protection regulations when contacting or evaluating candidates sourced through CodifyPro.
              </li>
              <li>
                CodifyPro does not verify or warrant the absolute accuracy of any job seeker&apos;s profile, resume, or represented qualifications.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">5.</span>
              <span>Job Postings & Content Sourcing</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>
                Job listings on CodifyPro may be sourced from: (a) direct submissions by verified recruiters or platform administrators, (b) automated aggregation from public third-party sources, or (c) job descriptions structured using AI tools.
              </li>
              <li>
                CodifyPro does not guarantee the ongoing accuracy, completeness, availability, or legitimacy of any job listing, including stated salary ranges, job requirements, or external application links, and is not responsible for the hiring practices of any employer.
              </li>
              <li>
                Users should exercise their own independent judgment and due diligence, including verifying a job&apos;s legitimacy directly with the hiring company, before sharing personal or financial information.
              </li>
              <li>
                We reserve the right to remove, edit, or reject any job listing at our discretion, including any listings that appear fraudulent, deceptive, discriminatory, or in violation of applicable law.
              </li>
            </ul>
          </section>

          {/* Section 6 - AI Disclaimer Highlighted */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <div className="rounded-xl bg-blue-50/60 border border-blue-200/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-lg">
                <Sparkles className="h-5 w-5" />
                <h2>6. AI-Generated Content Disclaimer</h2>
              </div>
              <p className="text-text-secondary text-sm">
                CodifyPro utilizes third-party artificial intelligence models and APIs (including but not limited to Groq) to parse and extract data from resumes, parse unstructured job postings, and format tailored or ATS-ready resumes.
              </p>
              <div className="text-sm text-text-secondary space-y-1.5 font-medium">
                <p>You explicitly acknowledge that:</p>
                <ul className="list-disc pl-5 space-y-1 text-text-secondary">
                  <li>AI-generated outputs may occasionally contain errors, hallucinations, omissions, or inaccuracies and must be reviewed by you prior to use.</li>
                  <li>CodifyPro is not liable for decisions made or outcomes resulting from reliance on AI-generated outputs.</li>
                  <li>You remain solely responsible for the factual accuracy of any resume, profile, or application content you submit or download.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">7.</span>
              <span>Acceptable Use</span>
            </h2>
            <p className="text-text-secondary">You agree that you will NOT:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li>Upload false, deceptive, misleading, defamatory, or infringing content.</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or organization.</li>
              <li>Use unauthorized automated means (bots, scrapers, crawlers) to access the Service.</li>
              <li>Attempt to gain unauthorized access to other accounts, data, servers, or non-public areas of the platform.</li>
              <li>Use candidate or job data obtained through the platform for spam, harassment, or unlawful marketing.</li>
              <li>Upload files containing malware, viruses, or malicious scripts intended to disrupt platform operations.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">8.</span>
              <span>Intellectual Property</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>
                The CodifyPro name, branding, logo, UI/UX designs, algorithms, and underlying platform software are the exclusive intellectual property of CodifyPro by Aimtech Solutions and are protected by applicable intellectual property laws.
              </li>
              <li>
                You retain ownership of the content you upload (resumes, profile information). By uploading, you grant CodifyPro a limited, non-exclusive, royalty-free license to store, process, and display that content solely to operate and deliver the Service (e.g. displaying your profile to verified recruiters, generating ATS resumes).
              </li>
              <li>
                Job listing content sourced from third parties remains the property of its respective owners; CodifyPro claims no proprietary ownership over externally sourced job descriptions.
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">9.</span>
              <span>Subscription & Payments</span>
            </h2>
            <p className="text-text-secondary">
              CodifyPro core job seeker features, including AI resume extraction, job browsing, and daily MCQ challenges, are provided free of charge. In the event premium tiers, recruiter credits, or paid enterprise subscriptions are introduced, terms regarding billing cycles, renewal, and cancellation will be presented prior to transaction completion.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">10.</span>
              <span>Third-Party Services</span>
            </h2>
            <p className="text-text-secondary">
              The Service integrates with reputable third-party infrastructure and providers, including Groq (AI model processing), MongoDB Atlas (database), Redis/Upstash (caching & rate-limiting), and public job aggregators. Your use of the Service is also governed by the operational terms of these third parties where applicable. CodifyPro is not responsible for the independent acts, omissions, or downtime of third-party vendors.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">11.</span>
              <span>Termination</span>
            </h2>
            <p className="text-text-secondary">
              We may suspend or terminate your account, at our discretion, without prior notice, if you violate these Terms, engage in fraudulent, harmful, or abusive behavior, or for reasons required by law. You may request deletion of your account at any time through your account profile settings or by contacting our team.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">12.</span>
              <span>Disclaimers</span>
            </h2>
            <p className="text-text-secondary">
              The Service is provided strictly on an &quot;as is&quot; and &quot;as available&quot; basis, without warranties of any kind, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, or non-infringement. CodifyPro makes no warranty that the Service will meet your specific career expectations, guarantee employment outcomes, or operate without interruption.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">13.</span>
              <span>Limitation of Liability</span>
            </h2>
            <p className="text-text-secondary">
              To the maximum extent permitted by applicable law, CodifyPro, Aimtech Solutions, and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or employment opportunities, arising out of or related to your access to or use of the Service.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">14.</span>
              <span>Indemnification</span>
            </h2>
            <p className="text-text-secondary">
              You agree to defend, indemnify, and hold harmless CodifyPro and Aimtech Solutions from and against any claims, liabilities, damages, judgments, awards, losses, and expenses (including legal fees) resulting from your violation of these Terms or your use of the Service.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">15.</span>
              <span>Governing Law & Dispute Resolution</span>
            </h2>
            <p className="text-text-secondary">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict-of-law principles. Any legal suit or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts having jurisdiction.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-2 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">16.</span>
              <span>Changes to These Terms</span>
            </h2>
            <p className="text-text-secondary">
              We may update these Terms periodically. Substantive modifications will be indicated by updating the &quot;Last Updated&quot; date at the top of this document. Continued use of the platform following the posting of revised Terms confirms your acceptance of the changes.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">17.</span>
              <span>Contact Us</span>
            </h2>
            <p className="text-text-secondary">
              If you have any questions or inquiries regarding these Terms and Conditions, please contact our team:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-primary">
                <Mail className="h-4 w-4 text-primary" />
                <span><strong>Email:</strong> support@codifypro.aimtechsolutions.org</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <MapPin className="h-4 w-4 text-primary" />
                <span><strong>Organization:</strong> Aimtech Solutions Platform — CodifyPro Team</span>
              </div>
            </div>
          </section>

          {/* Legal Note banner */}
          <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              By checking &quot;I agree to the Terms and Conditions and Privacy Policy&quot; during sign-up, you confirm that you have read, understood, and agreed to be bound by these Terms.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

