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

// //get all users by admin
// const getAllAgents = async () => {
//   const allAgents = await User.find({ role: Role.AGENT });
//   return allAgents;
// };

// //update agent status
// const updateAgentStatus = async (id: string, status: string) => {
//   const agentUpSatus = status.toLowerCase();
//   const isExistAgent = await User.findOne({ _id: id, role: Role.AGENT });
//   if (!isExistAgent) {
//     throw new AppError(
//       'This ID does not belong to the agent.',
//       httpStatusCode.BAD_REQUEST
//     );
//   }
//   const agentStatus: string[] = Object.values(AgentStatus);
//   if (!agentStatus.includes(agentUpSatus)) {
//     throw new AppError(
//       'Please provide valid status.',
//       httpStatusCode.BAD_REQUEST
//     );
//   }
//   if (isExistAgent.agentStatus === agentUpSatus) {
//     throw new AppError(
//       `Agent already ${agentUpSatus}`,
//       httpStatusCode.FORBIDDEN
//     );
//   }
//   await User.findByIdAndUpdate(id, {
//     agentStatus: agentUpSatus,
//   });
//   return {
//     success: true,
//     message: `Agent status ${agentUpSatus} successfully`,
//     data: {
//       agentStatus: agentUpSatus,
//       role: Role.AGENT,
//     },
//   };
// };

// //get all users by admin
// const getAllUsers = async () => {
//   const allUsers = await User.find({ role: Role.USER });
//   return allUsers;
// };

// //update user status
// const updateUserStatus = async (id: string, status: string) => {
//   const userUpSatus = status.toLowerCase();
//   const isExistUser = await User.findOne({ _id: id, role: Role.USER });
//   if (!isExistUser) {
//     throw new AppError(
//       'This ID does not belong to the user.',
//       httpStatusCode.BAD_REQUEST
//     );
//   }
//   const agentStatus: string[] = Object.values(UserStatus);
//   if (!agentStatus.includes(userUpSatus)) {
//     throw new AppError(
//       'Please provide valid status.',
//       httpStatusCode.BAD_REQUEST
//     );
//   }
//   if (isExistUser.status === userUpSatus) {
//     throw new AppError(`User already ${userUpSatus}`, httpStatusCode.FORBIDDEN);
//   }
//   await User.findByIdAndUpdate(id, {
//     status: userUpSatus,
//   });
//   return {
//     success: true,
//     message: `User status ${userUpSatus} successfully`,
//     data: {
//       status: userUpSatus,
//       role: Role.USER,
//     },
//   };
// };

// //admin gel all wallet
// const getAllWallets = async () => {
//   const allWallets = await Wallet.find().populate(
//     'user',
//     'name phone role status'
//   );
//   return allWallets;
// };

// //admin update wallet status
// const updateWalletStatus = async (id: string, status: string) => {
//   const walletUpSatus = status.toLowerCase();
//   const isExistWallet = await Wallet.findOne({ user: id }).populate('user');
//   console.log(isExistWallet);
//   if (!isExistWallet) {
//     throw new AppError(
//       'This ID does not belong to the wallet.',
//       httpStatusCode.BAD_REQUEST
//     );
//   }

//   const walletstatus: string[] = Object.values(WalletStatus);
//   if (!walletstatus.includes(walletUpSatus)) {
//     throw new AppError(
//       'Please provide valid status.',
//       httpStatusCode.BAD_REQUEST
//     );
//   }
//   if (isExistWallet.status === walletUpSatus) {
//     throw new AppError(
//       `Wallet already ${walletUpSatus}`,
//       httpStatusCode.FORBIDDEN
//     );
//   }
//   await Wallet.findOneAndUpdate({user:id}, {
//     status: walletUpSatus,
//   });
//   return {
//     success: true,
//     message: `Wallet status ${walletUpSatus} successfully`,
//     data: {
//       walletStatus: walletUpSatus,
//     },
//   };
// };

export const userServices = {
  createUser,
  // updateAgentStatus,
  // updateUserStatus,
  // getAllUsers,
  // getAllAgents,
  // getAllWallets,
  // updateWalletStatus,
};
