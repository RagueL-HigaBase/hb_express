import type { NextFunction, Request, Response } from "express";
import { sessionServiceRead } from "../services/read/session.service.js";

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const { session } = req.cookies;
    console.log(session);
    // const { token } = req.cookies;
    // if (token) return res.status(401).json({ ok: false, message: "" })
    // const hasSession = await sessionServiceRead(token);
    next();
}