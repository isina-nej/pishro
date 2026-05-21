import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('admin course API auth', () => {
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
