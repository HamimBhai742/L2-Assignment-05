import { Router } from 'express';
import { Role } from '../user/user.interface';
import { checkAuth } from '../../middlewares/jwt.verify';
import { transactionController } from './transaction.controller';
const router = Router();

router.get(
  '/me',
  checkAuth(...Object.values(Role)),
  transactionController.getMyTransactoins
);

router.get(
  '/today-total-transactions',
  checkAuth(Role.AGENT),
  transactionController.todayTotalTransactions
);

router.get(
  '/last-month-transactions',
  checkAuth(Role.USER),
  transactionController.lastMonthTransactions
);

router.get(
  '/commission',
  checkAuth(Role.AGENT),
  transactionController.getCommissionTransactoins
);

export const transactionRoutes = router;
