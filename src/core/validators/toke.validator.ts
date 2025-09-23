import z from "zod";

export const validateToken = z.object({
    token: z.string().min(60).max(60)
})