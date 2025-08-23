import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { adminServices } from './admin.services';
import { sendResponse } from '../../utils/send.response';

const getAllUsers = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await adminServices.getAllUsers();
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Retrieved all agents successfully',
    data,
  });
});

const getAllAgents = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await adminServices.getAllAgents();
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Retrieved all users successfully',
      data,
    });
  }
);

const getAllWallets = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await adminServices.getAllWallets();
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Retrieved all wallets successfully',
      data,
    });
  }
);

const getAllTransaction = createAsyncFunction(
  async (req: Request, res: Response) => {
    const query = req.query;
    const data = await adminServices.getAllTransaction(
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

const approvedAgent = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await adminServices.approvedAgent(id);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);

const suspendAgent = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await adminServices.suspendAgent(id);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);

const activeWallet = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await adminServices.activeWallet(id);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);

const blockedWallet = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await adminServices.blockedWallet(id);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);

export const adminController = {
  approvedAgent,
  suspendAgent,
  activeWallet,
  getAllUsers,
  getAllAgents,
  getAllWallets,
  blockedWallet,
  getAllTransaction
};
