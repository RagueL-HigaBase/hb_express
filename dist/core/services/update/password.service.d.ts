import type { ApiPolicy } from "../../../shared/api/policy.js";
export type ReturnPolicyPasswordServiceUpdate = {
    message: string;
};
export declare function passwordServiceUpdate(userId: string, password: string, newPassword: string): Promise<ApiPolicy<ReturnPolicyPasswordServiceUpdate>>;
//# sourceMappingURL=password.service.d.ts.map