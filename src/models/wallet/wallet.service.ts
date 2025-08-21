import { WalletStatus } from '../wallet/wallet.interface';
import { Transaction } from '../transaction/transaction.model';
import httpStatusCode from 'http-status-codes';
import {
  TransactionStatus,
  TransactionType,
} from '../transaction/transaction.interface';
import { Wallet } from './wallet.model';
import { AppError } from '../../error/coustom.error.handel';
import { env } from '../../config/env';
import { User } from '../user/user.model';
import { Role, UserStatus } from '../user/user.interface';
interface Payload {
  to: string;
  amount: number;
}

//add money to wallet
const addMoney = async (userId: string, amount: number) => {
  console.log(userId, amount);
  const session = await Wallet.startSession();
  session.startTransaction();
  const trnxId = [...Array(10)]
    .map(() => `${env.TRNX_SECRET}`[Math.floor(Math.random() * 32)])
    .join('');

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
      transactionId: trnxId,
      to: userId,
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
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//withdraw money to user wallet
const withdrawMoney = async (userId: string, amount: number) => {
  console.log(userId, amount);
  const session = await Wallet.startSession();
  session.startTransaction();

  const trnxId = [...Array(10)]
    .map(() => `${env.TRNX_SECRET}`[Math.floor(Math.random() * 32)])
    .join('');

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

    const updateAmount = Number(wallet.balance) - Number(amount);

    if (updateAmount < 0) {
      throw new AppError('Insufficient balance', httpStatusCode.BAD_REQUEST);
    }

    await Wallet.findOneAndUpdate(
      { user: userId },
      { balance: updateAmount },
      { new: true, runValidators: true, session }
    );

    const transaction = await Transaction.create({
      type: TransactionType.WITHDRAW,
      transactionId: trnxId,
      from: userId,
      amount: amount,
      status: TransactionStatus.COMPLETED,
      initiatedBy: userId,
    });

    await session.commitTransaction();
    session.endSession();
    return {
      message: 'Money withdraw successfully',
      wallet: {
        user: wallet.user,
        balance: updateAmount,
        status: wallet.status,
      },
      transaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//send money to another user wallet
const sendMoney = async (userId: string, payload: Payload) => {
  const { to, amount } = payload;
  if (!to || !amount) {
    throw new AppError(
      'Receiver number and amount are required',
      httpStatusCode.BAD_REQUEST
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  const trnxId = [...Array(10)]
    .map(() => `${env.TRNX_SECRET}`[Math.floor(Math.random() * 32)])
    .join('');

  try {
    const receiverUser = await User.findOne({
      phone: to,
    });

    if (!receiverUser) {
      throw new AppError('Receiver not found.', httpStatusCode.NOT_FOUND);
    }

    if (receiverUser._id.toString() === userId) {
      throw new AppError(
        'You cannot send money to yourself',
        httpStatusCode.BAD_REQUEST
      );
    }

    if (receiverUser.status === UserStatus.BLOCKED) {
      throw new AppError('Receiver is blocked', httpStatusCode.FORBIDDEN);
    }

    if (receiverUser.role !== Role.USER) {
      throw new AppError('Receiver is not a user', httpStatusCode.FORBIDDEN);
    }

    const senderWallet = await Wallet.findOne({ user: userId });
    const receiverWallet = await Wallet.findOne({ user: receiverUser._id });

    if (!senderWallet) {
      throw new AppError('Wallet not found', httpStatusCode.NOT_FOUND);
    }

    if (!receiverWallet) {
      throw new AppError('Receiver wallet not found', httpStatusCode.NOT_FOUND);
    }

    if (senderWallet.status === WalletStatus.BLOCKED) {
      throw new AppError('Wallet is blocked', httpStatusCode.FORBIDDEN);
    }

    if (receiverWallet.status === WalletStatus.BLOCKED) {
      throw new AppError(
        'Receiver wallet is blocked',
        httpStatusCode.FORBIDDEN
      );
    }

    if (amount < 10) {
      throw new AppError(
        'Minimum amount to send is 10',
        httpStatusCode.BAD_REQUEST
      );
    }
    let fee = 0;
    if (amount > 100) {
      fee = 5;
    }
    const updateSenderAmount =
      Number(senderWallet.balance) - Number(amount) - fee;
    const updateReceiverAmount =
      Number(receiverWallet.balance) + Number(amount);

    if (updateSenderAmount < 0) {
      throw new AppError('Insufficient balance', httpStatusCode.BAD_REQUEST);
    }

    await Wallet.findOneAndUpdate(
      { user: userId },
      { balance: updateSenderAmount },
      { new: true, runValidators: true, session }
    );

    await Wallet.findOneAndUpdate(
      { user: receiverUser._id },
      { balance: updateReceiverAmount },
      { new: true, runValidators: true, session }
    );

    const senderTransaction = await Transaction.create({
      type: TransactionType.SEND_MONEY,
      transactionId: trnxId,
      from: userId,
      to: receiverUser._id,
      amount: amount,
      fee,
      status: TransactionStatus.COMPLETED,
      initiatedBy: userId,
    });

    const receiverTransaction = await Transaction.create({
      type: TransactionType.RECEIVE_MONEY,
      transactionId: trnxId,
      from: userId,
      to: receiverUser._id,
      amount: amount,
      status: TransactionStatus.COMPLETED,
      initiatedBy: receiverUser._id,
    });

    await session.commitTransaction();
    session.endSession();
    return {
      message: 'Send money successfully',
      senderTransaction,
      receiverTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//cash in agent add to user wallet
const cashIn = async (agentId: string, payload: Payload) => {
  const { to, amount } = payload;
  if (!to || !amount) {
    throw new AppError(
      'Cash-in number and amount are required',
      httpStatusCode.BAD_REQUEST
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  const trnxId = [...Array(10)]
    .map(() => `${env.TRNX_SECRET}`[Math.floor(Math.random() * 32)])
    .join('');

  try {
    const recipientUser = await User.findOne({
      phone: to,
    });

    if (!recipientUser) {
      throw new AppError('Recipient user not found.', httpStatusCode.NOT_FOUND);
    }

    if (recipientUser._id.toString() === agentId) {
      throw new AppError(
        'You cannot cash-in to yourself',
        httpStatusCode.BAD_REQUEST
      );
    }

    if (recipientUser.status === UserStatus.BLOCKED) {
      throw new AppError('Recipient is blocked', httpStatusCode.FORBIDDEN);
    }

    if (recipientUser.role !== Role.USER) {
      throw new AppError('Recipient is not a user', httpStatusCode.FORBIDDEN);
    }

    const senderWallet = await Wallet.findOne({ user: agentId });
    const recipientWallet = await Wallet.findOne({ user: recipientUser._id });

    if (!senderWallet) {
      throw new AppError('Wallet not found', httpStatusCode.NOT_FOUND);
    }

    if (!recipientWallet) {
      throw new AppError(
        'Recipient wallet not found',
        httpStatusCode.NOT_FOUND
      );
    }

    if (senderWallet.status === WalletStatus.BLOCKED) {
      throw new AppError('Sender wallet is blocked', httpStatusCode.FORBIDDEN);
    }

    if (recipientWallet.status === WalletStatus.BLOCKED) {
      throw new AppError(
        'Recipient wallet is blocked',
        httpStatusCode.FORBIDDEN
      );
    }

    if (amount < 50) {
      throw new AppError(
        'Minimum amount to send is 50',
        httpStatusCode.BAD_REQUEST
      );
    }
    const commission = Number(amount / 1000) * 4.5;
    const updateSenderAmount =
      Number((senderWallet.balance as number) + commission) - Number(amount);

    const updateRecipientAmount =
      Number(recipientWallet.balance) + Number(amount);

    if (updateSenderAmount < 0) {
      throw new AppError('Insufficient balance', httpStatusCode.BAD_REQUEST);
    }

    await Wallet.findOneAndUpdate(
      { user: agentId },
      { balance: updateSenderAmount },
      { new: true, runValidators: true, session }
    );

    await Wallet.findOneAndUpdate(
      { user: recipientUser._id },
      { balance: updateRecipientAmount },
      { new: true, runValidators: true, session }
    );

    const senderTransaction = await Transaction.create({
      type: TransactionType.CASH_IN,
      transactionId: trnxId,
      from: agentId,
      to: recipientUser._id,
      amount: amount,
      commission,
      status: TransactionStatus.COMPLETED,
      initiatedBy: agentId,
    });
    await session.commitTransaction();
    session.endSession();
    return {
      message: 'Cash-in successfully',
      transaction: senderTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//withdraw user wallet to agent
const cashOut = async (agentId: string, payload: Payload) => {
  const { to, amount } = payload;
  if (!to || !amount) {
    throw new AppError(
      'Cash-out number and amount are required',
      httpStatusCode.BAD_REQUEST
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  const trnxId = [...Array(10)]
    .map(() => `${env.TRNX_SECRET}`[Math.floor(Math.random() * 32)])
    .join('');

  try {
    const recipientUser = await User.findOne({
      phone: to,
    });

    if (!recipientUser) {
      throw new AppError('Recipient user not found.', httpStatusCode.NOT_FOUND);
    }

    if (recipientUser._id.toString() === agentId) {
      throw new AppError(
        'You cannot cash-in to yourself',
        httpStatusCode.BAD_REQUEST
      );
    }

    if (recipientUser.status === UserStatus.BLOCKED) {
      throw new AppError('Recipient is blocked', httpStatusCode.FORBIDDEN);
    }

    if (recipientUser.role !== Role.USER) {
      throw new AppError('Recipient is not a user', httpStatusCode.FORBIDDEN);
    }

    const receiverWallet = await Wallet.findOne({ user: agentId });
    const recipientWallet = await Wallet.findOne({ user: recipientUser._id });

    if (!receiverWallet) {
      throw new AppError('Wallet not found', httpStatusCode.NOT_FOUND);
    }

    if (!recipientWallet) {
      throw new AppError(
        'Recipient wallet not found',
        httpStatusCode.NOT_FOUND
      );
    }

    if (receiverWallet.status === WalletStatus.BLOCKED) {
      throw new AppError('Sender wallet is blocked', httpStatusCode.FORBIDDEN);
    }

    if (recipientWallet.status === WalletStatus.BLOCKED) {
      throw new AppError(
        'Recipient wallet is blocked',
        httpStatusCode.FORBIDDEN
      );
    }

    if (amount < 50) {
      throw new AppError(
        'Minimum amount to send is 50',
        httpStatusCode.BAD_REQUEST
      );
    }
    const commission = Number(amount / 1000) * 14.0;
    const updateReceiverAmount =
      Number((receiverWallet.balance as number) + commission) + Number(amount);

    const fee = Number(amount / 1000) * 18.5;
    const updateRecipientAmount =
      Number((recipientWallet.balance as number) - fee) - Number(amount);

    if (updateRecipientAmount < 0) {
      throw new AppError('Insufficient balance', httpStatusCode.BAD_REQUEST);
    }

    await Wallet.findOneAndUpdate(
      { user: agentId },
      { balance: updateReceiverAmount },
      { new: true, runValidators: true, session }
    );

    await Wallet.findOneAndUpdate(
      { user: recipientUser._id },
      { balance: updateRecipientAmount },
      { new: true, runValidators: true, session }
    );

    const senderTransaction = await Transaction.create({
      type: TransactionType.CASH_OUT,
      transactionId: trnxId,
      from: agentId,
      to: recipientUser._id,
      amount: amount,
      commission,
      status: TransactionStatus.COMPLETED,
      initiatedBy: agentId,
    });

    const recipientTransaction = await Transaction.create({
      type: TransactionType.WITHDRAW,
      transactionId: trnxId,
      from: recipientUser._id,
      to: agentId,
      amount: amount,
      commission,
      fee,
      status: TransactionStatus.COMPLETED,
      initiatedBy: recipientUser._id,
    });

    await Transaction.create({
      type: TransactionType.COMMISSION,
      transactionId: trnxId,
      amount: commission,
      status: TransactionStatus.COMPLETED,
      initiatedBy: agentId,
    });

    await Transaction.create({
      type: TransactionType.FEE,
      transactionId: trnxId,
      amount: fee,
      status: TransactionStatus.COMPLETED,
      initiatedBy: recipientUser,
    });

    await session.commitTransaction();
    session.endSession();
    return {
      message: 'Cash-in successfully',
      transaction: senderTransaction,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const walletServices = {
  addMoney,
  withdrawMoney,
  sendMoney,
  cashIn,
};
