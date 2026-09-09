import argon2 from "argon2";
import prisma from "../../config/prisma.js";
import type { RegisterInput } from "./auth.validation.js";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exist");
  }

  const passwordHash = await argon2.hash(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
}
