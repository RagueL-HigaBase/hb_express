// RU: Имя сессионной куки. Префикс __Host- делает её «host-only»: требует Secure, Path="/", без Domain.
// EN: Session cookie name. The __Host- prefix makes it host-only: requires Secure, Path="/", and no Domain.
// NL: Naam van de sessiecookie. Het __Host-voorvoegsel maakt haar host-only: vereist Secure, Path="/", en geen Domain.
export const COOKIE_NAME = '__Host-session' as const;

// RU: Путь куки. Для __Host- должен быть строго "/".
// EN: Cookie path. For __Host- it must be exactly "/".
// NL: Cookiepad. Voor __Host- moet dit exact "/" zijn.
export const COOKIE_PATH = '/' as const;

// RU: Режим SameSite для куки: "lax" — отправляется при переходах верхнего уровня, блокируется в третьих сторонах.
// EN: Cookie SameSite mode: "lax" — sent on top-level navigations, blocked in third-party contexts.
// NL: SameSite-modus voor de cookie: "lax" — verzonden bij navigaties op topniveau, geblokkeerd in third-party contexten.
export const COOKIE_SAMESITE = 'lax' as const;

// RU: Флаг Secure для куки: true — отправляется только по HTTPS (обязательно для __Host-).
// EN: Cookie Secure flag: true — sent only over HTTPS (required for __Host-).
// NL: Secure-vlag voor de cookie: true — wordt alleen via HTTPS verzonden (vereist voor __Host-).
export const COOKIE_SECURE = true;

// RU: TTL сессии в миллисекундах (3 часа). Используется для expiresAt и/или cookie maxAge.
// EN: Session TTL in milliseconds (3 hours). Used for expiresAt and/or cookie maxAge.
// NL: TTL van de sessie in milliseconden (3 uur). Gebruikt voor expiresAt en/of cookie maxAge.
export const SESSION_TTL_MS = 3 * 60 * 60 * 1000;

// RU: TTL PIN-кода в миллисекундах (15 минут). После истечения требуется повторное подтверждение PIN.
// EN: PIN TTL in milliseconds (15 minutes). After expiry, PIN confirmation is required again.
// NL: TTL van de PIN in milliseconden (15 minuten). Na verloop is opnieuw PIN-bevestiging nodig.
export const PIN_TTL_MS = 15 * 60 * 1000;


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
export const COMMON_COOKIE_OPTS = Object.freeze({
    path: COOKIE_PATH,
    sameSite: COOKIE_SAMESITE, // 'lax' | 'strict' | 'none'
    secure: COOKIE_SECURE,     // true на HTTPS/в проде
});

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
export const SET_COOKIE_OPTS = Object.freeze({
    ...COMMON_COOKIE_OPTS,
    httpOnly: true,
    maxAge: SESSION_TTL_MS,
});


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
export const CLEAR_COOKIE_OPTS = COMMON_COOKIE_OPTS;
