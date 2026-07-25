import { Router } from 'express';

export const createMarketplaceRoutes = ({ marketplaceController, uploadMiddleware }) => {
  const router = Router();
  router.get('/products', marketplaceController.getProducts);
  router.get('/listings/:userId', marketplaceController.getUserListings);
  router.post('/listings', marketplaceController.createListing);
  router.post('/upload', uploadMiddleware, marketplaceController.uploadImages);
  return router;
};
