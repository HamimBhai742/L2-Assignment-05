import { Transaction } from './transaction.model';

//all transaction
const getAllTransaction = async () => {
  const allTransaction = await Transaction.find();
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
export const transactionServices = {
  getAllTransaction,
  getMyTransactoins,
};
