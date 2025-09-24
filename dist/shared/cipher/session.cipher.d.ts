export declare function toB64Url(buf: Buffer): string;
/** Сырой случайный токен: 32 байта → base64url */
export declare function generateSessionToken(): string;
/** HMAC-SHA256(secret, token) → base64url (рекомендую) */
export declare function IdHash(token: string): string;
//# sourceMappingURL=session.cipher.d.ts.map