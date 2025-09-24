import { Router } from "express";
import { registerController } from "../controllers/create/register.controller.js";
import { loginControllerCreate } from "../controllers/create/login.controller.js";
import { loginMiddleware } from "../middleware/session.middleware.js";

export const publicRouter = Router();

publicRouter.post('/register', registerController);

publicRouter.post('/login', loginMiddleware, loginControllerCreate);
