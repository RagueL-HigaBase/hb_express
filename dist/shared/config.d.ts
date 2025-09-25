export declare const COOKIE_NAME: "__Host-session";
export declare const COOKIE_PATH: "/";
export declare const COOKIE_SAMESITE: "lax";
export declare const COOKIE_SECURE = true;
export declare const SESSION_TTL_MS: number;
export declare const PIN_TTL_MS: number;
/**
 * RU: Общие атрибуты куки, которые должны совпадать при установке и удалении.
 * EN: Common cookie attributes that must match for both set and clear operations.
 * NL: Gemeenschappelijke cookie-attributen die bij zetten en wissen gelijk moeten zijn.
 *
 * @remarks RU: Для __Host-session НЕ указывать Domain; path='/' и secure=true обязательны.
 *          EN: For __Host-session do NOT set Domain; path='/' and secure=true are required.
 *          NL: Voor __Host-session géén Domain; path='/' en secure=true zijn verplicht.
 *
 * @example
 * // RU: Удаление с совпадающими атрибутами
 * // EN: Clearing with matching attributes
 * // NL: Wissen met overeenkomende attributen
 * res.clearCookie(COOKIE_NAME, COMMON_COOKIE_OPTS);
 */
export declare const COMMON_COOKIE_OPTS: Readonly<{
    path: "/";
    sameSite: "lax";
    secure: true;
}>;
/**
 * RU: Опции для установки куки: включает httpOnly и задаёт maxAge из SESSION_TTL_MS.
 *     При необходимости maxAge можно переопределить при вызове res.cookie(...).
 * EN: Cookie set options: includes httpOnly and sets maxAge from SESSION_TTL_MS.
 *     You can override maxAge at the call site if needed.
 * NL: Cookie-instellingsopties: bevat httpOnly en stelt maxAge in via SESSION_TTL_MS.
 *     maxAge kan desgewenst per aanroep worden overschreven.
 *
 * @example
 * // RU: Установить куку с дефолтным TTL
 * // EN: Set cookie with the default TTL
 * // NL: Cookie zetten met de standaard TTL
 * res.cookie(COOKIE_NAME, token, SET_COOKIE_OPTS);
 *
 * @example
 * // RU: Переопределить TTL для конкретного случая
 * // EN: Override TTL for a specific case
 * // NL: TTL voor een specifiek geval overschrijven
 * res.cookie(COOKIE_NAME, token, { ...SET_COOKIE_OPTS, maxAge: 60_000 });
 */
export declare const SET_COOKIE_OPTS: Readonly<{
    httpOnly: true;
    maxAge: number;
    path: "/";
    sameSite: "lax";
    secure: true;
}>;
/**
 * RU: Опции для очистки куки: достаточно совпадающих path/sameSite/secure.
 * EN: Options for clearing the cookie: matching path/sameSite/secure are sufficient.
 * NL: Opties voor het wissen van de cookie: overeenkomende path/sameSite/secure volstaan.
 *
 * @remarks RU: Не добавляйте maxAge при очистке — Express сам ставит истёкший Expires.
 *          EN: Do not add maxAge when clearing — Express will set an expired Expires.
 *          NL: Voeg geen maxAge toe bij wissen — Express zet zelf een verlopen Expires.
 *
 * @example
 * // RU: Очистить куку
 * // EN: Clear cookie
 * // NL: Cookie wissen
 * res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
 */
export declare const CLEAR_COOKIE_OPTS: Readonly<{
    path: "/";
    sameSite: "lax";
    secure: true;
}>;
//# sourceMappingURL=config.d.ts.map