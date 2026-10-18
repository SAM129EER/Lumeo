import { AppError } from "../../utils/app-error.js";
import { generateToken } from "../../utils/jwt.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { createUser, findUserByEmail } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.types.js";

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
