import type { ApiPolicy } from "../../../shared/api/policy.js";
import { strinEncrypt, stringDecrypt } from "../../../shared/cipher/string.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { passNotMatch, serverError, userNotExist } from "../../../shared/messages/server.js";
import type { PublicSelectUser } from "../../selects/login.select.js";
import type { ValidateLogin } from "../../validators/login.validator.js";

export async function loginServiceCreate(v: ValidateLogin): Promise<ApiPolicy<PublicSelectUser>> {
    try {
        const isExist = await prisma.user.findUnique({ where: { email: v.email }, select: { id: true, password: true } });
        if (!isExist) return { ok: false, message: userNotExist};

        const passwordDecrypt = await stringDecrypt(v.password, isExist.password );
        if (!passwordDecrypt) return { ok: false, message: passNotMatch };

        const sessionPinHas = await strinEncrypt(v.pin);
            
        const sessionUuid = crypto.randomUUID();
        const sessionHash = await strinEncrypt(sessionUuid);

        return { ok: true, data: { email: isExist.id }};

    } catch(e) {
        return { ok: false, message: serverError }
    }
}