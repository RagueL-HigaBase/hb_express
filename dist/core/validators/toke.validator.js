import z from "zod";
export const validateToken = z.object({
    token: z.string().min(32).max(32)
});
//# sourceMappingURL=toke.validator.js.map