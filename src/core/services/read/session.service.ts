import { prisma } from "../../../shared/lib/prisma.js";

export async function sessionServiceUpdate(token: string) {
    const hasSession = await prisma.
}