import httpStatusCode from 'http-status-codes';
import { User } from '../user/user.model';
import { Role } from '../user/user.interface';
import { AppError } from '../../error/coustom.error.handel';
import { Wallet } from '../wallet/wallet.model';
import { env } from '../../config/env';
import { QueryBuilder } from '../../utils/query.builder';
import { Transaction } from '../transaction/transaction.model';
import {  transactionSearchFields, userSearchFields } from '../../utils/constain';

//get all users by admin
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: Role.USER }), query);
  const allUsers = await queryBuilder
    .filter()
    .search(userSearchFields)
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await User.countDocuments({ role: Role.USER });
  const metaData = await queryBuilder.getMeta(countDocuments);
  return {
    allUsers,
    metaData,
  };
};

//get all users by admin
const getAllAgents = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: Role.AGENT }), query);
  const allAgents = await queryBuilder
    .filter()
    .search(userSearchFields)
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await User.countDocuments({ role: Role.AGENT });
  const metaData = await queryBuilder.getMeta(countDocuments);
  return {
    allAgents,
    metaData,
  };
};

//admin gel all wallet
const getAllWallets = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Wallet.find().populate('user', 'name phone role status'),
    query
  );
  const allWallets = await queryBuilder
    .filter()
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await Wallet.countDocuments();
  const metaData = await queryBuilder.getMeta(countDocuments);
  return {
    allWallets,
    metaData,
  };
};

//all transaction
const getAllTransaction = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find()
      .populate('to', 'name phone role status')
      .populate('from', 'name phone role status'),
    query
  );
  const allTransaction = await queryBuilder
    .filter()
    .search(transactionSearchFields)
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await Transaction.countDocuments();
  const metaData = await queryBuilder.getMeta(countDocuments);

  return {
    allTransaction,
    metaData,
  };
};

//admin active wallet
const activeWallet = async (id: string) => {
  const isExistWallet = await Wallet.findOne({ user: id });
  const isExistUser = await User.findById(id);
  if (!isExistWallet) {
    throw new AppError(
      'This ID does not belong to the wallet.',
      httpStatusCode.BAD_REQUEST
    );
  }
  if (isExistUser?.role !== Role.USER) {
    throw new AppError('This is no user', httpStatusCode.BAD_REQUEST);
  }
  if (isExistWallet.status === env.WALLET_ACTIVE) {
    throw new AppError(
      `Wallet already ${env.WALLET_ACTIVE}`,
      httpStatusCode.FORBIDDEN
    );
  }
  await Wallet.findOneAndUpdate(
    { user: id },
    {
      status: env.WALLET_ACTIVE,
    }
  );
  return {
    success: true,
    message: `Wallet ${env.WALLET_ACTIVE} successfully`,
    data: {
      walletStatus: env.WALLET_ACTIVE,
    },
  };
};

//admin active wallet
const blockedWallet = async (id: string) => {
  const isExistWallet = await Wallet.findOne({ user: id });
  const isExistUser = await User.findById(id);
  if (!isExistWallet) {
    throw new AppError(
      'This ID does not belong to the wallet.',
      httpStatusCode.BAD_REQUEST
    );
  }
  if (isExistUser?.role !== Role.USER) {
    throw new AppError('This is no user', httpStatusCode.BAD_REQUEST);
  }
  if (isExistWallet.status === env.WALLET_BLOCKED) {
    throw new AppError(
      `Wallet already ${env.WALLET_BLOCKED}`,
      httpStatusCode.FORBIDDEN
    );
  }
  await Wallet.findOneAndUpdate(
    { user: id },
    {
      status: env.WALLET_BLOCKED,
    }
  );
  return {
    success: true,
    message: `Wallet  ${env.WALLET_BLOCKED} successfully`,
    data: {
      walletStatus: env.WALLET_BLOCKED,
    },
  };
};

//approved agent
const approvedAgent = async (id: string) => {
  const isExistAgent = await User.findOne({ _id: id, role: Role.AGENT });
  if (!isExistAgent) {
    throw new AppError(
      'This ID does not belong to the agent.',
      httpStatusCode.BAD_REQUEST
    );
  }
  if ((isExistAgent.agentStatus as string) === env.AGENT_APPROVED) {
    throw new AppError(`Agent already ${env.AGENT_APPROVED}`, httpStatusCode.FORBIDDEN);
  }
  await User.findByIdAndUpdate(id, {
    agentStatus: env.AGENT_APPROVED,
  });
  return {
    success: true,
    message: `Agent ${env.AGENT_APPROVED} successfully`,
    data: {
      agentStatus: env.AGENT_APPROVED,
      role: Role.AGENT,
    },
  };
};

//approved agent
const suspendAgent = async (id: string) => {
  const isExistAgent = await User.findOne({ _id: id, role: Role.AGENT });
  if (!isExistAgent) {
    throw new AppError(
      'This ID does not belong to the agent.',
      httpStatusCode.BAD_REQUEST
    );
  }
  if ((isExistAgent.agentStatus as string) === env.AGENT_SUSPEND) {
    throw new AppError(`Agent already ${env.AGENT_SUSPEND}`, httpStatusCode.FORBIDDEN);
  }
  await User.findByIdAndUpdate(id, {
    agentStatus: env.AGENT_SUSPEND,
  });
  return {
    success: true,
    message: `Agent ${env.AGENT_SUSPEND} successfully`,
    data: {
      agentStatus: env.AGENT_SUSPEND,
      role: Role.AGENT,
    },
  };
};

export const adminServices = {
  approvedAgent,
  suspendAgent,
  getAllUsers,
  getAllAgents,
  getAllWallets,
  activeWallet,
  blockedWallet,
  getAllTransaction,
};
