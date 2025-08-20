import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number,  default: 50 },
  status: { type: String, enum: WalletStatus, default: WalletStatus.ACTIVE },
},{
  timestamps: true,
  versionKey: false,
});

export const Wallet = model<IWallet>('Wallet', walletSchema);
