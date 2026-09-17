import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().trim().max(255).toLowerCase(),
  password: z.string().min(8).max(128),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
