import express from 'express';
import cors from 'cors';
import { scrapeProducts } from './scraper.js';
export async function start() {
    const server = express();
    const app = express.Router();
    server.use('/', app);
    app.use(express.json());
    app.use(cors({
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.get('/', handleRoot);
    app.get('/search', handleSearch);
    server.listen(3000, () => console.info('Backend running!'));
}
function handleRoot(_req, res) {
    res.json('Running backend');
}
// www.rndevelopment.be/search?q=kaas
async function handleSearch(req, res) {
    const searchParam = req.query.q;
    res.json(await scrapeProducts(searchParam));
}
//# sourceMappingURL=app.js.map