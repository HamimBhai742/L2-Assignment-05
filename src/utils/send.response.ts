import { Response } from 'express';

interface IMetaData {
  total: number;
}

interface IResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
  metadata?: IMetaData;
}

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    message: data.message,
    success: data.success,
    data: data.data,
    metadata: data.metadata,
  });
};
