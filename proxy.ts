// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { user as userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/restricted",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //Allow public routes
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  //Get session
  const { user } = await auth.api.getSession({
    headers: request.headers,
  });

  //Not logged in → login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  //Restricted user check
  const dbUser = await db.query.user.findFirst({
    where: eq(userTable.id, user.id),
    columns: { isRestricted: true },
  });

  if (dbUser?.isRestricted) {
    return NextResponse.redirect(new URL("/restricted", request.url));
  }

  //Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
