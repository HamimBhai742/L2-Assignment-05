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
    process.env.JWT_SECRET as string,
    process.env.JWT_EXPIRATION as string
  );
  return token;
};
