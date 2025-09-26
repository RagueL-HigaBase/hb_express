import type { NextFunction, Request, Response } from "express";
import { validatePasswordOnChange } from "../../validators/password.validator.js";
import { validationFailed } from "../../../shared/messages/server.js";
import { passwordServiceUpdate } from "../../services/update/password.service.js";

export async function passwordController(req: Request, res: Response, next: NextFunction) {
    // RU: userId приходит из systemMiddleware после валидации сессии.
    // EN: userId is provided by systemMiddleware after session validation.
    // NL: userId wordt door systemMiddleware gezet na sessievalidatie.
    const userId = res.locals.userId;

    // RU: Деструктурируем текущий пароль, новый пароль и подтверждение из тела запроса.
    // EN: Destructure current password, new password, and confirmation from the request body.
    // NL: Haal huidig wachtwoord, nieuw wachtwoord en bevestiging uit de request body.
    const { password, newPassword, confirm } = req.body;

    // RU: Валидируем входные данные схемой validatePasswordOnChange (тип/формат/совпадение confirm).
    // EN: Validate input with validatePasswordOnChange schema (type/format/confirm match).
    // NL: Valideer invoer met het schema validatePasswordOnChange (type/format/bevestiging).
    const v = validatePasswordOnChange.safeParse({ password, newPassword, confirm });

    // RU: Если валидация провалилась — возвращаем 401 с сообщением о валидации.
    // EN: If validation fails — return 401 with a validation message.
    // NL: Als validatie faalt — geef 401 terug met validatiebericht.
    if (!v.success) {
        return res.status(401).json({
        ok: false,
        data: { message: validationFailed },
        });
    }

    // RU: Пытаемся обновить пароль: сверяем текущий пароль и записываем новый.
    // EN: Attempt to update the password: verify current and persist the new one.
    // NL: Probeer het wachtwoord bij te werken: verifieer huidig en sla nieuw op.
    const isChanged = await passwordServiceUpdate(userId, password, newPassword);

    // RU: Если сервис вернул ошибку — пробрасываем её как 404 (по вашей семантике).
    // EN: If the service reports failure — return 404 (per your semantics).
    // NL: Als de service faalt — geef 404 terug (volgens jullie semantiek).
    if (!isChanged.ok) {
        return res.status(404).json({ ...isChanged });
    }

    // RU: Успех — отправляем 200 с данными результата.
    // EN: Success — respond 200 with the result payload.
    // NL: Succes — stuur 200 terug met de resultaatdata.
    return res.status(200).json({ ...isChanged });
}
