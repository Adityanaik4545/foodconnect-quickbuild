"use server";

import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { userProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateUserProfile(data: {
  name?: string;
  phoneNumber?: string;
  address?: string;
}) {
  const reqHeaders = await headers();
  const { user: sessionUser } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionUser?.id) {
    throw new Error("Not authenticated");
  }

  const userId = sessionUser.id;

  // Check if profile exists
  const existingProfile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1);

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name || null;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber || null;
  if (data.address !== undefined) updateData.address = data.address || null;

  if (existingProfile.length > 0) {
    // Update existing profile
    await db
      .update(userProfile)
      .set(updateData)
      .where(eq(userProfile.userId, userId));
  } else {
    // Create new profile if it doesn't exist
    await db.insert(userProfile).values({
      userId: userId,
      name: data.name || sessionUser.name || null,
      phoneNumber: data.phoneNumber || null,
      address: data.address || null,
      role: null, // Role should be set separately
    });
  }

  return { success: true };
}

