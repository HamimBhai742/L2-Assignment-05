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

const getAllAgents = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await userServices.getAllAgents();
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Retrieved all users successfully",
    data,
  });
});

const updateAgentStatus = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { agentStatus } = req.body;

    const data = await userServices.updateAgentStatus(id, agentStatus);

    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);

const getAllUsers = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await userServices.getAllUsers();
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Retrieved all agents successfully",
    data,
  });
});

const updateUserStatus = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const data = await userServices.updateUserStatus(id, status);

    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);

const getAllWallets = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await userServices.getAllWallets();
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: "Retrieved all wallets successfully",
    data,
  });
});


const updateWalletStatus = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const data = await userServices.updateWalletStatus(id, status);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: data.message,
      data: data.data,
    });
  }
);


export const userController = {
  createUser,
  updateAgentStatus,
  updateUserStatus,
  getAllUsers,
  getAllAgents,
  getAllWallets,
  updateWalletStatus
};
