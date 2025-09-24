import type { NextFunction, Request, Response } from "express";
import { sessionServicePatch } from "../services/update/session.service.js";
import { sessionActive } from "../../shared/messages/server.js";

export async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    const { session } = req.cookies;
    if (!session || typeof session !== 'string') return next();
    const r = await sessionServicePatch(session);

    if (r.ok) return res.status(200).json({ ok: true, message: sessionActive});
    res.clearCookie("session", { httpOnly: true, path: '/',  sameSite: 'lax',  secure: true, })
    return next();
}