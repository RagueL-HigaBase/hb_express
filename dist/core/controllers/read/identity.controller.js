import { identityServiceRead } from "../../services/read/identity.service.js";
export async function identityControllerRead(req, res) {
    // RU: userId установлен в res.locals systemMiddleware'ом после валидации сессии.
    // EN: userId is set on res.locals by systemMiddleware after session validation.
    // NL: userId is door systemMiddleware op res.locals gezet na sessievalidatie.
    const userId = res.locals.userId;
    // RU: Запрашиваем идентичность пользователя у сервисного слоя.
    // EN: Fetch the user's identity from the service layer.
    // NL: Haal de identiteit van de gebruiker op via de servicelaag.
    const hasIdentity = await identityServiceRead(userId);
    // RU: Если сервис вернул ошибку/не найдено — отвечаем 404 с полезной нагрузкой сервиса.
    // EN: If the service reports failure/not found — respond 404 with the service payload.
    // NL: Als de service faalt/niet gevonden — geef 404 terug met de servicepayload.
    if (!hasIdentity.ok) {
        return res.status(404).json({ ...hasIdentity });
    }
    // RU: Успех — возвращаем 200 и данные идентичности.
    // EN: Success — return 200 with the identity data.
    // NL: Succes — stuur 200 terug met de identiteitsgegevens.
    return res.status(200).json({ ...hasIdentity });
}
//# sourceMappingURL=identity.controller.js.map