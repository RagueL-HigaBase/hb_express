import type { NextFunction, Request, Response } from "express";

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const { session } = req.cookies;
    if (session) return res.status(401).json({ ok: false, message: })
    const hasSession = await 

    next();
}