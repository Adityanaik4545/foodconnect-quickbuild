"use server";

import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { userProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function saveUserRole(role: string) {
  // Authenticate user
  const reqHeaders = await headers();
  const {user} = await auth.api.getSession({
    headers: reqHeaders
  });

  if (!user.id) {
    throw new Error("Not authenticated");
  }

  const userId = user.id;
  
  // Check if profile already exists with a role
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId));

  if (profile.length > 0 && profile[0].role) {
    // User already has a role - prevent changing it
    throw new Error(`You are already registered as a ${profile[0].role}. You cannot change your role.`);
  }

  if (profile.length > 0) {
    // Profile exists but no role set - update with role
    await db
      .update(userProfile)
      .set({ role })
      .where(eq(userProfile.userId, userId));

    return { created: true };
  }

  // Create new profile
  await db.insert(userProfile).values({
    userId: userId,
    role: role,
    name: user.name || null,
    phoneNumber: null,
    address: null,
    latitude: null,
    longitude: null,
  });

  return { created: true };
}
