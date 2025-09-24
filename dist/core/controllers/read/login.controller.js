import { loginServiceRead } from "../../services/read/login.service.js";
export async function loginControllerRead(req, res, next) {
    const { session } = req.cookies;
    if (typeof session === "string") {
        const sessionToken = await loginServiceRead(session);
        return res.status(200).json({ ...sessionToken });
    }
    console.log(session);
}
//# sourceMappingURL=login.controller.js.map