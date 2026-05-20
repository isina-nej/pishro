# Deployment Guide - News Editor

## Pre-Deployment Checklist

- [ ] Run all tests and verify they pass
- [ ] Test editor on Chrome, Firefox, Safari
- [ ] Test on mobile/tablet devices
- [ ] Verify dark mode functionality
- [ ] Check database migrations applied
- [ ] Test auto-save functionality
- [ ] Verify rate limiting
- [ ] Test image upload
- [ ] Check CSP headers
- [ ] Verify authentication/authorization
- [ ] Run security audit
- [ ] Load test the API
- [ ] Backup production database
- [ ] Plan rollback strategy
- [ ] Notify team of deployment
- [ ] Monitor error logs
- [ ] Check performance metrics

---

## Step 1: Environment Setup

### 1.1 Environment Variables

Create `.env.production`:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/database

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com

# Upload Configuration
NEXT_PUBLIC_UPLOAD_MAX_SIZE=5242880
NEXT_PUBLIC_UPLOAD_PATH=/uploads/articles

# Editor Configuration
NEXT_PUBLIC_EDITOR_AUTO_SAVE_INTERVAL=30000
NEXT_PUBLIC_EDITOR_MAX_LENGTH=1000000

# Feature Flags
NEXT_PUBLIC_EDITOR_ENABLED=true
NEXT_PUBLIC_IMAGE_UPLOAD_ENABLED=true
NEXT_PUBLIC_AUTO_SAVE_ENABLED=true

# Security
NEXT_PUBLIC_CSP_ENABLED=true
NEXT_PUBLIC_RATE_LIMIT_ENABLED=true
```

### 1.2 Database Configuration

Ensure MySQL/MariaDB is running and accessible:

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME -e "SELECT 1"
```

---

## Step 2: Database Migration

### 2.1 Apply Pending Migrations

```bash
# Run Prisma migrations
npm run prisma:migrate

# Verify schema
npm run prisma:studio
```

### 2.2 Migrate Existing Data

If migrating from plain text articles:

```bash
# Create backup first
mysqldump -h $DB_HOST -u $DB_USER -p $DB_NAME > backup-$(date +%Y%m%d).sql

# Run migration script with confirmation
npx ts-node scripts/migrate-article-content.ts --confirm

# Verify migration
npm run prisma:studio
```

### 2.3 Rollback Plan

If issues occur:

```bash
# Restore from backup
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME < backup-YYYYMMDD.sql

# Revert migration
npx prisma migrate resolve --rolled-back 20260520082240_add_rich_content_fields
```

---

## Step 3: Build & Test

### 3.1 Production Build

```bash
# Install dependencies
npm ci

# Build project
npm run build

# Verify build
npm run build:check || npm run build
```

### 3.2 Run Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# All tests
npm run test
```

### 3.3 Security Audit

```bash
# Scan dependencies
npm audit

# Fix vulnerabilities (if any)
npm audit fix

# Check for XSS vulnerabilities
npm run audit:xss
```

---

## Step 4: Pre-Production Testing

### 4.1 Staging Deployment

```bash
# Deploy to staging environment
npm run deploy:staging

# Run smoke tests
npm run test:smoke

# Test API endpoints
curl https://staging.yourdomain.com/api/news/health
```

### 4.2 Performance Testing

```bash
# Load test API
npm run test:load -- --concurrent 100 --duration 60

# Check response times
npm run test:performance

# Memory profile
npm run profile:memory
```

### 4.3 Security Testing

```bash
# XSS payload tests
npm run test:security:xss

# SQL injection tests
npm run test:security:sql

# Rate limiting test
npm run test:security:ratelimit
```

---

## Step 5: Production Deployment

### 5.1 Deploy Application

```bash
# Using Docker
docker build -t pishro-editor:latest .
docker push your-registry/pishro-editor:latest

# Or using traditional server
pm2 start npm --name "pishro" -- start

