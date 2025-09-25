import type { ApiPolicy } from "../../../shared/api/policy.js";
import type { ServerSelectRevoke, ServerSelectExtended } from "../../selects/pin.select.js";
export declare function pinServiceRevoke(sessionId: string): Promise<ApiPolicy<ServerSelectRevoke>>;
export declare function pinServiceExtend(id: string, pin: string): Promise<ApiPolicy<ServerSelectExtended>>;
//# sourceMappingURL=pin.service.d.ts.map