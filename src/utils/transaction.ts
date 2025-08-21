import { ClientSession } from 'mongoose';
import {
  TransactionStatus,
  TransactionType,
} from '../models/transaction/transaction.interface';
import { Transaction } from '../models/transaction/transaction.model';

export const createTransaction = async (
  type: string,
  trnxId: string,
  amount: number,
  sender: string,
  reciver: string,
  commission: number,
  fee: number,
  initiatedBy: string,
  session: ClientSession
) => {
  const ss = await await Transaction.create(
    [
      {
        type,
        transactionId: trnxId,
        from: sender,
        to: reciver,
        amount: amount,
        commission,
        fee,
        status: TransactionStatus.COMPLETED,
        initiatedBy,
      },
    ],
    { session }
  );
  return ss;
};

export const createTransactionType = async (
  type: string,
  trnxId: string,
  amount: number,
  initiatedBy: string,
  session: ClientSession
) => {
  const ss = await await Transaction.create(
    [
      {
        type,
        transactionId: trnxId,
        amount,
        status: TransactionStatus.COMPLETED,
        initiatedBy,
      },
    ],
    { session }
  );
  return ss;
};

