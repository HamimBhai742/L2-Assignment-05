import { NextFunction, Request, Response } from 'express';
import { AppError } from '../error/coustom.error.handel';
import httpStatusCode from 'http-status-codes';
import { verifyJwtToken } from '../utils/token.create.verfy.fn';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user/user.model';
import { AgentStatus, UserStatus } from '../models/user/user.interface';
import { Wallet } from '../models/wallet/wallet.model';
import { WalletStatus } from '../models/wallet/wallet.interface';
export const checkAuth =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(
          'Access denied. No token provided.',
          httpStatusCode.BAD_REQUEST
        );
      }
      const decoded = verifyJwtToken(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const isExist = await User.findOne({ phone: decoded?.phone });
      if (!isExist) {
        throw new AppError('User not found', httpStatusCode.NOT_FOUND);
      }

      if (isExist?.status === UserStatus.BLOCKED) {
        throw new AppError(
          `User is ${isExist.status}`,
          httpStatusCode.FORBIDDEN
        );
      } else if (
        isExist?.agentStatus === AgentStatus.PENDING ||
        isExist?.agentStatus === AgentStatus.SUSPEND
      ) {
        throw new AppError(
          `Agent is ${isExist?.agentStatus}`,
          httpStatusCode.FORBIDDEN
        );
      }
      const isExistWallet = await Wallet.findOne({ user: isExist._id });

      if (!isExistWallet) {
        throw new AppError('Wallet not found', httpStatusCode.NOT_FOUND);
      }

      if (isExistWallet.status === WalletStatus.BLOCKED) {
        throw new AppError('Wallet is blocked', httpStatusCode.FORBIDDEN);
      }

      if (!authRole.includes(decoded.role)) {
        throw new AppError(
          'You do not have permission to access this route',
          httpStatusCode.FORBIDDEN
        );
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
