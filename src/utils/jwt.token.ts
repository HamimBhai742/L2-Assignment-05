import { env } from '../config/env';
import { IUser } from '../models/user/user.interface';
import { createJwtToken } from './token.create.verfy.fn';

export const createUserToken = (user: Partial<IUser>) => {
  const jsonPayload = {
    userId: user._id,
    phone: user.phone,
    role: user.role,
  };
  const token = createJwtToken(
    jsonPayload,
    env.JWT_SECRET ,
    env.JWT_EXPIRATION
  );
  return {
    accessToken: token,
  };
};
