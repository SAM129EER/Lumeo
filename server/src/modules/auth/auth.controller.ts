import type { Request, Response } from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "./auth.service.js";
import { ApiResponse } from "../../utils/api-response.js";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await registerUser(req.body);
  ApiResponse.created(
    res,
    "User registered successfully. Please check your email to verify your account.",
    result
  );
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await loginUser(req.body);
  ApiResponse.success(res, "Login successful.", result);
}

export async function verifyEmailController(req: Request, res: Response): Promise<void> {
  const result = await verifyEmail(req.body);
  ApiResponse.success(res, result.message);
}

export async function resendVerificationController(req: Request, res: Response): Promise<void> {
  const result = await resendVerificationEmail(req.body.email);
  ApiResponse.success(res, result.message);
}

export async function forgotPasswordController(req: Request, res: Response): Promise<void> {
  const result = await forgotPassword(req.body);
  ApiResponse.success(res, result.message);
}

export async function resetPasswordController(req: Request, res: Response): Promise<void> {
  const result = await resetPassword(req.body);
  ApiResponse.success(res, result.message);
}
