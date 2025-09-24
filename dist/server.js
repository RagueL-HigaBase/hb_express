import express, {} from 'express';
import { publicRouter } from './core/routes/main.routes.js';
import morgan from 'morgan';
import cors from 'cors';
import { mockController } from './mock/controller/mock.controller.js';
import cookieParser from "cookie-parser";
export async function runServer() {
    const app = express();
    const PORT = process.env.PORT || 8000;
    const DEV_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
    ];
    app.use(cors({
        origin: DEV_ORIGINS,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
        exposedHeaders: ["Content-Length", "X-Request-Id"],
    }));
    app.use(cookieParser());
    app.use(express.json());
    app.use(morgan('tiny'));
    app.use('/public', publicRouter);
    app.post('/', (req, res) => console.log(req, res));
    app.use(mockController);
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=server.js.map