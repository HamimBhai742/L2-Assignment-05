import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { sendResponse } from '../../utils/send.response';
import httpStatusCode from 'http-status-codes';
import { statsServices } from './stats.services';

const homePageStats = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await statsServices.homePageStats();
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Stats found successfully',
      data
    });
  }
);


export const statsController = { homePageStats };
