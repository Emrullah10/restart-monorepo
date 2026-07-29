import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import http from 'node:http';
import supertest from 'supertest';
import { makeGatewayHandlers } from '../src/handlers.js';

const listen = (app) => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

const cookieStrategy = () => {
  let cookieSet = false;
  return {
    strategy: {
      readToken: () => undefined,
      verifyToken: () => { throw new Error('not used in this test'); },
      onLoginSuccess: (res, token, data) => {
        cookieSet = true;
        return { message: data.message, user: data.user };
      },
      onLogout: () => {},
    },
    wasCookieSet: () => cookieSet,
  };
};

const bearerStrategy = {
  readToken: () => undefined,
  verifyToken: () => { throw new Error('not used in this test'); },
  onLoginSuccess: (res, token, data) => ({ message: data.message, user: data.user, token }),
  onLogout: () => {},
};

test('web-style strategy: login response withholds the token from the body', async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/login', (req, res) => {
    res.status(200).json({ message: 'Login successful', token: 'secret-token', user: { id: 'u1' } });
  });
  const iamServer = await listen(iamApp);

  const { strategy, wasCookieSet } = cookieStrategy();
  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: strategy,
  });

  const app = express();
  app.use(express.json());
  app.post('/login', handlers.login);

  const res = await supertest(app).post('/login').send({ email: 'x', password: 'y' });

  assert.equal(res.status, 200);
  assert.equal(res.body.token, undefined, 'web strategy must not leak the token into the response body');
  assert.ok(wasCookieSet(), 'onLoginSuccess should have been invoked to set the cookie');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('mobile-style strategy: login response includes the token in the body', async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/login', (req, res) => {
    res.status(200).json({ message: 'Login successful', token: 'secret-token', user: { id: 'u1' } });
  });
  const iamServer = await listen(iamApp);

  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: bearerStrategy,
  });

  const app = express();
  app.use(express.json());
  app.post('/login', handlers.login);

  const res = await supertest(app).post('/login').send({ email: 'x', password: 'y' });

  assert.equal(res.status, 200);
  assert.equal(res.body.token, 'secret-token');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('login proxies a non-ok upstream response through unchanged', async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/login', (req, res) => {
    res.status(401).json({ error: 'Invalid credentials' });
  });
  const iamServer = await listen(iamApp);

  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: bearerStrategy,
  });

  const app = express();
  app.use(express.json());
  app.post('/login', handlers.login);

  const res = await supertest(app).post('/login').send({ email: 'x', password: 'y' });

  assert.equal(res.status, 401);
  assert.equal(res.body.error, 'Invalid credentials');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('web-style strategy: register response withholds the token from the body and returns 201', async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/register', (req, res) => {
    res.status(201).json({ message: 'User registered successfully', token: 'secret-token', user: { id: 'u1' } });
  });
  const iamServer = await listen(iamApp);

  const { strategy, wasCookieSet } = cookieStrategy();
  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: strategy,
  });

  const app = express();
  app.use(express.json());
  app.post('/register', handlers.register);

  const res = await supertest(app).post('/register').send({ email: 'x', password: 'y', fullName: 'X' });

  assert.equal(res.status, 201);
  assert.equal(res.body.token, undefined, 'web strategy must not leak the token into the response body');
  assert.ok(wasCookieSet(), 'onLoginSuccess should have been invoked to set the cookie');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('mobile-style strategy: register response includes the token in the body', async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/register', (req, res) => {
    res.status(201).json({ message: 'User registered successfully', token: 'secret-token', user: { id: 'u1' } });
  });
  const iamServer = await listen(iamApp);

  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: bearerStrategy,
  });

  const app = express();
  app.use(express.json());
  app.post('/register', handlers.register);

  const res = await supertest(app).post('/register').send({ email: 'x', password: 'y', fullName: 'X' });

  assert.equal(res.status, 201);
  assert.equal(res.body.token, 'secret-token');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('register proxies a conflict (409) upstream response through unchanged', async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/register', (req, res) => {
    res.status(409).json({ error: 'Email already registered' });
  });
  const iamServer = await listen(iamApp);

  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: bearerStrategy,
  });

  const app = express();
  app.use(express.json());
  app.post('/register', handlers.register);

  const res = await supertest(app).post('/register').send({ email: 'x', password: 'y', fullName: 'X' });

  assert.equal(res.status, 409);
  assert.equal(res.body.error, 'Email already registered');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('me: valid token fetches the profile from IAM using the payload userId', async () => {
  const iamApp = express();
  let receivedPath;
  iamApp.get('/api/user/profile/:userId', (req, res) => {
    receivedPath = req.path;
    res.status(200).json({ id: req.params.userId, email: 'x@test.com' });
  });
  const iamServer = await listen(iamApp);

  const strategy = {
    readToken: () => 'valid-token',
    verifyToken: (token) => { assert.equal(token, 'valid-token'); return { userId: 'u1' }; },
    onLoginSuccess: () => ({}),
    onLogout: () => {},
  };
  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: strategy,
  });

  const app = express();
  app.get('/me', handlers.me);

  const res = await supertest(app).get('/me');

  assert.equal(res.status, 200);
  assert.equal(res.body.id, 'u1');
  assert.equal(receivedPath, '/api/user/profile/u1');

  await new Promise((resolve) => iamServer.close(resolve));
});

test('me: an expired/invalid token returns 401 without calling IAM', async () => {
  let iamCalled = false;
  const iamApp = express();
  iamApp.get('/api/user/profile/:userId', (req, res) => {
    iamCalled = true;
    res.status(200).json({ id: req.params.userId });
  });
  const iamServer = await listen(iamApp);

  const strategy = {
    readToken: () => 'expired-token',
    verifyToken: () => { throw new Error('jwt expired'); },
    onLoginSuccess: () => ({}),
    onLogout: () => {},
  };
  const handlers = makeGatewayHandlers({
    iamTarget: `http://localhost:${iamServer.address().port}`,
    authStrategy: strategy,
  });

  const app = express();
  app.get('/me', handlers.me);

  const res = await supertest(app).get('/me');

  assert.equal(res.status, 401);
  assert.equal(res.body.error, 'Invalid or expired session');
  assert.equal(iamCalled, false, 'IAM must not be called when token verification fails');

  await new Promise((resolve) => iamServer.close(resolve));
});
