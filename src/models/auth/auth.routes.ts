import { Router } from 'express';
import { authController } from './auth.controller';
import { validationRequest } from '../../middlewares/zod.validation';
import { authZodSchema } from './auth.zod.schema';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/login',
  validationRequest(authZodSchema),
  authController.loggedInUser
);

router.get(
  '/check',
  checkAuth(...Object.values(Role)),
  authController.checkLoginUser
);

router.post(
  '/match-pin/:pin',
  checkAuth(...Object.values(Role)),
  authController.matchPIN
);

router.post('/logout', authController.logout);

export const authRoutes = router;
