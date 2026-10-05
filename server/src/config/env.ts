import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment configuration:", _env.error.format());
}

export const env = _env.success ? _env.data : envSchema.parse({});
