import { GENDER } from "@prisma/client";
import z from "zod";
export const countrySchema = z.object({
    country: z.string().optional(),
    alpha2: z.string().optional(),
    alpha3: z.string().optional(),
    numeric: z.string().optional(),
});
export const identityValidator = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    middleName: z.string().min(1).max(50).optional(),
    gender: z.enum(GENDER).optional(),
    birthDate: z.date().optional(),
    nationality: countrySchema.optional(),
    placeOfBirth: countrySchema.optional(),
    updated: z.date()
});
//# sourceMappingURL=identity.validator.js.map