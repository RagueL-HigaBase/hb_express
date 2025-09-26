import type { Request, Response } from "express";
import { validatePin } from "../../validators/pin.validate.js";
import { pinServiceExtend, pinServiceRevoke } from "../../services/update/pin.service.js";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME } from "../../../shared/config.js";

export async function pinServiceUpdate(req: Request, res: Response) {

    // RU: Деструктурируем PIN из тела запроса для последующей проверки.
    // EN: Destructure the PIN from the request body for subsequent validation.
    // NL: Haalt de PIN uit de request body voor latere validatie.
    const { pin } = req.body;

    // RU: Извлекаем httpOnly-куку сессии из запроса (если есть).
    // EN: Extract the httpOnly session cookie from the request (if present).
    // NL: Haalt de httpOnly sessiecookie uit het verzoek (indien aanwezig).
    const { session } = req.cookies;

    // RU: Берём user-id, сохранённый предыдущим миддлваром в res.locals.
    // EN: Read the user id stored by a prior middleware in res.locals.
    // NL: Leest de user-id die door een eerdere middleware in res.locals is gezet.
    const sessionId = res.locals.user as string;

    // RU: Валидируем PIN через Zod-схему validatePin; safeParse возвращает { success, data|error } без выброса исключений.
    // EN: Validate the PIN using the Zod schema validatePin; safeParse returns { success, data|error } without throwing.
    // NL: Valideer de PIN met het Zod-schema validatePin; safeParse geeft { success, data|error } terug zonder exceptions.
    const v = validatePin.safeParse({ pin });


    // RU: Если валидация PIN не прошла — запускаем отзыв PIN для пользователя `sessionId`.
    // EN: If PIN validation failed — trigger PIN revocation for user `sessionId`.
    // NL: Als de PIN-validatie faalt — start de intrekking van de PIN voor gebruiker `sessionId`.
    if (!v.success) {
        // RU: Пытаемся отозвать/сбросить PIN (очистить состояние/TTL/счётчики попыток).
        // EN: Try to revoke/reset the PIN (clear state/TTL/attempt counters).
        // NL: Probeer de PIN in te trekken/resetten (status/TTL/pogingen wissen).
        const d = await pinServiceRevoke(sessionId);

        // RU: Если отзыв не удался — чистим сессионную куку и возвращаем ошибку сервиса (проксируем `d`).
        // EN: If revocation failed — clear the session cookie and return the service error (proxy `d`).
        // NL: Als intrekking mislukt — cookie wissen en de servicefout teruggeven (proxy `d`).
        if (!d.ok) {
            res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
            return res.status(404).json({ ...d });
        }
    };


    const extend = await pinServiceExtend(sessionId, pin);

    if (!extend.ok){ 
        res.clearCookie('session', { httpOnly: true, path: '/', sameSite: 'lax', secure: true });
        return res.status(404).json({ ...extend })
    }

    return res.status(200)
        .cookie('session', session, { 
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: true,
            maxAge: 3 * 60 * 60 * 1000
        })
        .json({...extend})
}