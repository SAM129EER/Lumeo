import type { Request, Response } from "express";
import { registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: {
      user,
    },
  });
}
