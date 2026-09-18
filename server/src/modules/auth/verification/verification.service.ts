import { AppError } from "../../../utils/app-error.js";
import { generateSecureToken, hashToken } from "../../../utils/token.js";
import { markUserEmailAsVerified } from "../auth.repository.js";
import {
  createVerificationToken,
  deleteVerificationToken,
  findVerificationToken,
} from "./verification.repository.js";

export async function createEmailVerificationToken(userId: string) {
  const token = generateSecureToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await createVerificationToken({
    userId,
    tokenHash,
    expiresAt,
  });

  return token;
}

export async function verifyEmailToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const record = await findVerificationToken(tokenHash);

  if (!record) {
    throw new AppError(
      400,
      "Invalid or expired email verification token.",
      "INVALID_VERIFICATION_TOKEN"
    );
  }

  if (record.expiresAt < new Date()) {
    await deleteVerificationToken(tokenHash);
    throw new AppError(
      400,
      "Verification token has expired. Please request a new one.",
      "VERIFICATION_TOKEN_EXPIRED"
    );
  }

  const updatedUser = await markUserEmailAsVerified(record.userId);
  await deleteVerificationToken(tokenHash);

  return updatedUser;
}