import express from 'express';
import cors from 'cors';
import { requestLogger, notFoundHandler } from '@restart/middlewares';
import { buildContainer } from './container.js';

const SERVICE_NAME = 'Marketplace Service';

export const boot = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger(SERVICE_NAME));

  const { marketplaceRoutes } = buildContainer();

  app.use('/api/marketplace', marketplaceRoutes);

  app.get('/', (req, res) => {
    res.send('ReStart Marketplace Service - Clean Architecture');
  });

  app.use(notFoundHandler(SERVICE_NAME));

  return app;
};
