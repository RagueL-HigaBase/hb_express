import { Router } from "express";
import { registerController } from "../controllers/create/register.controller.js";
import { loginControllerCreate } from "../controllers/create/login.controller.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";
export const publicRouter = Router();
publicRouter.post('/register', registerController);
publicRouter.post('/login', sessionMiddleware, loginControllerCreate);
//# sourceMappingURL=main.routes.js.map