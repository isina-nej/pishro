# Testing Guide - News Editor

## Overview

This guide covers comprehensive testing strategies for the News Editor component, including unit tests, integration tests, end-to-end tests, security tests, and performance tests.

## Test Setup

### Prerequisites

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress cypress-testing-library
npm install --save-dev artillery  # For load testing
```

### Configuration

**jest.config.js:**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/api/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## Unit Tests

### 1. Sanitization Tests

**Location**: `tests/lib/sanitize-content.test.ts`

```bash
npm run test:unit -- sanitize-content
```

**What's tested:**
- ✅ Safe HTML tag allowance
- ✅ XSS prevention (scripts, event handlers, iframes)
- ✅ Link sanitization
- ✅ Image sanitization
- ✅ Content length validation
- ✅ Word/character counting
- ✅ Plain text extraction
- ✅ Malformed HTML handling

**Expected**: 30+ tests passing

---

### 2. Hook Tests

**`useEditor` hook:**

```typescript
import { renderHook, act } from '@testing-library/react';
import { useEditor } from '@/lib/hooks/useEditor';

describe('useEditor', () => {
  it('should initialize with default config', () => {
    const { result } = renderHook(() => useEditor());
    expect(result.current.editor).toBeDefined();
    expect(result.current.isReady).toBe(true);
  });

  it('should update content', () => {
    const { result } = renderHook(() => useEditor());
    act(() => {
      result.current.setContent('<p>New content</p>');
    });
    expect(result.current.getContent()).toContain('New content');
  });

  it('should count words correctly', () => {
    const { result } = renderHook(() => 
      useEditor({ initialContent: '<p>Hello world test</p>' })
    );
    expect(result.current.getWordCount()).toBe(3);
  });
});
```

**`useAutoSave` hook:**

```typescript
describe('useAutoSave', () => {
  it('should save draft automatically', async () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => 
      useAutoSave({ content: 'test', interval: 1000 })
    );
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.saveStatus).toBe('saved');
    jest.useRealTimers();
  });
});
```

---

## Integration Tests

### 1. API Endpoint Tests

**Location**: `tests/api/news.integration.test.ts`

```bash
npm run test:integration -- news.integration
```

**Test Coverage:**

#### Create Article
```typescript
describe('POST /api/news/create', () => {
  it('should create article with valid data', async () => {
    const response = await fetch('/api/news/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Article',
        content: '<p>Test content</p>',
        category: 'Technology',
      }),
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.status).toBe('draft');
  });

  it('should reject without authentication', async () => {
    const response = await fetch('/api/news/create', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    expect(response.status).toBe(401);
  });

  it('should sanitize XSS content', async () => {
    const response = await fetch('/api/news/create', {
      method: 'POST',
      body: JSON.stringify({
        title: 'XSS Test',
        content: '<p>Safe</p><script>alert("xss")</script>',
        category: 'Test',
      }),
    });
    
    const data = await response.json();
    const article = await fetch(`/api/news/${data.id}`);
    const content = await article.json();
    expect(content.content).not.toContain('script');
  });
});
```

#### Update Article
```typescript
describe('PUT/PATCH /api/news/[id]/update', () => {
  it('should update article content', async () => {
    const updateResponse = await fetch(`/api/news/${articleId}/update`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated',
        content: '<p>Updated</p>',
      }),
    });
    
    expect(updateResponse.status).toBe(200);
  });

  it('should support partial updates', async () => {
    const updateResponse = await fetch(`/api/news/${articleId}/update`, {
      method: 'PATCH',
      body: JSON.stringify({
        content: '<p>Only update content</p>',
      }),
    });
    
    expect(updateResponse.status).toBe(200);
  });
});
```

#### Publish Article
```typescript
describe('POST /api/news/[id]/publish', () => {
  it('should publish article', async () => {
    const publishResponse = await fetch(`/api/news/${articleId}/publish`, {
      method: 'POST',
    });
    
    expect(publishResponse.status).toBe(200);
    const data = await publishResponse.json();
    expect(data.status).toBe('published');
    expect(data.publishedAt).toBeDefined();
  });
});
```

---

## End-to-End Tests

### 1. Create and Publish Flow

**Location**: `tests/e2e/news-editor.spec.ts`

```bash
npm run test:e2e
```

**Cypress Test:**

```typescript
describe('News Editor E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/admin/news/create');
    cy.login('admin@example.com', 'password');
  });

  it('should create and publish article', () => {
    // Type title
    cy.get('input[placeholder*="Title"]').type('My News Article');
    
    // Type content
    cy.get('[role="textbox"]').click().type('This is my article content');
    
    // Format content (bold)
    cy.get('[role="textbox"]').selectText('article');
    cy.contains('button', 'Bold').click();
    
    // Add link
    cy.contains('button', 'Link').click();
    cy.get('input[placeholder*="URL"]').type('https://example.com');
    cy.contains('button', 'Insert').click();
    
    // Insert image
    cy.contains('button', 'Insert Image').click();
    cy.fixture('test-image.jpg').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'test-image.jpg',
      });
    });
    cy.contains('button', 'Upload').click();
    
    // Wait for auto-save
    cy.contains('Saved').should('be.visible');
    
    // Publish
    cy.contains('button', 'Publish').click();
    cy.contains('Article published successfully').should('be.visible');
  });

  it('should auto-save draft', () => {
    cy.get('[role="textbox"]').type('Auto-saving content');
    cy.contains('Saving...').should('be.visible');
    cy.contains('Saved').should('be.visible');
    cy.clock().tick(30000); // Simulate 30 seconds
    cy.contains('Saved').should('be.visible');
  });

  it('should warn on unsaved changes', () => {
    cy.get('[role="textbox"]').type('Unsaved content');
    cy.window().then(win => {
      cy.stub(win, 'beforeunload').callsFake(() => true);
    });
    cy.reload();
    cy.on('window:beforeunload', (e) => {
      expect(e).toBe('You have unsaved changes');
    });
  });
});
```

---

## Browser Compatibility Tests

### 1. Desktop Browsers

```bash
npm run test:browser:desktop
```

**Test Matrix:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Tests:**
- ✅ Editor loads correctly
- ✅ Formatting works (bold, italic, etc.)
- ✅ Keyboard shortcuts work
- ✅ Toolbar displays properly
- ✅ Context menu works
- ✅ Image upload works
- ✅ Auto-save functions

### 2. Mobile Browsers

```bash
npm run test:browser:mobile
```

**Test Matrix:**
- iOS Safari 14+
- Chrome Android 90+
- Samsung Internet 14+
- Opera Mobile 64+

**Tests:**
- ✅ Touch interactions work
- ✅ Responsive design
- ✅ Keyboard doesn't hide content
- ✅ Toolbar accessible
- ✅ Image insertion works
- ✅ Formatting on touch

### 3. Tablet Browsers

```bash
npm run test:browser:tablet
```

**Test Matrix:**
- iPad Safari
- Chrome Tablet
- Android Tablet

**Tests:**
- ✅ Split keyboard/content
- ✅ Landscape orientation
- ✅ Touch + keyboard combo
- ✅ Toolbar layout

---

## Security Tests

### 1. XSS Prevention Tests

```bash
npm run test:security:xss
```

**Payloads to test:**

```typescript
const xssPayloads = [
  '<script>alert("xss")</script>',
  '<img src=x onerror="alert(1)">',
  '<svg onload="alert(1)">',
  '<iframe src="javascript:alert(1)">',
  '<a href="javascript:alert(1)">Click</a>',
  '<div onclick="alert(1)">Click</div>',
  '<input onfocus="alert(1)" autofocus>',
  '<body onload="alert(1)">',
  '<img src=x alt=x title=x onerror="/**/alert(1)//">',
  '"><script>alert(1)</script>',
];

