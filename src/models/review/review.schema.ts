import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    serviceType: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Review = model('Review', reviewSchema);
