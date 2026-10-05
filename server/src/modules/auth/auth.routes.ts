import { Router } from "express";
import { register } from "./auth.controller.js";
import { registerSchema } from "./auth.validation.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));

export default router;
