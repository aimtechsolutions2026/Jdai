import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentPulse AI | Next-Gen AI Career & Job Discovery Platform",
  description:
    "AI-powered job platform connecting top talent with high-growth companies. Groq-driven resume parsing, daily DSA & aptitude practice, and instant recruiter discovery.",
  keywords: ["AI Job Search", "Resume Parser", "Tech Jobs", "Recruiter Search", "DSA MCQ Practice", "Groq AI"],
  authors: [{ name: "TalentPulse Team" }],
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-surface-alt text-text-primary antialiased flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}

