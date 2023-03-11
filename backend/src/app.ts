import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { scrapeProducts } from './scraper.js'
import { getCheapestStore } from './cheapest.js'

// Define Express.JS webserver
export async function start(): Promise<void> {
    const server: Express = express()
    const app = express.Router()

    server.use('/', app)

    app.use(express.json())
    app.use(
        cors({
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
    )

    app.get('/', handleRoot)
    app.get('/search', handleSearch)
    app.post('/products', handleProducts)

    server.listen(3000, () => console.info('Backend running!'))
}

// Defines root endpoint
function handleRoot(_req: Request, res: Response): void {
    res.json('Running backend')
}

// Defines search endpoint for frontend to search products
async function handleSearch(req: Request, res: Response): Promise<void> {
    const searchParam = req.query.q as string
    res.json(await scrapeProducts(searchParam))
}

// Defines products endpoint for frontend to push products and get the best supermarket
async function handleProducts(req: Request, res: Response): Promise<void> {
    const body = req.body as string
    res.json(getCheapestStore(body))
}
