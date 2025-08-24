import httpStatusCode from 'http-status-codes';
import { AppError } from '../../error/coustom.error.handel';
import { Wallet } from '../wallet/wallet.model';
import { AgentStatus, IUser, Role} from './user.interface';
import { User } from './user.model';
import bcryptjs from 'bcrypt';
import { WalletStatus } from '../wallet/wallet.interface';

//create new user
const createUser = async (payload: Partial<IUser>) => {
  const { password, phone, role, ...reset } = payload;
  const isExsistUser = await User.findOne({ phone });
  if (isExsistUser) {
    throw new AppError(
      `This ${role} is already exsist`,
      httpStatusCode.FORBIDDEN
    );
  }
  const hashPassword = await bcryptjs.hash(password as string, 10);

  const user = await User.create({
    phone,
    password: hashPassword,
    role,
    ...reset,
  });

  const isExistWallet = await Wallet.findOne({ user: user._id });
  if (isExistWallet) {
    throw new AppError(
      'Wallet already exists for this user',
      httpStatusCode.BAD_REQUEST
    );
  }
  await Wallet.create({
    user: user._id,
  });

  return {
    user,
    message: `${role ? role : 'User'} created successfully`,
  };
};

export const userServices = {
  createUser,
  
};
