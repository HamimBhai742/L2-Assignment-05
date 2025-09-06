import { checkAuth } from './../../middlewares/jwt.verify';
import { NextFunction, Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import httpStatusCode from 'http-status-codes';
import passport from 'passport';
import { AppError } from '../../error/coustom.error.handel';
import { createUserToken } from '../../utils/jwt.token';
import { setCookies } from '../../utils/set.cookies';
import bcryptjs from 'bcrypt';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
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

      const userToken = createUserToken(user);
      setCookies(res, userToken);

      const userData = { ...user.toObject() };
      delete userData.password; // Remove password from user data

      //set cookie
      setCookies(res, userToken);

      //send response
      sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: 'You have logged in successfully',
        data: {
          accessToken: userToken.accessToken,
          user: userData,
        },
      });
    })(req, res, next);
  }
);

export const checkLoginUser = createAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'You have logged in successfully',
      data: req.user,
    });
  }
);

export const matchPIN = createAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const pin = req.params.pin;
    const { userId } = req.user as JwtPayload;
    const user = await User.findById(userId);
    const match = await bcryptjs.compare(pin, user?.password as string);

    if (!match) {
      return next(new AppError('Invalid PIN', httpStatusCode.UNAUTHORIZED));
    }

    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'You have logged in successfully',
      data: req.user,
    });
  }
);

export const logout = createAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken');
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'You have logged out successfully',
      data: null,
    });
  }
);

export const authController = {
  loggedInUser,
  checkLoginUser,
  logout,
  matchPIN,
};
