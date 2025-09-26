import type { ApiPolicy } from "../../../shared/api/policy.js";
import type { RegisterValidator } from "../../validators/register.validator.js";
export type ReturnPolicyRegisterServiceCreate = {
    email: string;
};
export declare function registerServiceCreate(v: RegisterValidator): Promise<ApiPolicy<ReturnPolicyRegisterServiceCreate>>;
//# sourceMappingURL=register.service.d.ts.map