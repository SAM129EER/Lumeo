import { AppError } from "../../utils/app-error.js";
import { generateToken } from "../../utils/jwt.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { generateSecureToken, hashToken } from "../../utils/token.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../utils/email.js";
import {
  createEmailVerificationToken,
  createPasswordResetToken,
  createUser,
  deleteEmailVerificationToken,
  deletePasswordResetToken,
  findEmailVerificationToken,
  findPasswordResetToken,
  findUserByEmail,
  markEmailAsVerified,
  updateUserPassword,
} from "./auth.repository.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "./auth.types.js";

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError(409, "An account with this email already exists.", "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await createUser({
    email,
    passwordHash,
  });

  // Generate and save email verification token (expires in 24 hours)
  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await createEmailVerificationToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  // Send verification email asynchronously
  sendVerificationEmail(user.email, rawToken).catch((err) => {
    console.error(`Failed to send verification email to ${user.email}:`, err);
  });

  const token = generateToken(user.id);

  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      status: user.status,
    },
    token,
  };
}

export async function verifyEmail(input: VerifyEmailInput) {
  const tokenHash = hashToken(input.token);

  const tokenRecord = await findEmailVerificationToken(tokenHash);
  if (!tokenRecord) {
    throw new AppError(400, "Invalid or expired verification token.", "INVALID_TOKEN");
  }

  if (tokenRecord.expiresAt < new Date()) {
    await deleteEmailVerificationToken(tokenRecord.id);
    throw new AppError(400, "Verification token has expired. Please request a new one.", "TOKEN_EXPIRED");
  }

  await markEmailAsVerified(tokenRecord.userId);
  await deleteEmailVerificationToken(tokenRecord.id);

  return { message: "Email verified successfully." };
}

export async function resendVerificationEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  // Return generic message to prevent email enumeration
  if (!user) {
    return { message: "If an account with that email exists, a verification link has been sent." };
  }

  if (user.emailVerifiedAt) {
    throw new AppError(400, "This email is already verified.", "ALREADY_VERIFIED");
  }

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await createEmailVerificationToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  await sendVerificationEmail(user.email, rawToken);

  return { message: "Verification email sent successfully." };
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const email = input.email.trim().toLowerCase();
  const user = await findUserByEmail(email);

  // Return generic message if user not found to prevent email enumeration
  if (!user) {
    return { message: "If an account with that email exists, a password reset link has been sent." };
  }

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  await sendPasswordResetEmail(user.email, rawToken);

  return { message: "Password reset link sent to your email." };
}

export async function resetPassword(input: ResetPasswordInput) {
  const tokenHash = hashToken(input.token);

  const resetRecord = await findPasswordResetToken(tokenHash);
  if (!resetRecord) {
    throw new AppError(400, "Invalid or expired password reset token.", "INVALID_TOKEN");
  }

  if (resetRecord.expiresAt < new Date()) {
    await deletePasswordResetToken(resetRecord.id);
    throw new AppError(400, "Password reset token has expired. Please request a new one.", "TOKEN_EXPIRED");
  }

  const passwordHash = await hashPassword(input.password);

  await updateUserPassword(resetRecord.userId, passwordHash);
  await deletePasswordResetToken(resetRecord.id);

  return { message: "Password has been reset successfully. You can now log in." };
}
