import { Router } from 'express';
import { walletController } from './wallet.controller';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from '../user/user.interface';
const router = Router();

router.post('/add-money', checkAuth(Role.USER), walletController.addMoney);

router.post(
  '/withdraw-money',
  checkAuth(Role.USER),
  walletController.withdrawMoney
);

router.post('/send-money', checkAuth(Role.USER), walletController.sendMoney);

router.post('/cash-in', checkAuth(Role.AGENT), walletController.cashIn);

export const walletRoutes = router;
