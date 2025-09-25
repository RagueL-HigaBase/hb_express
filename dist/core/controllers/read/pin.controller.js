import { sessionNotExist } from "../../../shared/messages/server.js";
import { pinServicePaper } from "../../services/paper/pin.service.js";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME } from "../../../shared/config.js";
export async function pinControllerLayer(req, res) {
    // RU: Читаем httpOnly-куку сессии; если отсутствует/не строка — очищаем __Host-session (атрибуты совпадают) и возвращаем 404 sessionNotExist.
    // EN: Read the httpOnly session cookie; if missing/not a string — clear __Host-session (matching attrs) and return 404 sessionNotExist.
    // NL: Lees de httpOnly sessiecookie; ontbreekt/geen string — wis __Host-session (zelfde attributen) en geef 404 sessionNotExist.
    const { session } = req.cookies;
    if (!session || typeof session !== 'string') {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(404).json({ ok: false, message: sessionNotExist });
    }
    // RU: Проверяем PIN-состояние по текущей сессии; при неуспехе чистим куку и маскируем ответ как «сессии нет» (404).
    // EN: Validate PIN state for the current session; on failure clear the cookie and mask the reply as “no session” (404).
    // NL: Valideer PIN-status voor de huidige sessie; bij falen cookie wissen en als “geen sessie” antwoorden (404).
    const r = await pinServicePaper(session);
    if (!r.ok) {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(404).json({ ok: false, message: sessionNotExist });
    }
    // RU: Успех — 200 с флагом ok:true и передачей срока действия PIN (pinElapsed).
    // EN: Success — 200 with ok:true and the PIN expiry timestamp (pinElapsed).
    // NL: Succes — 200 met ok:true en de vervaltijd van de PIN (pinElapsed).
    return res.status(200).json({ ok: true, data: { pinElapsed: r.data.pinElapsed } });
}
//# sourceMappingURL=pin.controller.js.map