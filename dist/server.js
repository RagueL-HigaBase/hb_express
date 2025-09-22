import express, {} from 'express';
import morgan from 'morgan';
export async function runServer() {
    const app = express();
    const PORT = process.env.PORT || 8000;
    app.use(morgan("combined"));
    app.use(express.json());
    app.post('/', (req, res) => console.log(req, res));
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=server.js.map