import { NextFunction, Request, Response } from 'express';

type asyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const createAsyncFunction =
  (fn: asyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => next(err));
  };
