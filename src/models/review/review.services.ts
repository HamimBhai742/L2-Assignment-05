import { IReview } from './review.interface';
import { Review } from './review.schema';

const createReview = async (userId: string, payload: IReview) => {
  const data = await Review.create({ ...payload, user: userId });
  return data;
};

const getAllReviews = async () => {
  const data = await Review.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        rating: 1,
        comment: 1,
        user: {
          name: 1,
          role: 1,
          phone: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  return data;
};

const getMyReviews = async (userId: string) => {
  const data = await Review.find({ user: userId });
  return data;
};

export const reviewServices = {
  createReview,
  getAllReviews,
  getMyReviews,
};
