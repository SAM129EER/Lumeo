import { Router } from "express";

import { register, verifyEmailController } from "./auth.controller.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/verify-email", asyncHandler(verifyEmailController));

export default router;
