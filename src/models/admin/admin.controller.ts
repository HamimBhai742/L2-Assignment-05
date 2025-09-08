import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { adminServices } from './admin.services';
import { sendResponse } from '../../utils/send.response';

const getAllUsers = createAsyncFunction(async (req: Request, res: Response) => {
  const query = req.query;
  const data = await adminServices.getAllUsers(query as Record<string, string>);
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Retrieved all users successfully',
    data: {
      users: data.allUsers,
      activeUsers: data.activeUser,
      blockedUsers: data.blockedUsers,
      totalUsers: data.totalUsers,
    },
    metadata: data.metaData,
  });
});

const getAllAgents = createAsyncFunction(
  async (req: Request, res: Response) => {
    const query = req.query;
    const data = await adminServices.getAllAgents(
      query as Record<string, string>
    );
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Retrieved all agents successfully',
      data: {
        agents: data.allAgents,
        pendingAgents: data.pendingAgents,
        approvedAgents: data.approvedAgents,
        suspendAgents: data.suspendAgents,
        totalAgents: data.totalAgents,
      },
      metadata: data.metaData,
    });
  }
);

const getAllWallets = createAsyncFunction(
  async (req: Request, res: Response) => {
    const query = req.query;
    const data = await adminServices.getAllWallets(
      query as Record<string, string>
    );
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
      data: null,
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
      data: null,
    });
  }
);

const reactiveAgent = createAsyncFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    const data = await adminServices.reactiveAgent(id);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: data.message,
      data: null,
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

const manageUser = createAsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(id, status);
  const data = await adminServices.manageUser(status, id);
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.ACCEPTED,
    success: true,
    message: `User ${status} successfully`,
    data: null,
  });
});

const deleteUser = createAsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await adminServices.deletedUser(id);
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.ACCEPTED,
    success: true,
    message: data.message,
    data: null,
  });
});

const adminOverView = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await adminServices.adminOverView();
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: 'Success',
      data,
    });
  }
);

const transactionAnalytics = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await adminServices.transactionAnalytics();
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: 'Success',
      data,
    });
  }
);

export const adminController = {
  approvedAgent,
  suspendAgent,
  reactiveAgent,
  activeWallet,
  getAllUsers,
  deleteUser,
  getAllAgents,
  getAllWallets,
  blockedWallet,
  getAllTransaction,
  manageUser,
  adminOverView,
  transactionAnalytics
};
