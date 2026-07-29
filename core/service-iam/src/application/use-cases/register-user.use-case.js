import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError } from '@restart/errors';
import { makeUser, validateUser } from '../../domain/entities/user.entity.js';

const SALT_ROUNDS = 10;

export const makeRegisterUser = ({ userRepo, jwtSecret }) => async ({ email, password, fullName }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = makeUser({ email, passwordHash, fullName });
  validateUser(user);

  const createdUser = await userRepo.create(user);

  // Same payload shape and lifetime as login-user.use-case.js — the gateway's
  // /gateway/me relies on the "userId" claim being identical across both.
  const token = jwt.sign(
    { userId: createdUser.id, email: createdUser.email, role: createdUser.role },
    jwtSecret,
    { expiresIn: '7d' }
  );

  return { user: createdUser, token };
};
