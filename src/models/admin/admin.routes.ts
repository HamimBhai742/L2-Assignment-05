import { Router } from 'express';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from '../user/user.interface';
import { adminController } from './admin.controller';

const router = Router();

router.get('/users', checkAuth(Role.ADMIN), adminController.getAllUsers);

router.get('/agents', checkAuth(Role.ADMIN), adminController.getAllAgents);

router.get('/wallets', checkAuth(Role.ADMIN), adminController.getAllWallets);

router.get(
  '/transactions',
  checkAuth(Role.ADMIN),
  adminController.getAllTransaction
);

router.patch(
  '/agent/approved/:id',
  checkAuth(Role.ADMIN),
  adminController.approvedAgent
);

router.patch(
  '/agent/suspend/:id',
  checkAuth(Role.ADMIN),
  adminController.suspendAgent
);

router.patch(
  '/wallet/active/:id',
  checkAuth(Role.ADMIN),
  adminController.activeWallet
);

router.patch(
  '/wallet/blocked/:id',
  checkAuth(Role.ADMIN),
  adminController.blockedWallet
);

export const adminRoutes = router;
