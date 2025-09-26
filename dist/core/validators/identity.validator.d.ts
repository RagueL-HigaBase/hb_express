import z from "zod";
export declare const countrySchema: z.ZodObject<{
    country: z.ZodOptional<z.ZodString>;
    alpha2: z.ZodOptional<z.ZodString>;
    alpha3: z.ZodOptional<z.ZodString>;
    numeric: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const identityValidator: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    middleName: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        UNKNOWN: "UNKNOWN";
    }>>;
    birthDate: z.ZodOptional<z.ZodDate>;
    nationality: z.ZodOptional<z.ZodObject<{
        country: z.ZodOptional<z.ZodString>;
        alpha2: z.ZodOptional<z.ZodString>;
        alpha3: z.ZodOptional<z.ZodString>;
        numeric: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>>;
    placeOfBirth: z.ZodOptional<z.ZodObject<{
        country: z.ZodOptional<z.ZodString>;
        alpha2: z.ZodOptional<z.ZodString>;
        alpha3: z.ZodOptional<z.ZodString>;
        numeric: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>>;
    updated: z.ZodDate;
}, z.z.core.$strip>;
export type IdentityValidator = z.infer<typeof identityValidator>;
//# sourceMappingURL=identity.validator.d.ts.map