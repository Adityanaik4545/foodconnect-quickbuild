"use server";

import { db } from "@/drizzle/db";
import { session, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function restrictUserByAdmin(
  targetUserId: string,
  reason: string
) {
  if (!reason) {
    throw new Error("Restriction reason is required");
  }

  // 1️⃣ Get current session
  const reqHeaders = await headers();
  const { user: adminUser } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!adminUser) {
    throw new Error("Not authenticated");
  }

  // 2️⃣ Admin check (simple & effective)
  if (adminUser.email !== "admin@foodconnect.com") {
    throw new Error("Unauthorized");
  }

  // 3️⃣ Prevent self-restriction (important)
  if (adminUser.id === targetUserId) {
    throw new Error("Admin cannot restrict themselves");
  }

  // 4️⃣ Update user (soft delete)
  await db
    .update(user)
    .set({
      isRestricted: true,
      restrictedReason: reason,
      restrictedAt: new Date(),
    })
    .where(eq(user.id, targetUserId));

      await db
    .delete(session)
    .where(eq(session.userId, targetUserId));

  return { success: true };
}
