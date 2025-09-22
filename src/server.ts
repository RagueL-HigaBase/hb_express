import express, { type Request, type Response } from 'express';

export async function runServer() {
    const app = express();

    const PORT = process.env.PORT || 8000;

    app.use(express.json());

    app.post('/', (req: Request, res: Response) => console.log(req, res))

    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    });
}