import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/login', authController.loggedInUser);

export const authRoutes = router;
