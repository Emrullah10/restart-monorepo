import { verifyAccessToken } from '../auth/jwt.js';
import { readAccessCookie } from '../auth/cookies.js';

export const requireAuth = (req, res, next) => {
  const token = readAccessCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};
