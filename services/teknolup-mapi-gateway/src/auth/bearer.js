import { makeVerifyAccessToken } from '@teknolup/gateway-core';
import { jwtSecret } from '../../configs/app-config.js';

// Deliberately strict: case-sensitive "Bearer ", the space is mandatory, and
// an empty token after the prefix is treated as absent. A bare token without
// the scheme is never accepted.
export const readBearerToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  const token = header.slice('Bearer '.length).trim();
  return token || undefined;
};

export const bearerStrategy = {
  readToken: readBearerToken,
  verifyToken: makeVerifyAccessToken(jwtSecret),
  onLoginSuccess: (res, token, data) => ({ message: data.message, user: data.user, token }),
  // Stateless — there is no server-side session to invalidate; the client
  // simply discards the token.
  onLogout: () => {},
};
