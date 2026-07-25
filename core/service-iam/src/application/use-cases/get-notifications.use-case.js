export const makeGetNotifications = ({ userRepo }) => async (userId) => {
  return userRepo.getNotifications(userId);
};
