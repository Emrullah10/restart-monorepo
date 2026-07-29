// readToken(req) and verifyToken(token) are injected so each gateway can
// supply its own auth strategy (cookie vs. Authorization header) while
// sharing this exact 401 behavior.
export const makeRequireAuth = ({ readToken, verifyToken }) => (req, res, next) => {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};
