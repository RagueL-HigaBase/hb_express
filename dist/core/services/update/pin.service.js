import { stringDecrypt } from "../../../shared/cipher/string.cipher.js";
import { PIN_TTL_MS, SESSION_TTL_MS } from "../../../shared/config.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { pinExtended, serverError, sessionUnexist } from "../../../shared/messages/server.js";
export async function pinServiceRevoke(sessionId) {
    try {
        // RU: Ищем сессию по ID; если нет — сообщаем, что сессии не существует.
        // EN: Look up the session by ID; if missing — report it does not exist.
        // NL: Zoek de sessie op ID; indien ontbreekt — meld dat deze niet bestaat.
        const f = await prisma.userSession.findUnique({ where: { id: sessionId } });
        if (!f)
            return { ok: false, message: sessionUnexist };
        // RU: Помечаем сессию как отозванную и фиксируем время отзыва.
        // EN: Mark the session as revoked and store the revocation timestamp.
        // NL: Markeer de sessie als ingetrokken en sla het tijdstip op.
        const s = await prisma.userSession.update({
            where: { id: sessionId },
            data: {
                revoked: true,
                revokedAt: new Date(),
            },
        });
        // RU: Возвращаем результат с флагом revoked.
        // EN: Return the result with the revoked flag.
        // NL: Retourneer het resultaat met de revoked-vlag.
        return { ok: true, data: { revoked: s.revoked } };
    }
    catch (e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, message: serverError };
    }
}
export async function pinServiceExtend(id, pin) {
    try {
        // RU: Ищем сессию по ID; если не найдена — сообщаем об отсутствии.
        // EN: Look up the session by ID; if not found — report it’s missing.
        // NL: Zoek de sessie op ID; indien niet gevonden — meld dat deze ontbreekt.
        const f = await prisma.userSession.findUnique({ where: { id } });
        // RU: Если сессия не найдена — ранний выход с ошибкой: ok=false и сообщение sessionUnexist.
        // EN: If the session is missing — early return with an error: ok=false and the sessionUnexist message.
        // NL: Als de sessie ontbreekt — vroege return met fout: ok=false en het bericht sessionUnexist.
        if (!f)
            return { ok: false, message: sessionUnexist };
        // RU: Сверяем введённый PIN с сохранённым bcrypt-хешем.
        // EN: Compare provided PIN with the stored bcrypt hash.
        // NL: Vergelijk de ingevoerde PIN met de opgeslagen bcrypt-hash.
        const pinHash = await stringDecrypt(pin, f.pinHash);
        if (!pinHash) {
            // RU: При неверном PIN сразу отзывать сессию.
            // EN: On invalid PIN, revoke the session immediately.
            // NL: Bij ongeldige PIN de sessie direct intrekken.
            await prisma.userSession.update({
                where: { id },
                data: { revoked: true, revokedAt: new Date() },
            });
            return { ok: false, message: sessionUnexist };
        }
        // RU: Фиксирует текущее время (timestamp) для расчётов issuedAt/истечения срока.
        // EN: Captures the current timestamp for issuedAt/expiry calculations.
        // NL: Legt de huidige tijd vast voor issuedAt-/vervalberekeningen.
        const now = new Date();
        // RU: Продлеваем PIN и сессию от текущего момента.
        // EN: Extend PIN and session from the current moment.
        // NL: Verleng PIN en sessie vanaf het huidige moment.
        await prisma.userSession.update({
            where: { id },
            data: {
                pinElapsed: new Date(now.getTime() + PIN_TTL_MS),
                sessionElapsed: new Date(now.getTime() + SESSION_TTL_MS),
                updated: new Date(),
            },
        });
        // RU: Сообщаем об успешном продлении PIN.
        // EN: Report successful PIN extension.
        // NL: Meld succesvolle verlenging van de PIN.
        return { ok: true, data: { message: pinExtended } };
    }
    catch (e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, message: serverError };
    }
}
//# sourceMappingURL=pin.service.js.map