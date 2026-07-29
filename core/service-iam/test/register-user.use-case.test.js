import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { makeRegisterUser } from '../src/application/use-cases/register-user.use-case.js';

const JWT_SECRET = 'test-secret';

const makeFakeUserRepo = ({ existingEmail } = {}) => ({
  findByEmail: async (email) => (email === existingEmail ? { id: 'existing' } : null),
  create: async (user) => ({ ...user, id: 'new-user-id' }),
});

test('register returns a token whose payload shape matches login (userId claim)', async () => {
  const registerUser = makeRegisterUser({ userRepo: makeFakeUserRepo(), jwtSecret: JWT_SECRET });

  const { user, token } = await registerUser({
    email: 'new@test.com',
    password: 'password123',
    fullName: 'New User',
  });

  assert.equal(user.id, 'new-user-id');
  assert.ok(token, 'expected a token to be returned');

  // This is the exact assumption gateway-core's handlers.js `me` relies on:
  // it reads `payload.userId` to build the IAM profile request URL.
  const payload = jwt.verify(token, JWT_SECRET);
  assert.equal(payload.userId, 'new-user-id');
});

test('register still rejects a duplicate email before issuing a token', async () => {
  const registerUser = makeRegisterUser({
    userRepo: makeFakeUserRepo({ existingEmail: 'taken@test.com' }),
    jwtSecret: JWT_SECRET,
  });

  await assert.rejects(
    () => registerUser({ email: 'taken@test.com', password: 'x', fullName: 'X' }),
    /already registered/i
  );
});
