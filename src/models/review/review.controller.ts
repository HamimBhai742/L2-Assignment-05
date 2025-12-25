import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { reviewServices } from './review.services';
import { JwtPayload } from 'jsonwebtoken';
import { sendResponse } from '../../utils/send.response';
import httpStatusCode from 'http-status-codes';
const createReview = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const data = await reviewServices.createReview(userId, req.body);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Review created successfully',
      data,
    });
  }
);

const getAllReviews = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await reviewServices.getAllReviews();
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Reviews found successfully',
      data,
    });
  }
);

const getMyReviews = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const data = await reviewServices.getMyReviews(userId);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'My reviews found successfully',
      data,
    });
  }
);

export const reviewController = { createReview, getAllReviews, getMyReviews };
