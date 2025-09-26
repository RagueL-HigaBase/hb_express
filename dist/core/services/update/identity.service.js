import { prisma } from "../../../shared/lib/prisma.js";
import { credentialError, serverError } from "../../../shared/messages/server.js";
export async function identityServiceUpdate(identity, userId) {
    try {
        const hasIdentity = await prisma.userIdentity.findUnique({ where: { id: userId } });
        if (!hasIdentity)
            return { ok: false, data: { message: credentialError } };
        const updateIdentity = await prisma.userIdentity.update({
            where: { id: userId },
            data: {
                firstName: identity?.firstName ?? hasIdentity.firstName,
                lastName: identity.lastName ?? hasIdentity.lastName,
                middleName: identity.middleName ?? hasIdentity.middleName,
                gender: identity.gender ?? hasIdentity.gender,
                birthDate: identity.birthDate ?? hasIdentity.birthDate,
                nationality: (identity?.nationality ?? hasIdentity.nationality),
                placeOfBirth: (identity?.placeOfBirth ?? hasIdentity.placeOfBirth),
                updated: new Date()
            }
        });
        return { ok: true, data: { ...updateIdentity } };
    }
    catch (e) {
        return { ok: false, data: { message: serverError } };
    }
}
//# sourceMappingURL=identity.service.js.map