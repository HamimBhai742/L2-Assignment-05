import { WalletStatus } from '../wallet/wallet.interface';
import { Transaction } from '../transaction/transaction.model';
import httpStatusCode from 'http-status-codes';

import {
  TransactionStatus,
  TransactionType,
} from '../transaction/transaction.interface';
import { Wallet } from './wallet.model';
import { AppError } from '../../error/coustom.error.handel';
const generateTranxId = () => {
  return `txn_${Date.now()}`;
};

//add money to wallet
const addMoney = async (userId: string, amount: number) => {
  console.log(userId, amount);
  const session = await Wallet.startSession();
  session.startTransaction();
  const transactionId = generateTranxId();
  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new AppError('Wallet not found', httpStatusCode.NOT_FOUND);
    }
    if (wallet.status === WalletStatus.BLOCKED) {
      throw new AppError('Wallet is blocked', httpStatusCode.FORBIDDEN);
    }
    if (amount <= 0) {
      throw new AppError(
        'Amount must be greater than zero',
        httpStatusCode.BAD_REQUEST
      );
    }
    const updateAmount = Number(wallet.balance) + Number(amount);
    await Wallet.findOneAndUpdate(
      { user: userId },
      { balance: updateAmount },
      { new: true, runValidators: true, session }
    );

    const transaction = await Transaction.create({
      type: TransactionType.ADD_MONEY,
      transactionId,
      to: wallet._id,
      amount: amount,
      status: TransactionStatus.COMPLETED,
      initiatedBy: userId,
    });

    await session.commitTransaction();
    return {
      message: 'Money added successfully',
      wallet: {
        user: wallet.user,
        balance: updateAmount,
        status: wallet.status,
      },
      transaction,
    };
  } catch (error) {
    await Transaction.findOneAndUpdate(
      { transactionId },
      {
        status: TransactionStatus.REVERSED,
      }
    );
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const walletServices = {
  addMoney,
};
