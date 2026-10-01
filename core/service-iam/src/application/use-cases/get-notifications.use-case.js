// Notification type → preference category. Anything unknown counts as "system".
const CATEGORY_BY_TYPE = { recycle: 'recycle', sell: 'marketplace', reward: 'rewards' };

export const makeGetNotifications = ({ userRepo }) => async (userId) => {
  const [list, prefs] = await Promise.all([userRepo.getNotifications(userId), userRepo.getNotificationPreferences(userId)]);
  return list.filter((n) => prefs[CATEGORY_BY_TYPE[n.type] ?? 'system'] !== false);
};
