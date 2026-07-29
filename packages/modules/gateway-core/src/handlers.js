// authStrategy: { readToken(req), verifyToken(token), onLoginSuccess(res, token, data), onLogout(res) }
export const makeGatewayHandlers = ({ iamTarget, authStrategy, fetchFn = fetch }) => {
  // Shared by login and register: both call an IAM endpoint that returns a
  // fresh { user, token } pair, then hand it to the auth strategy so web can
  // set the cookie (and withhold the token from the body) while mobile
  // returns the token directly.
  const forwardCredentialResponse = async (req, res, { upstreamPath, successStatus }) => {
    const response = await fetchFn(`${iamTarget}${upstreamPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const body = authStrategy.onLoginSuccess(res, data.token, data);
    res.status(successStatus).json(body);
  };

  return {
    login: (req, res) => forwardCredentialResponse(req, res, {
      upstreamPath: '/api/auth/login',
      successStatus: 200,
    }),

    register: (req, res) => forwardCredentialResponse(req, res, {
      upstreamPath: '/api/auth/register',
      successStatus: 201,
    }),

    me: async (req, res) => {
      const token = authStrategy.readToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      try {
        const payload = authStrategy.verifyToken(token);
        const response = await fetchFn(`${iamTarget}/api/user/profile/${payload.userId}`);
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(401).json({ error: 'Invalid or expired session' });
      }
    },

    logout: async (req, res) => {
      authStrategy.onLogout(res);
      res.status(200).json({ message: 'Logged out' });
    },
  };
};
