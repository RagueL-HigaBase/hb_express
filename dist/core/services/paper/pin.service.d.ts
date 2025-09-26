import type { ApiPolicy } from "../../../shared/api/policy.js";
export type ReturnPolicyPinServicePaper = {
    pinElapsed: boolean;
    id: string;
};
export declare function pinServicePaper(session: string): Promise<ApiPolicy<ReturnPolicyPinServicePaper>>;
//# sourceMappingURL=pin.service.d.ts.map