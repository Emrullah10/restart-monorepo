import { Router } from 'express';

export const createMarketplaceRoutes = ({ marketplaceController }) => {
  const router = Router();
  router.get('/products', marketplaceController.getProducts);
  return router;
};
