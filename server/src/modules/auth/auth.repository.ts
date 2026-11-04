import prisma from "../../config/prisma.js";
import type { SafeUser } from "./auth.types.js";

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const authRepository = {
  
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findUserById(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: SAFE_USER_SELECT,
    });
  },

  async createUser(data: {
    email: string;
    passwordHash: string;
    name?: string;
  }): Promise<SafeUser> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        ...(data.name ? { name: data.name } : {}),
      },
      select: SAFE_USER_SELECT,
    });
  },

  async createRefreshToken(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({
      data: {
        token: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  },

  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: {
        user: {
          select: SAFE_USER_SELECT,
        },
      },
    });
  },

  async revokeRefreshToken(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: {
        token: tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },
};
