import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TEST_BASE_URL, skipUnlessServerUp } from './helpers/server';

const BASE = TEST_BASE_URL;

describe('admin course API auth', { skip: await skipUnlessServerUp() }, () => {
  it('GET /api/admin/courses returns 401 without auth', async () => {
    const res = await fetch(`${BASE}/api/admin/courses`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.status, 'error');
  });

  it('GET /api/admin/courses/:id/chapters returns 401 without auth', async () => {
    const res = await fetch(`${BASE}/api/admin/courses/test-id/chapters`);
    assert.equal(res.status, 401);
  });

  it('GET /api/admin/lessons/:id/stream returns 401 without auth', async () => {
    const res = await fetch(`${BASE}/api/admin/lessons/test-id/stream`);
    assert.equal(res.status, 401);
  });
});
