// app/actions/isUserRestricted.ts
"use server";

import { db } from "@/drizzle/db";
import { user as userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function isUserRestricted() {
    const { user } = await auth.api.getSession({
        headers: await headers(),
    });

    if (!user) return false;

    const dbUser = await db.query.user.findFirst({
        where: eq(userTable.id, user.id),
        columns: {
            isRestricted: true,
            restrictedReason: true,
            restrictedAt: true,
        },
    });

    return dbUser;
}