import { Request, Response, NextFunction } from 'express';

/**
 * Global Express error handler.
 * Must be registered LAST with `app.use(errorHandler)`.
 * All errors thrown inside `asyncHandler`-wrapped controllers reach here.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  console.error('🔴 Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    error: { message: err.message || 'Internal Server Error' },
  });
}
