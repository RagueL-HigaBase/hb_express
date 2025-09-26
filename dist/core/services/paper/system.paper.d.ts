import type { ApiPolicy } from "../../../shared/api/policy.js";
export type ReturnPolicySystemPapper = {
    userId: string;
    session: string;
    pinElapsed?: boolean;
};
export declare function systemPaperRead(session: string): Promise<ApiPolicy<ReturnPolicySystemPapper>>;
//# sourceMappingURL=system.paper.d.ts.map