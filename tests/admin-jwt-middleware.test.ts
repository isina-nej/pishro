import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyAdminAccessTokenForMiddleware } from '@/lib/admin-jwt';

test('malformed admin tokens are rejected without throwing', async () => {
  assert.equal(await verifyAdminAccessTokenForMiddleware('not-a-jwt'), false);
  assert.equal(await verifyAdminAccessTokenForMiddleware('eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIn0.bad!'), false);
});

// ponytail: this only covers malformed-cookie handling; add signed-token cases when auth fixtures exist.
