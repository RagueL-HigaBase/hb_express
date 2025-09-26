import z from "zod";
export const validatePasswordOnChange = z.object({
    password: z.string().min(10).max(32),
    newPassword: z.string().min(10).max(32),
    confirm: z.string().min(10).max(32),
}).refine(v => v.newPassword === v.confirm);
//# sourceMappingURL=password.validator.js.map