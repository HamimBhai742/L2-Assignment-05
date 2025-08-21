import { Types } from 'mongoose';

export enum TransactionType {
  ADD_MONEY = 'add_money',
  WITHDRAW = 'withdraw',
  SEND_MONEY = 'send_money',
  RECEIVE_MONEY = 'receive_money',
  CASH_IN = 'cash_in',
  CASH_OUT = 'cash_out',
}
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REVERSED = 'reversed',
}
export interface ITransaction {
  type: TransactionType;
  transactionId: string;
  from?: Types.ObjectId;
  to?: Types.ObjectId;
  amount: number;
  status: TransactionStatus;
  fee?: number;
  commission?: number;
  initiatedBy: Types.ObjectId;
}
