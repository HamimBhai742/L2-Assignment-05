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

const withdrawMoney = createAsyncFunction(
  async (req: Request, res: Response) => {
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
  }
);

const sendMoney = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const body = req.body;
  const data = await walletServices.sendMoney(userId, body);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: data.message,
    data: data.wallet,
  });
});

const cashIn = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const body = req.body;
  const data = await walletServices.cashIn(userId, body);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: data.message,
    data: data.wallet,
  });
});

const cashOut = createAsyncFunction(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const body = req.body;
  const data = await walletServices.cashOut(userId, body);

  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: data.message,
    data: data.wallet,
  });
});

const viewMyWallet = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const data = await walletServices.viewMyWallet(userId);

    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'View my wallet successfully',
      data,
    });
  }
);

export const walletController = {
  addMoney,
  withdrawMoney,
  sendMoney,
  cashIn,
  cashOut,
  viewMyWallet,
};
