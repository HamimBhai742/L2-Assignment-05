import { transactionSearchFields } from '../../utils/constain';
import { QueryBuilder } from '../../utils/query.builder';
import { TransactionType } from './transaction.interface';
import { Transaction } from './transaction.model';

//view user own transactions
const getMyTransactoins = async (id: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find({ initiatedBy: id })
      .populate('from', 'name phone role status')
      .populate('to', 'name phone role status'),
    query
  );
  const myTnx = await queryBuilder
    .filter()
    .search(transactionSearchFields)
    .pagination()
    .sort()
    .select()
    .build();

  const totalItems = await new QueryBuilder(
    Transaction.find({ initiatedBy: id }),
    query
  )
    .filter()
    .search(transactionSearchFields)
    .count();
  console.log(totalItems);

  // const countDocuments = await Transaction.countDocuments({ initiatedBy: id });
  const metaData = await queryBuilder.getMeta(totalItems);
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
    .search(transactionSearchFields)
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
  getMyTransactoins,
  getCommissionTransactoins,
};
