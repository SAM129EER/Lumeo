import { Router } from "express";
import {
  forgotPasswordController,
  login,
  register,
  resendVerificationController,
  resetPasswordController,
  verifyEmailController,
} from "./auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validation.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

// Authentication
router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));

// Email Verification
router.post("/verify-email", validateBody(verifyEmailSchema), asyncHandler(verifyEmailController));
router.post("/resend-verification", validateBody(resendVerificationSchema), asyncHandler(resendVerificationController));

// Password Reset
router.post("/forgot-password", validateBody(forgotPasswordSchema), asyncHandler(forgotPasswordController));
router.post("/reset-password", validateBody(resetPasswordSchema), asyncHandler(resetPasswordController));

export default router;
