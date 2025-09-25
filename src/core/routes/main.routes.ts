import { Router } from "express";
import { registerControllerCreate } from "../controllers/create/register.controller.js";
import { loginControllerCreate } from "../controllers/create/login.controller.js";
import { loginMiddleware } from "../middleware/login.middleware.js";
import { pinMiddleware } from "../middleware/pin.middleware.js";
import { pinServiceUpdate } from "../controllers/update/pin.service.js";
import { loginControllerLayer } from "../controllers/read/login.controller.js";
import { pinControllerLayer } from "../controllers/read/pin.controller.js";


// RU 🔐 Маршруты аутентификации: регистрация, логин и PIN-флоу.
// EN 🔐 Auth routes: registration, login, and PIN flow.
// NL 🔐 Authenticatieroutes: registratie, inloggen en PIN-flow.
export const authRouter = Router();

// RU 📝 POST /register — регистрация пользователя (email + пароль), без входа.
// EN 📝 POST /register — create user (email + password), no login.
// NL 📝 POST /register — gebruiker aanmaken (e-mail + wachtwoord), geen login.
authRouter.post('/register', registerControllerCreate);

// RU 🔎 GET /login — проверка статуса сессии (активна/нет), без побочных эффектов.
// EN 🔎 GET /login — quick session status check (active or not), no side effects.
// NL 🔎 GET /login — snelle controle van sessiestatus (actief of niet), zonder neveneffecten.
authRouter.get('/login', loginControllerLayer);

// RU 🔑 POST /login — аутентификация (email/пароль/PIN), ставит httpOnly cookie; через loginMiddleware.
// EN 🔑 POST /login — authenticate (email/password/PIN), sets httpOnly cookie; via loginMiddleware.
// NL 🔑 POST /login — authenticatie (e-mail/wachtwoord/PIN), zet httpOnly cookie; via loginMiddleware.
authRouter.post('/login', loginMiddleware, loginControllerCreate);

// RU 📍 GET /pin — проверка статуса PIN для активной сессии.
// EN 📍 GET /pin — check PIN status for the active session.
// NL 📍 GET /pin — PIN-status controleren voor de actieve sessie.
authRouter.get('/pin', pinControllerLayer)

// RU ✅ POST /pin — подтверждение/обновление PIN; доступ через pinMiddleware.
// EN ✅ POST /pin — confirm/update PIN; protected by pinMiddleware.
// NL ✅ POST /pin — PIN bevestigen/bijwerken; beveiligd door pinMiddleware.
authRouter.post('/pin', pinMiddleware, pinServiceUpdate);

