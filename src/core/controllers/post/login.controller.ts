import type { Request, Response } from "express";
import { validateLogin } from "../../validators/login.validator.js";
import { zodError } from "../../../shared/messages/zod.js";
import { loginServiceCreate } from "../../services/read/login.service.js";

export async function loginController(req: Request, res: Response) {
    const { password, email, pin } = req.body;

    const v = validateLogin.safeParse({ email, password, pin });
    if (!v.success) return res.status(401).json({ ok: false, message: zodError })

    const isExist = await loginServiceCreate(v.data);
}