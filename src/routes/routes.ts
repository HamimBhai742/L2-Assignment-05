import { Router } from 'express';
import { userRoutes } from '../models/user/user.routes';
import { authRoutes } from '../models/auth/auth.routes';
import { walletRoutes } from '../models/wallet/wallet.routes';
import { transactionRoutes } from '../models/transaction/transaction.routes';
import { adminRoutes } from '../models/admin/admin.routes';

export const router = Router();

const routes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/wallet',
    route: walletRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/transactions',
    route: transactionRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
