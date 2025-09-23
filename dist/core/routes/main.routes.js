import { Router } from "express";
import { registerController } from "../controllers/post/register.controller.js";
import { loginController } from "../controllers/post/login.controller.js";
export const publicRouter = Router();
publicRouter.post('/register', registerController);
publicRouter.post('/login', loginController);
//# sourceMappingURL=main.routes.js.map