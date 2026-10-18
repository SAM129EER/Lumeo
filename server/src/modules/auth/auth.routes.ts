import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));

export default router;
