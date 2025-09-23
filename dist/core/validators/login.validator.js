import z from "zod";
export const validateLogin = z.object({
    email: z.email(),
    password: z.string().min(10).max(32)
});
//# sourceMappingURL=login.validator.js.map