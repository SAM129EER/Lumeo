import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().trim().max(255).toLowerCase(),
  password: z.string().min(8).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