# Verify deployment
pm2 list
```

### 5.2 Configure Reverse Proxy

**Nginx configuration:**

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  
  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;
  
  # SSL certificates
  ssl_certificate /etc/ssl/certs/yourdomain.crt;
  ssl_certificate_key /etc/ssl/private/yourdomain.key;
  
  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  
  # Proxy to Node.js
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

### 5.3 Enable SSL/TLS

```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d yourdomain.com
certbot renew --dry-run  # Test auto-renewal
```

---

## Step 6: Monitoring & Logging

### 6.1 Application Monitoring

```bash
# Start monitoring
npm run monitor

# View logs
pm2 logs pishro

# Monitor health
curl https://yourdomain.com/api/health
```

### 6.2 Error Tracking

Set up Sentry or similar:

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/123456",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 6.3 Performance Monitoring

```bash
# View Core Web Vitals
npm run check:web-vitals

# Monitor database performance
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME -e "SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST"
```

---

## Step 7: Backup & Recovery

### 7.1 Automated Backups

```bash
# Daily backup
0 2 * * * mysqldump -h $DB_HOST -u $DB_USER -p $DB_NAME | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Weekly upload to cloud
0 3 * * 0 aws s3 sync /backups s3://your-backup-bucket/
```

### 7.2 Disaster Recovery

```bash
# List available backups
ls -la /backups/

# Restore from backup
gunzip < /backups/db-YYYYMMDD.sql.gz | mysql -h $DB_HOST -u $DB_USER -p $DB_NAME
```

---

## Step 8: Documentation

### 8.1 Deployment Summary

Create `DEPLOYMENT.md`:

```markdown
# Production Deployment Summary

**Date**: 2026-05-20
**Version**: 1.0.0
**Environment**: Production

## Changes
- Rich text editor with TipTap integration
- Auto-save with 30-second debounce
- Server-side sanitization (XSS protection)
- Rate limiting on API endpoints
- Database schema updates

## Database Migrations
- Migration: 20260520082240_add_rich_content_fields
- Status: Applied
- Previous backup: backup-20260520.sql

## API Changes
- New: POST /api/news/create
- New: POST /api/news/draft
- New: PUT/PATCH /api/news/[id]/update
- New: POST /api/news/[id]/publish
- New: GET /api/news/[id]

## Rollback Plan
If issues occur:
1. Stop application: `pm2 stop pishro`
2. Restore database: See Backup & Recovery section
3. Revert code to previous version
4. Restart: `pm2 start pishro`

## Monitoring
- Error tracking: Sentry
- Performance: New Relic
- Uptime: UptimeRobot
- Logs: /var/log/pishro/

## Contact
DevOps Team: devops@yourdomain.com
```

### 8.2 Runbook

Create operational runbook for common issues:

```markdown
# Operations Runbook

## Issue: API Rate Limit Exceeded

**Symptoms**: Users getting 429 errors

**Solution**:
1. Check current rate limits in `lib/api-security.ts`
2. Increase limits if needed
3. Redeploy application
4. Monitor error logs

## Issue: Auto-Save Not Working

**Symptoms**: Drafts not being saved

**Solution**:
1. Check API logs: `pm2 logs pishro`
2. Verify database connectivity
3. Check rate limiting settings
4. Clear browser cache and try again

## Issue: Image Upload Failing

**Symptoms**: Image upload returns 500 error

**Solution**:
1. Check upload directory permissions: `ls -la /public/uploads/articles/`
2. Verify disk space: `df -h`
3. Check file permissions: `chmod 755 /public/uploads/articles/`
4. Restart application: `pm2 restart pishro`
```

---

## Step 9: Post-Deployment Verification

### 9.1 Functionality Tests

```bash
# Test API endpoints
curl -X POST https://yourdomain.com/api/news/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"<p>Test</p>","category":"Test"}'

# Test image upload
curl -F "file=@test.jpg" https://yourdomain.com/api/news/upload-image

