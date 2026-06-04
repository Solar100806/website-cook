import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an async controller method so that any thrown error is forwarded
 * to the global error handler instead of crashing the process.
 *
 * Usage:
 *   router.get('/', asyncHandler(controller.getRecipes));
 */
export function asyncHandler(fn: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
