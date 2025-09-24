import { Router } from "express";
import { registerController } from "../controllers/post/register.controller.js";
import { loginController } from "../controllers/post/login.controller.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";

export const publicRouter = Router();

publicRouter.post('/register', registerController);

publicRouter.post('/login',sessionMiddleware, loginController);

publicRouter.patch('/pin', sessionMiddleware);
