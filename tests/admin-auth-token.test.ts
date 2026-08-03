/**
 * Admin access-token verification tests.
 *
 * Was tests/admin-jwt-middleware.test.ts, targeting
 * `verifyAdminAccessTokenForMiddleware` from `@/lib/admin-jwt`. That module was
 * deleted in 9832e12 ("refactor: simplify admin middleware to avoid Edge crypto
 * verify mismatch") — middleware.ts now only checks that a token is *present*
 * and no longer verifies signatures. The surviving verifier is
 * `verifyAdminAccessToken` in `@/lib/admin-auth`, which keeps the same
 * fail-closed-but-non-throwing contract (returns `null` rather than `false`),
 * so the original invariant is retargeted here rather than dropped.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import {
  createAdminAccessToken,
  createAdminRefreshToken,
  verifyAdminAccessToken,
} from '@/lib/admin-auth';

// Set before any verify call: getAdminJwtSecret() reads env at call time, and
// without a secret every token would be rejected for the wrong reason.
process.env.ADMIN_JWT_SECRET = 'test-admin-jwt-secret';

const adminUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'ADMIN',
  phone: '09120000000',
};

describe('verifyAdminAccessToken', () => {
  it('rejects malformed tokens without throwing', () => {
    assert.equal(verifyAdminAccessToken('not-a-jwt'), null);
    assert.equal(
      verifyAdminAccessToken('eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIn0.bad!'),
      null
    );
    assert.equal(verifyAdminAccessToken(''), null);
  });

  it('rejects a token signed with a different secret', () => {
    const forged = jwt.sign({ ...adminUser, type: 'access' }, 'some-other-secret');
    assert.equal(verifyAdminAccessToken(forged), null);
  });

  it('rejects an expired token', () => {
    const expired = jwt.sign(
      { ...adminUser, type: 'access' },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: '-1s' }
    );
    assert.equal(verifyAdminAccessToken(expired), null);
  });

  it('rejects a refresh token presented as an access token', () => {
    const refresh = createAdminRefreshToken(adminUser.id);
    assert.equal(verifyAdminAccessToken(refresh), null);
  });

  it('accepts a valid access token and returns the admin identity', () => {
    const token = createAdminAccessToken(adminUser);
    assert.deepEqual(verifyAdminAccessToken(token), adminUser);
  });
});
