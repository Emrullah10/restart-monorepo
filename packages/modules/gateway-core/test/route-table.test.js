import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proxyRoutes } from '../src/route-table.js';

test('public marketplace routes are registered before the guarded catch-all', () => {
  const productsIndex = proxyRoutes.findIndex((r) => r.path === '/api/marketplace/products');
  const uploadsIndex = proxyRoutes.findIndex((r) => r.path === '/api/marketplace/uploads');
  const catchAllIndex = proxyRoutes.findIndex((r) => r.path === '/api/marketplace');

  assert.notEqual(productsIndex, -1);
  assert.notEqual(uploadsIndex, -1);
  assert.notEqual(catchAllIndex, -1);
  assert.ok(productsIndex < catchAllIndex, 'products route must precede the marketplace catch-all');
  assert.ok(uploadsIndex < catchAllIndex, 'uploads route must precede the marketplace catch-all');
});

test('every route entry has a valid auth mode', () => {
  for (const route of proxyRoutes) {
    assert.ok(['public', 'required'].includes(route.auth), `${route.path} has invalid auth: ${route.auth}`);
  }
});
