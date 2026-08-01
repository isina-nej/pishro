# Pishro Platform — Implementation Roadmap

**Source:** `REMEDIATION_PLAN.md` (21 items derived from `ARCHITECTURE_REVIEW.md`).
**Purpose:** turn the remediation plan into shippable, PR-sized batches with exact steps, so each batch can be picked up, executed, and deployed independently with minimal risk to a live production system.
**Status:** planning only — no code has been changed as part of this document.
**Unit of work:** a "batch" here is sized to be one PR / one deploy. Batches within a phase are ordered; batches across phases generally should not be parallelized ahead of their phase's prerequisites (see each phase's intro), but batches *within* a phase can sometimes run in parallel across engineers once their own listed dependencies are satisfied — this is called out per batch.

**Known deployment facts used throughout this doc** (confirm current values before executing):
- Local/dev DB is provisioned via `docker-compose.yml`, which mounts `./prisma/migrations` into MySQL's `docker-entrypoint-initdb.d` — this **only runs on first container initialization against an empty data volume**. It does **not** apply new migrations to an already-running database (dev, staging, or production) with existing data. Every batch below that includes a migration must be applied to a live database via `npx prisma migrate deploy` (production/staging) or `npx prisma migrate dev` (local), never assumed to "just apply" via container restart.
- No feature-flag system is present in this codebase today. Where a staged/canary rollout is recommended below, it means environment-based staged deploment (staging → canary/subset → full production) and close monitoring, not a runtime flag — introducing a formal feature-flag system is out of scope for this roadmap.
- Standard verification commands available: `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run test:unit`, `npm run build`.

---

## Phase 1: Critical Security Fixes (P0)

**Phase goal:** close the five actively-exploitable production issues identified in the review, plus their one hard prerequisite (`.env.example`), with the smallest possible set of changes per batch so each can be reviewed, tested, and shipped fast.

**Phase-level sequencing:** Batch 1.1 (debug routes) has no dependencies and should ship first, same day, independently of everything else. Batch 1.2 (`.env.example` + credential fallback) must ship — and be verified against every environment — before Batch 1.3 relies on any environment-config assumptions, though in practice 1.2 and 1.3 can be developed in parallel and merged in either order as long as 1.2's environment audit happens before 1.2's own deploy. Batch 1.3 (checkout + payment) must ship as a single unit — do not deploy the checkout fix without the payment fix or vice versa, since they are one exploit chain. Batch 1.4 (XSS) is fully independent and can be developed/shipped in parallel with any other Phase 1 batch.

