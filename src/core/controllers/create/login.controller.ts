import type { Request, Response } from "express";
import { validateLogin } from "../../validators/login.validator.js";
import { zodError } from "../../../shared/messages/zod.js";
import { loginServiceCreate } from "../../services/create/login.service.js";

export async function loginControllerCreate(req: Request, res: Response) {
    const { password, email, pin } = req.body;

    const v = validateLogin.safeParse({ email, password, pin });
    if (!v.success) return res.status(401).json({ ok: false, message: zodError })

    const isExist = await loginServiceCreate(v.data);
    if (!isExist.ok) return res.status(401).json({ ...isExist })
    
        return res.status(201)
        .cookie("session", isExist.data.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 3 * 60 * 60 * 1000,
        })
        .json({ ...isExist })
}