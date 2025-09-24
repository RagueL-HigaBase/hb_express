import "dotenv/config";
import type { ApiPolicy } from "../../../shared/api/policy.js";
import type { PublicSelectUser } from "../../selects/login.select.js";
import type { ValidateLogin } from "../../validators/login.validator.js";
export declare function loginServiceCreate(v: ValidateLogin): Promise<ApiPolicy<PublicSelectUser>>;
//# sourceMappingURL=login.service.d.ts.map