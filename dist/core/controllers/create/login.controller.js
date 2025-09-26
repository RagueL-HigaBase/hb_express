import { validateLogin } from "../../validators/login.validator.js";
import { zodError } from "../../../shared/messages/zod.js";
import { loginServiceCreate } from "../../services/create/login.service.js";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME, SET_COOKIE_OPTS } from "../../../shared/config.js";
export async function loginControllerCreate(req, res) {
    // RU: Деструктурируем email, password, pin из тела запроса для логина.
    // EN: Destructure email, password, pin from the request body for login.
    // NL: Haal email, password en pin uit de request body voor inloggen.
    const { password, email, pin } = req.body;
    // RU: Валидируем вход через Zod; при ошибке — 401 с сообщением zodError (ранний выход).
    // EN: Validate input with Zod; on failure, return 401 with zodError (early return).
    // NL: Valideer invoer met Zod; bij fout 401 met zodError (vroege return).
    const v = validateLogin.safeParse({ email, password, pin });
    // RU: При ошибке валидации (Zod) — вернуть 401 Unauthorized с ok:false и сообщением zodError (ранний выход).
    // EN: On validation failure (Zod), return 401 Unauthorized with ok:false and the zodError message (early return).
    // NL: Bij validatiefout (Zod) 401 Unauthorized teruggeven met ok:false en het zodError-bericht (vroege return)
    if (!v.success) {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(401).json({ ok: false, message: zodError });
    }
    // RU: Пытаемся аутентифицировать через loginServiceCreate (проверка email/пароля/PIN).
    // EN: Attempt authentication via loginServiceCreate (checks email/password/PIN).
    // NL: Authenticeer via loginServiceCreate (controleert email/wachtwoord/PIN).
    const isExist = await loginServiceCreate(v.data);
    // RU: Если сервис вернул неуспех — 401 и тело ошибки isExist (неверные данные/аккаунт).
    // EN: If the service fails — return 401 with error payload isExist (invalid credentials/account).
    // NL: Bij falen van de service — 401 met foutpayload isExist (ongeldige gegevens/account).
    if (!isExist.ok) {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(401).json({ ...isExist });
    }
    // RU: При успехе — ставим httpOnly-куку session с токеном и отвечаем 201 с данными isExist.
    // EN: On success — set an httpOnly session cookie with the token and respond 201 with isExist data.
    // NL: Bij succes — zet een httpOnly session-cookie met de token en antwoord 201 met isExist-gegevens.
    return res.status(200)
        .cookie(COOKIE_NAME, isExist.data.token, SET_COOKIE_OPTS)
        .json({ ok: isExist.ok, data: {
            message: isExist.data.message
        } });
}
//# sourceMappingURL=login.controller.js.map