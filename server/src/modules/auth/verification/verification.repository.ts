import prisma from "../../../config/prisma.js";

export async function createVerificationToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.emailVerificationToken.create({
    data: {
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    },
  });
}


export async function findVerificationToken(tokenHash: string) {
  return prisma.emailVerificationToken.findUnique({
    where: {
      tokenHash,
    },
  });
}

export async function deleteVerificationToken(tokenHash: string) {
  return prisma.emailVerificationToken.delete({
    where: {
      tokenHash,
    },
  });
}