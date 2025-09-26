import type { NextFunction, Request, Response } from "express";
import { CLEAR_COOKIE_OPTS, COOKIE_NAME, SET_COOKIE_OPTS } from "../../shared/config.js";
import { credentialError } from "../../shared/messages/server.js";
import { systemPaperRead } from "../services/paper/system.paper.js";

export async function systemMiddleware(req: Request, res: Response, next: NextFunction) {
    // RU: Деструктурируем cookie `session` из входящего запроса.
    // EN: Destructure the `session` cookie from the incoming request.
    // NL: Haal de `session`-cookie uit het binnenkomende request.
    const { session } = req.cookies;

    // RU: Если cookie отсутствует или имеет неверный тип — очищаем cookie и возвращаем ошибку 404 с сообщением учетных данных.
    // EN: If the cookie is missing or of the wrong type—clear the cookie and return 404 with a credential error message.
    // NL: Als de cookie ontbreekt of van het verkeerde type is—cookie wissen en 404 met inlogfout teruggeven.
    if (!session || typeof session !== 'string') {
        
    // RU: Сбрасываем потенциально некорректную/просроченную cookie.
    // EN: Clear a potentially invalid/expired cookie.
    // NL: Wis een mogelijk ongeldige/verlopen cookie.
    res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);

    // RU: Отправляем ответ с ошибкой и прекращаем выполнение middleware.
    // EN: Send the error response and stop middleware execution.
    // NL: Stuur de foutrespons en stop de middleware-uitvoering.
    return res.status(404).json({
            ok: false,
            data: { message: credentialError },
        });
    }

    // RU: Пытаемся прочитать и валидировать серверную сессию по токену.
    // EN: Attempt to read and validate the server-side session using the token.
    // NL: Probeer de server-side sessie te lezen en te valideren met de token.
    const r = await systemPaperRead(session);

    // RU: Если валидация не пройдена — очищаем cookie, возвращаем 404 и выходим.
    // EN: If validation fails—clear the cookie, return 404, and exit.
    // NL: Als de validatie faalt—cookie wissen, 404 teruggeven en stoppen.
    if (!r.ok) {
        res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTS);
        return res.status(404).json({ ...r });
    }

    if (r.ok) {
        if (r.data.pinElapsed) {
            return res.status(404).json({ 
                ok: true,
                data: {
                    pinElapsed: r.data.pinElapsed
                }
            })
        }
        
        // RU: Если все в порядке — обновляем cookie сессии, сохраняем userId в `res.locals` и передаем управление дальше.
        // EN: If everything is fine—refresh the session cookie, stash userId in `res.locals`, and pass control to the next middleware.
        // NL: Als alles in orde is—ververs de sessiecookie, plaats userId in `res.locals` en ga door naar de volgende middleware.
        res.cookie(COOKIE_NAME, r.data.session, SET_COOKIE_OPTS);
        res.locals.userId = r.data.userId;
        return next();
    }
}