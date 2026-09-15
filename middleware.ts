import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "talentpulse_token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "talentpulse-insecure-dev-secret-key-32charsmin"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  let session: { userId: string; role: string; email: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as any;
    } catch {
      session = null;
    }
  }

  const seekerRoutes = ["/dashboard", "/applications", "/resume-center"];
  const recruiterRoutes = ["/recruiter"];
  const adminRoutes = ["/admin"];

  // 1. Seeker routes protection
  const isSeekerRoute = seekerRoutes.some((route) => pathname.startsWith(route));
  if (isSeekerRoute) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Recruiter routes protection
  const isRecruiterRoute = recruiterRoutes.some((route) => pathname.startsWith(route));
  if (isRecruiterRoute) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "recruiter" && session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 3. Admin routes protection
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/resume-center/:path*",
    "/recruiter/:path*",
    "/admin/:path*",
  ],
};

