import { sessionUnexist } from "../../../shared/messages/server.js";
import { sessionServicePaper } from "../../services/paper/session.service.js";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME } from "../../../shared/config.js";
export async function loginControllerLayer(req, res) {
    // RU: Статусы 200/404 выбраны под фронтовую логику; альтернативно отсутствие сессии можно обозначать 401/419.
    // EN: 200/404 are chosen for frontend flow; alternatively, no session can be signaled with 401/419.
    // NL: 200/404 zijn gekozen voor de frontend-flow; alternatief is geen sessie met 401/419.
    // RU: Важно: атрибуты clearCookie (path/sameSite/secure/domain) должны совпадать с теми, что использовались при установке, иначе кука не удалится.
    // EN: Important: clearCookie attributes (path/sameSite/secure/domain) must match those used when setting; otherwise the cookie won’t be removed.
    // NL: Belangrijk: clearCookie-attributen (path/sameSite/secure/domain) moeten overeenkomen met die bij het zetten; anders wordt de cookie niet verwijderd.
    const { session } = req.cookies;
    // RU: Читает httpOnly-куку session; если её нет или это не строка — очищает куку (maxAge:0, secure, sameSite:lax, path:/) и отвечает 200 { ok:false, message:sessionUnexist }.
    // EN: Reads the httpOnly session cookie; if missing or not a string, clears it (maxAge:0, secure, sameSite:lax, path:/) and returns 200 { ok:false, message:sessionUnexist }.
    // NL: Leest de httpOnly session-cookie; ontbreekt of geen string, wist hem (maxAge:0, secure, sameSite:lax, path:/) en geeft 200 { ok:false, message:sessionUnexist }.
    if (!session || typeof session !== 'string') {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(400).json({ ok: false, message: sessionUnexist, reason: "test from reasone" });
    }
    // RU: Затем вызывает sessionServicePaper(session) для проверки/поиска сессии в БД/сервисе.
    // EN: Then calls sessionServicePaper(session) to validate/lookup the session in the DB/service.
    // NL: Roept vervolgens sessionServicePaper(session) aan om de sessie te valideren/op te zoeken in de DB/service.
    const r = await sessionServicePaper(session);
    console.log(r);
    // RU: Если сервис вернул неуспех (!r.ok) — чистит куку и отвечает 404 с телом r (например, сессия не найдена/протухла).
    // EN: If the service fails (!r.ok), clears the cookie and responds 404 with payload r (e.g., session not found/expired).
    // NL: Bij falen van de service (!r.ok), cookie wissen en 404 met payload r (bijv. sessie niet gevonden/verlopen).
    if (!r.ok) {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(404).json({ ...r });
    }
    return res.status(200).json({ ...r });
}
//# sourceMappingURL=login.controller.js.map