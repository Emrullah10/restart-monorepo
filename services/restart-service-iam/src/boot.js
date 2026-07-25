import express from 'express';
import cors from 'cors';
import { requestLogger, notFoundHandler } from '@restart/middlewares';
import { buildContainer } from './container.js';

const SERVICE_NAME = 'IAM Service';

export const boot = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger(SERVICE_NAME));

  const { authRoutes, userRoutes, gamificationRoutes, miscRoutes } = buildContainer();

  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/gamification', gamificationRoutes);
  app.use('/api', miscRoutes);

  app.get('/', (req, res) => {
    res.send('ReStart IAM Service - Clean Architecture & DDD');
  });

  app.use(notFoundHandler(SERVICE_NAME));

  return app;
};
