import auth from "@/app/middlewares/auth.js";
import validateRequest from "@/app/middlewares/validate-req.js";
import { Router } from "express";
import { PostController } from "@/app/modules/post/post.controllers.js";
import { PostValidation } from "@/app/modules/post/post.validation.js";
import { singleFileUpload } from "@/helpers/fileUploader.js";

const router = Router();

router.get("/feed", auth(), PostController.getPosts);

router.get("/reacted/:id/post", auth(), PostController.reacted)

router.get(
  "/:id/likes",
  auth(),
  validateRequest(PostValidation.getLikesSchema),
  PostController.getLikes
);

router.get(
  "/:id/comments",
  auth(),
  validateRequest(PostValidation.getCommentsSchema),
  PostController.getComments
);

router.post(
  "/",
  auth(),
  // validateRequest(PostValidation.createPostSchema),
  singleFileUpload("image"),
  PostController.createPost
);

router.delete(
  "/:id",
  auth(),
  validateRequest(PostValidation.deletePostSchema),
  PostController.deletePost
);


export const PostRoutes = router;
