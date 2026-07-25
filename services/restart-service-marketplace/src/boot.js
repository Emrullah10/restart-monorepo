import express from 'express';
import cors from 'cors';
import { requestLogger, notFoundHandler } from '@restart/middlewares';
import { buildContainer } from './container.js';
import { uploadDir } from './upload.js';

const SERVICE_NAME = 'Marketplace Service';

export const boot = () => {
  const app = express();
  app.use(cors());
  app.use(requestLogger(SERVICE_NAME));

  const { marketplaceRoutes } = buildContainer();

  app.use('/api/marketplace/uploads', express.static(uploadDir));
  // JSON body parsing is scoped to /api/marketplace so it doesn't run
  // ahead of multer on the multipart /upload route.
  app.use('/api/marketplace', express.json(), marketplaceRoutes);

  app.get('/', (req, res) => {
    res.send('ReStart Marketplace Service - Clean Architecture');
  });

  app.use(notFoundHandler(SERVICE_NAME));

  return app;
};
