import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { AppError } from "../../utils/app-error.js";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);
    ApiResponse.created(res, "User registered successfully.", result);
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    ApiResponse.success(res, "Login successful.", result);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);
    ApiResponse.success(res, "Tokens refreshed successfully.", tokens);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    ApiResponse.success(res, "Logged out successfully.");
  },

  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(401, "Unauthorized.", "UNAUTHORIZED");
    }

    const user = await authService.getMe(req.user.userId);
    ApiResponse.success(res, "User profile retrieved successfully.", { user });
  },
};
