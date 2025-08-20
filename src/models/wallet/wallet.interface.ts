import { Types } from 'mongoose';

export enum WalletStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}
export interface IWallet {
  user: Types.ObjectId;
  balance?: number;
  status?: WalletStatus;
}
