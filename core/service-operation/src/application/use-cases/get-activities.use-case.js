export const makeGetActivities = ({ operationRepo }) => async ({ userId, limit = 10 }) => {
  return operationRepo.findActivitiesByUserId(userId, limit);
};
