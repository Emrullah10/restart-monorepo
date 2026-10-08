import { NotFoundError } from '@teknolup/errors';

export const makeGetUserProfile = ({ userRepo }) => async ({ userId }) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const stats = await userRepo.getUserStats(userId);

  return { user, stats };
};
