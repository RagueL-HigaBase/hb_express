import type { ApiPolicy } from "../../../shared/api/policy.js";
import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, sessionUnexist } from "../../../shared/messages/server.js";
export type ReturnPolicySessionServicePaper = { sessionElapsed: boolean }

export async function sessionServicePaper(session: string): Promise<ApiPolicy<ReturnPolicySessionServicePaper>> {
    try {

        // RU: Генерируется криптографический хеш сессии для унифицированного поиска и идентификации записей в системе БД.
        // EN: Generates a cryptographic session hash to support lookup and identification of records in the system database.
        // NL: Genereert een cryptografische sessiehash voor het opzoeken en identificeren van records in de systeemdatabase.
        const sessionHash = IdHash(session);

        // RU: Асинхронно ищет запись сессии в БД через Prisma по id=sessionHash; вернёт найденный объект или null.
        // EN: Asynchronously looks up a session in the DB via Prisma by id=sessionHash; returns the record or null.
        // NL: Zoekt asynchroon een sessie in de DB via Prisma met id=sessionHash; retourneert het record of null.
        const isSession = await prisma.userSession.findUnique({ where: { id: sessionHash } });

        // RU: Если сессия не найдена, вернуть результат ошибки: ok=false и сообщение sessionUnexist (ранний выход).
        // EN: If the session is missing, return an error result: ok=false with the sessionUnexist message (early return).
        // NL: Als de sessie ontbreekt, een foutresultaat teruggeven: ok=false met het bericht sessionUnexist (vroege return).
        if (!isSession) return { ok: false, data: { message: sessionUnexist } };

        // RU: Если сессия отозвана (revoked), вернуть ошибку как для несуществующей: ok=false, message=sessionUnexist.
        // EN: If the session is revoked, return an error as if it doesn’t exist: ok=false with message sessionUnexist.
        // NL: Als de sessie is ingetrokken (revoked), een fout teruggeven alsof deze niet bestaat: ok=false, bericht sessionUnexist.
        if (isSession.revoked) return { ok: false, data: { message: sessionUnexist } };

        // RU: Если срок действия сессии истёк (sessionElapsed < now), помечает её revoked и revokedAt, затем возвращает { ok:false, message: sessionUnexist }.
        // EN: If the session has expired (sessionElapsed < now), sets revoked and revokedAt, then returns { ok:false, message: sessionUnexist }.
        // NL: Als de sessie is verlopen (sessionElapsed < nu), zet revoked en revokedAt en retourneert { ok:false, message: sessionUnexist }.
        if (isSession.sessionElapsed < new Date()) {
            const revokeSession = await prisma.userSession.update({ 
                where: { id: sessionHash}, 
                data: { 
                    revoked: true,
                    revokedAt: new Date()
                }
            });
            return { ok: false, data: { message: sessionUnexist } };
        };
        // RU: Успешный результат: ok=true; в data указано, что срок сессии не истёк (sessionElapsed=false).
        // EN: Success result: ok=true; data indicates the session has not expired (sessionElapsed=false).
        // NL: Succesresultaat: ok=true; data geeft aan dat de sessie niet is verlopen (sessionElapsed=false).
        return { ok: true, data: { sessionElapsed: false } }

    } catch(e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, data: { message: serverError } };
    }
}