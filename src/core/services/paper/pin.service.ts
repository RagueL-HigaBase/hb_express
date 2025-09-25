import type { ApiPolicy } from "../../../shared/api/policy.js";
import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, sessionUnexist } from "../../../shared/messages/server.js";
import type { ServerSelectPin } from "../../selects/pin.select.js";

export async function pinServicePaper(session: string): Promise<ApiPolicy<ServerSelectPin>> {
    try {
        
        // RU: Строим детерминированный идентификатор сессии из токена (HMAC) для поиска в БД.
        // EN: Derive a deterministic session identifier from the token (HMAC) for DB lookup.
        // NL: Leid een deterministische sessie-ID af uit de token (HMAC) voor DB-opzoeking.
        const sessionIdHash = IdHash(session);

        // RU: Ищем сессию по хешу; если не найдена — сообщаем, что сессии нет.
        // EN: Find the session by hash; if not found — report that the session doesn’t exist.
        // NL: Zoek de sessie op hash; indien niet gevonden — melden dat de sessie niet bestaat.
        const s = await prisma.userSession.findUnique({ where: { id: sessionIdHash }});

        if (!s) return { ok: false, message: sessionUnexist };

        // RU: Если срок сессии истёк ИЛИ она уже отозвана — помечаем revoked и возвращаем «сессии нет».
        // EN: If the session is expired OR already revoked — mark as revoked and return “no session”.
        // NL: Als de sessie is verlopen OF al ingetrokken — markeer als revoked en geef “geen sessie” terug.
        if (s.sessionElapsed < new Date || s.revoked === true) {
            // RU: Фиксируем отзыв сессии и время отзыва; защитный апдейт.
            // EN: Persist revocation and timestamp; defensive update.
            // NL: Sla intrekking en tijdstip op; defensieve update.
            const onUpdate = await prisma.userSession.update({
                where: { id: sessionIdHash },
                data: { revoked: true, revokedAt: new Date() }
            });
            return { ok: false, message: sessionUnexist };
        };

        // RU: Если PIN истёк — сообщаем фронту, что требуется повторное подтверждение PIN.
        // EN: If the PIN has expired — signal the frontend that PIN confirmation is required.
        // NL: Als de PIN is verlopen — geef aan de frontend door dat PIN-bevestiging nodig is.
        if (s.pinElapsed < new Date) return { ok: true, data: { pinElapsed: true, id: s.id }};

        // RU: Иначе — сессия активна, PIN ещё действителен.
        // EN: Otherwise — session active, PIN still valid.
        // NL: Anders — sessie actief, PIN nog geldig.
        return { ok: true, data: { pinElapsed: false, id: s.id }};


    } catch(e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, message: serverError };
    }
}