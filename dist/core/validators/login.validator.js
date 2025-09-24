import z from "zod";
export const validateLogin = z.object({
    email: z.email(),
    password: z.string().min(10).max(32),
    pin: z.string().min(4).max(4)
});
//# sourceMappingURL=login.validator.js.map