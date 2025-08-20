import { model, Schema } from 'mongoose';
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    transactionId: { type: String, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    to: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema
);
