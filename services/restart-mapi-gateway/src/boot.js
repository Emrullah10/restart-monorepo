import express from 'express';
import { makeBoot, buildRouter, makeGatewayHandlers, strictAuthLimiter } from '@restart/gateway-core';
import { bearerStrategy } from './auth/bearer.js';
import { serviceTargets } from '../configs/app-config.js';

const SERVICE_NAME = 'Mobile API Gateway';

const ownRoutes = (router) => {
  const handlers = makeGatewayHandlers({ iamTarget: serviceTargets.iam, authStrategy: bearerStrategy });

  router.post('/api/gateway/login', strictAuthLimiter, express.json(), handlers.login);
  router.post('/api/gateway/register', strictAuthLimiter, express.json(), handlers.register);
  router.get('/api/gateway/me', handlers.me);
  router.post('/api/gateway/logout', handlers.logout);
};

const router = buildRouter({ authStrategy: bearerStrategy, serviceTargets, ownRoutes });

export const boot = makeBoot({
  serviceName: SERVICE_NAME,
  banner: 'ReStart Mobile API Gateway',
  // No credentials: native apps don't send cookies and don't enforce CORS;
  // reflecting an origin with credentials:true (as the web gateway does)
  // would be an unnecessary widening of the attack surface here.
  corsOptions: {},
  router,
});
