import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { scrapeProducts } from './scraper.js'

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

  server.listen(3000, () => console.info('Backend running!'))
}

function handleRoot(_req: Request, res: Response): void {
  res.json('Running backend')
}

// www.rndevelopment.be/search?q=kaas
async function handleSearch(req: Request, res: Response): Promise<void> {
  const searchParam = req.query.q as string
  res.json(await scrapeProducts(searchParam))
}
