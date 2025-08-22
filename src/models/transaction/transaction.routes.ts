import { Router } from 'express';
import { Role } from '../user/user.interface';
import { checkAuth } from '../../middlewares/jwt.verify';
import { transactionController } from './transaction.controller';
const router = Router();

router.get(
  '/',
  checkAuth(Role.ADMIN),
  transactionController.getAllTransactin
);

router.get(
  '/me',
  checkAuth(Role.USER),
  transactionController.getMyTransactoins
);

router.get(
  '/agent-commission/me',
  checkAuth(Role.AGENT),
  transactionController.getCommissionTransactoins
);

export const transactionRoutes=router