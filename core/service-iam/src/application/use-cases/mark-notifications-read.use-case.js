export const makeMarkAllNotificationsRead = ({ userRepo }) => async (userId) => {
  return userRepo.markAllNotificationsRead(userId);
};

export const makeMarkNotificationRead = ({ userRepo }) => async (notificationId) => {
  return userRepo.markNotificationRead(notificationId);
};
