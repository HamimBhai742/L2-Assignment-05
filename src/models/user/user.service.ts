import { IUser } from './user.interface';
import { User } from './user.model';
import bcryptjs from 'bcrypt';
const createUser = async (payload: Partial<IUser>) => {
  const { password, email, phone, role, ...reset } = payload;
  const hashPassword = await bcryptjs.hash(password as string, 10);

  const user = await User.create({
    email,
    phone,
    password: hashPassword,
    role,
    ...reset,
  });
  return {
    user,
    message: `${role ? role : 'User'} created successfully`,
  };
};

export const userServices = {
  createUser,
};
