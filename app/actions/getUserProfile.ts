"use server";

import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { userProfile, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getUserProfile() {
  const reqHeaders = await headers();
  const { user: sessionUser } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionUser?.id) {
    throw new Error("Not authenticated");
  }

  // Get user profile
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, sessionUser.id))
    .limit(1);

  // Get user data (email, etc.)
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, sessionUser.id))
    .limit(1);

  if (profile.length === 0 || userData.length === 0) {
    return {
      name: userData[0]?.name || null,
      email: userData[0]?.email || null,
      phoneNumber: null,
      address: null,
      role: null,
    };
  }

  return {
    name: profile[0].name || userData[0].name || null,
    email: userData[0].email || null,
    phoneNumber: profile[0].phoneNumber || null,
    address: profile[0].address || null,
    role: profile[0].role || null,
    latitude: profile[0].latitude || null,
    longitude: profile[0].longitude || null,
  };
}

