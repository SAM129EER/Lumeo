import type { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";
import { ApiResponse } from "../../utils/api-response.js";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await registerUser(req.body);
  ApiResponse.created(res, "User registered successfully.", result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await loginUser(req.body);
  ApiResponse.success(res, "Login successful.", result);
}
