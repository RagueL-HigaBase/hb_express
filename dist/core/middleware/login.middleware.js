import { sessionServicePaper } from "../services/paper/session.service.js";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME } from "../../shared/config.js";
export async function loginMiddleware(req, res, next) {
    const { session } = req.cookies;
    // RU: Читает httpOnly-куку session; если её нет или это не строка — не отвечает, передаёт выполнение дальше (next()).
    // EN: Reads the httpOnly session cookie; if missing or not a string, don’t respond—pass control to the next handler (next()).
    // NL: Leest de httpOnly session-cookie; ontbreekt of is geen string — geen response, ga door naar de volgende handler (next()).
    if (!session || typeof session !== 'string')
        return next();
    // RU: Проверяет сессию через sessionServicePaper(session) (запрос к БД/валидация).
    // EN: Validates the session via sessionServicePaper(session) (DB/validation).
    // NL: Valideert de sessie via sessionServicePaper(session) (DB/validatie).
    const r = await sessionServicePaper(session);
    console.log(r);
    // RU: Если сессия валидна — немедленно отвечаем 200 с { ok:true, message:sessionActive } и прерываем цепочку.
    // EN: If the session is valid, immediately respond 200 with { ok:true, message:sessionActive } and stop the chain.
    // NL: Indien de sessie geldig is, meteen 200 antwoorden met { ok:true, message:sessionActive } en de keten stoppen.
    if (r.ok)
        return res.status(200).json({ ok: true, data: { sessionElapsed: r.data.sessionElapsed } });
    // RU: Если сессия невалидна — очищаем куку session (атрибуты совпадают с установкой) и передаём выполнение дальше (next()),
    // чтобы последующие миддлы/роуты решили, что вернуть (например, 401/редирект на логин).
    // EN: If the session is invalid, clear the session cookie (attributes matching how it was set) and call next(),
    // letting downstream middleware/routes decide the final response (e.g., 401/redirect to login).
    // NL: Is de sessie ongeldig, wis de session-cookie (attributen gelijk aan bij het zetten) en ga door met next(),
    // zodat vervolghandlers/routers het definitieve antwoord bepalen (bijv. 401/redirect naar login).
    res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
    return next();
}
//# sourceMappingURL=login.middleware.js.map