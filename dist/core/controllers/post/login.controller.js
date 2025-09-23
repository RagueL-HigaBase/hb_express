import { validateLogin } from "../../validators/login.validator.js";
import { zodError } from "../../../shared/messages/zod.js";
export async function loginController(req, res) {
    const { password, email } = req.body;
    const v = validateLogin.safeParse({ email, password });
    if (!v.success)
        return res.status(401).json({ ok: false, message: zodError });
}
//# sourceMappingURL=login.controller.js.map