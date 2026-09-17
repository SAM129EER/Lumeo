import { env } from "../../config/env.js";
import { sendEmail } from "../../infrastructure/email/email.service.js";
import { createVerificationEmail } from "../../infrastructure/email/template/verification-email.js";
import { AppError } from "../../utils/app-error.js";
import { hashPassword } from "../../utils/password.js";
import { createUser, findUserByEmail } from "./auth.repository.js";
import type { RegisterInput } from "./auth.types.js";
import {
  createEmailVerificationToken,
  verifyEmailToken,
} from "./verification/verification.service.js";

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists.",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await createUser({
    email,
    passwordHash,
  });

  const rawToken = await createEmailVerificationToken(user.id);
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${rawToken}`;
  const emailTemplate = createVerificationEmail({ verificationUrl });

  // Asynchronously send email without blocking response
  sendEmail({
    to: user.email,
    subject: emailTemplate.subject,
    text: emailTemplate.text,
    html: emailTemplate.html,
  }).catch((err) => {
    console.error(`[Auth Service] Failed to send verification email to ${user.email}:`, err);
  });

  return user;
}

export async function verifyEmail(token: string) {
  return verifyEmailToken(token);
}
