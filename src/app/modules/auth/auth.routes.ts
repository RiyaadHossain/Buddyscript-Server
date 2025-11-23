import auth from "@/app/middlewares/auth.js";
import { loginRateLimiter } from "@/app/middlewares/rate-limit.js";
import validateRequest from "@/app/middlewares/validate-req.js";
import { AuthController } from "@/app/modules/auth/auth.controllers.js";
import { AuthValidation } from "@/app/modules/auth/auth.validation.js";
import { Router } from "express";

const router = Router();

router.get(
  "/signup",
  validateRequest(AuthValidation.signupSchema),
  AuthController.signup
);

router.get(
  "/login",
  loginRateLimiter,
  validateRequest(AuthValidation.loginSchema),
  AuthController.login
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordSchema),
  auth(),
  AuthController.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
