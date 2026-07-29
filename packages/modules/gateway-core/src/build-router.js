import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { makeRequireAuth } from './require-auth.js';
import { proxyRoutes as defaultProxyRoutes } from './route-table.js';

// authStrategy: { readToken(req), onLoginSuccess(res, token, data), onLogout(res) }
// ownRoutes: (router, { authStrategy }) => void — mounted BEFORE the shared
//   proxy table, so each gateway can register its own /api/gateway/* (or
//   equivalent) endpoints first.
export const buildRouter = ({
  authStrategy,
  serviceTargets,
  ownRoutes,
  routes = defaultProxyRoutes,
}) => {
  const router = Router();
  const requireAuth = makeRequireAuth({
    readToken: authStrategy.readToken,
    verifyToken: authStrategy.verifyToken,
  });

  if (ownRoutes) {
    ownRoutes(router, { authStrategy });
  }

  for (const route of routes) {
    const proxy = createProxyMiddleware({
      target: serviceTargets[route.service],
      changeOrigin: true,
      ...(route.pathRewrite && { pathRewrite: route.pathRewrite }),
    });

    const method = route.method === 'get' ? 'get' : 'use';
    const middlewares = route.auth === 'required' ? [requireAuth, proxy] : [proxy];

    router[method](route.path, ...middlewares);
  }

  return router;
};
