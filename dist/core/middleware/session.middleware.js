import { sessionServiceRead } from "../services/read/session.service.js";
export async function sessionMiddleware(req, res, next) {
    const { session } = req.cookies;
    console.log(session);
    // const { token } = req.cookies;
    // if (token) return res.status(401).json({ ok: false, message: "" })
    // const hasSession = await sessionServiceRead(token);
    next();
}
//# sourceMappingURL=session.middleware.js.map