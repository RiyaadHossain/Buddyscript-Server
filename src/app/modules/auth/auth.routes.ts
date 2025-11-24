import { loginRateLimiter } from "@/app/middlewares/rate-limit.js";
import validateRequest from "@/app/middlewares/validate-req.js";
import { AuthController } from "@/app/modules/auth/auth.controllers.js";
import { AuthValidation } from "@/app/modules/auth/auth.validation.js";
import { Router } from "express";

const router = Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.signupSchema),
  AuthController.signup
);

router.post(
  "/login",
  loginRateLimiter,
  validateRequest(AuthValidation.loginSchema),
  AuthController.login
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordSchema),
  AuthController.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
