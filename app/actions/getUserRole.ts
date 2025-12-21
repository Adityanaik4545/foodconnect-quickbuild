"use server";

import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { userProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getUserRole() {
  const reqHeaders = await headers();

  const { user } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!user?.id) return null;

  const result = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, user.id));

  if (result.length === 0) return null;

  return result[0].role; // "donor" | "receiver"
}
