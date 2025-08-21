import { Router } from 'express';
import { walletController } from './wallet.controller';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from '../user/user.interface';
const router = Router();

router.post('/add-money', checkAuth(Role.USER), walletController.addMoney);

router.post('/withdraw-money', checkAuth(Role.USER), walletController.withdrawMoney);

export const walletRoutes = router;
