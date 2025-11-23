import { loginRateLimiter } from "@/app/middlewares/rate-limit.js";
import validateRequest from "@/app/middlewares/validate-req.js";
import { AuthController } from "@/app/modules/auth/auth.controllers.js";
import { AuthValidation } from "@/app/modules/auth/auth.validation.js";
import { Router } from "express";

const router = Router();

router.get(
  "/login",
  loginRateLimiter,
  validateRequest(AuthValidation.loginSchema),
  AuthController.login
);

export const AuthRoutes = router;
