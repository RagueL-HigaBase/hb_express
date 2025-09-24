import { sessionServicePatch } from "../services/update/session.service.js";
import { sessionActive } from "../../shared/messages/server.js";
export async function sessionMiddleware(req, res, next) {
    const { session } = req.cookies;
    if (!session || typeof session !== 'string')
        return next();
    const r = await sessionServicePatch(session);
    if (r.ok)
        return res.status(200).json({ ok: true, message: sessionActive });
    res.clearCookie("session", { httpOnly: true, sameSite: 'lax', secure: true, });
    next();
}
//# sourceMappingURL=session.middleware.js.map