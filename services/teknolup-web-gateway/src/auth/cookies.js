import { ACCESS_COOKIE } from '../../configs/app-config.js';

const isProd = process.env.NODE_ENV === 'production';

export const setAccessCookie = (res, token) => {
  res.cookie(ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAccessCookie = (res) => {
  res.clearCookie(ACCESS_COOKIE);
};

export const readAccessCookie = (req) => req.cookies?.[ACCESS_COOKIE];
