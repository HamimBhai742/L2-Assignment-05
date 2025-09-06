import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import { userServices } from './user.service';
import httpStatusCode from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';

const createUser = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await userServices.createUser(req.body);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: data.message,
    data: data.user,
  });
});

const getSingleUser = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await userServices.getSingleUser(req.params.phone);

    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User found successfully',
      data,
    });
  }
);

const getMeUser = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const data = await userServices.getMeUser(userId);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: data.message,
    data: data.user,
  });
});

const updateUser = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const data = await userServices.updateUser(userId, req.body);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: data.message,
    data: data.user,
  });
});

const changePIN = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  console.log(req.body, 'sssssssss');
  const data = await userServices.changePIN(userId, req.body);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: data.message,
    data: data.user,
  });
});

const matchUserPin = createAsyncFunction(
  async (req: Request, res: Response) => {
    const phone = req.params.phone;
    const data = await userServices.matchUserPin(phone, req.body.pin);

    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Pin match successfully',
      data,
    });
  }
);

export const userController = {
  createUser,
  getSingleUser,
  getMeUser,
  updateUser,
  changePIN,
  matchUserPin
};
