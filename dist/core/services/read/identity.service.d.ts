import type { Prisma } from "@prisma/client";
import type { ApiPolicy } from "../../../shared/api/policy.js";
export declare const PublicSelect: {
    firstName: true;
    lastName: true;
    middleName: true;
    gender: true;
    birthDate: true;
    nationality: true;
    placeOfBirth: true;
};
export type Returnpolicypublicidentity = Prisma.UserIdentityGetPayload<{
    select: typeof PublicSelect;
}>;
export declare function identityServiceRead(userId: string): Promise<ApiPolicy<Returnpolicypublicidentity>>;
//# sourceMappingURL=identity.service.d.ts.map