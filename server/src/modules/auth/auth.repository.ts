import prisma from "../../config/prisma.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
    },
    select: {
      id: true,
      email: true,
      status: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function markUserEmailAsVerified(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerifiedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      status: true,
      emailVerifiedAt: true,
      updatedAt: true,
    },
  });
}
