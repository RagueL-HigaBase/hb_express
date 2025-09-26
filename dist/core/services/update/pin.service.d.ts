import type { ApiPolicy } from "../../../shared/api/policy.js";
export type ReturnpolicyPinServiceRevoke = {
    revoked: boolean;
};
export type ReturnpolicyPinServiceExtend = {
    message: string;
};
export declare function pinServiceRevoke(sessionId: string): Promise<ApiPolicy<ReturnpolicyPinServiceRevoke>>;
export declare function pinServiceExtend(id: string, pin: string): Promise<ApiPolicy<ReturnpolicyPinServiceExtend>>;
//# sourceMappingURL=pin.service.d.ts.map