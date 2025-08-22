import { QueryBuilder } from '../../utils/query.builder';
import { TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';

//all transaction
const getAllTransaction = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find()
      .populate('to', 'name phone role status')
      .populate('from', 'name phone role status'),
    query
  );
  const allTransaction = await queryBuilder
    .filter()
    .search()
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await Transaction.countDocuments();
  const metaData = await queryBuilder.getMeta(countDocuments);

  return {
    allTransaction,
    metaData,
  };
};

//view user own transactions
const getMyTransactoins = async (id: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find({ initiatedBy: id }),
    query
  );
  const myTnx = await queryBuilder
    .filter()
    .search()
    .pagination()
    .sort()
    .select()
    .build();
  const countDocuments = await Transaction.countDocuments({ initiatedBy: id });
  const metaData = await queryBuilder.getMeta(countDocuments);
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
    .search()
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
export const transactionServices = {
  getAllTransaction,
  getMyTransactoins,
  getCommissionTransactoins,
};
