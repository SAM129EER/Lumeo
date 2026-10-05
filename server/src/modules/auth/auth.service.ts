import { AppError } from "../../utils/app-error.js";
import { hashPassword } from "../../utils/password.js";
import { createUser, findUserByEmail } from "./auth.repository.js";
import type { RegisterInput } from "./auth.types.js";

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(
      409,
      "An account with this email already exists.",
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const passwordHash = await hashPassword(input.password);

  return createUser({
    email,
    passwordHash,
  });
}
