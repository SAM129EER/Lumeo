import {
  generateSecureToken,
  hashToken,
} from "../../../utils/token.js";

import {
  createVerificationToken,
} from "./verification.repository.js";

export async function createEmailVerificationToken(
  userId: string,
) {
  const token = generateSecureToken();

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + 15 * 60 * 1000,
  );

  await createVerificationToken({
    userId,
    tokenHash,
    expiresAt,
  });

  return token;
}