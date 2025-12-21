import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes (auth endpoints)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for session cookie
  // Better-auth uses cookies with "better-auth" prefix
  const cookies = request.cookies;
  const cookieHeader = request.headers.get("cookie") || "";
  
  // Check for better-auth session cookies
  // Better-auth typically uses cookies like: better-auth.session_token, better-auth.session, etc.
  const hasSessionCookie = 
    cookieHeader.includes("better-auth") ||
    cookies.has("better-auth.session_token") ||
    cookies.has("better-auth.session") ||
    cookies.has("session_token");

  // If no session cookie found, redirect to login
  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session cookie exists, allow access
  // The actual session validation will happen in the page/component
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

