import jwt from 'jsonwebtoken';

// Factory, not a bare function: the secret must be injected by each gateway's
// own config rather than imported from a shared module-level constant.
export const makeVerifyAccessToken = (jwtSecret) => (token) => jwt.verify(token, jwtSecret);
