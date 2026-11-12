# Pishro audit — 2026-11-12

Scope: targeted source review of high-risk authentication, payment, SMS, deployment and infrastructure paths. This is NOT a comprehensive penetration test; live server and database were not accessed.

## Changes in this patch

- Production payment initiation and verification reject the simulated gateway and sandbox configuration; unverified callbacks remain pending.
- Production SMS never falls back to a mock delivery; provider failures are propagated. OTP and SMS bodies are no longer printed by the common SMS client.
- Signup and password-reset APIs wait for SMS provider acknowledgement before returning success.
- Admin refresh is accessible without a valid access JWT; the handler still verifies the refresh JWT and active admin account.
- Docker MySQL credentials must be explicitly supplied and host port is loopback-only. Compose service installs use npm ci, including tsx needed by the backup job.
- Added regression tests covering the payment and SMS safety policies.

## Outstanding issues, prioritized

1. **High**: login and OTP throttles use per-process Maps, ineffective with more than one app instance. Replace with persistent atomic Redis/MySQL counters and add IP/account throttles.
2. **High**: admin tokens are returned to JavaScript/localStorage and JWT logout has no server-side revocation. Add rotation, revocation and role/account status checks.
3. **High**: audit all authorization checks and object ownership in admin/user APIs, uploads and video streaming, and add CSRF/origin validation for cookie-authenticated writes.
4. **Medium**: CI skips several integration tests when no MySQL instance is running. Add MySQL service, seeded migrations and E2E tests for authentication, payment and uploads.
5. **Medium**: compose still installs packages at service startup; build pinned images and replace shallow health checks. Verify backup schedule and restore backups regularly.
6. **Medium**: pull-based production deployment stops PM2 before building, causing downtime and weakening rollback. Use atomic release directories and health-gated switch.
7. **Medium**: restrict production CORS origins, review the 550MB middleware request limit, use anti-SSRF controls for remote media, scan dependencies and rotate exposed secrets.

## Deployment checklist

- [ ] Set unique strong `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, `NEXTAUTH_SECRET`, `ADMIN_JWT_SECRET` and `VIDEO_TOKEN_SECRET`.
- [ ] Confirm DATABASE_URL uses the same app password; bind MySQL to localhost or an internal Docker-only network.
- [ ] Use a real configured SMS gateway and real non-sandbox payment gateway in production.
- [ ] Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` in CI.
- [ ] Backup and migrate database; test auth, OTP, payment callback, uploads and rollback in staging before production deployment.
- [ ] Monitor errors, failed SMS, payment status, backups, disk and memory.

## Additional critical authorization findings

- Previously unauthenticated public-library mutations now require ADMIN.
- File-serving APIs deny direct access to private backups, raw videos, temporary and HLS objects, even when the underlying S3 client can read them.
- Published free books and admin previews remain readable; paid books require a future entitlement model and are intentionally not accessible through generic download routes.
- Private content is no longer sent with public immutable cache headers in the legacy book route.
