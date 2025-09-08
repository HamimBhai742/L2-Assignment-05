import { transactionController } from './../transaction/transaction.controller';
import httpStatusCode from 'http-status-codes';
import { User } from '../user/user.model';
import { Role } from '../user/user.interface';
import { AppError } from '../../error/coustom.error.handel';
import { Wallet } from '../wallet/wallet.model';
import { env } from '../../config/env';
import { QueryBuilder } from '../../utils/query.builder';
import { Transaction } from '../transaction/transaction.model';
import {
  transactionSearchFields,
  userSearchFields,
} from '../../utils/constain';
import { TransactionStatus } from '../transaction/transaction.interface';

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

  const totalItems = await new QueryBuilder(
    User.find({ role: Role.USER }),
    query
  )
    .filter()
    .search(userSearchFields)
    .count();

  const metaData = await queryBuilder.getMeta(totalItems);

  const activeUser = await User.countDocuments({
    role: Role.USER,
    isActive: true,
  });
  const blockedUsers = await User.countDocuments({
    role: Role.USER,
    isActive: false,
  });
  const totalUsers = await User.countDocuments({ role: Role.USER });
  return {
    allUsers,
    metaData,
    blockedUsers,
    activeUser,
    totalUsers,
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

  const totalItems = await new QueryBuilder(
    User.find({ role: Role.AGENT }),
    query
  )
    .filter()
    .search(userSearchFields)
    .count();
  const metaData = await queryBuilder.getMeta(totalItems);
  const pendingAgents = await User.countDocuments({
    role: Role.AGENT,
    agentStatus: 'pending',
  });
  const approvedAgents = await User.countDocuments({
    role: Role.AGENT,
    agentStatus: 'approved',
  });

  const suspendAgents = await User.countDocuments({
    role: Role.AGENT,
    agentStatus: 'suspend',
  });

  const totalAgents = await User.countDocuments({ role: Role.AGENT });
  return {
    allAgents,
    metaData,
    pendingAgents,
    approvedAgents,
    suspendAgents,
    totalAgents,
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

  const totalItems = await new QueryBuilder(Transaction.find(), query)
    .filter()
    .search(transactionSearchFields)
    .count();
  const metaData = await queryBuilder.getMeta(totalItems);

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
    throw new AppError(
      `Agent already ${env.AGENT_APPROVED}`,
      httpStatusCode.FORBIDDEN
    );
  }
  await User.findByIdAndUpdate(id, {
    agentStatus: env.AGENT_APPROVED,
  });
  return {
    success: true,
    message: `Agent ${env.AGENT_APPROVED} successfully`,
  };
};

//approved agent
const suspendAgent = async (id: string) => {
  console.log(id);
  const isExistAgent = await User.findOne({ _id: id, role: Role.AGENT });
  if (!isExistAgent) {
    throw new AppError(
      'This ID does not belong to the agent.',
      httpStatusCode.BAD_REQUEST
    );
  }
  if ((isExistAgent.agentStatus as string) === env.AGENT_SUSPEND) {
    throw new AppError(
      `Agent already ${env.AGENT_SUSPEND}`,
      httpStatusCode.FORBIDDEN
    );
  }
  await User.findByIdAndUpdate(id, {
    agentStatus: env.AGENT_SUSPEND,
    isActive: false,
  });
  await Wallet.findOneAndUpdate(
    { user: id },
    {
      status: env.WALLET_BLOCKED,
    }
  );
  return {
    success: true,
    message: `Agent ${env.AGENT_SUSPEND} successfully`,
  };
};

const reactiveAgent = async (id: string) => {
  console.log(id);
  const isExistAgent = await User.findOne({ _id: id, role: Role.AGENT });
  if (!isExistAgent) {
    throw new AppError(
      'This ID does not belong to the agent.',
      httpStatusCode.BAD_REQUEST
    );
  }

  await User.findByIdAndUpdate(id, {
    agentStatus: env.AGENT_APPROVED,
    isActive: true,
  });

  await Wallet.findOneAndUpdate(
    { user: id },
    {
      status: env.WALLET_ACTIVE,
    }
  );
  return {
    success: true,
    message: `Agent ${env.AGENT_REACTIVE} successfully`,
  };
};

