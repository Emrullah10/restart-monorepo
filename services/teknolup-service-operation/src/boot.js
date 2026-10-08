import express from 'express';
import cors from 'cors';
import { requestLogger, notFoundHandler } from '@teknolup/middlewares';
import { buildContainer } from './container.js';

const SERVICE_NAME = 'Operation Service';

export const boot = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger(SERVICE_NAME));

  const { operationRoutes } = buildContainer();

  app.use('/api', operationRoutes);

  app.get('/', (req, res) => {
    res.send('TeknoLup Operation Service - Clean Architecture');
  });

  app.use(notFoundHandler(SERVICE_NAME));

  return app;
};
