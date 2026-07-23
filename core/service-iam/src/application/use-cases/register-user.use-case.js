import bcrypt from 'bcrypt';
import { ConflictError } from '@restart/errors';
import { makeUser, validateUser } from '../../domain/entities/user.entity.js';

const SALT_ROUNDS = 10;

export const makeRegisterUser = ({ userRepo }) => async ({ email, password, fullName }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = makeUser({ email, passwordHash, fullName });
  validateUser(user);

  return userRepo.create(user);
};
