export const makeGetLeaderboard = ({ userRepo }) => async ({ userId, limit = 3 }) => {
  const topUsers = await userRepo.getLeaderboard({ limit });
  const currentUser = userId ? await userRepo.getUserRank(userId) : null;
  return { topUsers, currentUser };
};
