/**
 * RU: Преобразует буфер в base64url: заменяет +/ на -_ и убирает =; безопасно для URL и куки.
 *
 * EN: Converts a Buffer to base64url: replaces +/ with -_ and strips =; safe for URLs and cookies.
 *
 * NL: Zet een Buffer om naar base64url: vervangt +/ door -_ en verwijdert =; veilig voor URL's en cookies.
 *
 * @param buf Буфер с данными / Data buffer / Gegevensbuffer
 * @returns base64url-строка без паддинга / base64url string / base64url-tekenreeks
 */
export declare function toB64Url(buf: Buffer): string;
/**
 * RU: Создаёт сырой 32-байтный токен сессии и кодирует его как base64url для безопасной передачи/хранения.
 * EN: Creates a raw 32-byte session token and encodes it as base64url for safe transport/storage.
 * NL: Maakt een ruwe sessietoken van 32 bytes en codeert deze als base64url voor veilige overdracht/opslag.
 * @returns base64url-токен сессии / base64url session token / base64url-sessietoken
 */
export declare function generateSessionToken(): string;
/**
 * RU: HMAC-SHA256(secret, token) → base64url; стабильный идентификатор для поиска и индексации в БД.
 * EN: HMAC-SHA256(secret, token) → base64url; stable identifier for database lookup and indexing.
 * NL: HMAC-SHA256(secret, token) → base64url; stabiele identificator voor DB-opzoeking en indexering.
 * @param token Токен из generateSessionToken / Token from generateSessionToken / Token van generateSessionToken
 * @returns Хеш-идентификатор (base64url) / Hash identifier (base64url) / Hash-identificator (base64url)
 * @env SESSION_HMAC_SECRET — секрет HMAC; при отсутствии используется дефолтное значение для разработки.
 */
export declare function IdHash(token: string): string;
//# sourceMappingURL=session.cipher.d.ts.map