import { Router } from 'express';

export const createOperationRoutes = ({ operationController }) => {
  const router = Router();

  router.get('/services', operationController.getServices);
  router.get('/services/nearby', operationController.getNearbyServices);

  router.get('/activities/:userId', operationController.getActivities);

  router.post('/recycle/log', operationController.logRecycle);
  router.get('/recycle/history/:userId', operationController.getRecycleHistory);

  router.post('/ai/generate-motivation', operationController.calculateImpact);

  router.post('/logistics/find', operationController.findCouriers);

  return router;
};
