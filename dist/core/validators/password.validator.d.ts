import z from "zod";
export declare const validatePasswordOnChange: z.ZodObject<{
    password: z.ZodString;
    newPassword: z.ZodString;
    confirm: z.ZodString;
}, z.z.core.$strip>;
export type ValidatePasswordOnChange = z.infer<typeof validatePasswordOnChange>;
//# sourceMappingURL=password.validator.d.ts.map