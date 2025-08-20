import { Types } from 'mongoose';

export enum TransactionType {
  ADD = 'ADD',
  WITHDRAW = 'WITHDRAW',
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  COMMISSION = 'COMMISSION',
}
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED',
}
export interface ITransaction {
  type: TransactionType;
  transactionId: string;
  form: Types.ObjectId;
  to: Types.ObjectId;
  amount: number;
  status: TransactionStatus;
  fee: number;
  initiatedBy: Types.ObjectId;
}
