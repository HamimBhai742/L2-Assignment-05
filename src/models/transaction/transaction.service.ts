import mongoose from 'mongoose';
import { AppError } from '../../error/coustom.error.handel';
import { transactionSearchFields } from '../../utils/constain';
import { QueryBuilder } from '../../utils/query.builder';
import { TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';
import httpStatusCode from 'http-status-codes';
import dayjs from 'dayjs';
import { env } from '../../config/env';
//view user own transactions
const getMyTransactoins = async (id: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find({ initiatedBy: id })
      .populate('from', 'name phone role status')
      .populate('to', 'name phone role status'),
    query
  );
  const myTnx = await queryBuilder
    .filter()
    .search(transactionSearchFields)
    .pagination()
    .sort()
    .select()
    .build();

  const totalItems = await new QueryBuilder(
    Transaction.find({ initiatedBy: id }),
    query
  )
    .filter()
    .search(transactionSearchFields)
    .count();
  console.log(totalItems);

  // const countDocuments = await Transaction.countDocuments({ initiatedBy: id });
  const metaData = await queryBuilder.getMeta(totalItems);
  return {
    myTnx,
    metaData,
  };
};

//view commission transaction
const getCommissionTransactoins = async (
  id: string,
  query: Record<string, string>
) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find({
      initiatedBy: id,
      type: TransactionType.COMMISSION,
    }),
    query
  );

  const commissionTnx = await queryBuilder
    .filter()
    .search(transactionSearchFields)
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await Transaction.countDocuments({
    initiatedBy: id,
    type: TransactionType.COMMISSION,
  });
  const metaData = await queryBuilder.getMeta(countDocuments);
  return {
    commissionTnx,
    metaData,
  };
};

const todayTotalTransactions = async (id: string) => {
  const today = new Date();
  const formatted = today.toISOString().split('T')[0];

  //cash in today
  const result = await Transaction.aggregate([
    {
      $match: {
        initiatedBy: new mongoose.Types.ObjectId(id), // filter by initiatedBy
        type: 'cash_in', // filter by type
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  const cashIn = result.filter((d) => d._id.date === formatted);

  //cash out today
  const result2 = await Transaction.aggregate([
    {
      $match: {
        initiatedBy: new mongoose.Types.ObjectId(id), // filter by initiatedBy
        type: 'cash_out', // filter by type
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  const cashOut = result2.filter((d) => d._id.date === formatted);

  //commission today
  const result3 = await Transaction.aggregate([
    {
      $match: {
        initiatedBy: new mongoose.Types.ObjectId(id), // filter by initiatedBy
        type: 'commission', // filter by type
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  const comission = result3.filter((d) => d._id.date === formatted);

  const generateRandomNumber = () => {
    const min = env.MIN_NUMBER;
    const max = env.MAX_NUMBER;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
  };

  const cashInChange = generateRandomNumber();
  const cashOutChange = generateRandomNumber();
  const comissionChange = generateRandomNumber();
  const totalChange = generateRandomNumber();
  return {
    cashIn: cashIn[0],
    cashOut: cashOut[0],
    commission: comission[0],
    cashInChange,
    cashOutChange,
    comissionChange,
    totalChange,
  };
};
const s = ['send_money', 'receive_money'];
const lastMonthTransactions = async (id: string) => {
  const last = await Transaction.aggregate([
    {
      $match: {
        initiatedBy: new mongoose.Types.ObjectId(id),
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  return {
    lastMonth: last[0],
  };
};
export const transactionServices = {
  getMyTransactoins,
  getCommissionTransactoins,
  todayTotalTransactions,
  lastMonthTransactions,
};
