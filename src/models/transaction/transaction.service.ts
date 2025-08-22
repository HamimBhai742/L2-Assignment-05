import { TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';

//all transaction
const getAllTransaction = async () => {
  const allTransaction = await Transaction.find().populate('to',"name phone role status").populate('from','name phone role status');
  return allTransaction;
};

//view user own transactions
const getMyTransactoins = async (id: string) => {
  const myTnx = await Transaction.find({ initiatedBy: id });
  const total = await Transaction.countDocuments({ initiatedBy: id });
  return {
    myTnx,
    total,
  };
};

//view commission transaction
const getCommissionTransactoins = async (id: string) => {
  const commissionTnx = await Transaction.find({
    initiatedBy: id,
    type: TransactionType.COMMISSION,
  });
  const total = await Transaction.countDocuments({ initiatedBy: id });
  return {
    commissionTnx,
    total,
  };
};
export const transactionServices = {
  getAllTransaction,
  getMyTransactoins,
  getCommissionTransactoins,
};