# Test auto-save
curl -X POST https://yourdomain.com/api/news/draft \
  -H "Content-Type: application/json" \
  -d '{"title":"Draft","content":"<p>Test</p>"}'
```

### 9.2 Security Verification

```bash
# Check security headers
curl -I https://yourdomain.com
# Should include: X-Content-Type-Options, X-Frame-Options, CSP, etc.

# Test CSP
curl https://yourdomain.com | grep -i "Content-Security-Policy"

# Verify HTTPS
curl https://yourdomain.com -v | grep "SSL"
```

### 9.3 Performance Checks

```bash
# Check response time
time curl https://yourdomain.com/api/news/health

# Check database connection
npm run check:db

# Monitor memory usage
pm2 monit
```

---

## Step 10: Communication & Documentation

### 10.1 Notify Team

Send deployment notification:

```markdown
🚀 **News Editor Deployed to Production**

**When**: May 20, 2026, 10:00 AM UTC
**What**: Rich text editor for news articles
**New Features**:
- Full HTML formatting support
- Auto-save every 30 seconds
- Server-side XSS protection
- Rate limiting on API endpoints
- Dark mode support

**API Changes**:
- New endpoints for create/update/publish/get articles
- Draft management API
- Image upload endpoint

**Documentation**:
- API Docs: https://docs.yourdomain.com/api
- Component Docs: https://docs.yourdomain.com/components
- User Guide: https://docs.yourdomain.com/guide

**Support**: devops@yourdomain.com
```

### 10.2 Update Documentation

- Update README with new features
- Add to API documentation
- Update user guides
- Create troubleshooting guide

---

## Performance Optimization

### Memory Optimization

```javascript
// Implement connection pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

### Caching Strategy

```javascript
// Cache sanitization rules
const sanitizationCache = new Map();

function getCachedSanitizationRules() {
  if (sanitizationCache.has('rules')) {
    return sanitizationCache.get('rules');
  }
  const rules = buildSanitizationRules();
  sanitizationCache.set('rules', rules);
  return rules;
}
```

### Database Optimization

```sql
-- Add indexes for faster queries
ALTER TABLE NewsArticle ADD INDEX idx_draft (draft);
ALTER TABLE NewsArticle ADD INDEX idx_published (published);
ALTER TABLE NewsArticle ADD INDEX idx_publishedAt (publishedAt);
```

---

## Troubleshooting Common Issues

### Database Connection Error

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME -e "SELECT 1"

# Check environment variables
echo $DATABASE_URL

# Verify credentials
mysql -h localhost -u root -p -e "SHOW DATABASES"
```

### Out of Memory

```bash
# Increase Node.js heap size
NODE_OPTIONS=--max_old_space_size=4096 npm start

# Or in pm2
pm2 start npm --max_memory_restart 500M -- start
```

### Rate Limiting Too Strict

Edit `lib/api-security.ts`:

```typescript
const RATE_LIMIT_MAX = {
  draft: 60,      // Increase from 30
  upload: 20,     // Increase from 10
  create: 10,     // Increase from 5
  default: 120,   // Increase from 60
};
```

---

## Rollback Procedure

If critical issues occur:

```bash
# 1. Stop application
pm2 stop pishro

# 2. Restore database
gunzip < /backups/db-YYYYMMDD.sql.gz | mysql -h $DB_HOST -u $DB_USER -p $DB_NAME

# 3. Restore previous code
git checkout previous-tag
npm ci
npm run build

# 4. Restart application
pm2 start pishro

# 5. Verify
curl https://yourdomain.com/api/health
```

---

## Support & Escalation

**Escalation Path**:
1. First attempt: Check logs and error tracking
2. Second attempt: Review deployment documentation
3. Escalate: Contact DevOps team
4. Critical: Invoke rollback procedure

**Contact Information**:
- DevOps: devops@yourdomain.com
- On-call: +1-xxx-xxx-xxxx
- Slack: #devops-alerts

