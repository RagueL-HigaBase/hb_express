import { sessionNotExist } from "../../../shared/messages/server.js";
import { sessionServicePaper } from "../../services/paper/session.service.js";
export async function loginServiceRead(req, res) {
    const { session } = req.cookies;
    if (!session || typeof session !== 'string') {
        res.clearCookie('session', { httpOnly: true, path: '/', sameSite: 'lax', secure: true });
        return res.status(200).json({ ok: false, message: sessionNotExist });
    }
    const r = await sessionServicePaper(session);
    if (!r.ok) {
        res.clearCookie('session', { httpOnly: true, path: '/', sameSite: 'lax', secure: true });
        return res.status(404).json({ ...r });
    }
    return res.status(200).json({ ...r });
}
//# sourceMappingURL=login.service.js.map