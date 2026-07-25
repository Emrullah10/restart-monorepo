export const makeGetRewards = ({ userRepo }) => async () => {
  return userRepo.getRewards();
};
