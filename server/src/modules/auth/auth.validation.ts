import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .email("Please provide a valid email address.")
    .trim()
    .toLowerCase()
    .max(255, "Email address is too long."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password cannot exceed 128 characters."),
});

export type RegisterInputDTO = z.infer<typeof registerSchema>;
