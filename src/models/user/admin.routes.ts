import { Router } from 'express';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from './user.interface';
import { userController } from './user.controller';

const router = Router();

router.patch(
  '/agent-status/:id',
  checkAuth(Role.ADMIN),
  userController.updateAgentStatus
);

export const adminRoutes = router;
