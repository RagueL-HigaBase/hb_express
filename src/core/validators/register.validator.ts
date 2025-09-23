import z from "zod";

export const registerValidator = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(10).max(32),
    confirm: z.string().min(10).max(32)
}).refine(val => val.confirm === val.password);

export type RegisterValidator = z.infer<typeof registerValidator>