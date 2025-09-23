import { registerValidator } from "../../validators/register/register.validator.js";
import { registerService } from "../../services/post/register.service.js";
export async function registerController(req, res) {
    const { email, password, confirm } = req.body;
    const v = registerValidator.safeParse({ email, password, confirm });
    if (!v.success) {
        return res.status(401).json({
            ok: false,
            message: "system.failed.validation"
        });
    }
    const p = await registerService(v.data);
    if (!p.ok)
        return res.status(401).json({ ...p });
    return res.status(200).json({ ...p });
}
//# sourceMappingURL=register.controller.js.map