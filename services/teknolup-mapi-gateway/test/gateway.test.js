import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret';
const FAKE_TOKEN = jwt.sign({ userId: 'u1', email: 'valid@test.com', role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

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

  const operationApp = express();
  operationApp.use((req, res) => {
    // Echo back the post-rewrite path and the Authorization header we
    // received, so both pathRewrite and Bearer-header passthrough are
    // observable in one place.
    res.status(200).json({
      receivedPath: req.originalUrl,
      receivedAuth: req.headers.authorization,
    });
  });

  const marketplaceApp = express();
  marketplaceApp.get('/api/marketplace/products', (req, res) => res.status(200).json({ products: [] }));
  marketplaceApp.get('/api/marketplace/listings', (req, res) => res.status(200).json({ listings: [] }));
  marketplaceApp.post('/api/marketplace/upload', (req, res) => {
    // No body parser mounted here, deliberately: multer would normally sit
    // here in the real service. We just prove the raw multipart stream and
    // the Authorization header both survive the gateway proxy hop intact.
    let receivedBytes = 0;
    req.on('data', (chunk) => { receivedBytes += chunk.length; });
    req.on('end', () => {
      res.status(200).json({
        receivedBytes,
        receivedAuth: req.headers.authorization,
        receivedContentType: req.headers['content-type'],
      });
    });
  });

  iamServer = await listen(iamApp);
  operationServer = await listen(operationApp);
  marketplaceServer = await listen(marketplaceApp);

  process.env.IAM_SERVICE_URL = `http://localhost:${iamServer.address().port}`;
  process.env.OPERATION_SERVICE_URL = `http://localhost:${operationServer.address().port}`;
  process.env.MARKETPLACE_SERVICE_URL = `http://localhost:${marketplaceServer.address().port}`;
  process.env.JWT_SECRET = JWT_SECRET;

  ({ boot } = await import('../src/boot.js'));
});

after(async () => {
  await Promise.all(
    [iamServer, operationServer, marketplaceServer].map(
      (server) => new Promise((resolve) => server.close(resolve))
    )
  );
});

test('login returns the token in the response body (no cookie)', async () => {
  const app = boot();
  const res = await supertest(app).post('/api/gateway/login').send({ email: 'valid@test.com', password: 'x' });

  assert.equal(res.status, 200);
  assert.equal(res.body.token, FAKE_TOKEN);
  assert.equal(res.headers['set-cookie'], undefined, 'mapi gateway must not set cookies');
});

test('guarded route rejects requests with no Authorization header', async () => {
  const app = boot();
  const res = await supertest(app).get('/api/marketplace/listings');
  assert.equal(res.status, 401);
});

test('guarded route accepts a valid Bearer token', async () => {
  const app = boot();
  const res = await supertest(app)
    .get('/api/marketplace/listings')
    .set('Authorization', `Bearer ${FAKE_TOKEN}`);
  assert.equal(res.status, 200);
});

test('public marketplace products route works without a token', async () => {
  const app = boot();
  const res = await supertest(app).get('/api/marketplace/products');
  assert.equal(res.status, 200);
});

test('logout is a stateless no-op that still returns 200', async () => {
  const app = boot();
  const res = await supertest(app).post('/api/gateway/logout');
  assert.equal(res.status, 200);
  assert.equal(res.headers['set-cookie'], undefined);
});

test('operation proxy rewrites /api/operation/* to /api/* and forwards the Bearer header', async () => {
  const app = boot();
  const res = await supertest(app)
    .get('/api/operation/services')
    .set('Authorization', `Bearer ${FAKE_TOKEN}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.receivedPath, '/api/services');
  assert.equal(res.body.receivedAuth, `Bearer ${FAKE_TOKEN}`);
});

test('operation proxy rejects requests with no Bearer token', async () => {
  const app = boot();
  const res = await supertest(app).get('/api/operation/services');
  assert.equal(res.status, 401);
});

test('multipart upload reaches the upstream with an intact body and Authorization header', async () => {
  const app = boot();
  const boundaryBody = Buffer.from(
    '--boundary123\r\nContent-Disposition: form-data; name="images"; filename="a.jpg"\r\nContent-Type: image/jpeg\r\n\r\nfake-image-bytes\r\n--boundary123--\r\n'
  );

  const res = await supertest(app)
    .post('/api/marketplace/upload')
    .set('Authorization', `Bearer ${FAKE_TOKEN}`)
    .set('Content-Type', 'multipart/form-data; boundary=boundary123')
    .send(boundaryBody);

  assert.equal(res.status, 200);
  assert.equal(res.body.receivedBytes, boundaryBody.length, 'upstream must receive the full unmodified body');
  assert.equal(res.body.receivedAuth, `Bearer ${FAKE_TOKEN}`);
  assert.match(res.body.receivedContentType, /^multipart\/form-data/);
});

test('multipart upload is rejected without a Bearer token, and never reaches the upstream', async () => {
  const app = boot();
  const res = await supertest(app)
    .post('/api/marketplace/upload')
    .set('Content-Type', 'multipart/form-data; boundary=boundary123')
    .send(Buffer.from('--boundary123--\r\n'));

  assert.equal(res.status, 401);
});
