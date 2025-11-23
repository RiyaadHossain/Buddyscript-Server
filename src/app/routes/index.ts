import { AuthRoutes } from "@modules/auth/auth.routes.js";
import { UserRoutes } from "@modules/user/user.routes.js";
import { Router } from "express";

const router = Router();

const routes = [
  { path: "/auth", routes: AuthRoutes },
  { path: "/users", routes: UserRoutes },
];

routes.map((route) => router.use(route.path, route.routes));
export default router;
