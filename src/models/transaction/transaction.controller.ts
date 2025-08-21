import httpStatusCode from 'http-status-codes';
import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import { transactionServices } from './transaction.service';
import { JwtPayload } from 'jsonwebtoken';

const getAllTransactin = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await transactionServices.getAllTransaction();
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'All transaction retrived successfully',
      data,
    });
  }
);

const getMyTransactoins = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const data = await transactionServices.getMyTransactoins(userId);
    //send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      metadata: {
        total: data.total,
      },
      message: 'My transaction retrived successfully',
      data: data.myTnx,
    });
  }
);

const getCommissionTransactoins = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const data = await transactionServices.getCommissionTransactoins(userId);
    //send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      metadata: {
        total: data.total,
      },
      message: 'My transaction retrived successfully',
      data: data.commissionTnx,
    });
  }
);

export const transactionController = {
  getAllTransactin,
  getMyTransactoins,
  getCommissionTransactoins
};
