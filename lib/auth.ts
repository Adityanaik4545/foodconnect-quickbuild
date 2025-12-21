import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/db"; // <-- IMPORTANT
import { account, session, user, verification } from "../drizzle/schema";
import { nextCookies} from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema:{
      user,
      account,
      session,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!
});