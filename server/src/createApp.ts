import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import { usersRoutes } from './routes/usersRoutes.js'
import { vacationRequestsRoutes } from './routes/vacationRequestsRoutes.js'

export function createApp() {
  const app = express()
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174']
  const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : defaultOrigins

  app.use(cors({ origin: allowedOrigins }))
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/users', usersRoutes)
  app.use('/api/vacation-requests', vacationRequestsRoutes)
  app.use(errorHandler)

  return app
}
