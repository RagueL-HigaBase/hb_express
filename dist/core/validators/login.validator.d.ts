import z from "zod";
export declare const validateLogin: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.z.core.$strip>;
export type ValidateLogin = z.infer<typeof validateLogin>;
//# sourceMappingURL=login.validator.d.ts.map