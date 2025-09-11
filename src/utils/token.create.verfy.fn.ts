import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createJwtToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
  return token;
};

export const verifyJwtToken = (token: string, secret: string) => {
  const veryfiedToken = jwt.verify(token, secret);
  return veryfiedToken;
};


