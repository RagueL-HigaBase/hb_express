import { Router } from "express";
import { registerController } from "../controllers/post/register.controller.js";
export const publicRouter = Router();
publicRouter.post('/register', registerController);
//# sourceMappingURL=main.routes.js.map