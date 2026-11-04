import { Router } from "express";
import { authController } from "./auth.controller.js";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.validation.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler((req, res) => authController.register(req, res))
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler((req, res) => authController.login(req, res))
);

router.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  asyncHandler((req, res) => authController.refresh(req, res))
);

router.post(
  "/logout",
  validateBody(refreshTokenSchema),
  asyncHandler((req, res) => authController.logout(req, res))
);

router.get(
  "/me",
  requireAuth,
  asyncHandler((req, res) => authController.getMe(req, res))
);

export default router;
