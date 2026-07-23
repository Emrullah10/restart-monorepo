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
