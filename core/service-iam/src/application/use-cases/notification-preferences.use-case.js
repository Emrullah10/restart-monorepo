import { UnauthorizedError, ValidationError } from '@teknolup/errors';

export const PREFERENCE_KEYS = ['recycle', 'marketplace', 'rewards', 'system'];

export const makeGetNotificationPreferences = ({ userRepo }) => async ({ userId }) => {
  if (!userId) throw new UnauthorizedError('Unauthorized');
  return userRepo.getNotificationPreferences(userId);
};

export const makeUpdateNotificationPreferences = ({ userRepo }) => async ({ userId, preferences }) => {
  if (!userId) throw new UnauthorizedError('Unauthorized');
  const current = await userRepo.getNotificationPreferences(userId);
  const next = { ...current };
  for (const key of PREFERENCE_KEYS) {
    if (preferences?.[key] === undefined) continue;
    if (typeof preferences[key] !== 'boolean') throw new ValidationError(`"${key}" must be a boolean`);
    next[key] = preferences[key];
  }
  await userRepo.saveNotificationPreferences(userId, next);
  return next;
};
