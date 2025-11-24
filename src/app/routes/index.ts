import { CommentRoutes } from "@/app/modules/comment/comment.routes.js";
import { LikeRoutes } from "@/app/modules/like/like.routes.js";
import { PostRoutes } from "@/app/modules/post/post.routes.js";
import { AuthRoutes } from "@modules/auth/auth.routes.js";
import { Router } from "express";

const router = Router();

const routes = [
  { path: "/auth", routes: AuthRoutes },
  { path: "/post", routes: PostRoutes },
  { path: "/comment", routes: CommentRoutes },
  { path: "/like", routes: LikeRoutes },
];

routes.map((route) => router.use(route.path, route.routes));
export default router;
