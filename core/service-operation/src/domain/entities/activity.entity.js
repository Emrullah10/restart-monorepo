export const makeActivity = ({ id, userId, activityType, title, description, pointsEarned, amountEarned, createdAt }) => ({
  id,
  userId,
  activityType,
  title,
  description,
  pointsEarned: pointsEarned || 0,
  amountEarned: amountEarned || 0,
  createdAt: createdAt || new Date(),
});

export const activityToJSON = (activity) => ({ ...activity });
