import { makeVerifyAccessToken } from '@teknolup/gateway-core';
import { setAccessCookie, clearAccessCookie, readAccessCookie } from './cookies.js';
import { jwtSecret } from '../../configs/app-config.js';

export const cookieStrategy = {
  readToken: readAccessCookie,
  verifyToken: makeVerifyAccessToken(jwtSecret),
  onLoginSuccess: (res, token, data) => {
    setAccessCookie(res, token);
    return { message: data.message, user: data.user };
  },
  onLogout: clearAccessCookie,
};
