import express from 'express';
import cors from 'cors';
import { requestLogger, notFoundHandler } from '@restart/middlewares';

// serviceName: string, used in logs and the 404 body
// corsOptions: passed straight to cors()
// extraMiddleware: array of middleware mounted after cors, before the router
//   (e.g. cookie-parser for the web gateway). DO NOT pass express.json()
//   here — see the note below.
// router: the express Router to mount (built via buildRouter)
export const makeBoot = ({ serviceName, banner, corsOptions, extraMiddleware = [], router }) => () => {
  const app = express();
  app.use(cors(corsOptions));
  // NOTE: express.json() is intentionally NOT mounted globally here, and
  // must never be added to extraMiddleware either. Proxied routes must
  // receive the raw request stream — http-proxy-middleware forwards it
  // as-is. If the body were parsed first, the stream would already be
  // consumed and the proxied request would hang waiting for a body that
  // never arrives. Only a gateway's own routes (login/logout) that read
  // req.body directly should apply express.json() locally, scoped to that
  // route only.
  for (const middleware of extraMiddleware) {
    app.use(middleware);
  }
  app.use(requestLogger(serviceName));

  app.use(router);

  app.get('/', (req, res) => {
    res.send(banner);
  });

  app.use(notFoundHandler(serviceName));

  return app;
};
