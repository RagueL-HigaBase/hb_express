import type { ApiPolicy } from "../../../shared/api/policy.js";
import { strinEncrypt } from "../../../shared/cipher/string.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import type { RegisterValidator } from "../../validators/register.validator.js";
import type { PublicSelectRegister } from "../../selects/register.select.js";
import { serverError, userExist } from "../../../shared/messages/server.js";

export async function registerServiceCreate(v: RegisterValidator): Promise<ApiPolicy<PublicSelectRegister>> {
    try {

        // RU: Асинхронно ищет пользователя по уникальному email через Prisma; вернёт объект пользователя или null.
        // EN: Asynchronously looks up a user by unique email via Prisma; returns the user record or null.
        // NL: Zoekt asynchroon een gebruiker op uniek e-mailadres via Prisma; retourneert het record of null.
        const isExist = await prisma.user.findUnique({ where: { email: v.email }});

        // RU: Если пользователь уже существует, вернуть неуспех: ok=false с сообщением userExist — предотвращает дублирование регистрации.
        // EN: If the user already exists, return failure: ok=false with the userExist message — prevents duplicate sign-up.
        // NL: Als de gebruiker al bestaat, fout teruggeven: ok=false met bericht userExist — voorkomt dubbele registratie.
        if (isExist) return { ok:false, message: userExist };

        // RU: Шифрует/хэширует пароль v.password; результат — строка для безопасного хранения в БД.
        // EN: Encrypts/hashes v.password; returns a string suitable for secure storage in the database.
        // NL: Versleutelt/hasht v.password; retourneert een tekenreeks voor veilige opslag in de database.
        const encryptPassword = await strinEncrypt(v.password);
        
        /**
         * RU: Prisma-транзакция: создаёт пользователя и связанные пустые записи
         * (identity, permanent/current address, system credentials); атомарно. Возвращает { id, email }.
         * EN: Prisma transaction: creates a user and related empty records
         * (identity, permanent/current address, system credentials); atomic. Returns { id, email }.
         * NL: Prisma-transactie: maakt een gebruiker en gekoppelde lege records aan
         * (identity, permanent/huidig adres, systeemcredentials); atomair. Retourneert { id, email }.
         */
        const createCollection = await prisma.$transaction(async (tx) => {
            // RU: Создаёт пользователя; выбираем только email и id.
            // EN: Creates the user; select email and id only.
            // NL: Maakt de gebruiker; selecteert alleen email en id.
            const createUser = await tx.user.create({
                data: {
                    email: v.email,
                    password: encryptPassword
                },
                select: {
                    email: true,
                    id: true
                }
            });

            // RU: Стартовая запись идентичности (ключ = user.id).
            // EN: Initial identity record (key = user.id).
            // NL: Initiëel identity-record (sleutel = user.id).
            const createIdentity = await tx.userIdentity.create({ data: { id: createUser.id } });

            // RU: Пустая запись постоянного адреса (ключ = user.id).
            // EN: Empty permanent address record (key = user.id).
            // NL: Leeg record voor permanent adres (sleutel = user.id).
            const createPermanentAddress = await tx.userPermanentAddress.create({ data: { id: createUser.id } });

            // RU: Пустая запись текущего адреса (ключ = user.id).
            // EN: Empty current address record (key = user.id).
            // NL: Leeg record voor huidig adres (sleutel = user.id).
            const createCurrentAdress = await tx.userCurrentAddress.create({ data: { id: createUser.id } });

            // RU: Стартовые системные учётные данные (ключ = user.id).
            // EN: Initial system credentials (key = user.id).
            // NL: Initiële systeemcredentials (sleutel = user.id).
            const createSystemCredentials = await tx.userSystemCredentials.create({ data: { id: createUser.id } });

            // RU: Возвращаем созданного пользователя (id, email).
            // EN: Return the created user (id, email).
            // NL: Geef de aangemaakte gebruiker terug (id, email).
            return createUser;
        });

        // RU: Возвращает успешный результат: ok=true; в data — объект созданного пользователя (id, email).
        // EN: Returns a successful result: ok=true; data contains the created user object (id, email).
        // NL: Geeft een succesvol resultaat terug: ok=true; data bevat het aangemaakte gebruikersobject (id, email).
        return { ok: true, data: createCollection };
    } catch(e) {
        // RU: Возвращает общий ответ об ошибке сервера: ok=false и сообщение serverError.
        // EN: Returns a generic server error response: ok=false with the serverError message.
        // NL: Geeft een algemene serverfout terug: ok=false met het bericht serverError.
        return { ok: false, message: serverError}
    }
}