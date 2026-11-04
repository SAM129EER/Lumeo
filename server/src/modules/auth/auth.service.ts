import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  generateSecureToken,
  hashToken,
} from "../../utils/security.js";
import { authRepository } from "./auth.repository.js";
import type {
  AuthResponse,
  AuthTokens,
  LoginInput,
  RegisterInput,
  SafeUser,
} from "./auth.types.js";

export const authService = {
  
  async register(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError(
        409,
        "An account with this email already exists.",
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const passwordHash = await hashPassword(input.password);

    const user = await authRepository.createUser({
      email,
      passwordHash,
      ...(input.name ? { name: input.name.trim() } : {}),
    });

    const tokens = await this.issueTokens(user.id, user.email);

    return { user, tokens };
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);
    if (!user || !user.passwordHash) {
      throw new AppError(
        401,
        "Invalid email or password.",
        "INVALID_CREDENTIALS"
      );
    }

    const isPasswordValid = await verifyPassword(
      input.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new AppError(
        401,
        "Invalid email or password.",
        "INVALID_CREDENTIALS"
      );
    }

    const tokens = await this.issueTokens(user.id, user.email);

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: safeUser, tokens };
  },

  async refresh(rawRefreshToken: string): Promise<AuthTokens> {
    const tokenHash = hashToken(rawRefreshToken);

    const tokenRecord = await authRepository.findRefreshToken(tokenHash);
    if (!tokenRecord) {
      throw new AppError(
        401,
        "Invalid refresh token.",
        "INVALID_REFRESH_TOKEN"
      );
    }

    // Reuse detection: if a revoked token is presented, revoke all sessions for safety
    if (tokenRecord.revokedAt) {
      await authRepository.revokeAllUserRefreshTokens(tokenRecord.userId);
      throw new AppError(
        401,
        "Revoked refresh token used. Please log in again.",
        "REVOKED_REFRESH_TOKEN"
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new AppError(
        401,
        "Refresh token has expired. Please log in again.",
        "EXPIRED_REFRESH_TOKEN"
      );
    }

    // Rotate refresh token: revoke current and issue a new pair
    await authRepository.revokeRefreshToken(tokenHash);

    return this.issueTokens(tokenRecord.user.id, tokenRecord.user.email);
  },

  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = hashToken(rawRefreshToken);
    await authRepository.revokeRefreshToken(tokenHash);
  },

  async getMe(userId: string): Promise<SafeUser> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, "User not found.", "USER_NOT_FOUND");
    }
    return user;
  },

  async issueTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessToken = generateAccessToken({ userId, email });

    const rawRefreshToken = generateSecureToken(40);
    const refreshTokenHash = hashToken(rawRefreshToken);

    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
    );

    await authRepository.createRefreshToken({
      tokenHash: refreshTokenHash,
      userId,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
    };
  },
};
