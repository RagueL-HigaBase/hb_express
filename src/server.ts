import { mockController } from './mock/controller/mock.controller.js';
import express, { type Request, type Response } from 'express';
import { authRouter } from './core/routes/main.routes.js';
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

export async function runServer() {

    const app = express();

    // RU: Порт сервера (из ENV или 8000 по умолчанию).
    // EN: Server port (from ENV or 8000 by default).
    // NL: Serverpoort (uit ENV of standaard 8000).
    const PORT = process.env.PORT || 8000;

    // RU: Разрешённые источники для CORS в дев-режиме (фронтовые дев-серверы).
    // EN: Allowed CORS origins in dev (frontend dev servers).
    // NL: Toegestane CORS-origins in dev (frontend dev-servers).
    const DEV_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
    ];

    // RU: CORS — включаем креденшелы и явно перечисляем методы/заголовки.
    // EN: CORS — enable credentials and explicitly list methods/headers.
    // NL: CORS — credentials aan en methoden/headers expliciet opgegeven.
    app.use(cors({
        origin: DEV_ORIGINS,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
        exposedHeaders: ["Content-Length", "X-Request-Id"],
    }));

    // RU: Helmet — безопасные HTTP-заголовки (XSS/iframe/прочее).
    // EN: Helmet — secure HTTP headers (XSS/iframe/etc).
    // NL: Helmet — veilige HTTP-headers (XSS/iframe/enz.).
    app.use(helmet());

    // RU: Глобальный rate limit — 200 запросов за 15 минут на IP.
    // EN: Global rate limit — 200 requests per 15 minutes per IP.
    // NL: Globale rate limit — 200 requests per 15 minuten per IP.
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

    // RU: Парсинг cookie (для чтения httpOnly-сессии на сервере).
    // EN: Cookie parsing (to read httpOnly session on the server).
    // NL: Cookie parsing (voor het lezen van httpOnly-sessie op de server).
    app.use(cookieParser());

    // RU: JSON body-парсер (иначе req.body будет undefined).
    // EN: JSON body parser (otherwise req.body is undefined).
    // NL: JSON body parser (anders is req.body undefined).
    app.use(express.json());

    // RU: Лёгкое логирование запросов (метод/URL/статус/время).
    // EN: Lightweight request logging (method/URL/status/time).
    // NL: Lichtgewicht request-logging (methode/URL/status/tijd).
    app.use(morgan('tiny'));

    // RU: Основные маршруты аутентификации (/auth/...).
    // EN: Main authentication routes (/auth/...).
    // NL: Hoofd-authenticatieroutes (/auth/...).
    app.use('/auth', authRouter);

    // RU: Тестовый endpoint (не логируйте целиком req/res в проде).
    // EN: Test endpoint (don’t log full req/res in production).
    // NL: Test-endpoint (log niet heel req/res in productie).
    app.post('/', (req: Request, res: Response) => console.log(req, res));

    // RU: Прочие/мок-маршруты — должны идти после основных.
    // EN: Other/mock routes — should come after main routes.
    // NL: Overige/mock-routes — horen na de hoofd-routes.
    app.use(mockController)

    // RU: Запуск HTTP-сервера.
    // EN: Start HTTP server.
    // NL: Start HTTP-server.
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
