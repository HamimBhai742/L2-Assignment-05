import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export enum WalletStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}
export interface IWallet {
  user: Types.ObjectId ;
  balance?: number;
  status?: WalletStatus;
}
