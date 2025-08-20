import { model, Schema } from 'mongoose';
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: TransactionType, required: true },
    transactionId: { type: String, required: true },
    form: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: TransactionStatus, required: true },
    fee: { type: Number, required: true },
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