describe('XSS Prevention', () => {
  xssPayloads.forEach(payload => {
    it(`should sanitize: ${payload.substring(0, 30)}...`, () => {
      const sanitized = sanitizeContent(payload);
      expect(sanitized).not.toContain('script');
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('onload');
      expect(sanitized).not.toContain('javascript:');
    });
  });
});
```

### 2. CSRF Protection

```bash
npm run test:security:csrf
```

```typescript
it('should reject requests without CSRF token', async () => {
  const response = await fetch('/api/news/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  
  expect(response.status).toBe(403);
});
```

### 3. Rate Limiting

```bash
npm run test:security:ratelimit
```

```typescript
it('should enforce rate limits', async () => {
  for (let i = 0; i < 35; i++) {
    const response = await fetch('/api/news/draft', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', content: '<p>Test</p>' }),
    });
    
    if (i < 30) {
      expect(response.status).toBe(200);
    } else {
      expect(response.status).toBe(429);
    }
  }
});
```

---

## Performance Tests

### 1. Load Testing

```bash
npm run test:performance:load
```

**Artillery Config** (`artillery.yml`):

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      ramp: 5

scenarios:
  - name: "Create Article"
    flow:
      - post:
          url: "/api/news/create"
          json:
            title: "Load Test Article"
            content: "<p>Test content</p>"
            category: "Test"

  - name: "Get Article"
    flow:
      - get:
          url: "/api/news/{{ articleId }}"

  - name: "Auto-save Draft"
    flow:
      - post:
          url: "/api/news/draft"
          json:
            articleId: "{{ articleId }}"
            content: "<p>Auto-saving</p>"
```

