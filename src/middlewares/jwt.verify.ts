import { NextFunction, Request, Response } from 'express';
import { AppError } from '../error/coustom.error.handel';
import httpStatusCode from 'http-status-codes';
import { verifyJwtToken } from '../utils/token.create.verfy.fn';
const checkAuth =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(
          'Access denied. No token provided.',
          httpStatusCode.BAD_REQUEST
        );
      }

      const decoed = verifyJwtToken(token, process.env.JWT_SECRET as string);
      console.log(decoed);
    } catch (error) {
      next(error);
    }
  };
