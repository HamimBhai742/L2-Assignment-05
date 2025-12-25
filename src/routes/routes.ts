import { Router } from 'express';
import { userRoutes } from '../models/user/user.routes';
import { authRoutes } from '../models/auth/auth.routes';
import { walletRoutes } from '../models/wallet/wallet.routes';
import { transactionRoutes } from '../models/transaction/transaction.routes';
import { adminRoutes } from '../models/admin/admin.routes';
import { blogRoutes } from '../models/blogs/blogs.route';
import { statsRoutes } from '../models/stats/stats.routes';
import { reviewRoutes } from '../models/review/review.routes';

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
  {
    path: '/blog',
    route: blogRoutes,
  },
  {
    path: '/stats',
    route: statsRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
