import { setAccessCookie, clearAccessCookie, readAccessCookie } from './auth/cookies.js';
import { verifyAccessToken } from './auth/jwt.js';
import { serviceTargets } from '../configs/app-config.js';

export const makeGatewayHandlers = ({ fetchFn = fetch } = {}) => ({
  login: async (req, res) => {
    const response = await fetchFn(`${serviceTargets.iam}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    setAccessCookie(res, data.token);
    res.status(200).json({ message: data.message, user: data.user });
  },

  me: async (req, res) => {
    const token = readAccessCookie(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const payload = verifyAccessToken(token);
      const response = await fetchFn(`${serviceTargets.iam}/api/user/profile/${payload.userId}`);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired session' });
    }
  },

  logout: async (req, res) => {
    clearAccessCookie(res);
    res.status(200).json({ message: 'Logged out' });
  },
});
