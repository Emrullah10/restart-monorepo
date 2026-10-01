import bcrypt from 'bcrypt';
import { NotFoundError, UnauthorizedError, ValidationError } from '@restart/errors';

const SALT_ROUNDS = 10;
export const MIN_PASSWORD_LENGTH = 8;

export const makeChangePassword = ({ userRepo }) => async ({ userId, currentPassword, newPassword }) => {
  if (!userId) throw new UnauthorizedError('Unauthorized');
  if (!currentPassword || !newPassword) throw new ValidationError('Current and new password are required');
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (newPassword === currentPassword) throw new ValidationError('New password must differ from the current one');

  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Current password is incorrect');

  await userRepo.updatePasswordHash(userId, await bcrypt.hash(newPassword, SALT_ROUNDS));
  return { changed: true };
};
