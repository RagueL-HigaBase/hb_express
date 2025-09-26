import iso from "iso-3166-1";
import { countrySchema, identityValidator } from "../../validators/identity.validator.js";
import { validationFailed } from "../../../shared/messages/server.js";
import { identityServiceUpdate } from "../../services/update/identity.service.js";
export async function identityControllerUpdate(req, res) {
    const userId = res.locals.userId;
    const { firstName, lastName, middleName, gender, birthDate, nationality, placeOfBirth, updated } = req.body;
    const dN = nationality;
    const isoN = iso.whereNumeric(dN.numeric);
    const vN = countrySchema.safeParse(isoN);
    const dP = placeOfBirth;
    const isoP = iso.whereNumeric(dP.numeric);
    const vP = countrySchema.safeParse(isoP);
    const v = identityValidator.safeParse({
        firstName,
        lastName,
        middleName,
        gender,
        birthDate: birthDate ? new Date(birthDate) : '',
        nationality: vN.data,
        placeOfBirth: vP.data,
        updated: new Date(updated)
    });
    console.log(v);
    if (!v.success)
        return res.status(404).json({ ok: false, data: { message: validationFailed } });
    const tryUpdateIdentity = await identityServiceUpdate(v.data, userId);
    res.status(200).json({ ok: true, data: { ...tryUpdateIdentity } });
}
//# sourceMappingURL=identity.controller.js.map