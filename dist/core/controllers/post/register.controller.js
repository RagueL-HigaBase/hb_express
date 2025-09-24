import { registerValidator } from "../../validators/register.validator.js";
import { registerServiceCreate } from "../../services/post/register.service.js";
import { zodError } from "../../../shared/messages/zod.js";
export async function registerController(req, res) {
    const { email, password, confirm } = req.body;
    const v = registerValidator.safeParse({ email, password, confirm });
    if (!v.success) {
        return res.status(401).json({
            ok: false,
            message: zodError
        });
    }
    const p = await registerServiceCreate(v.data);
    if (!p.ok)
        return res.status(401).json({ ...p });
    return res.status(200).json({ ...p });
}
//# sourceMappingURL=register.controller.js.map