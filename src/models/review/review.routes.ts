import { Router } from 'express';
import { reviewController } from './review.controller';
import { checkAuth } from '../../middlewares/jwt.verify';
import { Role } from '../user/user.interface';
import { validationRequest } from '../../middlewares/zod.validation';
import { createReviewZodSchema } from './review.zod.schema';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.USER),
  validationRequest(createReviewZodSchema),
  reviewController.createReview
);

router.get('/all', reviewController.getAllReviews);

router.get('/me', checkAuth(Role.USER), reviewController.getMyReviews);

export const reviewRoutes = router;
