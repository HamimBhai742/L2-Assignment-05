import { Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  rating: number;
  serviceType: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
