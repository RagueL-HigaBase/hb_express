import "dotenv/config";
import { generateSessionToken, IdHash } from "../../../shared/cipher/session.cipher.js";
import { stringEncrypt, stringDecrypt } from "../../../shared/cipher/string.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { passNotMatch, serverError, serverWelcomeLogin, userNotExist } from "../../../shared/messages/server.js";
import { PIN_TTL_MS, SESSION_TTL_MS } from "../../../shared/config.js";
export async function loginServiceCreate(v) {
    try {
        // RU: Ищем пользователя по уникальному email через Prisma; вернёт запись или null.
        // EN: Look up a user by unique email via Prisma; returns the record or null.
        // NL: Zoekt een gebruiker op uniek e-mailadres via Prisma; retourneert record of null.
        const isExist = await prisma.user.findUnique({ where: { email: v.email } });
        // RU: Если пользователь не найден — вернуть ошибку userNotExist (ранний выход).
        // EN: If no user is found — return error userNotExist (early return).
        // NL: Als geen gebruiker is gevonden — fout userNotExist teruggeven (vroege return).
        if (!isExist)
            return { ok: false, data: { message: userNotExist } };
        // RU: Сравниваем введённый пароль с bcrypt-хешем из БД (stringDecrypt → compare).
        // EN: Compare the supplied password with the stored bcrypt hash (stringDecrypt → compare).
        // NL: Vergelijk het ingevoerde wachtwoord met de opgeslagen bcrypt-hash (stringDecrypt → compare).
        const passwordDecrypt = await stringDecrypt(v.password, isExist.password);
        // RU: При несовпадении пароля — вернуть ошибку passNotMatch.
        // EN: On mismatch — return the passNotMatch error.
        // NL: Bij mismatch — fout passNotMatch teruggeven.
        if (!passwordDecrypt)
            return { ok: false, data: { message: passNotMatch } };
        // RU: Генерирует одноразовый токен сессии (32 байта, base64url) для хранения в httpOnly-куке.
        // EN: Generates a one-time session token (32 bytes, base64url) for storage in an httpOnly cookie.
        // NL: Genereert een eenmalige sessietoken (32 bytes, base64url) voor opslag in een httpOnly-cookie.
        const sessionToken = generateSessionToken();
        // RU: Строит устойчивый идентификатор сессии через HMAC-SHA256(token, secret) → base64url; удобен для поиска в БД.
        // EN: Derives a stable session identifier via HMAC-SHA256(token, secret) → base64url; DB-friendly for lookups.
        // NL: Leidt een stabiele sessie-ID af via HMAC-SHA256(token, secret) → base64url; geschikt voor DB-opzoeking.
        const sessionIdHash = IdHash(sessionToken);
        // RU: Хеширует одноразовый PIN пользователя с помощью bcrypt для безопасного хранения (сравнение без восстановления).
        // EN: Hashes the user’s one-time PIN with bcrypt for safe storage (comparison without reversal).
        // NL: Hasht de eenmalige PIN van de gebruiker met bcrypt voor veilige opslag (vergelijking zonder omkering).
        const encryptPin = await stringEncrypt(v.pin);
        // RU: Фиксирует текущее время (timestamp) для расчётов issuedAt/истечения срока.
        // EN: Captures the current timestamp for issuedAt/expiry calculations.
        // NL: Legt de huidige tijd vast voor issuedAt-/vervalberekeningen.
        const now = new Date();
        // RU: Создаёт запись сессии в БД (Prisma): id=sessionIdHash, userId=isExist.id,
        // срок действия сессии — 3 часа от now (sessionElapsed),
        // хеш PIN (pinHash) и его срок действия — 15 минут (pinElapsed).
        // EN: Creates a session record in the DB (Prisma): id=sessionIdHash, userId=isExist.id,
        // session lifetime is 3 hours from now (sessionElapsed),
        // PIN hash (pinHash) and its lifetime is 15 minutes (pinElapsed).
        // NL: Maakt een sessierecord in de DB (Prisma): id=sessionIdHash, userId=isExist.id,
        // sessieduur is 3 uur vanaf now (sessionElapsed),
        // PIN-hash (pinHash) en geldigheid 15 minuten (pinElapsed).
        const initializeSession = await prisma.userSession.create({
            data: {
                id: sessionIdHash,
                userId: isExist.id,
                sessionElapsed: new Date(now.getTime() + SESSION_TTL_MS),
                pinHash: encryptPin,
                pinElapsed: new Date(now.getTime() + PIN_TTL_MS)
            }
        });
        // RU: Возвращает успех с одноразовым токеном sessionToken — клиент сохранит его в httpOnly-куке.
        // EN: Returns success with the one-time sessionToken — the client will store it in an httpOnly cookie.
        // NL: Geeft succes terug met de eenmalige sessionToken — de client slaat deze op in een httpOnly-cookie.
        return { ok: true, data: { message: serverWelcomeLogin, token: sessionToken } };
    }
    catch (e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, data: { message: serverError } };
    }
}
//# sourceMappingURL=login.service.js.map