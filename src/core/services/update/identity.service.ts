import type { Prisma } from "@prisma/client";
import type { ApiPolicy } from "../../../shared/api/policy.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { credentialError, serverError } from "../../../shared/messages/server.js";
import type { IdentityValidator } from "../../validators/identity.validator.js";

export async function identityServiceUpdate(identity: IdentityValidator, userId: string): Promise<ApiPolicy<any>> {
    try {
        const hasIdentity = await prisma.userIdentity.findUnique({ where: {id: userId } });
        if (!hasIdentity) return { ok: false, data: { message: credentialError} };

        const updateIdentity = await prisma.userIdentity.update({ 
            where: { id: userId }, 
            data: { 
                firstName: identity?.firstName ?? hasIdentity.firstName,
                lastName: identity.lastName ?? hasIdentity.lastName,
                middleName: identity.middleName ?? hasIdentity.middleName,
                gender: identity.gender ?? hasIdentity.gender,
                birthDate: identity.birthDate ?? hasIdentity.birthDate,
                nationality: (identity?.nationality ?? hasIdentity.nationality) as Prisma.InputJsonValue,
                placeOfBirth: (identity?.placeOfBirth ?? hasIdentity.placeOfBirth) as Prisma.InputJsonValue,
                updated: new Date()
            }});
            return { ok: true, data: { ...updateIdentity }};

    } catch(e) {
        return { ok: false, data: { message: serverError}}
    }
}