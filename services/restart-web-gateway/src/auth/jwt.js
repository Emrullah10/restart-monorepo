import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../configs/app-config.js';

export const verifyAccessToken = (token) => jwt.verify(token, jwtSecret);
