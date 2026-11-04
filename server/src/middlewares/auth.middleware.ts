import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken, type AccessTokenPayload } from "../utils/security.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Authorization token is required.", "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError(401, "Token is missing.", "UNAUTHORIZED");
  }

  req.user = verifyAccessToken(token);
  next();
}
