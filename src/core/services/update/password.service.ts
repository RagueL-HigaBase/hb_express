import type { ApiPolicy } from "../../../shared/api/policy.js";
import { stringEncrypt, stringDecrypt } from "../../../shared/cipher/string.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { credentialChanged, credentialError, serverError, userNotExist } from "../../../shared/messages/server.js";
export type ReturnPolicyPasswordServiceUpdate = { message: string };

export async function passwordServiceUpdate(userId: string, password: string, newPassword: string): Promise<ApiPolicy<ReturnPolicyPasswordServiceUpdate>> {
    try {
        // RU: Ищем пользователя по id; если не найден — сообщаем об этом.
        // EN: Look up the user by id; if not found — report it.
        // NL: Zoek de gebruiker op id; indien niet gevonden — meld dit.
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { ok: false, data: { message: userNotExist } };

        // RU: Сверяем переданный текущий пароль с хэшем в БД.
        // EN: Compare the provided current password against the DB hash.
        // NL: Vergelijk het opgegeven huidige wachtwoord met de DB-hash.
        const comparePassword = await stringDecrypt(password, user.password);

        // RU: Если сверка не прошла — возвращаем ошибку учетных данных.
        // EN: If comparison fails — return credential error.
        // NL: Als de vergelijking faalt — geef inlogfout terug.
        if (!comparePassword) return { ok: false, data: { message: credentialError } };

        // RU: Шифруем/хэшируем новый пароль для записи в БД.
        // EN: Encrypt/hash the new password before persisting.
        // NL: Versleutel/hash het nieuwe wachtwoord voordat het wordt opgeslagen.
        const newPasswordEncrypt = await stringEncrypt(newPassword);

        // RU: Обновляем пароль пользователя и метку обновления.
        // EN: Update the user's password and the updated timestamp.
        // NL: Werk het wachtwoord van de gebruiker en de update-timestamp bij.
        const changePassword = await prisma.user.update({
            where: { id: userId },
            data: {
                password: newPasswordEncrypt,
                updated: new Date(),
            },
        });

        // RU: Теоретически, если обновление не прошло — возвращаем серверную ошибку.
        // EN: If, theoretically, the update fails — return a server error.
        // NL: Als de update theoretisch faalt — geef een serverfout terug.
        if (!changePassword) return { ok: false, data: { message: serverError } };

        // RU: Успех — пароль изменен.
        // EN: Success — password changed.
        // NL: Succes — wachtwoord gewijzigd.
        return { ok: true, data: { message: credentialChanged } };
    } catch (e) {
        // RU: Любые исключения интерпретируем как серверную ошибку.
        // EN: Treat any thrown exceptions as a server error.
        // NL: Behandel alle uitzonderingen als een serverfout.
        return { ok: false, data: { message: serverError } };
    }
}
