import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, sessionUnexist } from "../../../shared/messages/server.js";
export async function loginServiceRead(session) {
    try {
        const sessionId = IdHash(session);
        const hasToken = await prisma.userSession.findUnique({
            where: { id: sessionId }
        });
        if (!hasToken)
            return { ok: false, message: sessionUnexist };
        let hasSessionElapsed = false;
        let hasPinElapsed = false;
        if (hasToken.sessionElapsed < new Date())
            hasSessionElapsed = true;
        if (hasToken.pinElapsed < new Date())
            hasPinElapsed = true;
        return { ok: true, data: { sessionElapsed: hasSessionElapsed, pinElapsed: hasPinElapsed } };
    }
    catch (e) {
        return { ok: false, message: serverError };
    }
}
//# sourceMappingURL=login.service.js.map