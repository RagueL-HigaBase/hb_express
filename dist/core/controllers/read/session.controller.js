import { loginServiceRead } from "../../services/read/login.service.js";
import { sessionUnexist } from "../../../shared/messages/server.js";
export async function sessionContrioller(req, res, next) {
    const { session } = req.cookies;
    if (typeof session === "string") {
        const sessionToken = await loginServiceRead(session);
        if (!sessionToken.ok) {
            return res.status(404)
                .cookie("session", "", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 0,
            })
                .json({ ...sessionToken });
        }
        return res.status(200).json({ ...sessionToken });
    }
    return res.status(404)
        .json({ ok: false, message: sessionUnexist })
        .cookie("session", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
//# sourceMappingURL=session.controller.js.map