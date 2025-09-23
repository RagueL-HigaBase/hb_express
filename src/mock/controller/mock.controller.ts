import type { ErrorRequestHandler, Request, Response } from "express";

export async function mockController(req: Request, res: Response, err: ErrorRequestHandler) {
    res.status(404).json({
        ok: false,
        message: "system.enpoint.unexist"
    })
}