### 2. Memory Profiling

```bash
npm run test:performance:memory
```

```typescript
it('should not leak memory during continuous editing', async () => {
  const { result } = renderHook(() => useEditor());
  
  const initialMemory = process.memoryUsage().heapUsed;
  
  for (let i = 0; i < 1000; i++) {
    act(() => {
      result.current.setContent(`<p>Content ${i}</p>`);
    });
  }
  
  const finalMemory = process.memoryUsage().heapUsed;
  const memoryIncrease = finalMemory - initialMemory;
  
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB increase
});
```

### 3. Editor Performance

```bash
npm run test:performance:editor
```

```typescript
it('should handle large documents efficiently', async () => {
  const largeContent = '<p>' + 'Lorem ipsum dolor sit amet. '.repeat(10000) + '</p>';
  
  const startTime = performance.now();
  const { result } = renderHook(() => useEditor({ initialContent: largeContent }));
  const endTime = performance.now();
  
  expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
});
```

---

## Accessibility Tests

### 1. Keyboard Navigation

```bash
npm run test:a11y:keyboard
```

```typescript
describe('Keyboard Navigation', () => {
  it('should navigate toolbar with Tab', () => {
    cy.get('[role="textbox"]').focus();
    cy.focused().should('have.attr', 'role', 'textbox');
    
    cy.get('body').tab();
    cy.focused().should('have.attr', 'aria-label', 'Bold');
  });

  it('should use arrow keys in dropdown', () => {
    cy.get('[role="combobox"]').click();
    cy.get('body').type('{downarrow}');
    cy.focused().should('have.attr', 'role', 'option');
  });
});
```

### 2. Screen Reader

```bash
npm run test:a11y:screenreader
```

```typescript
describe('Screen Reader Support', () => {
  it('should have proper ARIA labels', () => {
    cy.get('[role="textbox"]').should('have.attr', 'aria-label');
    cy.get('[role="button"]').each($button => {
      cy.wrap($button).should('have.attr', 'aria-label');
    });
  });

  it('should announce formatting changes', () => {
    cy.get('[role="status"]').should('have.attr', 'aria-live', 'polite');
  });
});
```

---

## Test Commands

```bash
# Run all tests
npm run test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests
npm run test:e2e

# Security tests
npm run test:security

# Performance tests
npm run test:performance

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch

# Update snapshots
npm run test:update
```

---

## CI/CD Integration

**GitHub Actions** (`.github/workflows/test.yml`):

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Integration tests
        run: npm run test:integration
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Security tests
        run: npm run test:security
      
      - name: Coverage
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Test Coverage Goals

| Type | Target |
|------|--------|
| Unit | 80% |
| Integration | 70% |
| E2E | 60% |
| Overall | 75% |

---

## Troubleshooting Tests

### Test Timeout

Increase timeout:
```typescript
jest.setTimeout(10000);
```

### Flaky Tests

Use explicit waits:
```typescript
cy.contains('Saved', { timeout: 5000 }).should('be.visible');
```

### Memory Issues

Clear between tests:
```typescript
afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
```

