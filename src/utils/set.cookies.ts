import { Response } from 'express';

interface IToken {
  accessToken?: string;
  refreshToken?: string;
}

export const setCookies = (res: Response, token: IToken) => {
  if (token?.accessToken) {
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:'none'
    });
  }

  if (token?.refreshToken) {
    console.log(token)
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite:'none'
    });
  }
};
