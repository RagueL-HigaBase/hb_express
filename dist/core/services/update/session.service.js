import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, sessionUnexist } from "../../../shared/messages/server.js";
export async function sessionServicePatch(session) {
    try {
        const sessionHash = IdHash(session);
        const isSession = await prisma.userSession.findUnique({ where: { id: sessionHash } });
        if (!isSession)
            return { ok: false, message: sessionUnexist };
        if (isSession.revoked)
            return { ok: false, message: sessionUnexist };
        if (isSession.sessionElapsed < new Date()) {
            const revoreSession = await prisma.userSession.update({
                where: { id: sessionHash },
                data: {
                    revoked: true,
                    revokedAt: new Date(),
                }
            });
            return { ok: false, message: sessionUnexist };
        }
        ;
        return { ok: true, data: { sessionElapsed: false } };
    }
    catch (e) {
        return { ok: false, message: serverError };
    }
}
//# sourceMappingURL=session.service.js.map