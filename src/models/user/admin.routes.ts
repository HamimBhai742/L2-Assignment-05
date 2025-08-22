import { Router } from 'express';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from './user.interface';
import { userController } from './user.controller';

const router = Router();

router.get('/all-users', checkAuth(Role.ADMIN), userController.getAllUsers);

router.get('/all-agents', checkAuth(Role.ADMIN), userController.getAllAgents);

router.get('/all-wallets', checkAuth(Role.ADMIN), userController.getAllWallets);

router.patch(
  '/wallet-status/:id',
  checkAuth(Role.ADMIN),
  userController.updateWalletStatus
);

router.patch(
  '/agent-status/:id',
  checkAuth(Role.ADMIN),
  userController.updateAgentStatus
);

router.patch(
  '/user-status/:id',
  checkAuth(Role.ADMIN),
  userController.updateUserStatus
);

export const adminRoutes = router;
