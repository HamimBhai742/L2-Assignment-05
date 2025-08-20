import { Router } from 'express';
import { userController } from './user.controller';
import { validationRequest } from '../../middlewares/zod.validation';
import { createUserZodSchema } from './user.zodSchema';
const router = Router();

router.post(
  '/register',
  validationRequest(createUserZodSchema),
  userController.createUser
);

export const userRoutes = router;
