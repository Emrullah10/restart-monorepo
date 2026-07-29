import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readBearerToken } from '../src/auth/bearer.js';

const req = (authorization) => ({ headers: authorization === undefined ? {} : { authorization } });

test('reads a valid Bearer token', () => {
  assert.equal(readBearerToken(req('Bearer abc123')), 'abc123');
});

test('returns undefined when the header is missing', () => {
  assert.equal(readBearerToken(req()), undefined);
});

test('returns undefined for a Basic auth header', () => {
  assert.equal(readBearerToken(req('Basic dXNlcjpwYXNz')), undefined);
});

test('returns undefined for a lowercase "bearer" scheme (case-sensitive)', () => {
  assert.equal(readBearerToken(req('bearer abc123')), undefined);
});

test('returns undefined when the token is empty after the prefix', () => {
  assert.equal(readBearerToken(req('Bearer ')), undefined);
});

test('trims surrounding whitespace from the token', () => {
  assert.equal(readBearerToken(req('Bearer   abc123  ')), 'abc123');
});

test('returns undefined for "Bearer" with no trailing space at all', () => {
  assert.equal(readBearerToken(req('Bearer')), undefined);
});
