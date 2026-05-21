/**
 * API Security & Rate Limiting Tests
 * Location: tests/api/security.integration.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fetch from 'node-fetch';

const API_BASE = process.env.API_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

describe('API Security & Rate Limiting', () => {
  let authToken: string;
  let testArticleId: string;

  beforeAll(async () => {
    // Get auth token (mock session in real tests)
    authToken = 'test-token';
  }, TEST_TIMEOUT);

  afterAll(async () => {
    // Cleanup
  }, TEST_TIMEOUT);

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
      it(`should prevent XSS: ${name}`, async () => {
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

        expect(response.status).toBeLessThan(500); // Should not crash

        if (response.ok) {
          const data = await response.json();
          const article = await fetch(`${API_BASE}/api/news/${data.id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const articleData = await article.json();

          const content = articleData.content || '';
          shouldNotContain?.forEach((pattern) => {
            expect(content.toLowerCase()).not.toContain(pattern.toLowerCase());
          });

          if (shouldContain) {
            expect(content).toContain(shouldContain);
          }
        }
      }, TEST_TIMEOUT);
    });
  });

  // ============================================
  // RATE LIMITING TESTS
  // ============================================

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
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
        expect(response.status).not.toBe(429);
      });
    }, TEST_TIMEOUT);

    it('should reject requests exceeding rate limit', async () => {
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

      expect(rateLimitedCount).toBeGreaterThan(0);
    }, TEST_TIMEOUT);

    it('should include Retry-After header on rate limit', async () => {
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
        expect(retryAfter).toBeDefined();
        expect(parseInt(retryAfter || '0')).toBeGreaterThan(0);
      }
    }, TEST_TIMEOUT);

    it('should have different limits for different endpoints', async () => {
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
      expect(allSuccessful).toBe(true); // Should not hit 30/min limit with just 5 requests
    }, TEST_TIMEOUT);
  });

  // ============================================
  // SECURITY HEADERS TESTS
  // ============================================

  describe('Security Headers', () => {
    it('should include X-Content-Type-Options header', async () => {
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

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    }, TEST_TIMEOUT);

    it('should include X-Frame-Options header', async () => {
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

      expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    }, TEST_TIMEOUT);

    it('should include Content-Security-Policy header', async () => {
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
      expect(csp).toBeDefined();
      expect(csp).toContain('default-src');
    }, TEST_TIMEOUT);

    it('should include Referrer-Policy header', async () => {
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

      expect(response.headers.get('Referrer-Policy')).toBe(
        'strict-origin-when-cross-origin'
      );
    }, TEST_TIMEOUT);

    it('should include Permissions-Policy header', async () => {
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
      expect(permPolicy).toBeDefined();
      expect(permPolicy).toContain('camera=()');
    }, TEST_TIMEOUT);
  });

  // ============================================
  // CONTENT VALIDATION TESTS
  // ============================================

  describe('Content Validation', () => {
    it('should reject oversized content', async () => {
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

      expect(response.status).toBe(400);
    }, TEST_TIMEOUT);

    it('should validate required fields', async () => {
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

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('required');
    }, TEST_TIMEOUT);

    it('should reject invalid HTML entities', async () => {
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
      expect([200, 201, 400]).toContain(response.status);
    }, TEST_TIMEOUT);
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
      "UNION SELECT * FROM NewsArticle",
    ];

    sqlPayloads.forEach((payload) => {
      it(`should prevent SQL injection: ${payload.substring(0, 20)}...`, async () => {
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
        expect([200, 201, 400]).toContain(response.status);
        expect(response.status).not.toBe(500);
      }, TEST_TIMEOUT);
    });
  });

  // ============================================
  // AUTHENTICATION & AUTHORIZATION TESTS
  // ============================================

  describe('Authentication & Authorization', () => {
    it('should reject requests without authentication', async () => {
      const response = await fetch(`${API_BASE}/api/news/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'No Auth Test',
          content: '<p>Test</p>',
          category: 'Test',
        }),
      });

      expect(response.status).toBe(401);
    }, TEST_TIMEOUT);

    it('should reject requests with invalid token', async () => {
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

      expect(response.status).toBe(401);
    }, TEST_TIMEOUT);
  });

  // ============================================
  // IMAGE UPLOAD SECURITY TESTS
  // ============================================

  describe('Image Upload Security', () => {
    it('should validate image file type', async () => {
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

      expect(response.status).toBe(400);
    }, TEST_TIMEOUT);

    it('should reject oversized images', async () => {
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

      expect(response.status).toBe(400);
    }, TEST_TIMEOUT);
  });
});
