import { Response } from 'express';

interface IToken {
  accessToken?: string;
}

export const setCookies = (res: Response, token: IToken) => {
  if (token.accessToken) {
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
