import prisma from "../../config/prisma.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
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
