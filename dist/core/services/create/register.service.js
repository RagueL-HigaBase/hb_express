import { strinEncrypt } from "../../../shared/cipher/string.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, userExist } from "../../../shared/messages/server.js";
export async function registerServiceCreate(v) {
    try {
        const isExist = await prisma.user.findUnique({ where: { email: v.email } });
        if (isExist)
            return { ok: false, message: userExist };
        const encryptPassword = await strinEncrypt(v.password);
        const createCollection = await prisma.$transaction(async (tx) => {
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
            const createIdentity = await tx.userIdentity.create({ data: { id: createUser.id } });
            const createPermanentAddress = await tx.userPermanentAddress.create({ data: { id: createUser.id } });
            const createCurrentAdress = await tx.userCurrentAddress.create({ data: { id: createUser.id } });
            const createSystemCredentials = await tx.userSystemCredentials.create({ data: { id: createUser.id } });
            return createUser;
        });
        return { ok: true, data: createCollection };
    }
    catch (e) {
        return { ok: false, message: serverError };
    }
}
//# sourceMappingURL=register.service.js.map