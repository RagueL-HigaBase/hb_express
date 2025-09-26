import type { Request, Response } from "express";
export type ISOCountry = {
    country: string;
    alpha2: string;
    alpha3: string;
    numeric: string;
};
export declare function identityControllerUpdate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=identity.controller.d.ts.map