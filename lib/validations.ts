import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Export TypeScript type only for TS files (Better Auth, Drizzle)
export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
