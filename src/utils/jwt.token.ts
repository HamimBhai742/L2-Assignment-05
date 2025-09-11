import { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { IUser } from '../models/user/user.interface';
import { User } from '../models/user/user.model';
import { createJwtToken, verifyJwtToken } from './token.create.verfy.fn';

export const createUserToken = (user: Partial<IUser>) => {
  const jsonPayload = {
    userId: user._id,
    phone: user.phone,
    role: user.role,
  };
  const token = createJwtToken(jsonPayload, env.JWT_SECRET, env.JWT_EXPIRATION);
  const refreshToken = createJwtToken(
    jsonPayload,
    env.JWT_REFRESH_TOKEN,
    env.JWT_REFRESH_EXPIRATION
  );
  return {
    accessToken: token,
    refreshToken,
  };
};

export const createNewAccessTokeUsingRefreshToken = async (
  refreshToken: string
) => {
  const verifyUser = verifyJwtToken(
    refreshToken,
    env.JWT_REFRESH_TOKEN
  ) as JwtPayload;

  if (!verifyUser) {
    throw new Error('Invalid refresh token');
  }

  const isExsit = await User.findOne({ phone: verifyUser.phone });
  if (!isExsit) {
    throw new Error('User not found');
  }

  if (isExsit.isActive === false) {
    throw new Error('User is blocked');
  }

  const token = createUserToken(isExsit);
  return token.accessToken;
};
