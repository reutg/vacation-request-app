import type { NextFunction, Request, Response } from 'express'

type ApiError = Error & { status?: number }

export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500
  const message = status >= 500 ? 'Internal server error' : err.message
  res.status(status).json({ message })
}
