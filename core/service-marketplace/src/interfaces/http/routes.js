import { Router } from 'express';

export const createMarketplaceRoutes = ({ marketplaceController }) => {
  const router = Router();
  router.get('/products', marketplaceController.getProducts);
  router.get('/listings/:userId', marketplaceController.getUserListings);
  return router;
};
