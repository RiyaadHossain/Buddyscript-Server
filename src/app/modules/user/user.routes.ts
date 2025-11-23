import { UserController } from "@modules/user/user.controllers.js";
import { USER_ROLES } from "@/enums/user.js";
import auth from "@middlewares/auth.js";
import { Router } from "express";

const router = Router();
router.get("/", auth(USER_ROLES.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;