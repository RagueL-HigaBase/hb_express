import { sessionUnexist } from "../../shared/messages/server.js";
import { pinServicePaper } from "../services/paper/pin.service.js";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME } from "../../shared/config.js";
export async function pinMiddleware(req, res, next) {
    // RU: Читаем httpOnly-куку `session`; если нет/не строка — чистим куку и возвращаем 404 sessionUnexist.
    // EN: Read the httpOnly `session` cookie; if missing/not a string — clear the cookie and return 404 sessionUnexist.
    // NL: Lees de httpOnly `session`-cookie; ontbreekt/niet als string — cookie wissen en 404 sessionUnexist teruggeven.
    const { session } = req.cookies;
    if (!session || typeof session !== 'string') {
        return res.status(404) // RU/EN/NL: статус до отправки тела / status before body
            .clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS) // RU/EN/NL: удалить куку с совпадающими атрибутами
            .json({
            ok: false,
            message: sessionUnexist,
        });
    }
    // RU: Проверяем состояние PIN для текущей сессии.
    // EN: Validate the PIN state for the current session.
    // NL: Valideer de PIN-status voor de huidige sessie.
    const r = await pinServicePaper(session);
    // RU: Если сервис вернул неуспех — чистим куку и отдаём ошибку (проксируем тело `r`).
    // EN: On failure — clear the cookie and proxy the error payload `r`.
    // NL: Bij falen — cookie wissen en de foutpayload `r` teruggeven.
    if (!r.ok)
        return res.status(404)
            .clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS)
            .json({ ...r });
    // RU: Если PIN ещё действителен — сессия активна, отдаём 200 и сообщение.
    // EN: If the PIN is still valid — session is active, return 200 with a message.
    // NL: Als de PIN nog geldig is — sessie actief, 200 met bericht teruggeven.
    if (!r.data.pinElapsed) {
        return res.status(200).json({ ok: true, data: { pinElapsed: r.data.pinElapsed } });
    }
    // RU: Если PIN истёк — пробрасываем идентификатор в res.locals и передаём дальше (покажет экран PIN).
    // EN: If the PIN has expired — stash the id in res.locals and call next() (to show the PIN screen).
    // NL: Als de PIN is verlopen — id in res.locals plaatsen en doorgaan met next() (PIN-scherm tonen).
    if (r.data.pinElapsed) {
        res.locals.user = r.data.id;
        return next();
    }
}
//# sourceMappingURL=pin.middleware.js.map