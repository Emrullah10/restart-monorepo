import { Router } from 'express';

export const createAuthRoutes = ({ usersController }) => {
  const router = Router();
  router.post('/register', usersController.register);
  router.post('/login', usersController.login);
  return router;
};

export const createUserRoutes = ({ usersController }) => {
  const router = Router();
  router.get('/profile/:userId', usersController.getProfile);
  router.patch('/password', usersController.changePassword);
  router.get('/notification-preferences', usersController.getNotificationPreferences);
  router.put('/notification-preferences', usersController.updateNotificationPreferences);
  return router;
};

export const createGamificationRoutes = ({ gamificationController }) => {
  const router = Router();
  router.get('/leaderboard', gamificationController.getLeaderboard);
  router.get('/badges/:userId', gamificationController.getUserBadges);
  return router;
};

export const createMiscRoutes = ({ miscController }) => {
  const router = Router();
  router.get('/rewards', miscController.getRewards);
  router.post('/rewards/redeem', miscController.redeemReward);
  router.post('/contact', miscController.submitContactMessage);
  return router;
};

export const createNotificationsRoutes = ({ notificationsController }) => {
  const router = Router();
  router.get('/notifications/:userId', notificationsController.getNotifications);
  router.patch('/notifications/:id/read', notificationsController.markRead);
  router.patch('/notifications/:userId/read-all', notificationsController.markAllRead);
  return router;
};
