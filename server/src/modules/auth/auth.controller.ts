import type { Request, Response } from "express";

import { registerSchema, verifyEmailSchema } from "./auth.validation.js";
import { registerUser, verifyEmail } from "./auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);

  const user = await registerUser(input);

  res.status(201).json({
    success: true,
    data: {
      user,
    },
  });
}

export async function verifyEmailController(
  req: Request,
  res: Response
): Promise<void> {
  const input = verifyEmailSchema.parse(req.body);

  const user = await verifyEmail(input.token);

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
    data: {
      user,
    },
  });
}
