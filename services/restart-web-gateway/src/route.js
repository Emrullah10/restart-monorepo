import express, { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { strictAuthLimiter } from './middlewares/security-middleware.js';
import { requireAuth } from './middlewares/require-auth.js';
import { makeGatewayHandlers } from './gateway-handlers.js';
import { serviceTargets } from '../configs/app-config.js';

export const buildRouter = () => {
  const router = Router();
  const handlers = makeGatewayHandlers();

  // Only the gateway's own routes parse the body — proxied routes below
  // forward the raw request stream untouched (see boot.js for why).
  router.post('/api/gateway/login', strictAuthLimiter, express.json(), handlers.login);
  router.get('/api/gateway/me', handlers.me);
  router.post('/api/gateway/logout', handlers.logout);

  router.use(
    '/api/auth/register',
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/user',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/gamification',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/rewards',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/notifications',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/contact',
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/operation',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.operation, changeOrigin: true, pathRewrite: { '^/api/operation': '/api' } })
  );

  router.use(
    '/api/marketplace',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.marketplace, changeOrigin: true })
  );

  return router;
};
