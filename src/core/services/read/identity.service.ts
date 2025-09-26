import type { Prisma } from "@prisma/client";
import type { ApiPolicy } from "../../../shared/api/policy.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { credentialError, serverError } from "../../../shared/messages/server.js";

export const PublicSelect = {
    firstName: true,
    lastName: true,
    middleName: true,
    gender: true,
    birthDate: true,
    nationality: true,
    placeOfBirth: true,
} satisfies Prisma.UserIdentitySelect;

export type Returnpolicypublicidentity = Prisma.UserIdentityGetPayload<{ select: typeof PublicSelect}>

export async function identityServiceRead(userId: string): Promise<ApiPolicy<Returnpolicypublicidentity>> {
    try {
        // RU: Ищем запись идентичности; предполагаем, что PK = userId.
        // EN: Look up the identity record; assume PK equals userId.
        // NL: Zoek het identity-record; ga ervan uit dat de PK gelijk is aan userId.
        const hasIdentity = await prisma.userIdentity.findUnique({ where: { id: userId }, select: PublicSelect });

        // RU: Если запись не найдена — возвращаем ошибку учетных данных.
        // EN: If no record found — return credential error.
        // NL: Als geen record gevonden — geef inlogfout terug.
        if (!hasIdentity) return { ok: false, data: { message: credentialError } };

        // RU: Успех — отдаём найденную идентичность в стандартном формате.
        // EN: Success — return the found identity in the standard format.
        // NL: Succes — geef de gevonden identiteit terug in het standaardformaat.
        return { ok: true, data: { ...hasIdentity } };
    } catch (e) {
        // RU: Любая ошибка БД/сети — серверная ошибка.
        // EN: Any DB/network error — server error.
        // NL: Elke DB-/netwerkfout — serverfout.
        return { ok: false, data: { message: serverError } };
    }
}
