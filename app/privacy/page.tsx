import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Sparkles, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Privacy Policy | CodifyPro AI",
  description: "Privacy policy explaining how CodifyPro by Aimtech Solutions collects, uses, and safeguards user data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-between">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 w-full">
        {/* Top Breadcrumb & Header */}
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
              Privacy & Data Protection
            </Badge>
            <span className="text-xs text-text-muted">Last Updated: September 21, 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-secondary">
            Privacy Policy — CodifyPro
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-2 leading-relaxed">
            CodifyPro by Aimtech Solutions (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy explains what information we collect, how we use it, who we share it with, and the choices you have when you use the CodifyPro website and platform (the &quot;Service&quot;).
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-card space-y-8 text-sm sm:text-base text-text-primary leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">1.</span>
              <span>Information We Collect</span>
            </h2>

            <div className="space-y-3">
              <h3 className="font-bold text-sm sm:text-base text-secondary">1.1 Information You Provide</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
                <li><strong>Account information:</strong> Name, email address, phone number, encrypted password, and account role (Job Seeker / Recruiter / Admin).</li>
                <li><strong>Profile information:</strong> Professional headline, bio/summary, work experience, education, skills, certifications & IDs, salary expectations (INR / USD), location/pincode, social links (LinkedIn, GitHub, Portfolio), and languages.</li>
                <li><strong>Resume files:</strong> PDF resumes you upload to your profile, and any information extracted from them.</li>
                <li><strong>Job posting content:</strong> Company name, job title, description, compensation ranges, requirements, and application URLs submitted by administrators or recruiters.</li>
                <li><strong>Communications:</strong> Messages, feedback, inquiries, or support requests you send to us.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-sm sm:text-base text-secondary">1.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
                <li><strong>Usage data:</strong> Features used, search queries and filters applied, job applications submitted, daily MCQ attempts, and streak progress.</li>
                <li><strong>Device & technical data:</strong> IP address, browser type and version, device operating system, and approximate location derived from IP.</li>
                <li><strong>Cookies & tokens:</strong> Secure HTTP cookies used for session authentication and user preferences.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-sm sm:text-base text-secondary">1.3 Information from Third Parties</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
                <li>Job listings aggregated from verified public third-party sources or automated collectors.</li>
                <li>If you authenticate through a third-party single sign-on provider (such as Google), we receive basic identity information permitted by your provider privacy settings.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">2.</span>
              <span>How We Use Your Information</span>
            </h2>
            <p className="text-text-secondary">We process collected data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li>To create, manage, and authenticate your account.</li>
              <li>To parse and extract structured profile data from uploaded resumes using AI processing (via Groq).</li>
              <li>To generate tailored and ATS-compliant resume previews and exports upon your request.</li>
              <li>To display relevant job openings and power smart keyword and filter searches.</li>
              <li>To allow verified recruiters to discover job seekers based on relevant skills, roles, and experience.</li>
              <li>To operate gamified learning tools (daily MCQ quizzes, streak tracking, XP).</li>
              <li>To deliver real-time role-based notifications regarding job matches and application updates.</li>
              <li>To maintain platform security, detect fraudulent activities, and comply with legal requirements.</li>
            </ul>
          </section>

          {/* Section 3 - Sharing Table */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">3.</span>
              <span>How We Share Your Information</span>
            </h2>
            <p className="text-text-secondary">
              <strong>We do not sell your personal data.</strong> Information is shared solely in the contexts outlined below:
            </p>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full divide-y divide-border text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 font-bold text-secondary">
                  <tr>
                    <th scope="col" className="px-4 py-3 sm:px-6">Recipient</th>
                    <th scope="col" className="px-4 py-3 sm:px-6">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-white text-text-secondary">
                  <tr>
                    <td className="px-4 py-3 sm:px-6 font-semibold text-text-primary">
                      Recruiters (Job Seekers only)
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      Your profile and parsed qualifications are visible to recruiters searching by role or skills, if your profile is discoverable.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 sm:px-6 font-semibold text-text-primary">
                      Groq (AI Processing Provider)
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      To parse resume text in real time and extract structured profile details; data sent is limited to resume content.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 sm:px-6 font-semibold text-text-primary">
                      Database & Infrastructure
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      MongoDB Atlas and Redis/Upstash for secure data persistence and authenticated session management.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 sm:px-6 font-semibold text-text-primary">
                      Legal & Regulatory Authorities
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      Where required to comply with applicable law, court order, or to protect the safety and rights of users.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 sm:px-6 font-semibold text-text-primary">
                      Successor Entity
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      In the event of a merger, acquisition, or restructuring, subject to equivalent confidentiality standards.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">4.</span>
              <span>Data Retention</span>
            </h2>
            <p className="text-text-secondary">
              We retain personal data for as long as your account remains active or as needed to provide our services. You may delete your account at any time. When an account is deleted, personal profile data is purged or anonymized within a reasonable timeframe, except where retention is legally mandated.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">5.</span>
              <span>Your Rights and Choices</span>
            </h2>
            <p className="text-text-secondary">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>Access:</strong> Request confirmation and copies of personal information we maintain about you.</li>
              <li><strong>Correction:</strong> Update or rectify incomplete or inaccurate profile details directly from your account page.</li>
              <li><strong>Deletion:</strong> Request permanent erasure of your account and associated personal data.</li>
              <li><strong>Portability:</strong> Request an export of your parsed profile details in machine-readable format.</li>
              <li><strong>Withdraw Consent:</strong> Revoke consent for optional communications or data processing at any time.</li>
            </ul>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
              <h4 className="font-bold text-sm text-secondary mb-1">5.1 Profile Visibility Control</h4>
              <p className="text-xs sm:text-sm text-text-secondary">
                Job Seekers retain full control over whether their profile is searchable by verified recruiters. Toggling visibility settings will immediately exclude your profile from recruiter talent search.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">6.</span>
              <span>Data Security</span>
            </h2>
            <p className="text-text-secondary">
              We implement industry-standard organizational and technical safeguards, including TLS/HTTPS encryption in transit, strict database access controls, salted bcrypt password hashing, and in-memory buffer processing for PDF resumes. While we maintain rigorous security protocols, no internet transmission is completely impervious, and absolute security cannot be guaranteed.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">7.</span>
              <span>Cookies and Tracking Technologies</span>
            </h2>
            <p className="text-text-secondary">
              We use secure, HTTP-only cookies and local storage to keep you logged in, persist filter preferences, and manage notification read states. You can modify your browser settings to decline cookies, though certain authentication features may not function properly without cookies enabled.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">8.</span>
              <span>Children&apos;s Privacy</span>
            </h2>
            <p className="text-text-secondary">
              CodifyPro is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors. If we discover that information has been provided by a minor, we will promptly delete it.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">9.</span>
              <span>International Data Transfers</span>
            </h2>
            <p className="text-text-secondary">
              Your information may be processed and hosted on cloud infrastructure located outside your country of residence. We ensure that suitable contractual and technical protections are established to safeguard your data in compliance with applicable data privacy laws.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">10.</span>
              <span>Third-Party Links</span>
            </h2>
            <p className="text-text-secondary">
              Our platform contains links to external job postings, employer websites, and third-party career portals. We have no authority over and assume no responsibility for the content, privacy practices, or policies of external sites.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">11.</span>
              <span>Changes to This Privacy Policy</span>
            </h2>
            <p className="text-text-secondary">
              We may update this Privacy Policy from time to time. Material updates will be communicated through platform notices or email, and reflected by updating the &quot;Last Updated&quot; date above.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <span className="text-primary font-black">12.</span>
              <span>Contact Us</span>
            </h2>
            <p className="text-text-secondary">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data rights, please reach out to us:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-primary">
                <Mail className="h-4 w-4 text-primary" />
                <span><strong>Privacy Contact:</strong> privacy@codifypro.aimtechsolutions.org</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <MapPin className="h-4 w-4 text-primary" />
                <span><strong>Platform:</strong> Aimtech Solutions Platform — CodifyPro Security Team</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

