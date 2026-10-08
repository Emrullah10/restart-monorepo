import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret';
const FAKE_TOKEN = jwt.sign({ userId: 'u1', email: 'valid@test.com', role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

// Stub upstream services (iam/operation/marketplace) so the gateway's proxy
// targets point at throwaway servers we control. Ports must be set via env
// BEFORE boot.js (and its transitive config import) is loaded, because
// configs/app-config.js reads process.env at module-evaluation time.
let iamServer;
let operationServer;
let marketplaceServer;
let boot;

const listen = (app) => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

before(async () => {
  const iamApp = express();
  iamApp.use(express.json());
  iamApp.post('/api/auth/login', (req, res) => {
    if (req.body.email === 'valid@test.com') {
      return res.status(200).json({
        message: 'Login successful',
        token: FAKE_TOKEN,
        user: { id: 'u1', email: 'valid@test.com' },
      });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  });
  iamApp.get('/api/user/profile/:userId', (req, res) => {
    res.status(200).json({ id: req.params.userId, email: 'valid@test.com' });
  });
  iamApp.post('/api/auth/register', (req, res) => {
    res.status(201).json({ message: 'User registered successfully', token: FAKE_TOKEN, user: { id: 'u2', email: req.body.email } });
  });

  const operationApp = express();
  operationApp.use((req, res) => {
    // Echo back the path we received (post-rewrite) and the raw body, so the
    // pathRewrite and stream-passthrough behaviors are both observable.
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      res.status(200).json({ receivedPath: req.originalUrl, receivedBody: body });
    });
  });

  const marketplaceApp = express();
  marketplaceApp.get('/api/marketplace/products', (req, res) => {
    res.status(200).json({ products: [] });
  });
  marketplaceApp.get('/api/marketplace/listings', (req, res) => {
    res.status(200).json({ listings: ['should-not-be-reached-without-auth'] });
  });

  iamServer = await listen(iamApp);
  operationServer = await listen(operationApp);
  marketplaceServer = await listen(marketplaceApp);

  process.env.IAM_SERVICE_URL = `http://localhost:${iamServer.address().port}`;
  process.env.OPERATION_SERVICE_URL = `http://localhost:${operationServer.address().port}`;
  process.env.MARKETPLACE_SERVICE_URL = `http://localhost:${marketplaceServer.address().port}`;
  process.env.JWT_SECRET = 'test-secret';

  ({ boot } = await import('../src/boot.js'));
});

after(async () => {
  await Promise.all([iamServer, operationServer, marketplaceServer].map(
    (server) => new Promise((resolve) => server.close(resolve))
  ));
});

test('login sets an HttpOnly cookie and does NOT leak the token in the response body', async () => {
  const app = boot();
  const res = await supertest(app)
    .post('/api/gateway/login')
    .send({ email: 'valid@test.com', password: 'x' });

  assert.equal(res.status, 200);
  assert.equal(res.body.token, undefined, 'token must not appear in the response body');
  assert.deepEqual(Object.keys(res.body).sort(), ['message', 'user']);

  const setCookie = res.headers['set-cookie'];
  assert.ok(setCookie, 'expected a Set-Cookie header');
  assert.match(setCookie[0], /teknolup_access_token=/);
  assert.match(setCookie[0], /HttpOnly/i);
});

test('login with bad credentials proxies the 401 through unchanged', async () => {
  const app = boot();
  const res = await supertest(app)
    .post('/api/gateway/login')
    .send({ email: 'nope@test.com', password: 'x' });

  assert.equal(res.status, 401);
});

test('register sets an HttpOnly cookie and does NOT leak the token in the response body', async () => {
  const app = boot();
  const res = await supertest(app)
    .post('/api/gateway/register')
    .send({ email: 'new@test.com', password: 'x', fullName: 'New User' });

  assert.equal(res.status, 201);
  assert.equal(res.body.token, undefined, 'token must not appear in the response body');
  assert.deepEqual(Object.keys(res.body).sort(), ['message', 'user']);

  const setCookie = res.headers['set-cookie'];
  assert.ok(setCookie, 'expected a Set-Cookie header');
  assert.match(setCookie[0], /teknolup_access_token=/);
  assert.match(setCookie[0], /HttpOnly/i);
});

test('me returns 401 when no session cookie is present', async () => {
  const app = boot();
  const res = await supertest(app).get('/api/gateway/me');
  assert.equal(res.status, 401);
  assert.equal(res.body.error, 'Unauthorized');
});

test('public marketplace products route is reachable without auth', async () => {
  const app = boot();
  const res = await supertest(app).get('/api/marketplace/products');
  assert.equal(res.status, 200);
});

test('guarded marketplace catch-all rejects unauthenticated requests without reaching upstream', async () => {
  const app = boot();
  const res = await supertest(app).get('/api/marketplace/listings');
  assert.equal(res.status, 401);
  // If the upstream had been reached, it would have returned the sentinel
  // listing below — asserting its absence proves requireAuth short-circuited
  // the proxy rather than merely returning 401 after forwarding.
  assert.equal(JSON.stringify(res.body).includes('should-not-be-reached-without-auth'), false);
});

test('operation proxy rewrites /api/operation/* to /api/* on the upstream, with a valid session', async () => {
  const app = boot();
  const agent = supertest.agent(app);

  const login = await agent.post('/api/gateway/login').send({ email: 'valid@test.com', password: 'x' });
  assert.equal(login.status, 200);

  const res = await agent.get('/api/operation/services');
  assert.equal(res.status, 200);
  assert.equal(res.body.receivedPath, '/api/services');
});

test('POST body reaches the proxied upstream unmodified (express.json() stream trap)', async () => {
  const app = boot();
  const agent = supertest.agent(app);

  await agent.post('/api/gateway/login').send({ email: 'valid@test.com', password: 'x' });

  const res = await agent
    .post('/api/operation/recycle/log')
    .set('Content-Type', 'application/json')
    .send({ weightKg: 3 });

  assert.equal(res.status, 200);
  assert.equal(res.body.receivedBody, JSON.stringify({ weightKg: 3 }));
});
