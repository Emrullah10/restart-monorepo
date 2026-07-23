import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@restart/errors';

export const makeLoginUser = ({ userRepo, jwtSecret }) => async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: '7d',
  });

  return { user, token };
};
