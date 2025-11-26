import auth from "@/app/middlewares/auth.js";
import validateRequest from "@/app/middlewares/validate-req.js";
import { Router } from "express";
import { CommentController } from "@/app/modules/comment/comment.controllers.js";
import { CommentValidation } from "@/app/modules/comment/comment.validation.js";

const router = Router();

router.get("/", CommentController.getComments);

router.post(
  "/",
  auth(),
  validateRequest(CommentValidation.createCommentSchema),
  CommentController.createComment
);

router.delete(
  "/:id",
  auth(),
  validateRequest(CommentValidation.deleteCommentSchema),
  CommentController.deleteComment
);

router.get("/react/:id/comment", auth(), CommentController.react);

export const CommentRoutes = router;
