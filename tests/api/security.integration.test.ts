/**
 * API Security & Rate Limiting Tests
 * Location: tests/api/security.integration.test.ts
 *
 * These are true integration tests: they issue real HTTP requests against a
 * running instance at API_URL (default http://localhost:3000). They fail with
 * ECONNREFUSED when no server is up — start one with `npm run dev` first.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const API_BASE = process.env.API_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

/** assert that `haystack` contains `needle`, with a readable failure message */
function assertContains(haystack: string, needle: string) {
  assert.ok(
    haystack.includes(needle),
    `expected ${JSON.stringify(haystack)} to contain ${JSON.stringify(needle)}`
  );
}

describe('API Security & Rate Limiting', () => {
  const authToken = 'test-token';

  // ============================================
  // XSS PREVENTION TESTS
  // ============================================

  describe('XSS Prevention', () => {
    const xssPayloads = [
      {
        name: 'Script tag injection',
        payload: '<p>Safe</p><script>alert("xss")</script>',
        shouldContain: 'Safe',
        shouldNotContain: ['script', 'alert'],
      },
      {
        name: 'Event handler injection',
        payload: '<img src=x onerror="alert(1)">',
        shouldNotContain: ['onerror', 'alert'],
      },
      {
        name: 'SVG onload',
        payload: '<svg onload="alert(1)"></svg>',
        shouldNotContain: ['onload', 'alert'],
      },
      {
        name: 'iframe injection',
        payload: '<iframe src="javascript:alert(1)"></iframe>',
        shouldNotContain: ['iframe', 'javascript'],
      },
      {
        name: 'onclick handler',
        payload: '<div onclick="alert(1)">Click</div>',
        shouldNotContain: ['onclick', 'alert'],
      },
    ];

    xssPayloads.forEach(({ name, payload, shouldContain, shouldNotContain }) => {
      it(`should prevent XSS: ${name}`, { timeout: TEST_TIMEOUT }, async () => {
        const response = await fetch(`${API_BASE}/api/news/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: `XSS Test: ${name}`,
            content: payload,
            category: 'Test',
          }),
        });

        assert.ok(response.status < 500, `expected status < 500, got ${response.status}`); // Should not crash

        if (response.ok) {
          const data = await response.json();
          const article = await fetch(`${API_BASE}/api/news/${data.id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const articleData = await article.json();

          const content = articleData.content || '';
          shouldNotContain?.forEach((pattern) => {
            assert.ok(
              !content.toLowerCase().includes(pattern.toLowerCase()),
              `expected sanitized content not to contain ${JSON.stringify(pattern)}`
            );
          });

          if (shouldContain) {
            assertContains(content, shouldContain);
          }
        }
      });
    });
  });

  // ============================================
  // RATE LIMITING TESTS
  // ============================================

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', { timeout: TEST_TIMEOUT }, async () => {
      const requests = [];

      // Make 5 requests (limit for create is 5/min)
      for (let i = 0; i < 5; i++) {
        const promise = fetch(`${API_BASE}/api/news/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: `Rate Limit Test ${i}`,
            content: `<p>Test ${i}</p>`,
            category: 'Test',
          }),
        });
        requests.push(promise);
      }

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        assert.notEqual(response.status, 429);
      });
    });

    it('should reject requests exceeding rate limit', { timeout: TEST_TIMEOUT }, async () => {
      const requests = [];

      // Make 10 requests (limit is 5/min, so 6th+ should be rejected)
      for (let i = 0; i < 10; i++) {
        const promise = fetch(`${API_BASE}/api/news/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: `Rate Limit Exceed ${i}`,
            content: `<p>Test ${i}</p>`,
            category: 'Test',
          }),
        });
        requests.push(promise);
      }

      const responses = await Promise.all(requests);
      const rateLimitedCount = responses.filter((r) => r.status === 429).length;

      assert.ok(rateLimitedCount > 0, `expected some 429s, got ${rateLimitedCount}`);
    });

    it('should include Retry-After header on rate limit', { timeout: TEST_TIMEOUT }, async () => {
      // Make requests until rate limit
      const requests = [];
      for (let i = 0; i < 10; i++) {
        const promise = fetch(`${API_BASE}/api/news/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: `Rate Limit Header Test ${i}`,
            content: `<p>Test ${i}</p>`,
            category: 'Test',
          }),
        });
        requests.push(promise);
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find((r) => r.status === 429);

      if (rateLimitedResponse) {
        const retryAfter = rateLimitedResponse.headers.get('Retry-After');
        assert.notEqual(retryAfter, null);
        assert.ok(parseInt(retryAfter || '0') > 0, 'expected positive Retry-After');
      }
    });

    it('should have different limits for different endpoints', { timeout: TEST_TIMEOUT }, async () => {
      // Test draft save endpoint (30/min limit)
      const draftRequests = [];
      for (let i = 0; i < 5; i++) {
        const promise = fetch(`${API_BASE}/api/news/draft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: `Draft ${i}`,
            content: `<p>Draft ${i}</p>`,
          }),
        });
        draftRequests.push(promise);
      }

      const responses = await Promise.all(draftRequests);
      const allSuccessful = responses.every((r) => r.status !== 429);
      assert.equal(allSuccessful, true); // Should not hit 30/min limit with just 5 requests
    });
  });

  // ============================================
  // SECURITY HEADERS TESTS
  // ============================================

  describe('Security Headers', () => {
    it('should include X-Content-Type-Options header', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Header Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    });

    it('should include X-Frame-Options header', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Frame Options Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      assert.equal(response.headers.get('X-Frame-Options'), 'SAMEORIGIN');
    });

    it('should include Content-Security-Policy header', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'CSP Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      const csp = response.headers.get('Content-Security-Policy');
      assert.notEqual(csp, null);
      assertContains(csp || '', 'default-src');
    });

    it('should include Referrer-Policy header', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Referrer Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      assert.equal(
        response.headers.get('Referrer-Policy'),
        'strict-origin-when-cross-origin'
      );
    });

    it('should include Permissions-Policy header', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Permissions Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      const permPolicy = response.headers.get('Permissions-Policy');
      assert.notEqual(permPolicy, null);
      assertContains(permPolicy || '', 'camera=()');
    });
  });

  // ============================================
  // CONTENT VALIDATION TESTS
  // ============================================

  describe('Content Validation', () => {
    it('should reject oversized content', { timeout: TEST_TIMEOUT }, async () => {
      const largeContent = '<p>' + 'x'.repeat(1048576 + 100) + '</p>';

      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Large Content Test',
          content: largeContent,
          category: 'Test',
        }),
      });

      assert.equal(response.status, 400);
    });

    it('should validate required fields', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          // Missing title
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      assert.equal(response.status, 400);
      const data = await response.json();
      assertContains(data.error ?? '', 'required');
    });

    it('should reject invalid HTML entities', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Entity Test',
          content: '<p>Test &invalid; entity</p>',
          category: 'Test',
        }),
      });

      // Should either clean or reject
      assert.ok(
        [200, 201, 400].includes(response.status),
        `unexpected status ${response.status}`
      );
    });
  });

  // ============================================
  // SQL INJECTION TESTS
  // ============================================

  describe('SQL Injection Prevention', () => {
    const sqlPayloads = [
      "'; DROP TABLE NewsArticle; --",
      "1' OR '1'='1",
      "admin' --",
      "1; DELETE FROM NewsArticle; --",
      'UNION SELECT * FROM NewsArticle',
    ];

    sqlPayloads.forEach((payload) => {
      it(
        `should prevent SQL injection: ${payload.substring(0, 20)}...`,
        { timeout: TEST_TIMEOUT },
        async () => {
          const response = await fetch(`${API_BASE}/api/news/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              title: payload,
              content: `<p>${payload}</p>`,
              category: payload,
            }),
          });

          // Should not execute SQL, just treat as data
          assert.ok(
            [200, 201, 400].includes(response.status),
            `unexpected status ${response.status}`
          );
          assert.notEqual(response.status, 500);
        }
      );
    });
  });

  // ============================================
  // AUTHENTICATION & AUTHORIZATION TESTS
  // ============================================

  describe('Authentication & Authorization', () => {
    it('should reject requests without authentication', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'No Auth Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      assert.equal(response.status, 401);
    });

    it('should reject requests with invalid token', { timeout: TEST_TIMEOUT }, async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer invalid-token-xyz',
        },
        body: JSON.stringify({
          title: 'Invalid Token Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      assert.equal(response.status, 401);
    });
  });

  // ============================================
  // IMAGE UPLOAD SECURITY TESTS
  // ============================================

  describe('Image Upload Security', () => {
    it('should validate image file type', { timeout: TEST_TIMEOUT }, async () => {
      const formData = new FormData();
      formData.append(
        'file',
        new Blob(['not-an-image'], { type: 'text/plain' }),
        'test.txt'
      );

      const response = await fetch(`${API_BASE}/api/news/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      assert.equal(response.status, 400);
    });

    it('should reject oversized images', { timeout: TEST_TIMEOUT }, async () => {
      const largeBlob = new Blob([new ArrayBuffer(6 * 1024 * 1024)], {
        type: 'image/jpeg',
      });
      const formData = new FormData();
      formData.append('file', largeBlob, 'large.jpg');

      const response = await fetch(`${API_BASE}/api/news/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      assert.equal(response.status, 400);
    });
  });
});
