import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import { walletServices } from './wallet.service';
import httpStatusCode from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';

const addMoney = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const amount = Number(req.body.amount);
  const data = await walletServices.addMoney(userId, amount);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Money added successfully',
    data,
  });
});

const withdrawMoney = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const amount = Number(req.body.amount);
  const data = await walletServices.withdrawMoney(userId, amount);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Money withdraw successfully',
    data,
  });
});

export const walletController = {
  addMoney,
  withdrawMoney,
};
