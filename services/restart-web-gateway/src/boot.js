import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestLogger, notFoundHandler } from '@restart/middlewares';
import { buildRouter } from './route.js';

const SERVICE_NAME = 'Web Gateway';

export const boot = () => {
  const app = express();
  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLogger(SERVICE_NAME));

  app.use(buildRouter());

  app.get('/', (req, res) => {
    res.send('ReStart Web Gateway');
  });

  app.use(notFoundHandler(SERVICE_NAME));

  return app;
};
