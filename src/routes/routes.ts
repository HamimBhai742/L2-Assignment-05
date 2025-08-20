import { Router } from 'express';
import { userRoutes } from '../models/user/user.routes';
import { authRoutes } from '../models/auth/auth.routes';

export const router = Router();

const routes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  }
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
