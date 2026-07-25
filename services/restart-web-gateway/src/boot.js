import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestLogger, notFoundHandler } from '@restart/middlewares';
import { buildRouter } from './route.js';

const SERVICE_NAME = 'Web Gateway';

export const boot = () => {
  const app = express();
  app.use(cors({ credentials: true, origin: true }));
  // NOTE: express.json() is intentionally NOT mounted globally here.
  // Proxied routes (register/user/gamification/rewards/contact/operation/marketplace)
  // must receive the raw request stream — http-proxy-middleware forwards it
  // as-is. If the body were parsed here first, the stream would already be
  // consumed and the proxied request would hang waiting for a body that
  // never arrives. Only the gateway's own routes (login/logout) that read
  // req.body directly apply express.json() locally in route.js.
  app.use(cookieParser());
  app.use(requestLogger(SERVICE_NAME));

  app.use(buildRouter());

  app.get('/', (req, res) => {
    res.send('ReStart Web Gateway');
  });

  app.use(notFoundHandler(SERVICE_NAME));

  return app;
};
