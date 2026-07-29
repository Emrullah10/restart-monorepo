// Order IS the contract. Public marketplace routes (products/uploads) MUST
// stay before the guarded '/api/marketplace' catch-all, or product browsing
// silently falls behind auth. This invariant is pinned by a test — do not
// "clean up" this ordering without checking gateway-core's test suite.
// Note: registration is NOT a proxy route. It's a gateway own-route
// (/api/gateway/register, see handlers.js) so the auth strategy can hand
// the freshly issued token to the client the same way login does — a plain
// proxy would leak the token straight to the browser body on the web side.
export const proxyRoutes = [
  { path: '/api/user', service: 'iam', auth: 'required' },
  { path: '/api/gamification', service: 'iam', auth: 'required' },
  { path: '/api/rewards', service: 'iam', auth: 'required' },
  { path: '/api/notifications', service: 'iam', auth: 'required' },
  { path: '/api/contact', service: 'iam', auth: 'public' },
  {
    path: '/api/operation',
    service: 'operation',
    auth: 'required',
    pathRewrite: { '^/api/operation': '/api' },
  },
  // Public marketplace browsing — must stay before the guarded catch-all
  // below so visitors can view products and images without a session.
  { path: '/api/marketplace/products', service: 'marketplace', auth: 'public', method: 'get' },
  { path: '/api/marketplace/uploads', service: 'marketplace', auth: 'public' },
  { path: '/api/marketplace', service: 'marketplace', auth: 'required' },
];
