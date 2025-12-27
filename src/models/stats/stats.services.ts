import { Review } from '../review/review.schema';
import { Transaction } from '../transaction/transaction.model';
import { Role } from '../user/user.interface';
import { User } from '../user/user.model';

const homePageStats = async () => {
  const totalUsers = await User.countDocuments({ role: Role.USER });
  const totalAgents = await User.countDocuments({ role: Role.AGENT });
  const totalTransactionAmount = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);
  const uptimeSeconds = process.uptime();
  const totalSecondsInDay = 24 * 60 * 60;

  const uptimePercentage = Math.min(
    (uptimeSeconds / totalSecondsInDay) * 100,
    100
  ).toFixed(2);

  const avgRating = await Review.aggregate([
    {
      $group: {
        _id: null,
        total: { $avg: '$rating' },
      },
    },
  ]);

  const totalActiveUser = await User.countDocuments({
    isActive: true,
    role: Role.USER,
  });

  const totalAgent= await User.countDocuments({
    isActive: true,
    role: Role.AGENT,
  });

  return {
    totalUsers,
    totalAgents,
    totalTransactionAmount: totalTransactionAmount[0]?.total,
    upTime: `${Number(uptimePercentage)}%`,
    downTime: `${100 - Number(uptimePercentage)}%`,
    avgRating: avgRating[0]?.total,
    totalActiveUser,
    totalAgent
  };
};

export const statsServices = { homePageStats };
