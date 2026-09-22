import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "CodifyPro AI | Next-Gen AI Career & Job Discovery Platform",
  description:
    "AI-powered job platform connecting top talent with high-growth companies. AI-driven resume parsing, daily DSA & aptitude practice, and instant recruiter discovery.",
  keywords: ["AI Job Search", "Resume Parser", "Tech Jobs", "Recruiter Search", "DSA MCQ Practice", "AI"],
  authors: [{ name: "CodifyPro Team" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-alt text-text-primary antialiased flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}

