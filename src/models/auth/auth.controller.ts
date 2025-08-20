import { NextFunction, Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import httpStatusCode from 'http-status-codes';
import passport from 'passport';
import { AppError } from '../../error/coustom.error.handel';
import { createUserToken } from '../../utils/jwt.token';
const loggedInUser = createAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return next(
          new AppError(err.message, httpStatusCode.INTERNAL_SERVER_ERROR)
        );
      }

      if (!user) {
        return next(new AppError(info.message, httpStatusCode.UNAUTHORIZED));
      }

      const accessToken = createUserToken(user);

      const userData = { ...user.toObject() };
      delete userData.password; // Remove password from user data
      //send response
      sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: 'You have logged in successfully',
        data: {
          accessToken,
          user: userData,
        },
      });
    });
  }
);


