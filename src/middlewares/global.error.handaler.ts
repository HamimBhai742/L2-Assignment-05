import { ZodError } from './../../node_modules/zod/v4/classic/errors.d';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../error/coustom.error.handel';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  const errorSource: any = [];
  const handelValidationError = (err: any) => {
    const error = Object.values(err.errors);
    error.forEach((e: any) =>
      errorSource.push({
        path: e.path,
        message: e.message,
      })
    );
    statusCode = 400;
    message = 'Validation Error';
  };

  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Zod Validation Error';
    err.issues.forEach((i: any) => {
      errorSource.push({
        path: i.path[i.path.length - 1],
        message: i.message,
      });
    });
  } else if (err.name === 'ValidationError') {
    handelValidationError(err);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
  });
};
