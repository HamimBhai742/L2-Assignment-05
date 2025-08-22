import httpStatusCode from 'http-status-codes';
import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import { transactionServices } from './transaction.service';
import { JwtPayload } from 'jsonwebtoken';

const getAllTransactin = createAsyncFunction(
  async (req: Request, res: Response) => {
    const query = req.query;
    const data = await transactionServices.getAllTransaction(
      query as Record<string, string>
    );
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
    const query = req.query;
    const data = await transactionServices.getMyTransactoins(
      userId,
      query as Record<string, string>
    );
    //send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'My transaction retrived successfully',
      data: data.myTnx,
      metadata: data.metaData,
    });
  }
);

const getCommissionTransactoins = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const query = req.query;
    const data = await transactionServices.getCommissionTransactoins(
      userId,
      query as Record<string, string>
    );
    //send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: 'My transaction retrived successfully',
      data: data.commissionTnx,
      metadata: data.metaData,
    });
  }
);

export const transactionController = {
  getAllTransactin,
  getMyTransactoins,
  getCommissionTransactoins,
};
