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

router.get('/overview', checkAuth(Role.ADMIN), adminController.adminOverView);
router.get(
  '/transaction-analytics',
  checkAuth(Role.ADMIN),
  adminController.transactionAnalytics
);
router.patch(
  '/agents-approved/:id',
  checkAuth(Role.ADMIN),
  adminController.approvedAgent
);

router.patch(
  '/agents-suspend/:id',
  checkAuth(Role.ADMIN),
  adminController.suspendAgent
);
router.patch(
  '/agents-reactive/:id',
  checkAuth(Role.ADMIN),
  adminController.reactiveAgent
);

router.patch(
  '/user-status/:id',
  checkAuth(Role.ADMIN),
  adminController.manageUser
);

router.delete('/user/:id', checkAuth(Role.ADMIN), adminController.deleteUser);

router.patch(
  '/wallets/active/:id',
  checkAuth(Role.ADMIN),
  adminController.activeWallet
);

router.patch(
  '/wallets/blocked/:id',
  checkAuth(Role.ADMIN),
  adminController.blockedWallet
);

export const adminRoutes = router;
