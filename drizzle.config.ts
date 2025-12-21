import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",          // where migration files will be created
  schema: "./drizzle/schema.ts",   // our schema file
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
