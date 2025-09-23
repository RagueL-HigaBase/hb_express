import z from "zod";
export declare const registerValidator: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    confirm: z.ZodString;
}, z.z.core.$strip>;
export type RegisterValidator = z.infer<typeof registerValidator>;
//# sourceMappingURL=register.validator.d.ts.map