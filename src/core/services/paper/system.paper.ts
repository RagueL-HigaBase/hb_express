import type { ApiPolicy } from "../../../shared/api/policy.js";
import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { PIN_TTL_MS, SESSION_TTL_MS } from "../../../shared/config.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { credentialError, serverError } from "../../../shared/messages/server.js";
export type ReturnPolicySystemPapper = { userId: string, session: string, pinElapsed?: boolean };

export async function systemPaperRead(session: string): Promise<ApiPolicy<ReturnPolicySystemPapper>> {
    try {
        // RU: Строим детерминированный идентификатор сессии из токена (HMAC) для поиска в БД.
        // EN: Derive a deterministic session identifier from the token (HMAC) for DB lookup.
        // NL: Leid een deterministische sessie-ID af uit de token (HMAC) voor DB-opzoeking.
        const sessionId = IdHash(session);

        // RU: Ищем сессию по вычисленному идентификатору в таблице userSession.
        // EN: Look up the session by the computed identifier in the userSession table.
        // NL: Zoek de sessie op met de berekende ID in de tabel userSession.
        const hasSession = await prisma.userSession.findUnique({ where: { id: sessionId } });

        // RU: Если сессия не найдена — возвращаем ошибку учетных данных.
        // EN: If no session is found, return a credential error.
        // NL: Als er geen sessie is gevonden, geef een inlogfout terug.
        if (!hasSession) return { ok: false, data: { message: credentialError } };

        // RU: Проверяем, что сессия не отозвана и ее сроки еще не истекли:
        //     - revoked !== true — сессия действительна;
        //     - pinElapsed > new Date() — PIN/2FA окно еще активно;
        //     - sessionElapsed > new Date() — основное время жизни сессии еще не истекло.
        // EN: Validate that the session is not revoked and both expirations are in the future:
        //     - revoked !== true — session is valid;
        //     - pinElapsed > new Date() — PIN/2FA window still valid;
        //     - sessionElapsed > new Date() — primary session TTL not expired.
        // NL: Controleren dat de sessie niet is ingetrokken en beide vervaltijden in de toekomst liggen:
        //     - revoked !== true — sessie is geldig;
        //     - pinElapsed > new Date() — PIN/2FA-venster is nog geldig;
        //     - sessionElapsed > new Date() — primaire sessieduur is nog niet verlopen.
        // RU: Фиксируем текущее время единожды, чтобы избежать расхождений в сравнениях и обновлении.
        // EN: Capture the current time once to avoid drift between comparisons and updates.
        // NL: Leg het huidige tijdstip één keer vast om afwijkingen tussen vergelijkingen en updates te voorkomen.
        const now = new Date();

        if ( hasSession.revoked !== true && hasSession.sessionElapsed > now && hasSession.pinElapsed < now) 
            return { ok: true, data: { userId: hasSession.userId, session: session, pinElapsed: true } };

        // RU: Проверяем, что сессия не отозвана и обе «продливаемые» даты позже текущего времени.
        // EN: Ensure the session is not revoked and both expiration timestamps are in the future.
        // NL: Controleer dat de sessie niet is ingetrokken en dat beide vervaltijden in de toekomst liggen.
        if ( hasSession.revoked !== true && hasSession.pinElapsed > now && hasSession.sessionElapsed > now) {
            // RU: Продлеваем время жизни сессии и PIN-окна, а также помечаем время обновления.
            // EN: Extend the session TTL and PIN window, and stamp the update time.
            // NL: Verleng de sessieduur en het PIN-venster en zet de update-tijdstempel.
            await prisma.userSession.update({
                where: { id: sessionId },
                data: {
                sessionElapsed: new Date(now.getTime() + SESSION_TTL_MS),
                pinElapsed: new Date(now.getTime() + PIN_TTL_MS),
                updated: now,
                },
            });

            // RU: Возвращаем успешный ответ с идентификатором пользователя, привязанным к сессии.
            // EN: Return success with the user identifier associated with the session.
            // NL: Geef succes terug met de aan de sessie gekoppelde gebruikers-ID.
            return { ok: true, data: { userId: hasSession.userId, session: session } };
        }

        // RU: Во всех остальных случаях — считаем учетные данные недействительными.
        // EN: In all other cases, treat the credentials as invalid.
        // NL: In alle andere gevallen worden de inloggegevens als ongeldig beschouwd.
        return { ok: false, data: { message: credentialError } };



    } catch(e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, data: { message: serverError} };
    }
}