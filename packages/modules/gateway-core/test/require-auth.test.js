import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeRequireAuth } from '../src/require-auth.js';

const makeRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.body = body; return res; };
  return res;
};

test('requireAuth rejects with 401 Unauthorized when no token is present', () => {
  const requireAuth = makeRequireAuth({ readToken: () => undefined, verifyToken: () => ({}) });
  const req = {};
  const res = makeRes();
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Unauthorized');
});

test('requireAuth rejects with 401 Invalid or expired session when verification throws', () => {
  const requireAuth = makeRequireAuth({
    readToken: () => 'some-token',
    verifyToken: () => { throw new Error('bad token'); },
  });
  const req = {};
  const res = makeRes();
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Invalid or expired session');
});

test('requireAuth populates req.user and calls next() on a valid token', () => {
  const payload = { userId: 'u1' };
  const requireAuth = makeRequireAuth({
    readToken: () => 'valid-token',
    verifyToken: (token) => { assert.equal(token, 'valid-token'); return payload; },
  });
  const req = {};
  const res = makeRes();
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.user, payload);
  assert.equal(res.statusCode, null);
});
