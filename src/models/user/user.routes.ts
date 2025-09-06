import { Router } from 'express';
import { userController } from './user.controller';
import { validationRequest } from '../../middlewares/zod.validation';
import {
  changePinZodSchema,
  createUserZodSchema,
  matchPinZodeSchema,
  updateUserZodSchema,
} from './user.zodSchema';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from './user.interface';
const router = Router();

router.post(
  '/register',
  validationRequest(createUserZodSchema),
  userController.createUser
);

router.put(
  '/update',
  validationRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  userController.updateUser
);

router.get('/me', checkAuth(...Object.values(Role)), userController.getMeUser);

router.get(
  '/:phone',
  checkAuth(...Object.values(Role)),
  userController.getSingleUser
);

router.post(
  '/match-pin/:phone',
  validationRequest(matchPinZodeSchema),
  checkAuth(Role.AGENT),
  userController.matchUserPin
);

router.put(
  '/change-pin',
  validationRequest(changePinZodSchema),
  checkAuth(...Object.values(Role)),
  userController.changePIN
);

export const userRoutes = router;
