import { ValidationError } from '@teknolup/errors';

export const makeUser = ({ id, email, passwordHash, fullName, role, avatarUrl, createdAt }) => {
  const user = {
    id,
    email,
    passwordHash,
    fullName,
    role: role || 'user',
    avatarUrl,
    createdAt: createdAt || new Date(),
  };

  return user;
};

export const validateUser = (user) => {
  if (!user.email) throw new ValidationError('Email is required');
  if (!user.email.includes('@')) throw new ValidationError('Invalid email format');
};

export const userToJSON = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  role: user.role,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});
