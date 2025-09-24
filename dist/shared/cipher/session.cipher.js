import crypto from "crypto";
export function toB64Url(buf) {
    return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
/** Сырой случайный токен: 32 байта → base64url */
export function generateSessionToken() {
    return toB64Url(crypto.randomBytes(32));
}
/** HMAC-SHA256(secret, token) → base64url (рекомендую) */
export function IdHash(token) {
    const SECRET = process.env.SESSION_HMAC_SECRET || "9eJKDi9qHcQy4mS5tQOM3lRkqR8S3gq0xv3wGdE3b9k";
    const mac = crypto.createHmac("sha256", Buffer.from(SECRET, "utf8"));
    mac.update(token, "utf8");
    return toB64Url(mac.digest());
}
//# sourceMappingURL=session.cipher.js.map