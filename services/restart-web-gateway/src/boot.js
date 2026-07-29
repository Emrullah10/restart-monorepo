import express from 'express';
import cookieParser from 'cookie-parser';
import { makeBoot, buildRouter, makeGatewayHandlers, strictAuthLimiter } from '@restart/gateway-core';
import { cookieStrategy } from './auth/cookie-strategy.js';
import { serviceTargets } from '../configs/app-config.js';

const SERVICE_NAME = 'Web Gateway';

const ownRoutes = (router) => {
  const handlers = makeGatewayHandlers({ iamTarget: serviceTargets.iam, authStrategy: cookieStrategy });

  // Only the gateway's own routes parse the body — proxied routes forward
  // the raw request stream untouched (see the express.json() note in
  // @restart/gateway-core's boot.js).
  router.post('/api/gateway/login', strictAuthLimiter, express.json(), handlers.login);
  router.post('/api/gateway/register', strictAuthLimiter, express.json(), handlers.register);
  router.get('/api/gateway/me', handlers.me);
  router.post('/api/gateway/logout', handlers.logout);
};

const router = buildRouter({ authStrategy: cookieStrategy, serviceTargets, ownRoutes });

export const boot = makeBoot({
  serviceName: SERVICE_NAME,
  banner: 'ReStart Web Gateway',
  corsOptions: { credentials: true, origin: true },
  extraMiddleware: [cookieParser()],
  router,
});