const manageUser = async (status: string, id: string) => {
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new AppError(
      'This ID does not belong to the user.',
      httpStatusCode.BAD_REQUEST
    );
  }

  if (status === 'block' && isExistUser.isActive) {
    await User.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true, runValidators: true }
    );
    await Wallet.findOneAndUpdate(
      { user: id },
      {
        status: env.WALLET_BLOCKED,
      }
    );
  }

  if (status === 'unblock' && !isExistUser.isActive) {
    await User.findByIdAndUpdate(
      id,
      {
        isActive: true,
      },
      { new: true, runValidators: true }
    );
    await Wallet.findOneAndUpdate(
      { user: id },
      {
        status: env.WALLET_ACTIVE,
      }
    );
  }

  return {
    success: true,
    message: `User ${status} successfully`,
  };
};

const deletedUser = async (id: string) => {
  await User.findByIdAndDelete(id);
  await Wallet.findOneAndDelete({ user: id });
  return {
    success: true,
    message: `User deleted successfully`,
  };
};

const adminOverView = async () => {
  const totalAgent = await User.countDocuments({ role: Role.AGENT });
  const totalUser = await User.countDocuments({ role: Role.USER });
  const totalTransaction = await Transaction.countDocuments();
  const totalTransactionValue = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const todayTransaction = await Transaction.countDocuments({
    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) },
  });

  const todayTransactionValue = await Transaction.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const todayAvgTransaction =
    todayTransaction > 0
      ? todayTransactionValue[0]?.total / todayTransaction
      : 0;

  const avgTransaction =
    totalTransaction > 0
      ? totalTransactionValue[0]?.total / totalTransaction
      : 0;
  return {
    totalAgent,
    totalUser,
    totalTransaction,
    totalTransactionAmount: totalTransactionValue[0]?.total,
    todayTransaction,
    todayAmount: todayTransactionValue[0]?.total,
    todayAvgTransaction,
    avgTransaction,
  };
};

const transactionAnalytics = async () => {
  const transaction = await Transaction.aggregate([
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        transactions: { $sum: 1 },
        volume: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        transactions: 1,
        volume: 1,
        day: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'Sun' },
              { case: { $eq: ['$_id', 2] }, then: 'Mon' },
              { case: { $eq: ['$_id', 3] }, then: 'Tues' },
              { case: { $eq: ['$_id', 4] }, then: 'Wednes' },
              { case: { $eq: ['$_id', 5] }, then: 'Thurs' },
              { case: { $eq: ['$_id', 6] }, then: 'Fri' },
              { case: { $eq: ['$_id', 7] }, then: 'Sat' },
            ],
            default: 'Unknown',
          },
        },
      },
    },
  ]);

  const typeChart = await Transaction.aggregate([
    {
      $match: {
        status: TransactionStatus.COMPLETED,
        type: {
          $in: [
            'cash_in',
            'cash_out',
            'send_money',
            'receive_money',
            'withdraw',
            'deposit',
          ],
        },
      },
    },
    {
      $group: {
        _id: '$type',
        value: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        value: 1,
        name: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'cash_in'] }, then: 'Cash In' },
              { case: { $eq: ['$_id', 'cash_out'] }, then: 'Cash Out' },
              { case: { $eq: ['$_id', 'send_money'] }, then: 'Send Money' },
              {
                case: { $eq: ['$_id', 'receive_money'] },
                then: 'Receive Money',
              },
              { case: { $eq: ['$_id', 'withdraw'] }, then: 'Withdraw' },
              { case: { $eq: ['$_id', 'deposit'] }, then: 'Deposit' },
            ],
            default: 'Unknown',
          },
        },
        color: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'cash_in'] }, then: '#10B981' },
              { case: { $eq: ['$_id', 'cash_out'] }, then: '#F59E0B' },
              { case: { $eq: ['$_id', 'send_money'] }, then: '#3B82F6' },
              { case: { $eq: ['$_id', 'receive_money'] }, then: '#8B5CF6' },
              { case: { $eq: ['$_id', 'withdraw'] }, then: '#1D4ED8' },
              { case: { $eq: ['$_id', 'deposit'] }, then: '#047857' },
            ],
            default: '#FF0000',
          },
        }
      },
    },
  ]);
  return { transaction, typeChart };
};

export const adminServices = {
  approvedAgent,
  suspendAgent,
  reactiveAgent,
  getAllUsers,
  getAllAgents,
  getAllWallets,
  activeWallet,
  blockedWallet,
  getAllTransaction,
  manageUser,
  deletedUser,
  adminOverView,
  transactionAnalytics,
};
