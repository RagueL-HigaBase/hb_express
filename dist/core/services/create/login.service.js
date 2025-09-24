import "dotenv/config";
import { generateSessionToken, IdHash } from "../../../shared/cipher/session.cipher.js";
import { strinEncrypt, stringDecrypt } from "../../../shared/cipher/string.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { passNotMatch, serverError, userNotExist } from "../../../shared/messages/server.js";
export async function loginServiceCreate(v) {
    try {
        const isExist = await prisma.user.findUnique({ where: { email: v.email } });
        if (!isExist)
            return { ok: false, message: userNotExist };
        const passwordDecrypt = await stringDecrypt(v.password, isExist.password);
        if (!passwordDecrypt)
            return { ok: false, message: passNotMatch };
        // Generating a unique one-time session token
        const sessionToken = generateSessionToken();
        // Generating a unique one-time session identifier (UUID)
        const sessionId = IdHash(sessionToken);
        // Encrypting the one-time session PIN provided by the user //
        const sessionPinHas = await strinEncrypt(v.pin);
        // Creates a Date object with the current date and time and assigns it to the variable
        const now = new Date();
        const initializeSession = await prisma.userSession.create({
            data: {
                id: sessionId,
                userId: isExist.id,
                sessionElapsed: new Date(now.getTime() + 3 * 60 * 60 * 1000),
                pinHash: sessionPinHas,
                pinElapsed: new Date(now.getTime() + 15 * 60 * 1000)
            }
        });
        return { ok: true, data: { token: sessionToken } };
    }
    catch (e) {
        return { ok: false, message: serverError };
    }
}
//# sourceMappingURL=login.service.js.map