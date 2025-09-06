import httpStatusCode from 'http-status-codes';
import { AppError } from '../../error/coustom.error.handel';
import { Wallet } from '../wallet/wallet.model';
import {
  AgentStatus,
  IUpdatePIN,
  IUpdateUser,
  IUser,
  Role,
} from './user.interface';
import { User } from './user.model';
import { env } from '../../config/env';
import bcryptjs from 'bcrypt';
//create new user
const createUser = async (payload: Partial<IUser>) => {
  console.log(payload);
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

const getSingleUser = async (phone: string) => {
  const user = await User.findOne({ phone, role: Role.USER });
  if (!user) {
    throw new AppError('User not found', httpStatusCode.NOT_FOUND);
  }
  const wallet = await Wallet.findOne({ user: user._id });
  return {
    user,
    wallet,
  };
};

const getMeUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatusCode.NOT_FOUND);
  }
  return {
    user,
    message: 'User find successfully',
  };
};

const updateUser = async (id: string, payload: Partial<IUpdateUser>) => {
  const isExsistUpUser = await User.findOne({
    phone: payload?.phone,
    _id: { $ne: id },
  });

  if (isExsistUpUser) {
    throw new AppError(
      'This phone number is already exsist',
      httpStatusCode.FORBIDDEN
    );
  }

  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!user) {
    throw new AppError('User not found', httpStatusCode.NOT_FOUND);
  }
  return {
    user,
    message: 'User update successfully',
  };
};

const changePIN = async (id: string, payload: Partial<IUpdatePIN>) => {
  console.log(payload);
  const { currentPIN, newPIN } = payload;
  console.log(currentPIN, newPIN, env.BCRYPT_PASS_NUMBER);
  const fiUser = await User.findById(id);
  const match = await bcryptjs.compare(currentPIN as string, fiUser!.password);
  if (!match) {
    throw new AppError('Current PIN does not match', httpStatusCode.FORBIDDEN);
  }
  const hashPassword = await bcryptjs.hash(
    newPIN as string,
    env.BCRYPT_PASS_NUMBER
  );
  const user = await User.findByIdAndUpdate(
    id,
    { password: hashPassword },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new AppError('User not found', httpStatusCode.NOT_FOUND);
  }
  return {
    user,
    message: 'PIN change successfully',
  };
};

const matchUserPin = async (phone: string, pin: string) => {
  console.log(pin)
  const user = await User.findOne({ phone });
  const match = await bcryptjs.compare(pin, user?.password as string);
  if (!match) {
    throw new AppError('User pin does not match', httpStatusCode.UNAUTHORIZED);
  }
  return user;
};

export const userServices = {
  createUser,
  getSingleUser,
  getMeUser,
  updateUser,
  changePIN,
  matchUserPin,
};
