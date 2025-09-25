import z from "zod";
export const validatePin = z.object({
    pin: z.string().min(4).max(4)
});
//# sourceMappingURL=pin.validate.js.map