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
  router.post('/contact', miscController.submitContactMessage);
  return router;
};
