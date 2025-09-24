import type { ApiPolicy } from "../../../shared/api/policy.js";
import { IdHash } from "../../../shared/cipher/session.cipher.js";
import { prisma } from "../../../shared/lib/prisma.js";
import { serverError, sessionUnexist } from "../../../shared/messages/server.js";
import type { SesionServerSelect } from "../../selects/session.select.js";

export async function sessionServicePatch(session: string): Promise<ApiPolicy<SesionServerSelect>> {
    try {
        const sessionHash = IdHash(session);
        const isSession = await prisma.userSession.findUnique({ where: { id: sessionHash } });

        if (!isSession) return { ok: false, message: sessionUnexist };

        if (isSession.revoked) return { ok: false, message: sessionUnexist};

        if (isSession.sessionElapsed < new Date()) {
            const revoreSession = await prisma.userSession.update({ 
                where: { id: sessionHash}, 
                data: { 
                    revoked: true,
                    revokedAt: new Date(),
                }
            });
            return { ok: false, message: sessionUnexist };
        };
        return { ok: true, data: { sessionElapsed: false } }

    } catch(e) {
        return { ok: false, message: serverError }
    }
}