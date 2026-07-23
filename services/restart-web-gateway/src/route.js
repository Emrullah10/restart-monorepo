import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { strictAuthLimiter } from './middlewares/security-middleware.js';
import { requireAuth } from './middlewares/require-auth.js';
import { makeGatewayHandlers } from './gateway-handlers.js';
import { serviceTargets } from '../configs/app-config.js';

export const buildRouter = () => {
  const router = Router();
  const handlers = makeGatewayHandlers();

  router.post('/api/gateway/login', strictAuthLimiter, handlers.login);
  router.get('/api/gateway/me', handlers.me);
  router.post('/api/gateway/logout', handlers.logout);

  router.use(
    '/api/auth/register',
    createProxyMiddleware({ target: serviceTargets.iam, changeOrigin: true })
  );

  router.use(
    '/api/operation',
    requireAuth,
    createProxyMiddleware({ target: serviceTargets.operation, changeOrigin: true, pathRewrite: { '^/api/operation': '/api' } })
  );

  router.use(
    '/api/marketplace',
    createProxyMiddleware({ target: serviceTargets.marketplace, changeOrigin: true })
  );

  return router;
};
