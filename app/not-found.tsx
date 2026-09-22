import Link from "next/link";
import { Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodifyProLogo } from "@/components/layout/CodifyProLogo";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-border shadow-card">
        <div className="flex justify-center">
          <CodifyProLogo size="lg" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            404 Error
          </span>
          <h1 className="text-3xl font-black text-secondary tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            The page you are looking for doesn&apos;t exist or has moved. Explore available tech jobs or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-2">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Explore Jobs</span>
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
              <Home className="h-3.5 w-3.5" />
              <span>Go Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

