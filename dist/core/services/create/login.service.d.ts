import "dotenv/config";
import type { ApiPolicy } from "../../../shared/api/policy.js";
import type { ValidateLogin } from "../../validators/login.validator.js";
export type ReturnPolicyLoginServiceCreate = {
    message: string;
    token: string;
};
export declare function loginServiceCreate(v: ValidateLogin): Promise<ApiPolicy<ReturnPolicyLoginServiceCreate>>;
//# sourceMappingURL=login.service.d.ts.map