**Do not parallelize Phase 1 with Phase 2, 3, or 4 work touching the same files** (e.g., don't have someone refactoring `app/api/checkout/route.ts` for Phase 3 performance work while Batch 1.3 is in flight).

---

### Batch 1.1 — Remove/Lock Down Debug Endpoints

**Goal**
Eliminate the unauthenticated, production-reachable `app/api/debug/*` surface (16 routes), including a destructive `deleteMany` handler and multiple data-leaking/reconnaissance handlers.

**Exact implementation steps**
1. `find app/api/debug -name route.ts` to get the authoritative list of all 16 files.
2. For each file, `grep -rn "<route-path-segment>" app components lib scripts` to confirm zero production callers (expected: zero for all of them — these are dev-only conveniences).
3. Ask in the team channel/PR description whether anyone relies on any of these locally (e.g., `debug/seed-courses` as a manual dev-seeding shortcut) — give a short window (same day) before merging, since this is a deletion that can't be silently un-discovered later if someone's local workflow breaks.
4. Delete the entire `app/api/debug/` directory.
5. Run `npm run lint` and `npx tsc --noEmit` to confirm no dangling imports reference the deleted routes.
6. Run `npm run build` locally to confirm the route tree builds clean without them.
7. If any handler's *logic* (not the HTTP endpoint) is still wanted for local dev convenience, port it into a standalone script under `scripts/` invoked via `tsx scripts/<name>.ts`, run manually — never as an HTTP route.

**Files to change**
- Delete: `app/api/debug/**` (all 16 `route.ts` files and the directory itself)
- Optional additions: `scripts/dev-seed-courses.ts` etc., only if step 7 is needed

**Dependencies**
None. Can start immediately, in parallel with all other Phase 1 batches.

**Database migration requirements**
None. (Note: `app/api/debug/clear/route.ts` currently runs `prisma.digitalBook.deleteMany({})` against the live schema — deleting the route removes the risk; no schema change needed.)

**Testing strategy**
- Static: `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass with the directory removed.
- Manual: after deploy, `curl` a sample of the deleted endpoints (e.g., `GET /api/debug/db-status`, `GET /api/debug/clear`) against staging and confirm 404, not 200.
- No new automated test is needed for a deletion; if the team wants a regression guard, add a CI step that fails the build if any file matching `app/api/debug/**` exists (prevents recurrence).

**Rollback strategy**
Trivial — `git revert` the deletion commit. Since these routes have no production callers, reverting has zero user-facing impact either direction (the fix is purely subtractive and safe to revert if, against expectation, something breaks).

**Deployment considerations**
- No feature flag or staged rollout needed — this is a strict risk-reduction deletion with no legitimate traffic to disrupt.
- Deploy standalone, don't bundle with other changes, so its (trivial) rollback stays trivial and isolated.
- After deploy, verify with a WAF/CDN log check (if available) that no external traffic was hitting these paths — useful signal for whether this was already being probed.

---

### Batch 1.2 — Environment Configuration Hardening (`.env.example` + remove hardcoded DB credential fallback)

**Goal**
Document every required environment variable, then make the app fail fast and loudly at startup if required DB credentials are missing, instead of silently falling back to a hardcoded default password.

**Exact implementation steps**
1. Enumerate every env var reference: `grep -rho "process\.env\.[A-Z_][A-Za-z0-9_]*" --include=*.ts --include=*.tsx . | sort -u`.
2. Group results by concern (Database, NextAuth, Admin JWT, S3/object storage, Zarinpal, Melipayamak/SMS, misc) matching the mental model already in `CLAUDE.md`.
3. Write `.env.example` at repo root with each variable name, a one-line purpose comment, and a non-functional placeholder value (never a real value).
4. Add a one-line pointer to `.env.example` in `README.md`.
5. **Before touching `lib/db.ts`:** audit every environment that runs this app (local dev, CI, staging, production) and confirm each has real, non-default values set for `DB_USER`, `DB_PASSWORD`, `DB_NAME`. This is the step most likely to be skipped under time pressure — do not skip it.
6. In `lib/db.ts`, remove the `|| 'root'`, `|| 'pishro_password'`, `|| 'pishro'` fallback expressions. Add an explicit startup assertion (throw a clear error naming the missing variable) if any of `DB_USER`/`DB_PASSWORD`/`DB_NAME`/`DB_HOST` is unset, executed at module load time (so failure happens at boot, not at first query).
7. Run `npm run dev` locally with a deliberately-unset `DB_PASSWORD` to confirm the app now fails immediately with a clear error message, not a silent connection using the old default.
8. Restore local `.env`/`.env.local` and confirm normal startup still works.

**Files to change**
- New: `.env.example`
- `README.md` (pointer to `.env.example`)
- `lib/db.ts` (remove fallback expressions, add startup assertion)

**Dependencies**
None to start (steps 1–4 are pure documentation). Step 6 (the actual code change) should not merge until step 5's environment audit is complete and confirmed by whoever owns each environment (local dev leads, CI config owner, staging/production deploy owner).

**Database migration requirements**
None — this is connection-configuration only, no schema change.

**Testing strategy**
- Manual boot test (step 7 above) is the primary verification — this is fundamentally a "does the app fail correctly when misconfigured" test, which automated unit tests don't naturally cover well.
- If a lightweight integration test harness exists for `lib/db.ts`, add a case asserting module load throws when `DB_PASSWORD` is unset (mock `process.env`).
- `npm run test` full suite should still pass with real env vars set (sanity check that nothing else silently depended on the old fallback values, e.g., a test fixture assuming `database: 'pishro'` by default).

**Rollback strategy**
- `.env.example`/`README.md` changes: trivial revert, no risk either direction.
- `lib/db.ts` change: revert is a single-file `git revert`. If reverted, the app returns to the previous (fallback-permissive) behavior — safe from an availability standpoint, but re-opens the credential-fallback risk, so treat a rollback here as "buy time to fix the real env issue," not a resolution.

**Deployment considerations**
- **This is the one Phase 1 change with real outage risk if step 5 is skipped.** Deploy to staging first; confirm clean boot. Then deploy to production during a low-traffic window with the on-call engineer aware, specifically watching startup logs for the new assertion firing.
- Have the previous `lib/db.ts` version ready to redeploy immediately (standard rollback readiness) in case an environment was missed in the audit.
- Communicate the change to whoever manages production environment variables *before* deploying, not after — this should not be a surprise to infra/ops.

---

### Batch 1.3 — Checkout & Payment Integrity Fix

**Goal**
Close the free-enrollment exploit chain: (a) `checkout` currently trusts a client-supplied `userId` with no session check, and (b) `payment/verify` currently marks any order `PAID` based on a client-supplied `Status=OK` query parameter with no real Zarinpal signature verification. Ship both together — fixing one without the other leaves the chain exploitable via the remaining half.

**Exact implementation steps**

*Checkout auth (do first within this batch):*
1. In `app/api/checkout/route.ts`, replace the body-supplied `userId` with `const session = await auth(); if (!session?.user?.id) return unauthorized();` — model directly on the existing correct pattern in `app/api/user/pay/route.ts`.
2. Use `session.user.id` as the order's `userId` everywhere in the handler; do not fall back to any body-supplied value even if present.
3. Update any frontend call site (`components/checkout/**`) that currently sends `userId` in the request body — safe to leave temporarily (harmless once the backend ignores it) but clean up in the same PR to avoid confusion about the real trust boundary.

*Payment verification (do second within this batch, depends on checkout's order data being trustworthy):*
4. Locate and re-enable the currently-commented-out real Zarinpal authority/signature verification code in `app/api/payment/verify/route.ts`.
5. Confirm which Zarinpal SDK is actually intended to be live — the project has both `zarinpal-node-sdk` and `zarinpal-nodejs` installed; pick one, remove/ignore the other's usage if present, and note the decision in the PR description.
6. Rewrite the handler to: (a) look up the order server-side by ID, (b) independently re-derive the expected amount/authority from the database — never trust a client-supplied amount, (c) call Zarinpal's verification API server-to-server with that authority, (d) only mark `PAID` and create the enrollment if Zarinpal's response confirms success.
7. Add an idempotency guard: if the order is already `PAID`, return success without re-processing/re-enrolling.
8. Add explicit handling for Zarinpal failure/timeout/already-verified responses — do not let an ambiguous gateway response default to "treat as paid."

*Testing (do before merge, not after):*
9. Write a regression test asserting a request to `payment/verify` with `Status=OK` and a fabricated/invalid authority is rejected — this is the exact currently-exploitable case, and it must be red before the fix and green after.
10. Test the full flow against Zarinpal's sandbox/test environment end-to-end in a non-production environment: real checkout → real (sandbox) payment → real verification round-trip.

**Files to change**
- `app/api/checkout/route.ts`
- `app/api/payment/verify/route.ts`
- `components/checkout/**` (whichever component(s) currently send `userId` in the checkout request body)
- Zarinpal SDK integration module (wherever the client is instantiated/called from)
- New/updated test file(s) under `tests/` covering both the auth check and the signature-verification rejection case

**Dependencies**
Should ship after Batch 1.2's environment audit if Zarinpal credentials are part of that env-var sweep (confirm `.env.example` includes the Zarinpal keys). Otherwise independent of other Phase 1 batches — but internally, item (a) checkout-auth must land before or atomically with item (b) payment-verify, not after.

**Database migration requirements**
None expected — this fix operates on existing `Order`/`Transaction`/`Enrollment` tables and columns. If the idempotency guard (step 7) requires a new state that the current schema can't express (e.g., a `verifiedAt` timestamp doesn't exist), add it as a small additive migration (`ALTER TABLE Order ADD COLUMN ...`), non-destructive and backward-compatible.

**Testing strategy**
- Unit/integration: the regression test from step 9 is mandatory and must be reviewed as carefully as the fix itself.
- End-to-end against Zarinpal sandbox (step 10) is mandatory before this batch is considered done — do not accept "unit tests pass" alone as sign-off for a payment-integrity fix.
- Manual QA pass: place a real (sandbox) order end-to-end in staging, confirm correct order status transitions (`PENDING` → `PAID`), correct enrollment creation, and correct rejection of a manually-crafted bad `Status=OK` request.
- Load/idempotency check: call `payment/verify` twice for the same already-paid order and confirm no duplicate enrollment/side effects.

**Rollback strategy**
- Both files can be reverted independently via `git revert`, but **must be reverted together** if rolled back at all — reverting only the payment-verify fix while keeping the checkout-auth fix is safe (checkout still requires a session; verify goes back to the old behavior, which is bad but no worse than before). Reverting only the checkout-auth fix while keeping the payment-verify fix is also safe in isolation. Reverting both returns to the pre-fix state, which is known-bad — only do this if the fix itself is causing a production incident (e.g., legitimate payments failing to verify), and treat it as an emergency, not a routine rollback.
- Keep the previous route handlers available in version control for fast redeploy; this is the highest-risk batch in the entire roadmap, so rollback readiness should be explicitly rehearsed (know the exact `git revert` commands before deploying, don't figure them out during an incident).

**Deployment considerations**
- **Staged rollout, not big-bang.** Deploy to staging first, run the full Zarinpal sandbox flow (step 10), then deploy to production during a low-traffic window with an engineer actively monitoring the first real transactions.
- Set up (even if manual/ad hoc) monitoring on order-status transition rates and payment-verification success/failure rates for the first 24–48 hours post-deploy — a spike in verification failures could mean either the fix is working correctly (blocking previously-successful fraud) or a bug is rejecting legitimate payments; you need to be able to tell these apart quickly.
- Have a support/ops contact aware of the deploy window in case real customers report checkout issues immediately after — this is the one Phase 1 change most likely to generate a support ticket if something is subtly wrong.
- Communicate to finance/business stakeholders that this fix may reveal historical fraudulent "free" enrollments obtained via the old bypass — decide in advance (not during deploy) whether/how to audit and potentially revoke those retroactively; that's a business decision, not an engineering one, but engineering should flag it before shipping so it isn't a surprise.

---

### Batch 1.4 — News Content XSS Sanitization

**Goal**
Close the stored-XSS gap by sanitizing article HTML at render time with DOMPurify, rather than relying solely on the weak, bypassable regex sanitizer applied once at content-creation time.

**Exact implementation steps**
1. Confirm `isomorphic-dompurify` is already a dependency (it is — used in `lib/markdown-processor.ts`) and review that file's usage pattern as the reference implementation.
2. In `components/news/NewsArticleDetail.tsx`, wrap the value passed to `dangerouslySetInnerHTML` with `DOMPurify.sanitize(article.content)` (server-safe via `isomorphic-dompurify`).
3. Apply the identical change in `components/news/NewsDetail.tsx`.
4. Add a regression test asserting a known XSS payload (e.g., `<img src=x onerror=alert(1)>`, `<script>alert(1)</script>`) is stripped from the rendered output at both call sites.
5. Manually spot-check a sample of existing published articles in staging after the change to confirm no legitimate rich content (tables, embeds, formatting) is being stripped by DOMPurify's default config — adjust the allowed-tags/attributes config only if a real regression is found, don't pre-emptively widen it.
6. Leave `lib/sanitize-content.ts` (the weak creation-time sanitizer) in place for this batch — do not remove it here. Flag it explicitly in the PR description as a follow-up removal candidate once render-time sanitization is confirmed sufficient in production (tracked under Phase 4/technical debt, not this urgent fix, to keep this batch's blast radius minimal).

**Files to change**
- `components/news/NewsArticleDetail.tsx`
- `components/news/NewsDetail.tsx`
- New/updated test file under `tests/` (e.g., alongside the existing `tests/lib/sanitize-content.test.ts`, add a render-path test)

**Dependencies**
None — fully independent of every other Phase 1 batch, can ship in parallel with any of them.

**Database migration requirements**
None. This is a render-time fix; no data is modified or migrated.

**Testing strategy**
- Automated: the XSS-payload regression test (step 4) is the core test — it must fail against the pre-fix code and pass after.
- Manual: spot-check existing articles for visual regressions (step 5) in staging before production deploy.
- Existing `tests/lib/sanitize-content.test.ts` should continue passing unchanged (this fix adds a layer, it doesn't remove the existing one in this batch).

**Rollback strategy**
Trivial single-file-pair revert via `git revert`. Reverting removes the added safety layer but does not reintroduce any *new* risk beyond the pre-existing (already-documented) gap — safe to revert without urgency if, unexpectedly, DOMPurify's default sanitization breaks legitimate article rendering in a way that can't be quickly config-tuned.

**Deployment considerations**
- Low-risk, standard deploy — no special staging beyond the standard staging-then-production flow and the manual spot-check in step 5.
- No customer communication needed; this is a defensive fix with no user-visible behavior change for legitimate content.
- Good candidate to bundle with Batch 1.1 in the same deploy window if convenient, since both are low-risk/independent — but keep them as separate commits/PRs for clean rollback isolation.

---

## Phase 2: Authentication and Authorization Hardening

**Phase goal:** close the remaining defense-in-depth gaps around the admin auth boundary — token lifecycle, CSRF, security headers, rate limiting, and the drifted CORS/rate-limiter duplication — now that the acute Phase 1 exploits are closed.

**Phase-level sequencing:** Batch 2.1 (token hardening) is sequenced first within this phase because it's explicitly more valuable once Batch 1.4 (XSS fix, Phase 1) has closed the one identified token-theft vector — hardening a lock is most valuable once the door next to it is shut. Batches 2.2 (CSRF) and 2.3 (security headers) have no hard dependency on 2.1 and can run in parallel with it or with each other. Batch 2.4 (rate-limiting infrastructure) should land before Batch 2.5 (CORS/rate-limiter consolidation), since 2.5's rate-limiter half depends on the shared-store implementation 2.4 introduces.

**This phase should not start until all of Phase 1 is deployed and stable** (at minimum a few days of quiet production monitoring after Batch 1.3), since several Phase 2 batches touch the same admin-auth and middleware code paths that Phase 1 doesn't touch directly, but a phase-wide "let Phase 1 settle" buffer reduces the chance of attributing a Phase 2 regression to the wrong change.

---

### Batch 2.1 — Admin Token Lifecycle Hardening

**Goal**
Reduce the exposure window and add real server-side revocation capability for admin JWTs, given the access token is deliberately non-httpOnly and there is currently no way to invalidate a stolen or logged-out token before its natural expiry.

**Exact implementation steps**
1. **Step A (ship first, standalone, near-zero risk):** reduce `ADMIN_TOKEN_EXPIRY` default from 24h to a shorter window (e.g., 1–2h), forcing more frequent silent refresh. This requires no schema change and can ship independently ahead of Step B if the team wants an immediate, low-effort risk reduction while Step B is developed.
2. **Step B (the real fix):** add a `tokenVersion` (or `revokedAt`) integer/timestamp column to the `AdminUser` Prisma model.
3. Update JWT issuance (`lib/admin-auth.ts`) to embed the current `tokenVersion` in every issued access/refresh token.
4. Update verification (`lib/admin-jwt.ts`, used by `middleware.ts`) to look up the admin's current `tokenVersion` from the database and reject the token if it doesn't match — this adds one DB lookup to the verification path; confirm this doesn't meaningfully regress middleware latency (Edge-safe verification currently avoids DB calls — this is an architecturally meaningful change, benchmark it).
5. Increment `tokenVersion` on logout (`app/api/admin/auth/logout/route.ts`) so a logged-out token can no longer authenticate even if replayed.
6. Increment `tokenVersion` on refresh (`app/api/admin/auth/refresh/route.ts`) so old refresh tokens are invalidated the moment a new pair is issued — turning today's "rotation in name only" into real rotation.
7. Add an internal admin-only "revoke all sessions for this admin" action (increment `tokenVersion` directly) for incident-response use, even if there's no UI for it yet — a script or a protected internal endpoint is sufficient for v1.

**Files to change**
- `prisma/schema.prisma` (`AdminUser` model — new field)
- New Prisma migration
- `lib/admin-auth.ts`
- `lib/admin-jwt.ts`
- `app/api/admin/auth/login/route.ts` (set `ADMIN_TOKEN_EXPIRY` default; embed version on issuance)
- `app/api/admin/auth/refresh/route.ts`
- `app/api/admin/auth/logout/route.ts`
- `middleware.ts` (if the DB-lookup verification call changes how/where verification happens relative to Edge runtime constraints — confirm `lib/admin-jwt.ts`'s Edge-safety assumptions still hold once a DB call is added; this may require moving the version check to a Node.js runtime route instead of Edge middleware if Edge can't reach the DB directly)

**Dependencies**
Sequenced after Batch 1.4 (see phase intro). Step A has no further dependency and can ship any time. Step B depends on the schema migration being applied (see below) before the code that reads/writes `tokenVersion` is deployed — standard migrate-before-deploy-code ordering.

**Database migration requirements**
Yes — additive, non-destructive: `ALTER TABLE AdminUser ADD COLUMN tokenVersion INT NOT NULL DEFAULT 0` (or equivalent via `prisma migrate dev --name add_admin_token_version`). Safe on a live table of AdminUser's expected small size (admin accounts, not customer-scale). Apply via `npx prisma migrate deploy` against staging, then production — **not** via container re-initialization (see roadmap-level note above).

**Testing strategy**
- Unit tests on `lib/admin-jwt.ts` verification logic: token with correct version passes, token with stale version is rejected.
- Integration test: log in → log out → replay the old access token → assert 401.
- Integration test: refresh → replay the old (pre-refresh) refresh token → assert rejection.
- Latency check: benchmark middleware verification time before/after adding the DB lookup, on a representative admin request volume, to confirm no unacceptable regression (this is the one step in this batch most likely to surface a surprise).
- Extend `tests/admin-jwt-middleware.test.ts` (already exists) with the above cases rather than creating a parallel test file.

**Rollback strategy**
- Code rollback (`git revert` on the auth files) is safe and independent of the migration — the `tokenVersion` column, if left in place after a code rollback, is simply unused (harmless).
- The migration itself does not need a "down" migration for a safe rollback — an additive column with a default value doesn't break anything if the code that used it is reverted.
- If Step A alone (shorter TTL) causes unexpected admin-session-thrashing complaints, it can be reverted independently and immediately without touching Step B.

**Deployment considerations**
- Deploy the migration first, verify it applied cleanly in staging and production, *then* deploy the code that depends on it — never the reverse order.
- If the Edge-runtime DB-access constraint in step 4 turns out to be a real blocker (Edge middleware often can't make arbitrary DB calls), this may require moving verification into a Node.js-runtime API route called from middleware, or caching `tokenVersion` lookups briefly (e.g., a short-TTL in-memory or Redis cache keyed by admin ID) to bound the added latency — resolve this design question during implementation, not at deploy time.
- Monitor admin login/session-related support tickets for the first few days after Step A ships (shorter TTL is the most likely to generate "I keep getting logged out" feedback).

---

### Batch 2.2 — CSRF / Origin Validation on Admin Mutations

**Goal**
Add a second layer of CSRF defense (explicit `Origin` header validation) to state-changing admin routes, since the current defense relies entirely on `SameSite=Lax` cookie behavior with no server-side origin check.

**Exact implementation steps**
1. Audit every route under `app/api/admin/*` that handles `POST`/`PUT`/`PATCH`/`DELETE` and determine which rely on ambient cookie auth vs. explicitly sending the Bearer token read from the non-httpOnly access-token cookie (Bearer-pattern routes are already CSRF-immune by construction — prioritize the audit on cookie-only routes).
2. Implement a shared `Origin` validation helper (in `middleware.ts` or a function it calls) that checks the request's `Origin` header, when present, against the app's configured allowed origin(s) — reject with 403 if present and mismatched. When `Origin` is absent (some legitimate same-origin requests omit it), fall back to allowing the request (don't break legitimate traffic on this ambiguous case) but log it for visibility.
3. Wire this check into `middleware.ts`'s existing admin-route matcher path, so it applies uniformly rather than per-route.
4. Confirm no legitimate non-browser callers (internal scripts, health checks, CI) are broken by the new check — if any exist, explicitly allowlist them (e.g., via a distinct internal API key mechanism) rather than weakening the check for everyone.
5. Reconcile the allowed-origin source with whatever list Batch 2.5 (CORS consolidation) eventually settles on — ideally implement this against the *same* canonical origin list from the start, rather than adding a third independent origin list.

**Files to change**
- `middleware.ts`
- Possibly a new shared helper module (e.g., `lib/origin-check.ts`) if the logic is non-trivial enough to warrant extraction
- Any admin route handler found in step 1 to rely on ambient-cookie-only auth without Bearer-token usage (fix pattern inconsistency if found, or explicitly accept the risk with a documented reason)

**Dependencies**
No hard dependency on other Phase 2 batches, but strongly recommend coordinating with Batch 2.5 on the canonical origin list (see step 5) to avoid a third divergent source of truth.

**Database migration requirements**
None.

**Testing strategy**
- Integration test: admin mutation request with a mismatched `Origin` header is rejected (403).
- Integration test: admin mutation request with a matching `Origin` header succeeds.
- Integration test: admin mutation request with no `Origin` header (legitimate same-origin case) succeeds, confirming the fallback in step 2 doesn't over-block.
- Manual QA: exercise the actual admin UI (create/edit course, news, etc.) end-to-end in staging to confirm no legitimate admin action is blocked.

**Rollback strategy**
Single-file (`middleware.ts` + helper) revert via `git revert`. No data/schema involved — fully safe to revert instantly if legitimate admin traffic is unexpectedly blocked.

**Deployment considerations**
- Deploy to staging and have someone manually exercise every major admin write flow (course CRUD, news CRUD, library CRUD, uploads) before production — this is the kind of change most likely to have an untested edge case (an admin flow that, for whatever reason, sends requests cross-origin legitimately, e.g., from an internal tool).
- Roll out with the "no Origin header → allow" fallback intentionally permissive at first; revisit tightening it (reject missing-Origin too) as a follow-up once confident no legitimate traffic depends on the fallback, rather than risking a big-bang strict rollout.

---

### Batch 2.3 — Global Security Headers & CSP

**Goal**
Apply the existing `securityHeaders`/`addSecurityHeaders` (currently wired into only 2 of 150 routes) platform-wide, closing the clickjacking (`X-Frame-Options`) gap and giving every response at least the current baseline CSP, without yet attempting the larger `'unsafe-inline'` removal project.

**Exact implementation steps**
1. Move header application from per-route imports into `next.config.ts`'s `headers()` function (preferred — applies to all responses including static assets/pages without per-route code) or, if per-route conditional logic is needed, into `middleware.ts`.
2. Use the existing header values from `lib/api-security.ts` unchanged for this batch — do not attempt to tighten the CSP (remove `'unsafe-inline'`) here; that's flagged explicitly as a larger, separate follow-up effort.
3. Remove the now-redundant per-route `addSecurityHeaders` calls in `app/api/news/draft/route.ts` and `app/api/news/upload-image/route.ts` once the global application is confirmed working (avoids double-applying headers).
4. Deploy to staging and manually verify headers are present on a sample of responses across public pages, admin pages, and API routes (`curl -I` a handful of representative URLs).

**Files to change**
- `next.config.ts` and/or `middleware.ts`
- `lib/api-security.ts` (source of truth for header values, unchanged in this batch)
- `app/api/news/draft/route.ts`, `app/api/news/upload-image/route.ts` (remove now-redundant local calls)

**Dependencies**
None — independent of other Phase 2 batches.

**Database migration requirements**
None.

**Testing strategy**
- Automated: a simple integration test asserting `X-Frame-Options` and `Content-Security-Policy` headers are present on a representative sample of route types (public page, admin page, API route).
- Manual: click through key public flows (home, course browsing, checkout) and key admin flows (login, dashboard, course/news CRUD) in staging with browser devtools open, watching the console for any CSP violation errors that indicate something legitimately depends on a header that's now being enforced more broadly than before (e.g., a third-party embed, an inline script that was previously "invisible" because headers weren't applied to that route).

**Rollback strategy**
Single-file revert. If a CSP violation breaks a legitimate feature (e.g., an iframe embed or inline script the business needs), revert immediately and investigate the specific violation before re-attempting — do not try to "fix forward" under production pressure for a security-header change.

**Deployment considerations**
- Genuinely test every page type in staging before production — this is a global change and the review flagged it as capable of breaking an untested legitimate use (an iframe embed, a previously-unnoticed inline script). Don't skip the manual click-through.
- Consider a brief production canary (deploy to a small percentage of traffic or a single instance first, if the deployment setup supports it) before full rollout, given the "applies to literally every response" blast radius — if no canary mechanism exists, at minimum deploy during a low-traffic window with active monitoring.

---

### Batch 2.4 — Centralized Rate Limiting Infrastructure

**Goal**
Replace the per-process in-memory rate limiter (ineffective across multiple instances) with a shared-store-backed implementation, and extend rate limiting to abuse-prone endpoints (OTP/SMS send, login, checkout, payment-verify, admin writes) that currently have none.

**Exact implementation steps**
1. Confirm deployment topology: is the app already running as multiple instances/serverless, or single-instance today? This determines urgency but not correctness — build for the shared-store case regardless, since single-instance-today doesn't mean single-instance-always.
2. Introduce Redis (or confirm one is already available in the infra) as the shared store. Add a `redis` service to `docker-compose.yml` for local/dev parity if not already present.
3. Implement a new shared rate-limiter function in `lib/api-security.ts` (or a new `lib/rate-limit.ts` if the change is substantial enough to warrant a fresh module) backed by Redis, preserving a similar call-site API to the existing `checkRateLimit(clientId, endpoint)` to minimize churn at call sites.
4. Replace the bespoke in-memory limiter in `app/api/admin/auth/login/route.ts` with a call to the new shared implementation.
5. Add rate limiting to: `app/api/auth/login/route.ts`, `app/api/otp/send/route.ts`, `app/api/sms/send-otp/route.ts`, `app/api/auth/send-sms-otp/route.ts`, `app/api/checkout/route.ts`, `app/api/payment/verify/route.ts`, and all `app/api/admin/*` write endpoints.
6. Tune limits per endpoint by risk/cost profile: SMS-send endpoints should have the tightest limits (direct per-message cost), login endpoints moderate (balance brute-force protection against legitimate retry UX), admin writes generous but present (protect against a compromised/scripted admin session doing damage quickly).
7. Add a fallback behavior decision for Redis unavailability: fail open (allow requests, log loudly) is recommended over fail closed (block all requests) for most endpoints, to avoid an infrastructure blip becoming a full outage — except possibly OTP/SMS-send, where failing closed briefly is more defensible given the direct cost exposure. Make this decision explicit in code and document it in the PR.

**Files to change**
- `lib/api-security.ts` (or new `lib/rate-limit.ts`)
- `app/api/admin/auth/login/route.ts`
- `app/api/auth/login/route.ts`, `app/api/otp/send/route.ts`, `app/api/sms/send-otp/route.ts`, `app/api/auth/send-sms-otp/route.ts`
- `app/api/checkout/route.ts`, `app/api/payment/verify/route.ts`
- All `app/api/admin/*` write endpoints (enumerate via the route inventory from the architecture review — 71 admin routes, filter to non-GET handlers)
- `docker-compose.yml` (if adding Redis)
- New env vars for Redis connection (add to `.env.example` from Batch 1.2)

**Dependencies**
No hard dependency on other Phase 2 batches, but should land before Batch 2.5, which depends on this batch's shared implementation existing.

**Database migration requirements**
None (Redis is not the Prisma-managed MySQL database — no Prisma migration needed). If Redis is genuinely new infrastructure, this does require an infra/ops change (provisioning a Redis instance) that should be tracked and coordinated separately from the application code change.

**Testing strategy**
- Unit tests on the rate-limiter function itself: confirm correct counting, correct window expiry, correct fail-open/fail-closed behavior when Redis is unreachable (mock the Redis client for this).
- Integration test: hit a rate-limited endpoint past its threshold and confirm a 429 (or equivalent) response.
- Load-adjacent test: confirm rate limiting works correctly across what simulates multiple instances (e.g., two separate Node processes in a test harness both hitting the same Redis-backed limiter) — this is the entire point of the fix, so specifically test the multi-instance case, not just single-process behavior.
- Manual: verify legitimate usage patterns (a real user's normal login/checkout flow) don't get throttled — tune limits based on this before finalizing.

**Rollback strategy**
- Code rollback (`git revert`) returns to the previous per-route/in-memory behavior — safe, no data loss, since rate-limit state itself is inherently ephemeral/non-critical.
- If Redis itself becomes a problem (latency, availability) after deploy, the fail-open decision from step 7 should already make this a graceful degradation rather than an outage — but if it isn't behaving that way, reverting the code is a safe immediate mitigation while the Redis issue is investigated separately.

**Deployment considerations**
- Coordinate with whoever provisions infrastructure — this batch has an infra dependency (Redis) that application-code deploy alone can't satisfy; sequence the infra provisioning ahead of the code deploy.
- Roll out rate limiting on new endpoints with generous initial limits and tighten based on observed real traffic patterns over the following weeks, rather than guessing tight limits upfront and risking blocking legitimate users on day one.
- Monitor 429 response rates closely for the first week post-deploy as the primary signal for whether limits are tuned correctly.

---

### Batch 2.5 — CORS & Rate-Limiter Consolidation

**Goal**
Reconcile the two independently-maintained CORS allow-lists (`lib/api-response.ts` and `lib/cors.ts`, already confirmed to have drifted) into one source of truth, and finish retiring the bespoke admin-login rate limiter in favor of Batch 2.4's shared implementation.

**Exact implementation steps**
1. Diff the two CORS allow-lists (`ALLOWED_ORIGINS` in `lib/api-response.ts` vs. the list in `lib/cors.ts`) and document every difference.
2. For each difference, determine with whoever owns deployment/frontend config whether it's intentional (e.g., a CMS preview origin that's genuinely needed in one context but not another) or drift — do not assume either list is "the correct one" by default.
3. Produce a single reconciled origin list. Pick one module as canonical (recommend whichever is structurally more complete/current based on the audit) and have the other delegate to it (re-export or thin wrapper) rather than maintaining two independent lists even temporarily.
4. Grep every call site of both `getCorsHeaders`/`addCorsHeaders` (both modules export similarly-named functions — be careful to distinguish them during the grep) and migrate them to the canonical module.
5. Once all call sites are migrated and verified, delete the non-canonical module's duplicate logic (keep only the delegation/re-export, or remove entirely if no longer imported anywhere).
6. Confirm Batch 2.4 has shipped; if not, block this step. Replace any remaining bespoke rate-limiting logic with the shared implementation from Batch 2.4 (the primary remaining instance was already addressed in Batch 2.4 step 4 — this step is a final sweep to confirm no other bespoke limiter was missed).

**Files to change**
- `lib/api-response.ts`
- `lib/cors.ts`
- All call sites of either CORS helper (enumerate via `grep -rn "getCorsHeaders\|addCorsHeaders" app lib`)

**Dependencies**
Depends on Batch 2.4 shipping first for the rate-limiter half. The CORS half has no such dependency and can be done independently/earlier if convenient — consider splitting this into two smaller PRs (CORS consolidation, rate-limiter final sweep) if the reconciliation work in steps 1–2 turns out to be non-trivial.

**Database migration requirements**
None.

**Testing strategy**
- Integration test: a request from each origin in the reconciled allow-list succeeds; a request from a non-allowed origin is rejected — covering both the previously-divergent cases explicitly (the origin that was in one list but not the other) to confirm the reconciliation decision from step 2 is correctly implemented, not just "some list works."
- Regression test: confirm no previously-working legitimate cross-origin integration (if any exists, e.g., a CMS preview tool) breaks after consolidation.

**Rollback strategy**
`git revert` on the consolidated files. If a legitimate origin was accidentally dropped during reconciliation, this is the most likely failure mode — have the pre-consolidation origin list handy (it's in the diff from step 1) for fast re-addition without a full revert if only one origin needs restoring.

**Deployment considerations**
- Deploy to staging and specifically test from any known legitimate cross-origin integration (CMS preview, any partner/embed origin) before production.
- Low-traffic-window deploy recommended given the "could silently break a legitimate integration nobody tests regularly" risk profile — this is the kind of break that might not surface until days later when someone happens to use the affected integration.

---

## Phase 3: Database and API Architecture Improvements

**Phase goal:** fix data-layer correctness and performance issues (missing indexes, cascade behavior, N+1 queries, unfiltered/unpaginated endpoints) and begin the larger structural project of eliminating divergent dual data-access implementations per domain.

**Phase-level sequencing:** Batches 3.1 (indexes) and 3.2 (cascade fix) are both small, independent, additive schema changes — can be combined into a single migration/release if convenient, or shipped separately; no strong reason to sequence one before the other. Batch 3.3 (N+1 + courses pagination) has no schema dependency and can run in parallel with 3.1/3.2. Batch 3.4 (the Prisma-vs-raw-SQL consolidation program) is the largest, highest-risk item in the entire roadmap — it should start only after 3.1–3.3 are stable in production, and its first domain (courses) directly builds on the pagination/filtering fix already made in 3.3. Batch 3.5 (`Order.items`/tags schema dedup) should follow Batch 3.4's methodology and findings for the `courses`/`news` domains, since resolving "which implementation is authoritative" is a natural prerequisite to resolving "which schema representation is authoritative" within the same domains.

**This phase should not start until Phase 2 is deployed and stable.** Unlike Phase 1→2, there's no direct technical dependency, but Phase 3 touches high-traffic read paths (courses, orders) and financial data (via 3.5) — do not run a major data-layer migration project concurrently with unresolved auth-hardening work still settling in production, to keep incident attribution clean.

---

### Batch 3.1 — Missing Indexes Migration

**Goal**
Add indexes on `Order.status`/`createdAt`, `Transaction.status`/`type`/`createdAt`, and `User.role`/`createdAt` to support admin dashboard and reporting query patterns that currently have no index coverage.

**Exact implementation steps**
1. Before finalizing the exact column set, grep actual query patterns against these tables in `app/api/admin/**` and `lib/services/**` (`WHERE`/`ORDER BY` clauses) to confirm which columns are genuinely filtered/sorted on in practice, and whether any should be composite indexes (e.g., `status` + `createdAt` together) rather than single-column.
2. Add the corresponding `@@index([...])` annotations to `Order`, `Transaction`, and `User` in `prisma/schema.prisma`.
3. Generate the migration: `npx prisma migrate dev --name add_order_transaction_user_indexes` locally, review the generated SQL for sanity (should be pure `CREATE INDEX` statements, nothing destructive).
4. Run the full test suite (`npm run test`) to confirm nothing depends on the absence of these indexes (nothing should, but confirm).

**Files to change**
- `prisma/schema.prisma` (`Order`, `Transaction`, `User` models)
- New file: `prisma/migrations/<timestamp>_add_order_transaction_user_indexes/migration.sql`

**Dependencies**
None. Can ship independently at any point in Phase 3, including in parallel with 3.2/3.3.

**Database migration requirements**
Yes — additive `CREATE INDEX` statements only, non-destructive, reversible (an index can always be dropped without data loss). On tables with meaningful production row counts, adding an index can briefly affect write performance/locking during creation depending on MySQL version and storage engine (`ALGORITHM=INPLACE` should apply for standard secondary indexes on InnoDB, allowing concurrent writes, but confirm against the actual MySQL version in use).

**Testing strategy**
- `npm run test` full suite as a baseline regression check.
- Query-plan verification: run `EXPLAIN` on the specific admin queries identified in step 1 before and after the migration in staging, confirming the new indexes are actually being used (not just present).
- No new business-logic test needed — this is a pure performance change with no behavioral difference in query *results*, only query *speed*.

**Rollback strategy**
Migrations adding indexes can be rolled back with a follow-up migration dropping them (`DROP INDEX`), or left in place harmlessly if rollback is only about the *application code* around them (there is no application code change in this batch, only schema). In practice, there's rarely a reason to roll this back — worst case is a temporary write-performance dip during index creation on a large table, which is a timing/scheduling concern, not a correctness one.

**Deployment considerations**
- Apply the migration during a low-traffic window if the `Order`/`Transaction`/`User` tables have meaningful production row counts, to minimize any write-lock contention during index creation.
- Apply via `npx prisma migrate deploy` against the actual production database — **not** via container re-initialization (see roadmap-level note; `docker-compose.yml`'s migration mount only applies to fresh containers).
- No application code deploy is needed alongside this — the schema change alone delivers the benefit as soon as admin queries run against it.

---

### Batch 3.2 — Investment Portfolio Cascade Fix

**Goal**
Change `UserInvestmentPortfolio.userId`'s `onDelete` behavior from `Cascade` to `SetNull`, matching the audit-preserving pattern already correctly used on `Order` and `Transaction`, so deleting a user doesn't destroy their investment purchase history.

**Exact implementation steps**
1. Confirm the current nullability of `UserInvestmentPortfolio.userId` in `prisma/schema.prisma` — if it's currently required (non-nullable), this migration must also make it nullable, which is a more involved schema change than a pure relation-behavior tweak.
2. Update the relation annotation to `onDelete: SetNull` (and add `?` for nullability if step 1 found it's required).
3. Generate the migration (`npx prisma migrate dev --name fix_investment_portfolio_cascade`) and review the generated SQL carefully — confirm it's an `ALTER TABLE ... MODIFY ... DROP FOREIGN KEY ... ADD CONSTRAINT ... ON DELETE SET NULL` style change, not anything that touches existing row data.
4. If `userId` was required and is becoming nullable, confirm the migration doesn't attempt to backfill/change any existing non-null values (it shouldn't need to — existing rows keep their current `userId` values, only the *constraint* changes).
5. Test the actual user-deletion path end-to-end in a local/staging environment with a test user that has an associated `UserInvestmentPortfolio` row: delete the user, confirm the portfolio row survives with `userId` set to `NULL` rather than being deleted.

**Files to change**
- `prisma/schema.prisma` (`UserInvestmentPortfolio` model)
- New Prisma migration file
- Wherever user-deletion logic lives (confirm it doesn't have any code-level assumption that `UserInvestmentPortfolio.userId` is always non-null after this change, e.g., a report/query that would break on encountering a null)

**Dependencies**
None — independent of other Phase 3 batches, though can be bundled into the same migration/release as Batch 3.1 for deployment convenience if desired.

**Database migration requirements**
Yes — a relation-constraint change, possibly combined with a nullability change (see step 1/4). Not destructive to existing data, but this is the kind of migration that deserves a staging dry-run against a realistic data copy before production, specifically to catch the nullability edge case if it applies.

**Testing strategy**
- The end-to-end user-deletion test (step 5) is the core test — this is exactly the scenario the review flagged as currently broken, so it must be explicitly exercised, not just inferred from the schema change looking correct.
- Regression test: any existing admin reporting/query code that reads `UserInvestmentPortfolio.userId` should be checked (grep + manual review) for null-handling if nullability changed — add a test case with a null `userId` row if such code exists.
- `npm run test` full suite.

**Rollback strategy**
A follow-up migration reverting to `Cascade` (and back to non-nullable if that changed) is possible but **should not be treated as a casual rollback** — if any user deletions happen between deploying this fix and a hypothetical rollback, those deletions will have correctly preserved (`SetNull`) portfolio data; reverting the *schema* afterward doesn't retroactively delete that already-preserved data (which is fine/desired), but any *new* deletions after a rollback would return to the destructive `Cascade` behavior. In practice, there's no good reason to roll this specific fix back — treat it as one-directional.

**Deployment considerations**
- Dry-run against a staging copy of production data (or a realistic synthetic dataset) specifically exercising the nullability change if applicable, before touching production.
- Apply via `npx prisma migrate deploy`, same caveat as Batch 3.1 about not relying on container re-initialization.
- Can be bundled with Batch 3.1 in the same deploy for efficiency, since both are schema-only changes with no application code coupling between them.

---

### Batch 3.3 — Orders N+1 Fix & Courses Endpoint Pagination/Filtering

**Goal**
Fix the N+1 query pattern in `app/api/user/orders/route.ts` (one extra course lookup per order), and fix `app/api/courses/route.ts` to filter out unpublished courses and add pagination, closing both a performance issue and a draft-content-exposure issue.

**Exact implementation steps**

*Orders N+1:*
1. In `app/api/user/orders/route.ts`, after the initial paginated `prisma.order.findMany`, collect all distinct course IDs referenced across the page's orders.
2. Replace the current per-order `.map(async order => prisma.course.findMany(...))` with a single `prisma.course.findMany({ where: { id: { in: courseIds } } })` call.
3. Build a lookup map (course ID → course) from that single query's results, and join it back onto each order in memory when constructing the response — preserve the exact existing response shape so this is a pure performance fix with no API contract change.

*Courses endpoint:*
4. In `app/api/courses/route.ts`, add a `WHERE published = 1` (or Prisma-equivalent) filter to the raw-SQL query, matching the behavior already correctly implemented in `lib/services/course.server.ts`'s `getCoursesByPrisma()`.
5. Add standard `LIMIT`/`OFFSET` pagination to the same query, using the `paginatedResponse` helper from `lib/api-response.ts` for the response envelope, consistent with how other list endpoints in the codebase already work.
6. Audit every current caller of `app/api/courses/route.ts` (frontend hooks, any admin tooling) to confirm they can handle a paginated response shape instead of a flat array — update callers as needed in the same PR.

**Files to change**
- `app/api/user/orders/route.ts`
- `app/api/courses/route.ts`
- `lib/services/course.server.ts` (reference implementation, no change needed unless consolidating — see Batch 3.4 for that larger decision)
- Frontend caller(s) of the courses list endpoint (`lib/hooks/useCourses.ts` and any component consuming it directly) if the response shape changes

**Dependencies**
None on other Phase 3 batches. Note: this batch is explicitly the first slice of the larger Batch 3.4 effort for the `courses` domain — Batch 3.4 will build on this rather than duplicating it.

**Database migration requirements**
None — both fixes are query-logic changes against the existing schema, no schema modification needed. (This batch benefits from, but doesn't require, Batch 3.1's indexes — `Order.createdAt`/`published` filtering will perform better with those in place, so sequencing after 3.1 is preferred but not blocking.)

**Testing strategy**
- Orders N+1: add a test asserting the orders endpoint issues a bounded number of database queries regardless of how many orders are on the page (e.g., using a query-count assertion or a mock/spy on the Prisma client) — this directly tests the fix, not just the output correctness.
- Courses endpoint: add a test asserting an unpublished course never appears in the response; add a test asserting pagination parameters are respected (correct page size, correct total count).
- Regression: confirm the existing course-listing UI still renders correctly with the new paginated response shape in a manual staging pass.

**Rollback strategy**
Both are `git revert`-safe, single/few-file changes with no schema coupling. The courses-endpoint change is a behavior change (unpublished courses will stop appearing, response becomes paginated) — if this breaks an unexpected caller found post-deploy, reverting is safe and immediate, but treat the underlying draft-content-exposure issue as still needing a fix even if this specific implementation is rolled back.

**Deployment considerations**
- The courses-endpoint change is the more consequential half — deploy to staging and verify the public course-listing page still works correctly with real (staging) data, including confirming draft/unpublished courses no longer appear where they shouldn't.
- If any external/third-party integration consumes `app/api/courses/route.ts` directly (check for API keys/partner docs referencing it), the response-shape change (flat array → paginated envelope) is a breaking change for them — confirm this isn't the case, or version/coordinate accordingly, before deploying.

---

### Batch 3.4 — Prisma-vs-Raw-SQL Consolidation Program

**Goal**
Eliminate the recurring risk class proven in Batch 3.3 (two independent implementations of the same data access silently diverging in filtering/visibility behavior) across every domain that currently splits into a `-mysql.ts` + Prisma pair: `news`, `library`, `investment-models`, `skyroom`, and `courses` (already partially addressed by Batch 3.3).

**Exact implementation steps**
This is explicitly a multi-release program, not a single PR — execute one domain at a time:
1. **Per domain**, enumerate every behavioral difference between the raw-SQL (`-mysql.ts`) and Prisma implementations: filters applied (published/draft/status), default ordering, pagination defaults, included/joined relations, error handling.
2. Decide which behavior is correct for each divergence found (default to Prisma per the project's stated convention for new code, unless the raw-SQL path has a specific, documented performance or capability reason to remain authoritative — document that reason explicitly if so).
3. Migrate all call sites for that domain to the single surviving implementation.
4. Add a regression test per resolved divergence (e.g., "unpublished items never appear in the public listing," mirroring the test added in Batch 3.3 for courses) so the specific bug class this program exists to prevent has explicit coverage per domain.
5. Delete the losing implementation (`-mysql.ts` file or the redundant Prisma path, whichever lost) for that domain.
6. Repeat for the next domain. Recommended order: `courses` (already scoped via 3.3 — finish retiring `lib/services/course.server.ts`'s raw-SQL sibling if one still exists after 3.3), then `news`, `library`, `investment-models`, `skyroom` in whatever order the team judges lowest-risk-first (start with the domain with the least production write traffic).

**Files to change** (per domain, repeated across the program)
- `lib/services/news-mysql.ts` / `lib/services/news-service.ts`
- `lib/services/library-mysql.ts` / `lib/services/library-service.ts`
- `lib/services/investment-models-mysql.ts` / `lib/services/investment-models-service.ts`
- `lib/services/skyroom-mysql.ts` / `lib/services/skyroom-service.ts`
- All route handlers calling into whichever implementation is retired, per domain

**Dependencies**
Should start only after Batches 3.1–3.3 are stable in production. Depends on Batch 3.3's approach/lessons for the `courses` domain being validated first, since 3.3 is effectively "domain 1" of this program.

**Database migration requirements**
None expected as a rule — this is primarily an application-code consolidation, not a schema change. If a specific domain's consolidation reveals a schema issue (e.g., the kind found in Batch 3.5), that's handled as part of Batch 3.5, not this batch — keep the two concerns separate per domain to avoid an overly large, hard-to-review single change.

**Testing strategy**
- Per-domain regression test suite covering every behavioral divergence found in step 1, written *before* the consolidation lands (red/green: test fails against the losing implementation's gap, passes once consolidated onto the winning one).
- Full `npm run test` suite after each domain's consolidation, not just at the end of the whole program.
- Manual QA pass on both public-facing and admin-facing views of the affected domain after each consolidation (e.g., after `news` consolidation, check both the public news list/detail pages and the admin news management pages).

**Rollback strategy**
Each domain's consolidation should be its own PR/deploy, independently revertible via `git revert` without affecting other domains' consolidation status — this is precisely why the program is structured domain-by-domain rather than as one large change. If a consolidation for one domain causes a production issue, revert just that domain's change; the others remain unaffected.

**Deployment considerations**
- **Do not attempt this as one big-bang change across all domains.** One domain per release, with its own staging validation and monitoring period before starting the next.
- Budget real calendar time — this is explicitly flagged as High complexity/High risk in the remediation plan; rushing it to hit a sprint deadline is more likely to introduce a new divergence than to fix the existing ones cleanly.
- After each domain's consolidation, monitor for any behavior-change reports (support tickets, internal QA) for at least a few days before starting the next domain, to keep incident attribution clean.

---

### Batch 3.5 — `Order.items`/Tags Schema Deduplication

**Goal**
Resolve the duplicated-source-of-truth schema issues: `Order.items` (JSON) duplicating the normalized `OrderItem` table, and `NewsArticle`/`DigitalBook` each having both a JSON `tags` field and a proper join-table tag relation.

**Exact implementation steps**
1. **Audit phase (no code/schema change yet):** for each of the three duplications, trace every write path in the current codebase and determine which representation is actually being kept up to date in practice today — this may differ from what "should" be authoritative by design.
2. Write a reconciliation/backfill script that compares both representations for every existing row and flags any divergence found (rows where the JSON and normalized representations disagree) — surface this list to whoever owns order/content data for manual review *before* proceeding, since a divergence here means real, already-corrupted-relative-to-one-representation data that needs a human decision, not just an automated fix.
3. Once divergences are reviewed and resolved (either representation corrected to match the other, case by case, per the business's judgment on which is "true"), pick the normalized/relational representation as the long-term source of truth in all three cases (consistent with how tagging already works correctly elsewhere in the schema).
4. Migrate all write paths to write only to the normalized representation (stop writing to the JSON field).
5. Migrate all read paths to read only from the normalized representation.
6. Run both read paths in parallel (read from both, log/alert on any mismatch, serve from the normalized one) for a monitoring period before removing the JSON field entirely — this gives a safety window to catch any missed write path.
7. Once the monitoring period shows no mismatches, drop the JSON field(s) in a final migration.

**Files to change**
- `prisma/schema.prisma` (`Order`, `NewsArticle`, `DigitalBook` models — final field removal in step 7)
- All write paths to `Order.items` (`app/api/checkout/route.ts` and any admin order-management routes)
- All write paths to `NewsArticle.tags`/`DigitalBook.tags` JSON fields
- New reconciliation/backfill script (likely under `scripts/`)
- New Prisma migrations: one for any interim state if needed, one final for field removal

**Dependencies**
Should follow Batch 3.4's methodology and, ideally, timing for the `news`/`library` domains specifically (the tag-duplication half of this batch overlaps directly with those domains' consolidation) — sequence this after those domains' Batch 3.4 work lands, so the "which implementation is authoritative" question is already resolved before tackling "which schema representation is authoritative" within the same domain.

**Database migration requirements**
Yes, and this is the highest-stakes migration in the entire roadmap given `Order.items` touches financial/order data directly:
- No destructive change until step 7, and step 7 should only happen after the parallel-read monitoring period (step 6) confirms zero mismatches.
- Require a full backup/snapshot of the affected tables immediately before the step 7 migration, independent of standard backup cadence.
- Consider whether step 7 should keep the JSON column but stop reading/writing it (effectively deprecate-in-place) rather than physically dropping it, at least for `Order.items` specifically, given its financial sensitivity — a deprecated-but-present column is a safer long-term state than an irreversible drop if there's any residual doubt.

**Testing strategy**
- The reconciliation script (step 2) is itself the primary test of current data integrity — treat its output as a required review artifact, not just a diagnostic.
- Regression tests confirming order creation/reading and news/book tag creation/reading all function correctly against the normalized-only representation before any field removal.
- Explicit test for the parallel-read monitoring logic (step 6): confirm a deliberately-induced mismatch (in a test environment) is correctly logged/alerted, so the safety net is verified to actually work before relying on it in production.

**Rollback strategy**
- Steps 1–5 (write/read path migration, keeping the JSON field present but unused) are safely revertible via `git revert` at any point — the JSON field still exists and, if the old code paths are restored, would need a backfill to catch up on anything written only to the normalized table in the meantime (a small gap to manage, not a data-loss event).
- Step 7 (field removal) should be treated as effectively one-directional in practice — reversing a dropped column requires restoring from the pre-migration backup, which is why step 6's monitoring period and the backup requirement exist. Do not schedule step 7 until genuinely confident.

**Deployment considerations**
- This is a multi-week (not multi-day) effort by design — the parallel-read monitoring period (step 6) should run long enough to cover realistic usage patterns (e.g., a full billing/reporting cycle, if the business has one) before the final field removal.
- Coordinate explicitly with finance/business stakeholders before touching `Order.items` — this is financial data, and the review flagged this migration as needing "a written migration plan reviewed separately from this document" — treat that as a hard requirement, not a suggestion, before executing step 7 specifically.
- Keep steps 1–6 and step 7 as clearly separate deploys/PRs, not one large change, so the low-risk preparatory work and the one genuinely irreversible step are never conflated in review or in a rollback decision.

---

## Phase 4: Performance and Technical Debt Cleanup

**Phase goal:** pay down the remaining code-health debt (dead code, missing error/loading boundaries, admin SSR, date-formatting fragmentation, cart-store server-state leakage) and resolve the stale `enterprise-architecture-refactor` planning document. None of these are urgent; they're scheduled here because Phases 1–3 needed to land first, not because they're blocked by them technically (most Phase 4 batches have no real dependency on Phase 1–3 and can be pulled forward opportunistically if a team member has spare cycles).

**Phase-level sequencing:** All five batches in this phase are independent of each other and can be executed in any order, by different engineers, in parallel. Treat this phase as a backlog rather than a strict sequence — pick items up as capacity allows.

---

### Batch 4.1 — Dead Code Removal (News Editors + Seed Scripts)

**Goal**
Delete three abandoned news-editor implementations (~1,400+ lines) and five dead/duplicate seed scripts, removing onboarding confusion and unnecessary attack-surface/bundle weight.

**Exact implementation steps**
1. Re-verify (don't rely solely on the architecture review's earlier findings, which may be stale by execution time) zero importers for each: `grep -rn "RichNewsEditor\|NewsEditorEnhanced\|MDXNewsEditor" app components lib`.
2. Delete `components/admin/news/RichNewsEditor.tsx`, `components/news/NewsEditorEnhanced.tsx`, `components/news/MDXNewsEditor.tsx`, `app/admin/news/create-mdx/page.tsx`, `app/admin/news/create-mdx-example/page.tsx`, and any editor-only supporting components confirmed (via the same grep pattern) to be exclusively used by the deleted files.
3. Re-verify `npm run seed`'s actual dependency chain (`prisma/seeds/seed-all.ts` and its imports) hasn't changed, then delete `prisma/seed.ts`, `prisma/seed-simple.js`, `prisma/landings-seed.js`, `prisma/seed-admin.ts` (root), `prisma/persian-data-generator.ts` (root).
4. Run `npm run lint`, `npx tsc --noEmit`, `npm run build` to confirm a clean tree.
5. Run `npm run seed` against a local/test database to confirm seeding still works correctly using only the surviving `prisma/seeds/` files.

**Files to change**
- Delete: `components/admin/news/RichNewsEditor.tsx`, `components/news/NewsEditorEnhanced.tsx`, `components/news/MDXNewsEditor.tsx`, `app/admin/news/create-mdx/page.tsx`, `app/admin/news/create-mdx-example/page.tsx`
- Delete: `prisma/seed.ts`, `prisma/seed-simple.js`, `prisma/landings-seed.js`, `prisma/seed-admin.ts`, `prisma/persian-data-generator.ts` (root-level only, not the `prisma/seeds/` equivalents)

**Dependencies**
None.

**Database migration requirements**
None.

**Testing strategy**
- Static checks (lint/typecheck/build) as the primary safety net for a deletion.
- `npm run seed` run end-to-end against a scratch database as the specific test for the seed-script deletions.
- Manual: confirm the live news editor (`components/news/NewsEditor.tsx`, reachable via `app/admin/news/create/page.tsx`) still works correctly in staging after the deletion (sanity check that nothing shared was accidentally removed).

**Rollback strategy**
Trivial `git revert` — these are confirmed-dead files with no production dependency; reverting has zero functional impact either direction.

**Deployment considerations**
None beyond standard deploy — no staging-specific concern, no monitoring needed post-deploy beyond the standard build/smoke check.

---

### Batch 4.2 — Error/Loading Boundaries + Admin SSR Conversion

**Goal**
Add missing `error.tsx`/`loading.tsx` route boundaries (currently absent everywhere except a single root `not-found.tsx`), and convert the highest-traffic admin list pages from fully client-rendered to server components with client islands, recovering the SSR/streaming benefit the framework offers but the admin panel currently forfeits entirely.

**Exact implementation steps**

*Phase A — boundaries (low effort, do first):*
1. Add root-level `app/error.tsx` and `app/loading.tsx`.
2. Add per-route `loading.tsx`/`error.tsx` for the highest-traffic pages: `app/(routes)/courses/`, `app/(routes)/news/`, `app/(routes)/checkout/`, `app/admin/dashboard/`.

*Phase B — admin SSR conversion (larger effort, treat each page as its own sub-task):*
3. Pick one admin list page at a time (recommended start: courses list, given its existing partial server-component precedent from Batch 3.3's work).
4. Split the page into a server component handling data fetching (calling the domain's service layer directly, server-side) and a client component handling interactivity (filters, sort controls, row actions) — pass fetched data down as props.
5. Confirm loading/error states are handled correctly in the new split (this is the most common place for a regression — a working client-side loading spinner can silently disappear if not deliberately re-implemented via `loading.tsx`/Suspense in the server-component version).
6. Repeat for the next admin list page (news, library) as separate, independently-deployed changes.

**Files to change**
- New: `app/error.tsx`, `app/loading.tsx`, and per-route equivalents under `app/(routes)/courses/`, `app/(routes)/news/`, `app/(routes)/checkout/`, `app/admin/dashboard/`
- `app/admin/courses/**`, `app/admin/news/**`, `app/admin/library/**` (Phase B, one page/domain at a time)

**Dependencies**
Phase A has no dependencies. Phase B for the courses admin page benefits from Batch 3.4's courses-domain consolidation having already landed (cleaner to build a server component against a single, already-consolidated data-access path than against the pre-consolidation dual-implementation state).

**Database migration requirements**
None.

**Testing strategy**
- Phase A: manual verification that a deliberately-thrown error in a test route renders the new `error.tsx` instead of a blank/generic screen; manual verification that a slow-loading route shows the `loading.tsx` skeleton.
- Phase B: full manual QA pass per converted page — every action previously available in the client-rendered version (filter, sort, create, edit, delete) must be re-verified in the server/client-split version, since this is a real behavioral refactor, not a pure addition. Add/update any existing tests for the converted page's data-fetching logic to reflect the new server-side fetch location.

**Rollback strategy**
- Phase A: trivial revert, purely additive.
- Phase B: each page's conversion should be its own PR/deploy, independently revertible — if a converted admin page regresses (e.g., a filter stops working), revert just that page's change; other pages and the rest of the app are unaffected.

**Deployment considerations**
- Phase A: no special considerations, low-risk additive change.
- Phase B: deploy one page at a time, with a manual QA pass in staging covering every interactive feature of that specific page before production; monitor for admin-user-reported issues on that page for a few days before starting the next page's conversion.

---

### Batch 4.3 — Date Formatting Unification

**Goal**
Consolidate three uncoordinated date-formatting strategies (`date-fns-jalali`, `date-fns`+`faIR`-locale-only, native `Intl`/`toLocaleDateString('fa-IR')`) and fix two locale-missing bugs, standardizing on a single helper in `lib/utils.ts`.

**Exact implementation steps**
1. Decide the canonical approach: extend the existing `lib/utils.ts` `toLocaleDateString('fa-IR')`-based helper to be the single required entry point for all user-facing date rendering (recommended, since it's already correctly using Jalali-aware `Intl` formatting and already exists), or standardize on `date-fns-jalali` if true Jalali calendar *arithmetic* (not just display) is needed anywhere — confirm this isn't actually required before choosing the more complex option.
2. Enumerate every call site: `grep -rn "toLocaleDateString\|toLocaleString" --include=*.tsx --include=*.ts .` plus every `date-fns` import used for date display (not just Persian locale strings).
3. Replace each call site with the canonical helper, paying specific attention to the two known locale-missing bugs (`app/admin/news/page.tsx`, `lib/hooks/useDraftRestoration.ts`) as explicit must-fix cases, not just incidental cleanup.
4. Add an ESLint rule (or, if a custom rule is too heavyweight, a simple CI grep-based check) that flags direct `toLocaleDateString`/`date-fns` imports for date rendering outside the canonical helper module, to prevent the fragmentation from recurring.

**Files to change**
- `lib/utils.ts` (canonical helper, extended if needed)
- `components/checkout/result.tsx`
- `components/news/NewsArticleDetail.tsx`, `components/news/ArticlePreviewCard.tsx`, `components/news/NewsDetail.tsx`
- `app/admin/news/page.tsx`
- `lib/hooks/useDraftRestoration.ts`
- ~30 additional call sites identified in step 2
- New: ESLint rule config or CI check script

**Dependencies**
None.

**Database migration requirements**
None.

**Testing strategy**
- Snapshot/unit tests on the canonical helper covering representative dates, confirming correct Persian/Jalali output.
- Visual regression check (manual, or automated screenshot diff if the project has that tooling) across the affected pages before/after, since this is fundamentally a display-layer change best caught visually.
- Specific test cases for the two previously-locale-missing call sites, asserting Persian locale output (not a silent Gregorian fallback).

**Rollback strategy**
Per-file `git revert` is safe and low-risk — worst case is a formatting regression, immediately visible, not a functional break.

**Deployment considerations**
Low-risk, standard deploy. No special staging beyond a visual pass over the affected pages (news listing/detail, checkout result, admin news list) in staging before production.

---

### Batch 4.4 — Cart Store Server-State Fix

**Goal**
Stop persisting full snapshotted `Course` server entities (including `price`) into `localStorage` via `cart-store.ts`, and confirm/ensure checkout re-validates price server-side regardless of what the client's cart state contains.

**Exact implementation steps**
1. **First and most important:** audit `app/api/checkout/route.ts` (post Batch 1.3's auth fix) to determine whether it currently re-derives order pricing from `Course.price` in the database at order-creation time, or trusts a price value passed from the client/cart. If it trusts the client-supplied price, **fix that first** — this is a more serious, higher-priority issue than the store-refactor itself (a client-controlled price at checkout is a direct revenue-integrity bug, arguably should have been scoped as its own P0/P1 item if confirmed) and should be escalated accordingly rather than bundled quietly into this cleanup batch.
2. Once server-side price re-validation is confirmed (or fixed), refactor `stores/cart-store.ts`'s persisted shape to store only `id`, `type` (course/product), and `quantity` — remove `price` and other server-derived fields from the persisted `CartItem` shape.
3. Update cart-rendering components (`components/checkout/**` and wherever cart contents are displayed, e.g., a cart drawer/page) to join the lightweight persisted cart entries against live data from the relevant React Query hook (`useCourses`or equivalent) for display (price, title, availability).
4. Handle the loading state explicitly: a cart item's ID exists in the store, but its live details may not have loaded yet from the query cache — ensure the UI shows an appropriate loading/skeleton state rather than a blank or broken row during this window.
5. Add a migration path for existing users' already-persisted `localStorage` cart data (old shape with embedded price) — either a one-time client-side migration on load (read old shape, extract just the ID, discard the rest) or accept that existing carts simply reset once (acceptable for a low-stakes client-side cache, but decide and document the choice).

**Files to change**
- `stores/cart-store.ts`
- `app/api/checkout/route.ts` (if step 1 finds a real server-side price-trust issue)
- Cart-rendering components under `components/checkout/**` and any cart-drawer/summary component

**Dependencies**
Should follow Batch 1.3 (checkout auth/payment fixes), since step 1 audits the same checkout route those batches modified — cleaner to build on the already-hardened checkout flow than to interleave with it.

**Database migration requirements**
None.

**Testing strategy**
- Step 1's audit result should itself produce a test if a real issue is found: an integration test asserting checkout uses server-side `Course.price`, not any client-supplied value, regardless of what's sent in the request.
- Unit tests on the refactored store: confirm only the lightweight shape is persisted.
- Integration/E2E test: add item to cart, simulate a price change on the server (update the course's price directly in the test DB), reload the cart, confirm the displayed price reflects the *new* server price, not a stale cached one — this is the exact regression this batch exists to prevent, so it must be explicitly tested end-to-end.
- Manual QA: full add-to-cart → checkout flow in staging, including the loading-state behavior from step 4.

**Rollback strategy**
`git revert` on the store/component changes is safe — reverts to the previous (stale-price-risk) behavior, which is a known issue but not a new one, so rollback doesn't introduce a fresh regression, just re-exposes the previously-documented one. If step 1 found and fixed a server-side price-trust issue, that fix should be treated as its own more cautious rollback decision (same caution as any checkout-integrity fix, per Batch 1.3's guidance) — don't casually revert that part.

**Deployment considerations**
- If step 1 surfaces a real server-side price-trust gap, treat that discovery as an escalation — re-evaluate its priority against the Phase 1 items rather than shipping it quietly as part of routine Phase 4 cleanup, given the direct revenue-integrity implication.
- Otherwise, standard staging-then-production deploy with the specific price-change end-to-end test (from Testing strategy) run manually in staging before production sign-off.

---

### Batch 4.5 — OpenSpec Proposal Resolution

**Goal**
Resolve the stale `openspec/changes/enterprise-architecture-refactor/` proposal, whose tracked status (`tasks.md` — every phase "Not Started") no longer matches reality (its Phase 1 cleanup was already partially done outside the plan; much of its remaining scope now overlaps with Batches 3.4 and 4.1 of this roadmap).

**Exact implementation steps**
1. Hold a short team planning conversation (not itself an implementation step, but a required precondition) to decide between two paths: (a) re-scope and actively schedule the remaining work, explicitly folding in the overlap with Batches 3.4/4.1 so there's one tracked source of truth, or (b) close/archive the proposal as superseded by this roadmap's more surgical, prioritized approach.
2. If re-scoping (path a): update `openspec/changes/enterprise-architecture-refactor/tasks.md` to accurately reflect what's actually done (the Phase 1 SSH-key/root-script cleanup, already completed in commit `92388058`), remove or annotate tasks that are now redundant with Batches 3.4/4.1, and assign realistic owners/timelines to what remains.
3. If closing (path b): move the proposal directory to `openspec/changes/archive/` per the existing convention, with a note in `proposal.md` pointing to this roadmap (and the architecture review / remediation plan) as the superseding source of truth.
4. Either way, ensure the decision itself is recorded somewhere durable (the proposal's own files, or a linked decision doc) so a future contributor doesn't have to re-derive "is this plan still active?" from scratch, the same problem this batch exists to fix.

**Files to change**
- `openspec/changes/enterprise-architecture-refactor/tasks.md`
- `openspec/changes/enterprise-architecture-refactor/proposal.md`
- Possibly relocated to `openspec/changes/archive/` (path b)

**Dependencies**
Best done after Batches 3.4 and 4.1 have at least started (or their scope is clearly locked in), so the re-scope/closure decision can reference their actual outcomes rather than guessing at overlap in advance.

**Database migration requirements**
None — documentation-only change.

**Testing strategy**
Not applicable in the automated-test sense; the "test" here is a team review of the updated/archived proposal for accuracy against actual repo state at time of closure.

**Rollback strategy**
Not applicable — this is a documentation update with no runtime behavior; any "rollback" is simply editing the document again if the team's decision changes.

**Deployment considerations**
None — no deploy involved, purely a documentation/process change committed to the repo.

---

## Cross-Phase Notes for Execution Planning

- **Staffing:** Phase 1 is small enough (4 batches, all low-to-medium complexity except the inherently-risky payment fix) to be handled by one or two engineers in a focused week. Phase 2 and Phase 3 batches are largely independent of each other *within* their phase and can be parallelized across engineers once each phase's own start-gate (previous phase stable in production) is satisfied. Phase 4 is a standing backlog, not a sprint — treat it as fill-in work.
- **The riskiest single batch in this entire roadmap is 1.3 (checkout + payment).** Staff it with the most senior engineer available, budget real QA time against the Zarinpal sandbox, and do not compress its timeline to fit a sprint boundary.
- **The largest single batch is 3.4/3.5 combined (the Prisma-vs-raw-SQL consolidation and its associated schema deduplication).** Treat this as a standing quarter-scale program with its own tracking (likely worth its own OpenSpec change proposal once started, given the existing process convention), not a line item to squeeze into a single sprint.
- **Every batch touching `prisma/schema.prisma` must be applied to live databases via `npx prisma migrate deploy`, never assumed to apply via `docker-compose.yml` container re-initialization** — this applies to Batches 2.1, 3.1, 3.2, and 3.5.
