import { Router } from "express";
import auth from "@/app/middlewares/auth.js";
import validateRequest from "@/app/middlewares/validate-req.js";
import { LikeController } from "@/app/modules/like/like.controllers.js";
import { LikeValidation } from "@/app/modules/like/like.validation.js";

const router = Router();

router.post(
  "/",
  auth(),
  validateRequest(LikeValidation.likeSchema),
  LikeController.like
);
router.post(
  "/unlike",
  auth(),
  validateRequest(LikeValidation.unlikeSchema),
  LikeController.unlike
);

export const LikeRoutes = router;
