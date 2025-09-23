import express, { type Request, type Response } from 'express';
import { publicRouter } from './core/routes/main.routes.js';
import morgan from 'morgan';
import { mockController } from './mock/controller/mock.controller.js';

export async function runServer() {

    const app = express();

    const PORT = process.env.PORT || 8000;

    app.use(express.json());

    app.use(morgan('tiny'));

    app.use('/public', publicRouter);

    app.post('/', (req: Request, res: Response) => console.log(req, res));

    app.use(mockController)

    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    });
}