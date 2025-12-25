import z from 'zod';

export const createReviewZodSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  serviceType: z.string(),
});
