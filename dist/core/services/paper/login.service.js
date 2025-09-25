import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, sessionUnexist } from "../../../shared/messages/server.js";
export async function pinServicePaper(session) {
    try {
        const sessionIdHash = IdHash(session);
        const s = await prisma.userSession.findUnique({ where: { id: sessionIdHash } });
        console.log(s);
        if (!s) {
            return { ok: false, message: sessionUnexist };
        }
        if (s.pinElapsed > new Date() && s.sessionElapsed > new Date() && s.revoked !== true) {
            return { ok: true, data: { pinElapsed: false } };
        }
        ;
        if (s.pinElapsed < new Date() && s.sessionElapsed > new Date() && s.revoked !== true) {
            return { ok: true, data: { pinElapsed: true } };
        }
        ;
        const revokeSession = await prisma.userSession.update({ where: { id: sessionIdHash }, data: { revoked: true, revokedAt: new Date() } });
        return { ok: false, message: sessionUnexist };
    }
    catch (e) {
        return { ok: false, message: serverError };
    }
}
//# sourceMappingURL=login.service.js.map