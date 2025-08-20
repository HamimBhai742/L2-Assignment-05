import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

export const validationRequest =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
