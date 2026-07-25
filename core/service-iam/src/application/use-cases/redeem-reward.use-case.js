export const makeRedeemReward = ({ userRepo }) => async ({ userId, rewardId }) => {
  return userRepo.redeemReward({ userId, rewardId });
};
