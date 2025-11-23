import { logger } from "@/utils/logger.js";
import type { LoginPayload } from "@modules/auth/auth.interface.js";

const login = async (payload: LoginPayload) => {
  // Simulate user authentication logic
  logger.info(`User ${payload} attempting to log in.`);
  return { token: "fake-jwt-token", user: { id: 1, name: "John Doe" } };
};

export const AuthService = {
  login,
};
