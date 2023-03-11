import express, { Express, Request, Response } from 'express'
import cors from 'cors'

export async function start(): Promise<void> {
  const server: Express = express()
  const app = express.Router()
  
  server.use('/api/', app)
  
  app.use(express.json())
  app.use(
    cors({
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  
  app.get('/', handleRoot)
    
  server.listen(3000, () => console.info('Backend running!'))
}
  
function handleRoot(_req: Request, res: Response): void {
  res.json('Running backend')
}
