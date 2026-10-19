import prisma from "../../config/prisma.js";

// --- User Operations ---
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: { email: string; passwordHash: string }) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
    },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function markEmailAsVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerifiedAt: new Date() },
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

// --- Email Verification Token Operations ---
export async function createEmailVerificationToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: data.userId },
  });

  return prisma.emailVerificationToken.create({
    data,
  });
}

export async function findEmailVerificationToken(tokenHash: string) {
  return prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });
}

export async function deleteEmailVerificationToken(id: string) {
  return prisma.emailVerificationToken.delete({
    where: { id },
  });
}

// --- Password Reset Token Operations ---
export async function createPasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  await prisma.passwordResetToken.deleteMany({
    where: { userId: data.userId },
  });

  return prisma.passwordResetToken.create({
    data,
  });
}

export async function findPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
}

export async function deletePasswordResetToken(id: string) {
  return prisma.passwordResetToken.delete({
    where: { id },
  });
}
