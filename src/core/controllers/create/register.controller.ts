import type { Request, Response } from "express";
import { registerValidator } from "../../validators/register.validator.js";
import { registerServiceCreate } from "../../services/create/register.service.js";
import { zodError } from "../../../shared/messages/zod.js";

export async function registerControllerCreate(req: Request, res: Response) {
    // RU: Деструктурируем поля из тела запроса: email, password, confirm.
    // EN: Destructure request body fields: email, password, confirm.
    // NL: Destructureert velden uit de request body: email, password, confirm.
    const { email, password, confirm } = req.body;

    // RU: Валидируем входные данные через Zod: registerValidator.safeParse.
    // EN: Validate input using Zod: registerValidator.safeParse.
    // NL: Valideert invoer met Zod: registerValidator.safeParse
    const v = registerValidator.safeParse({ email, password, confirm });
    // RU: При ошибке валидации возвращаем 401 с ok:false и сообщением zodError (ранний выход).
    // EN: On validation failure, return 401 with ok:false and zodError message (early return).
    // NL: Bij validatiefout 401 terug met ok:false en zodError-bericht (vroege return).
    if (!v.success) {
        return res.status(401).json({
            ok: false,
            message: zodError
        })
    }
    
    // RU: Создаём пользователя через сервис registerServiceCreate с проверенными данными v.data.
    // EN: Create the user via registerServiceCreate using validated data v.data.
    // NL: Maakt de gebruiker aan via registerServiceCreate met gevalideerde data v.data.
    const p = await registerServiceCreate(v.data);

    // RU: Если сервис вернул неуспех — 401 с телом ошибки p.
    // EN: If the service fails — return 401 with error payload p.
    // NL: Als de service faalt — 401 met foutpayload p.
    if (!p.ok) return res.status(401).json({ ...p });

    // RU: Успех — 200 и результат p (например, созданный пользователь/токены).
    // EN: On success — 200 with result p (e.g., created user/tokens).
    // NL: Succes — 200 met resultaat p (bijv. aangemaakte gebruiker/tokens).
    return res.status(200).json({ ...p });
}