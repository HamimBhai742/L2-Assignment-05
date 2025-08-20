import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import { userServices } from './user.service';
import httpStatusCode from 'http-status-codes';
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

export const userController = {
  createUser,
};