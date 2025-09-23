import type { NextFunction, Request, Response } from "express";
import { sessionServiceUpdate } from "../services/read/session.service.js";

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const { token } = req.cookies;
    if (token) return res.status(401).json({ ok: false, message: "" })
    const hasSession = await sessionServiceUpdate(token);

    next();
}