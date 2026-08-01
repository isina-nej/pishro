# Pishro Platform — Production Remediation Plan

**Source:** `ARCHITECTURE_REVIEW.md` (full review of `main` @ `fe36dcf`).
**Purpose:** turn each finding in that review into an actionable, sequenced remediation item with enough context that any engineer (not just whoever wrote the review) can pick it up, understand why it matters, and implement it safely.
**Status:** planning only — no code has been changed as part of this document.
**How to use this doc:** each item is self-contained. The "Recommended order" field gives a single, dependency-aware execution sequence across all 21 items (see §0), which is not identical to the P0/P1/P2 severity labels in the architecture review — a few items are pulled earlier or later than their severity bucket because they unblock or compound with other fixes.

---

## 0. Sequencing Rationale

The architecture review grouped items by *severity* (P0/P1/P2). This plan resequences by *safe execution order*, because two things matter independently of severity:

1. **Dependencies.** You cannot safely remove the hardcoded DB credential fallback (item 3) before every environment has a real `.env` — so `.env.example` (originally a P2 item) is pulled forward to run immediately before it.
2. **Compounding risk.** The admin token's non-httpOnly design (originally P1, item 7 here) is only a *contained* risk today because there's no XSS vector reachable from the admin panel via the news-content path yet — once the checkout/payment fixes land, the stored-XSS fix (item 6) closes the one open injection point, at which point tightening token TTL is lower-stakes. Doing them in this order avoids fixing a token-theft mitigation before the theft vector itself is closed.

Execution order and severity are shown side by side in the summary table below.

| # | Item | Severity (from review) | Complexity | Fix risk |
|---|---|---|---|---|
| 1 | Remove/lock down `app/api/debug/*` | P0 | Low | Low |
| 2 | Add `.env.example` | P2 (pulled forward) | Low | Low |
| 3 | Remove hardcoded DB credential fallback | P0 | Low | Medium |
| 4 | Add session auth to `checkout` | P0 | Low | Medium |
| 5 | Fix `payment/verify` signature validation | P0 | Medium | High |
| 6 | Sanitize news content at render (XSS) | P0 | Low | Low |
| 7 | Admin token TTL / revocation hardening | P1 (pulled forward) | Medium | Medium |
| 8 | CSRF / Origin validation on admin mutations | P1 | Medium | Medium |
| 9 | Apply security headers/CSP globally | P1 | Low | Medium |
| 10 | Real shared-store rate limiting | P1 | Medium | Low |
| 11 | Missing indexes on `Order`/`Transaction`/`User` | P1 | Low | Low |
| 12 | Fix `UserInvestmentPortfolio` cascade behavior | P1 | Low | Medium |
| 13 | Fix N+1 in `user/orders` + `courses` pagination/filter | P1 | Medium | Low |
| 14 | Consolidate CORS + rate-limiter implementations | P1 | Medium | Medium |
| 15 | Delete dead news editors + dead seed scripts | P2 | Low | Low |
| 16 | Prisma-only vs raw-SQL-only per domain | P2 | High | High |
| 17 | Resolve `Order.items`/tags schema duplication | P2 | High | High |
| 18 | `error.tsx`/`loading.tsx` + admin SSR conversion | P2 | Medium | Low |
| 19 | Unify date formatting | P2 | Low | Low |
| 20 | Fix `cart-store.ts` server-state snapshotting | P2 | Low | Medium |
| 21 | Re-scope or close `enterprise-architecture-refactor` OpenSpec proposal | P2 | Low | Low |

---

## 1. Remove or lock down `app/api/debug/*`

**Problem**
16 route handlers under `app/api/debug/*` are reachable in production with no authentication and no `NODE_ENV` gate. This includes a `DELETE` handler that wipes an entire table (`prisma.digitalBook.deleteMany({})`), `GET` handlers that write seed data into production tables, and handlers that dump raw table contents or leak a slice of a real admin's bcrypt hash.

**Business impact**
Total, unauthenticated data-destruction capability against production content (all digital books) and unauthenticated schema/data reconnaissance. If discovered by an automated scanner or a malicious actor doing routine endpoint enumeration, this is a full incident, not a near-miss — expect data loss, potential regulatory/customer-notification obligations if any leaked data includes PII, and a credibility hit if it happens publicly.

**Security impact**
- Unauthenticated destructive write (`debug/clear`).
- Unauthenticated production data injection (`debug/seed-courses`, `debug/seed-test`).
- Credential-adjacent information disclosure: `debug/check-admin` returns a 20-character prefix of a real admin bcrypt hash plus phone-verification status; `debug/find-admin` targets a hardcoded phone number and leaks stack traces on failure.
- Schema/data reconnaissance: `debug/db-status`, `category-columns`, `check-courses`, `courses-data` dump raw table/column info, which materially helps an attacker plan further attacks (e.g., against S2/S3 below).

**Technical impact**
None if removed correctly — these routes are not referenced by any production feature (they are development conveniences). The only technical risk is if a developer has silently come to depend on one of them locally (e.g., `debug/seed-courses` as a manual dev-seeding shortcut) — verify this before deleting.

**Root cause**
Debug/dev-convenience endpoints were built directly under `app/api/`, which `middleware.ts` does not protect (its matcher only covers `/admin/:path*` and `/api/admin/:path*`). There is no repo-wide convention (lint rule, CI check, or runtime guard) preventing debug endpoints from shipping to production — the project's own docs flag `app/api/debug/*` as needing exactly this kind of gate, but it was never implemented.

**Recommended solution**
Preferred: **delete the entire `app/api/debug/` directory.** If any handler is genuinely still needed for local development, move its logic into a script (`scripts/`) run via `tsx`, not an HTTP endpoint — this removes the entire class of risk rather than mitigating it. If an HTTP endpoint is truly required (e.g., for CI smoke tests), gate it with both `process.env.NODE_ENV !== 'production'` (checked inside the handler, not just by convention) *and* the existing admin-auth check, and add an automated CI check that fails the build if any file under `app/api/debug/` is present without both guards.

**Files affected**
- `app/api/debug/clear/route.ts`
- `app/api/debug/seed-courses/route.ts`
- `app/api/debug/seed-test/route.ts`
- `app/api/debug/check-admin/route.ts`
- `app/api/debug/find-admin/route.ts`
- `app/api/debug/db-status/route.ts`
- `app/api/debug/category-columns/route.ts`
- `app/api/debug/check-courses/route.ts`
- `app/api/debug/courses-data/route.ts`
- remaining files under `app/api/debug/*` (16 total — enumerate with `find app/api/debug -name route.ts` before deleting)

**Implementation complexity:** Low — this is a deletion, not a rewrite. The only work is confirming no production code path depends on these routes (`grep -r "/api/debug" app components lib`) before removing.

**Risk level:** Low — deleting unauthenticated endpoints cannot break authenticated functionality; the only failure mode is breaking an undocumented local-dev habit, which is easily caught by a quick team check before merge.

**Recommended order:** 1 — highest severity, lowest cost, no dependencies. Do this first, same day.

---

## 2. Add `.env.example`

**Problem**
No `.env.example`/`.env.sample` exists anywhere in the repo. There is no documented, version-controlled list of required environment variables, which is very likely why the hardcoded credential fallback in `lib/db.ts` (item 3) exists in the first place — without a template, a new environment is easiest to stand up by relying on defaults.

**Business impact**
Indirect: slower onboarding, higher chance of a misconfigured environment (dev, staging, or worse, production) silently running on default/fallback values instead of failing loudly. This item's real value is that it's a prerequisite for item 3's fix to be safe.

**Security impact**
None directly (the file should never contain real secret values — only variable names and placeholder/example values). Its absence is a contributing factor to S5 in the review.

**Technical impact**
None — purely additive documentation.

**Root cause**
No convention was established for documenting required configuration; the team has been relying on tribal knowledge and, apparently, on `lib/db.ts`'s hardcoded fallback to paper over missing `DB_*` vars.

**Recommended solution**
Enumerate every `process.env.X` reference across the codebase (`grep -rho "process\.env\.[A-Z_]*" --include=*.ts --include=*.tsx . | sort -u`), and produce `.env.example` with each variable name, a one-line comment on what it's for, and a non-functional placeholder value (e.g., `DB_PASSWORD=changeme`). Group by concern (DB, NextAuth, Admin JWT, S3, Zarinpal, Melipayamak/SMS) to match the mental model already used in `CLAUDE.md`. Add a note to `README.md` pointing new contributors at it.

**Files affected**
- New file: `.env.example` (repo root)
- `README.md` (add a one-line pointer)
- Reference sources to enumerate vars from: `lib/db.ts`, `auth.ts`, `lib/admin-auth.ts`, `lib/admin-jwt.ts`, `lib/services/object-storage-service.ts`, payment/SMS provider integration files

**Implementation complexity:** Low — mechanical enumeration + a single new file.

**Risk level:** Low — cannot break anything; it's documentation.

**Recommended order:** 2 — trivial, and directly unblocks item 3. Do immediately after item 1.

---

## 3. Remove hardcoded database credential fallback

**Problem**
`lib/db.ts` falls back to `user: 'root'`, `password: 'pishro_password'`, `database: 'pishro'` when the corresponding env vars are unset, rather than failing to start. A misconfigured deployment doesn't error visibly — it silently connects using a known default credential.

**Business impact**
If this fallback is ever live against a real MySQL instance reachable from outside the app's own network boundary (e.g., a staging DB exposed during a migration, or a firewall misconfiguration), the credential is effectively public — it's sitting in source control. Worst case is unauthorized database access with a credential nobody thought to rotate because "it's just the local dev password."

**Security impact**
A hardcoded, source-controlled default credential. Even if never directly exploited, it fails a baseline security review/audit and is explicitly called out in the project's own `.claude/rules/security.md` as a pattern not to replicate — meaning the team already knows this is wrong.

**Technical impact**
Fixing this is a **behavior change**: any environment currently relying on the fallback (silently) will now fail to start at all (loudly) until its env vars are set correctly. This is the intended outcome, but it means every environment — dev, staging, CI, production — must be verified to have real `DB_USER`/`DB_PASSWORD`/`DB_NAME` set *before* this change ships, or you will cause an outage instead of preventing one.

**Root cause**
Convenience during early local development ("just works out of the box") that was never revisited before the code was in a position to run in shared/production environments. No `.env.example` (item 2) meant there was no forcing function to set real values.

**Recommended solution**
1. Ship item 2 (`.env.example`) first and confirm every environment (local, CI, staging, production) has a real, non-default `.env`/environment configuration for `DB_USER`/`DB_PASSWORD`/`DB_NAME`.
2. Change `lib/db.ts` to throw at module load (fail fast, loudly, at startup — not at first query) if any of `DB_USER`, `DB_PASSWORD`, `DB_NAME` is unset. Do not silently substitute a default.
3. Deploy to staging first and confirm the app boots cleanly before touching production.

**Files affected**
- `lib/db.ts` (the fallback expressions and the surrounding warning-log code that currently allows the app to proceed anyway)

**Implementation complexity:** Low — a small code change (remove `||` fallbacks, add a startup assertion).

**Risk level:** Medium — the code change itself is trivial, but the *rollout* risk is real: if any environment hasn't actually had its env vars set correctly (masked until now by the fallback), this change will cause an immediate startup failure there. Treat this as a deploy that requires a pre-flight environment audit, not just a code review.

**Recommended order:** 3 — right after `.env.example` exists, before other work, since it's foundational hygiene and low-effort, but sequenced after item 2 specifically to avoid the outage risk described above.

---

## 4. Add session authentication to `checkout`

**Problem**
`app/api/checkout/route.ts` reads `userId` directly from the request body and uses it to create orders, with no `auth()` session check. Any caller can create an order attributed to an arbitrary user ID simply by putting it in the request body.

**Business impact**
Orders (and, combined with item 5's payment bypass, paid enrollments) can be created for/against arbitrary users without their consent — potential for fraud, harassment (spamming a competitor's account with fake orders), inventory/seat manipulation on limited-capacity courses, and corrupted order-history data that support/finance teams will trust as real.

**Security impact**
Broken access control (OWASP A01) — the checkout endpoint has no ownership/identity check at all. Combined with item 5, this is a direct path to unauthorized paid enrollment (see item 5's impact — the two should be thought of as one exploit chain, not two independent bugs).

**Technical impact**
Fixing this is low-risk to existing legitimate traffic: real checkout flows already have an authenticated session (the user is logged in when checking out), so requiring `auth()` and deriving `userId` from the session instead of the request body should be transparent to genuine users. The only integration risk is if any internal/test tooling calls this endpoint without a session — audit before deploying.

**Root cause**
`app/api/user/pay/route.ts` (a similar/adjacent endpoint) already does this correctly via `auth()` — this looks like an inconsistency between two checkout-adjacent endpoints built at different times rather than a deliberate design choice, likely because `checkout` predates `user/pay` or was built by someone unaware of the established pattern.

**Recommended solution**
Replace the body-supplied `userId` with the ID from the NextAuth session (`const session = await auth(); if (!session) return unauthorized(); const userId = session.user.id;`), matching the pattern in `app/api/user/pay/route.ts`. Reject the request outright if there's no valid session — do not fall back to the body value even if present, to avoid resurrecting the vulnerability via a bypass.

**Files affected**
- `app/api/checkout/route.ts`
- Reference pattern: `app/api/user/pay/route.ts`
- Any frontend code currently sending `userId` in the checkout request body (`components/checkout/*`) — should be updated to stop sending it (harmless to leave, but should be cleaned up to avoid confusion about the actual trust boundary)

**Implementation complexity:** Low — this is a small, well-precedented change (a working example already exists in the same codebase).

**Risk level:** Medium — low code risk, but checkout is revenue-critical, so any change here needs to go through a real checkout smoke test (place a real order end-to-end in staging) before shipping, not just a unit test.

**Recommended order:** 4 — do immediately after the credential-fallback fix, before item 5, because item 5's payment-verification fix is more effective once order creation itself is trustworthy (fixing payment verification while checkout is still spoofable only closes half the chain).

---

## 5. Fix `payment/verify` signature validation

**Problem**
`app/api/payment/verify/route.ts` is a `GET` handler, unauthenticated, that marks any `orderId` as `PAID` and triggers enrollment creation whenever the caller passes `Status=OK` as a query parameter. The real Zarinpal signature/authority verification is commented out and replaced with a fake/test path.

**Business impact**
Direct, quantifiable revenue loss: anyone who can guess or enumerate an `orderId` can obtain a paid course or investment product for free by hitting a URL. This is the most financially damaging finding in the review — every successful exploitation is a completed free "purchase" that looks legitimate in the order/enrollment tables, making fraud detection after the fact harder (the data doesn't flag itself as anomalous).

**Security impact**
Complete bypass of payment-gateway trust boundary — the endpoint that is supposed to be the single source of truth for "did money actually change hands" trusts a client-supplied query parameter instead of verifying with Zarinpal. This is a textbook broken-authentication/business-logic vulnerability, not a subtle one.

**Technical impact**
Restoring real verification requires re-enabling the (currently commented-out) Zarinpal authority/signature check and handling its full response contract correctly (success, failure, already-verified, and timeout/error cases) — this is more than flipping a flag, since the "fake" path was presumably built to unblock development/testing without live Zarinpal credentials. Expect this to be the most involved P0 fix; budget time for testing against Zarinpal's sandbox environment, not just code review.

**Root cause**
Almost certainly built as a temporary stub during initial payment integration (to allow checkout flow development without live payment-gateway access) and never swapped back to the real implementation before shipping — a classic "temporary code that became permanent" failure, likely because there was no test/checklist gate requiring payment-path review before a release.

**Recommended solution**
1. Re-enable the real Zarinpal authority/signature verification code path (currently commented out) in `payment/verify`.
2. Require the endpoint to independently re-derive the order's expected amount/authority from the database (not trust any client-supplied amount), and verify the returned authority code against Zarinpal's verification API server-to-server before marking anything `PAID`.
3. Add an idempotency check (an order that's already `PAID` should not be re-processed/re-enrolled on a repeat call).
4. Add a regression test that specifically asserts a request with `Status=OK` and a fabricated/invalid authority is rejected — this is the exact case that's currently exploitable, so it should be the first test written.
5. Test end-to-end against Zarinpal's sandbox before production deploy; do not treat unit tests alone as sufficient sign-off for a payment integrity fix.

**Files affected**
- `app/api/payment/verify/route.ts`
- `app/api/checkout/route.ts` (order-creation contract this endpoint depends on — should be fixed first, see item 4)
- Zarinpal SDK integration code (`zarinpal-node-sdk`/`zarinpal-nodejs` usage — confirm which of the two installed SDKs is actually intended to be live)
- Order/enrollment creation logic invoked from this route

**Implementation complexity:** Medium — the verification logic itself is bounded, but requires careful handling of the gateway's response contract and edge cases (network failure, already-verified, mismatched amount).

**Risk level:** High — this is the highest-risk fix to get wrong in the entire plan: too strict and you block real paying customers (direct revenue loss and support burden); too loose and the vulnerability persists in a different form. Requires staged rollout (staging with Zarinpal sandbox → production with close monitoring of the first N real transactions) rather than a single big-bang deploy.

**Recommended order:** 5 — after checkout's auth fix (item 4), before any lower-priority work, given this is the single highest quantifiable business-impact item in the review. Treat items 4 and 5 as one release.

---

## 6. Sanitize news content at render time (stored XSS)

**Problem**
`components/news/NewsArticleDetail.tsx` and `NewsDetail.tsx` render `article.content` via `dangerouslySetInnerHTML` with no sanitization at render time. The only sanitization anywhere in the pipeline is a single pass through the legacy, regex-based (and, per the project's own docs, bypassable) `sanitizeContent` at *creation* time — meaning anything that gets past that weak filter at creation renders unsanitized to every visitor on every subsequent view.

**Business impact**
A successful injection is a stored/persistent XSS affecting every visitor of the article, not just the attacker — this can be used for session/cookie theft, credential phishing overlays, defacement, or (compounded with item 8's CSRF gap) forced actions on behalf of logged-in visitors, including admins who preview/moderate content. Reputational and customer-trust damage from a public-facing exploit is severe for a platform whose business is trust-dependent (education/investment).

**Security impact**
Stored XSS (OWASP A03 — Injection). The regex-based sanitizer this depends on is explicitly documented in the project's own security rules as "inherently bypassable" and legacy — this isn't a hypothetical, it's a known-weak control being relied on as the *only* control.

**Technical impact**
Low — DOMPurify (`isomorphic-dompurify`) is already a project dependency and already used correctly elsewhere (`lib/markdown-processor.ts`). This is adding a sanitization call at the render boundary, not introducing new infrastructure. Minor risk that some previously-rendering (but technically unsafe) markup in existing articles gets stripped post-fix — review a sample of existing published articles after deploying to confirm nothing legitimate breaks.

**Root cause**
Sanitization was implemented once, at content-creation time, under the (incorrect) assumption that "sanitized at write = safe at read forever." This misses that (a) the write-time sanitizer is weak/bypassable, and (b) defense-in-depth means the render boundary — the actual point where untrusted HTML becomes live DOM — should never trust upstream sanitization alone.

**Recommended solution**
Wrap the `article.content` value in DOMPurify's `sanitize()` immediately before passing it to `dangerouslySetInnerHTML`, in both render locations. Do this in addition to (not instead of) fixing/removing the weak creation-time sanitizer eventually (see item 15/16 territory — but the render-time fix is the urgent, self-contained piece). Add a regression test asserting a known XSS payload (e.g., `<img src=x onerror=alert(1)>`) is stripped by the full render path, not just by the creation-time sanitizer in isolation.

**Files affected**
- `components/news/NewsArticleDetail.tsx`
- `components/news/NewsDetail.tsx`
- Reference implementation: `lib/markdown-processor.ts` (existing correct DOMPurify usage)
- `lib/sanitize-content.ts` (flag for follow-up removal once render-time sanitization is confirmed sufficient — do not remove in this pass, to avoid widening scope of an urgent fix)

**Implementation complexity:** Low — a library call at two render sites; the library is already installed and already used correctly elsewhere in the codebase.

**Risk level:** Low — sanitizing output is a strictly safety-improving change; the only realistic regression is overly aggressive stripping of legitimate rich content (tables, embeds), which is easy to catch with a quick visual pass over existing articles.

**Recommended order:** 6 — self-contained, low-risk, high-value; do right after the payment/checkout pair since it doesn't depend on them and is cheap to ship independently.

---

## 7. Admin token TTL / revocation hardening

**Problem**
`admin_access_token` is deliberately non-httpOnly (readable by JS, to support `Authorization: Bearer` usage) with a 24h default lifetime (7d for the refresh token, 30d if "remember me" is checked). Refresh "rotation" issues new token pairs but never invalidates the old ones — there is no server-side revocation list. A captured token (via XSS, log exposure, or interception) remains valid until natural expiry regardless of logout or rotation.

**Business impact**
If an admin session is ever compromised (e.g., via an XSS vector — see item 6, or a compromised admin workstation), the attacker has full admin capability for up to 24h–30d with no way for the team to cut that access short short of rotating the shared JWT secret for *all* admins simultaneously (a blunt, disruptive instrument).

**Security impact**
Missing revocation is a standard gap in stateless-JWT designs, but it's compounded here by the non-httpOnly access token — the design already accepts a higher XSS-exposure tradeoff (to enable Bearer-token usage / CSRF immunity for those requests), which makes the lack of a "kill switch" for a stolen token more consequential than it would be in a purely httpOnly-cookie design.

**Technical impact**
Any revocation mechanism (allowlist/denylist, or short-lived-access + validated-refresh) adds a stateful component to what is currently a fully stateless auth system — a small architectural shift, not just a parameter tweak. Needs a storage location (Redis, or a DB table) and a lookup on every admin request, which adds latency and a new dependency/failure mode to reason about.

**Root cause**
The system was designed as fully stateless JWTs for simplicity, without an explicit decision to accept "no revocation" as a tradeoff — it reads as an omission rather than a deliberate choice (no comment/doc anywhere justifies skipping revocation).

**Recommended solution**
Incremental, in order of effort:
1. **Cheap first step:** shorten the default access-token TTL (e.g., 24h → 1–2h) and require more frequent silent refresh — reduces the exposure window without new infrastructure.
2. **Real fix:** add a lightweight server-side revocation check — a `revokedAt`/`tokenVersion` column on `AdminUser`, checked on every request in `lib/admin-jwt.ts`'s verification path; incrementing it on logout and on suspected compromise invalidates all outstanding tokens for that admin instantly. This is far cheaper than a full session-store migration and fits the existing stateless-JWT design with one DB lookup added.
3. Explicitly log/alert on logout-without-corresponding-revocation gaps if the first step is shipped before the second, so the interim risk is visible to the team, not silently accepted.

**Files affected**
- `lib/admin-auth.ts`
- `lib/admin-jwt.ts`
- `app/api/admin/auth/login/route.ts`
- `app/api/admin/auth/refresh/route.ts`
- `app/api/admin/auth/logout/route.ts`
- Prisma schema: `AdminUser` model (new field for token versioning/revocation)

**Implementation complexity:** Medium — the TTL reduction is trivial; the revocation mechanism is a real (if small) schema + verification-path change touching every admin-authenticated request.

**Risk level:** Medium — get the revocation check wrong (e.g., a caching bug on the version check) and you can lock out legitimate admins or, worse, fail open and revoke nothing. Needs solid test coverage on both the "logout revokes" and "old token after logout is rejected" paths before shipping.

**Recommended order:** 7 — sequenced after item 6 (XSS fix) specifically because it hardens a control whose main threat model (stolen token via XSS) is meaningfully reduced once the one identified stored-XSS vector is closed; doing it before item 6 would be hardening a lock on a door that's still propped open elsewhere.

---

## 8. CSRF / Origin validation on admin mutations

**Problem**
No explicit CSRF token or `Origin`/`Referer` validation exists anywhere in the app. The only CSRF defense is `SameSite=Lax` on cookies, and `middleware.ts` validates JWT presence/validity only — it never inspects request origin.

**Business impact**
In combination with any future or undiscovered XSS/injection vector, this removes a defense-in-depth layer that would otherwise limit blast radius — moderate standalone risk (SameSite=Lax already blocks the classic cross-site-form-POST case in modern browsers), but a meaningful gap in defense-in-depth for a platform handling payments and admin content.

**Security impact**
CSRF (OWASP A01/A05 territory depending on framing) — single-layer defense relying entirely on browser `SameSite` cookie behavior, with no server-side check that a state-changing request actually originated from the app's own frontend.

**Technical impact**
Adding `Origin`/`Referer` validation to admin-mutating routes is low-risk to implement (a header check before whatever comes next runs) but needs to account for legitimate non-browser callers if any exist (internal scripts, health checks) — audit for those before adding a blanket check.

**Root cause**
`SameSite=Lax` was likely judged "good enough" at the time admin auth was built, without an explicit second-layer decision — consistent with the pattern seen elsewhere in this plan of security controls that are partially present but not layered.

**Recommended solution**
Add an `Origin` header check (reject if present and not matching the app's own configured origin(s)) to all state-changing (`POST`/`PUT`/`PATCH`/`DELETE`) routes under `/api/admin/*`, implemented once as shared middleware logic (in `middleware.ts` or a shared helper called from it) rather than per-route, to avoid the kind of drift already seen with CORS (item 14). For routes using the Bearer-token pattern (non-httpOnly access token sent explicitly), note these are already CSRF-immune by construction — prioritize the check for routes that may still rely on ambient cookie auth alone.

**Files affected**
- `middleware.ts`
- Any admin route handlers found to rely on ambient cookie auth without also checking for the Bearer token pattern

**Implementation complexity:** Medium — the check itself is simple, but auditing every admin-mutating route to confirm which auth pattern (Bearer vs ambient cookie) it actually uses takes real investigation time.

**Risk level:** Medium — an overly strict Origin check can break legitimate admin usage from an unexpected but valid origin (e.g., a staging domain not in the allowlist) — needs the same "audit every allowed origin" discipline as item 14's CORS consolidation, and ideally should be done in the same pass.

**Recommended order:** 8 — after the token-hardening item, as part of the same "auth defense-in-depth" batch of work.

---

## 9. Apply security headers / CSP globally

**Problem**
`lib/api-security.ts`'s `addSecurityHeaders`/`securityHeaders` are wired into only 2 of 150 routes. The CSP that does exist allows `'unsafe-inline'` for both `script-src` and `style-src`, which would not have blocked the class of injection described in item 6 even where it is applied.

**Business impact**
Moderate, indirect — security headers are a baseline hardening layer expected by security-conscious customers/partners and audits; their near-total absence is the kind of finding that shows up badly in any third-party security assessment even without a specific active exploit tied to it.

**Security impact**
Missing `X-Frame-Options`/`frame-ancestors` (clickjacking exposure on nearly every page), missing/weak CSP (reduced defense-in-depth against injection even after item 6 lands), and inconsistent application in general — a partial control is easy to mistake for a complete one during future reviews.

**Technical impact**
Applying headers globally via `middleware.ts` or `next.config.ts`'s `headers()` function is low-risk and low-effort; tightening the CSP to remove `'unsafe-inline'` is higher-effort because it requires auditing every inline `<script>`/`<style>` usage across the app and converting them to nonce-based or external, which could be a non-trivial follow-up project on its own.

**Root cause**
The headers helper was built for a specific route (news draft/upload) and never generalized to apply platform-wide — again, a control that exists but was never wired into the shared request pipeline.

**Recommended solution**
Two-phase:
1. **Immediate:** move `addSecurityHeaders` into `next.config.ts`'s `headers()` function (or `middleware.ts` if per-route logic is needed) so it applies to every response by default, using the existing (even if imperfect) CSP as a starting point — this alone closes the clickjacking and "most routes have zero hardening" gaps.
2. **Follow-up (separate, larger effort):** audit inline script/style usage and tighten the CSP to drop `'unsafe-inline'`, using nonces generated per-request in middleware. Track this as its own follow-up item rather than blocking phase 1 on it.

**Files affected**
- `next.config.ts` and/or `middleware.ts`
- `lib/api-security.ts` (the source of truth for the header values, keep as-is for phase 1)

**Implementation complexity:** Low for phase 1 (wiring existing headers globally); Medium-High for phase 2 (CSP tightening).

**Risk level:** Medium — global headers can break things that weren't tested against them (e.g., a legitimately-needed inline script, or an iframe embed the business relies on) — roll out to staging and manually click through admin + key public flows before production.

**Recommended order:** 9 — bundled with items 7–8 as the "close the remaining auth/defense-in-depth gaps" batch.

---

## 10. Real, shared-store rate limiting

**Problem**
The shared in-memory rate limiter (`lib/api-security.ts`) is a per-process `Map` — already documented in the project's own rules as ineffective across multiple instances — and is wired into only 2–3 routes. OTP/SMS-send, login, checkout, and payment-verify endpoints have no rate limiting at all.

**Business impact**
Direct cost exposure via SMS-bombing (each OTP send likely costs money through the SMS provider) and fraud/abuse exposure via unthrottled login attempts (credential stuffing) against both customer and admin auth. In a multi-instance deployment, even the routes that do call the limiter today get effectively no protection, since each instance tracks its own counts.

**Security impact**
No brute-force protection on login endpoints; no abuse protection on cost-bearing SMS endpoints; the one route with its own bespoke limiter (`admin/auth/login`) is at least protected, but inconsistently with everything else, and still per-instance.

**Technical impact**
Requires a shared store (Redis is the standard choice, and would need to be introduced as new infrastructure if not already present in the deployment — confirm with the team/docker-compose setup) or, as a lower-effort interim step, a database-backed counter table if Redis isn't feasible immediately.

**Root cause**
The in-memory approach was presumably fast to build and sufficient for a single-instance deployment at the time; it was never revisited as the app was wired into any multi-instance/serverless deployment target, and adoption across routes was opportunistic rather than systematic.

**Recommended solution**
1. Stand up a shared-store-backed rate limiter (Redis preferred, given it's the standard tool for this and likely straightforward to add alongside the existing `docker-compose.yml` services).
2. Replace the bespoke limiter in `app/api/admin/auth/login/route.ts` and the sparse existing usages of `lib/api-security.ts` with calls to the new shared implementation, keeping the same call-site API where possible to minimize route-level changes.
3. Add rate limiting to: `app/api/auth/login/route.ts`, `app/api/otp/send/route.ts`, `app/api/sms/send-otp/route.ts`, `app/api/auth/send-sms-otp/route.ts`, `checkout`, `payment/verify`, and all `app/api/admin/*` write endpoints, with limits tuned per endpoint's cost/risk profile (SMS endpoints should be the tightest, given direct cost).

**Files affected**
- `lib/api-security.ts`
- `app/api/admin/auth/login/route.ts` (remove bespoke limiter)
- `app/api/auth/login/route.ts`, `app/api/otp/send/route.ts`, `app/api/sms/send-otp/route.ts`, `app/api/auth/send-sms-otp/route.ts`, `app/api/checkout/route.ts`, `app/api/payment/verify/route.ts`
- `docker-compose.yml` (if adding Redis)

**Implementation complexity:** Medium — the shared-store migration is the real work; per-route wiring after that is mechanical.

**Risk level:** Low — rate limiting fails safe in the sense that overly aggressive limits are an availability annoyance (legitimate users occasionally throttled) rather than a security hole; tune conservatively at first and tighten based on real traffic data.

**Recommended order:** 10 — after the auth-hardening batch (items 7–9), since it's a related but independently shippable piece of abuse-prevention infrastructure.

---

## 11. Missing indexes on `Order`, `Transaction`, `User`

**Problem**
`Order`, `Transaction`, and `User` have zero `@@index` annotations beyond implicit FK/unique indexes — no index on `Order.status`, `Transaction.status`/`type`/`createdAt`, or `User.role`/`email`/`createdAt`, despite these being exactly the columns an admin dashboard or reporting query would filter/sort by.

**Business impact**
Degraded admin dashboard and reporting performance that worsens as the order/transaction/user tables grow — likely invisible today at current data volume, but a predictable source of "the admin panel got slow" complaints as the business scales, showing up at the worst possible time (e.g., during a high-traffic sales period, exactly when order/transaction volume spikes).

**Security impact**
None directly, though slow admin queries under load can indirectly degrade the team's ability to respond quickly to a security incident (e.g., searching transaction history during a fraud investigation).

**Technical impact**
Adding indexes is low-risk and reversible; the main technical consideration is that adding indexes to large existing tables can briefly lock/slow writes during migration — schedule during a low-traffic window and confirm MySQL version's `ALGORITHM=INPLACE` support for the specific index types being added.

**Root cause**
Indexes elsewhere in the schema (`Course`, `NewsArticle`, `Comment`, etc.) were added thoughtfully, matching real query patterns — `Order`/`Transaction`/`User` appear to have been missed, possibly because these tables didn't have admin-facing filter/sort UI at the time they were modeled, and indexing wasn't revisited when that UI was added.

**Recommended solution**
Add `@@index([status])` and `@@index([createdAt])` to `Order`; `@@index([status])`, `@@index([type])`, `@@index([createdAt])` to `Transaction`; `@@index([role])` and `@@index([createdAt])` to `User` (confirm actual admin query patterns via a quick grep of `lib/services`/`app/api/admin` `WHERE`/`ORDER BY` usage before finalizing the exact column set — add composite indexes if two of these are commonly filtered together, e.g., `status` + `createdAt`). Ship as a standard Prisma migration.

**Files affected**
- `prisma/schema.prisma` (`Order`, `Transaction`, `User` models)
- New Prisma migration file

**Implementation complexity:** Low — a schema annotation change and a generated migration.

**Risk level:** Low — additive, reversible; the only care needed is around migration timing on large tables in production.

**Recommended order:** 11 — straightforward, no dependencies on prior items; can be batched with item 12 (also a schema change) in one migration/release.

---

## 12. Fix `UserInvestmentPortfolio` cascade behavior

**Problem**
`UserInvestmentPortfolio.userId` uses `onDelete: Cascade`, unlike `Order`/`Transaction`, which correctly use `SetNull`. Deleting a `User` permanently destroys their investment purchase records (`purchasePrice`, `expectedReturn`, `startDate`/`endDate`, `excelFileUrl`).

**Business impact**
Loss of financial/audit records for investment products on user deletion — this is exactly the kind of record a finance or compliance team will expect to exist for tax, dispute-resolution, or regulatory purposes, and inconsistency with how `Order`/`Transaction` are handled means the loss is easy to miss until someone specifically needs an old investment record for a deleted account.

**Security impact**
Data-integrity/audit-trail issue rather than a direct security exploit — but audit-trail gaps are a compliance-relevant finding in financial contexts.

**Technical impact**
Changing `Cascade` to `SetNull` requires the `userId` field to be nullable (if it isn't already) — check the current schema definition; this is a straightforward, low-risk migration given the pattern already exists and works correctly for `Order`/`Transaction` in the same schema.

**Root cause**
Likely an oversight during initial modeling — `Enrollment` and `QuizAttempt` also use `Cascade`, which is *correct* for non-financial progress data, and `UserInvestmentPortfolio` appears to have been modeled following that pattern rather than the financial-record pattern it should actually follow.

**Recommended solution**
Change `UserInvestmentPortfolio.userId`'s relation to `onDelete: SetNull`, matching `Order`/`Transaction`. Confirm the field is nullable in the schema; if not, add nullability as part of the same migration. Add a regression test (or at minimum a manual verification step) confirming a user deletion preserves their portfolio records with `userId` set to null, mirroring however `Order`/`Transaction` are already tested (if they are).

**Files affected**
- `prisma/schema.prisma` (`UserInvestmentPortfolio` model)
- New Prisma migration file

**Implementation complexity:** Low — a one-line relation annotation change plus a migration.

**Risk level:** Medium — not because the change itself is risky, but because user-deletion is a rare, high-consequence operation; get the migration wrong (e.g., forget nullability) and it could fail at delete-time in production rather than at migration-time, which is a worse place to discover it. Test the actual delete path in staging, not just the migration.

**Recommended order:** 12 — batch with item 11 as one schema-change release.

---

## 13. Fix N+1 in `user/orders` + add pagination/filtering to `courses` route

**Problem**
Two related but distinct issues: (a) `app/api/user/orders/route.ts` issues one additional `prisma.course.findMany` per order after the initial paginated fetch (parallelized, but still N extra round-trips per page); (b) `app/api/courses/route.ts` runs an unpaginated, unfiltered `SELECT * FROM Course ORDER BY createdAt DESC` that also fails to filter out unpublished courses (unlike its Prisma-based sibling implementation, `getCoursesByPrisma()`).

**Business impact**
(a) is a latency/scalability concern that worsens as users accumulate order history — currently probably invisible, will not stay that way. (b) is worse: it means unpublished/draft courses are potentially visible to the public via this endpoint, and the endpoint's response size grows unbounded with catalog size, both a performance and a **content-exposure** issue (draft/unfinished course listings shown to the public).

**Security impact**
(b) is a real, if lower-severity, data-exposure issue: draft/unpublished courses (which may contain incomplete pricing, placeholder content, or internal notes) are exposed through a public, unauthenticated endpoint.

**Technical impact**
(a): replace the per-order course lookup with a single batched query using an `IN` clause across all course IDs referenced by the page's orders, then map results back in memory — a standard N+1 fix with no behavior change to the response shape. (b): add the same `published: true` filter and pagination already implemented correctly in `getCoursesByPrisma()`; ideally, retire the raw-SQL route entirely in favor of the already-correct Prisma implementation (this overlaps with item 16's broader Prisma-vs-raw-SQL decision — treat the urgent fix here as filtering+pagination now, and the "which implementation survives" question as part of item 16).

**Root cause**
(a): a natural but suboptimal pattern (map over results, fetch related data per item) that wasn't caught because it "works" and Promise.all parallelization masks the latency at low order-history volumes. (b): the raw-SQL route was seemingly written independently of (and earlier or later than) `getCoursesByPrisma()`, without either implementation being retired once the other existed — see item 16.

**Recommended solution**
(a) In `app/api/user/orders/route.ts`, collect all course IDs across the page's orders first, run one `prisma.course.findMany({ where: { id: { in: courseIds } } })`, then join in memory when building the response.
(b) In `app/api/courses/route.ts`, add `published: true` (or the raw-SQL equivalent `WHERE published = 1`) and standard `LIMIT`/`OFFSET` pagination matching the convention used elsewhere (`paginatedResponse` from `lib/api-response.ts`).

**Files affected**
- `app/api/user/orders/route.ts`
- `app/api/courses/route.ts`
- Reference: `lib/services/course.server.ts` (`getCoursesByPrisma()`)

**Implementation complexity:** Medium — (a) is a small, well-understood refactor; (b) requires deciding whether to patch the raw-SQL query in place or switch the route to call the existing Prisma function (the latter is less code but touches more of the route's structure).

**Risk level:** Low — both changes make behavior stricter/more correct (no unpublished courses, batched queries returning the same data) rather than changing what legitimate users see, beyond removing draft-course leakage, which is the intended fix.

**Recommended order:** 13 — no dependency on items 11/12 but naturally grouped with them as the "data-layer correctness" batch.

---

## 14. Consolidate CORS and rate-limiter implementations

**Problem**
CORS allow-lists exist independently in `lib/api-response.ts` (`ALLOWED_ORIGINS`) and `lib/cors.ts` (`getCorsHeaders`) — already confirmed drifted (one includes an origin the other lacks). Rate limiting exists as both the shared `lib/api-security.ts` implementation and a separate bespoke limiter hand-rolled in `app/api/admin/auth/login/route.ts`.

**Business impact**
Drifted CORS lists mean the two "sources of truth" for what's allowed can disagree — in the safer direction that's a false-positive block (annoying, visible, gets reported and fixed), but in the riskier direction it can mean an origin is allowed by one code path that the team believes is blocked everywhere, silently widening the actual attack surface beyond what anyone reviewing `lib/api-response.ts` alone would conclude.

**Security impact**
Two independently-maintained security-relevant allow-lists is a maintainability risk that becomes a security risk the moment they disagree in the permissive direction — this should be treated as a "fix before it bites" item, not just tech debt.

**Technical impact**
Consolidating into one module is mechanical once the actual union of "correct" origins is determined — the main work is auditing both lists, understanding why they differ (is one intentionally broader for a reason, or is it just drift?), and picking the single correct list before merging.

**Root cause**
Two CORS helpers were built at different times (likely for different route groups) without either author being aware of the other — the project's own docs already flag this as a known, named issue rather than something newly discovered here.

**Recommended solution**
1. Audit both `ALLOWED_ORIGINS` (`lib/api-response.ts`) and the list in `lib/cors.ts`, reconcile to a single correct origin list (checking with whoever owns deployment config for what origins are actually legitimate, e.g., the extra `NEXT_PUBLIC_CMS_URL`-based origin).
2. Pick one module as canonical (recommend keeping `lib/cors.ts`'s `getCorsHeaders` if it's the more complete/current implementation, or vice versa — this is a judgment call for whoever does the audit) and have the other re-export/delegate to it, then eventually delete the duplicate once all call sites are migrated.
3. Do the same consolidation for rate limiting: replace `app/api/admin/auth/login/route.ts`'s bespoke limiter with a call to the shared implementation from item 10, once that's shared-store-backed.

**Files affected**
- `lib/api-response.ts`
- `lib/cors.ts`
- `app/api/admin/auth/login/route.ts`
- Any route currently importing either CORS helper (grep both `getCorsHeaders` and `addCorsHeaders` usage before starting)

**Implementation complexity:** Medium — low code complexity, but real investigation time needed to safely reconcile two allow-lists without breaking a legitimate integration that depends on the currently-wider one.

**Risk level:** Medium — the same "could break a legitimate but under-documented integration" risk as item 8's Origin check; do this audit carefully and communicate the final allow-list to the team before merging.

**Recommended order:** 14 — after the rate-limiting infrastructure work (item 10) is in place, since the rate-limiter half of this item depends on it; the CORS half has no such dependency and could be done earlier if convenient.

---

## 15. Delete dead news editors and dead seed scripts

**Problem**
Three abandoned news-editor implementations (`RichNewsEditor.tsx`, `NewsEditorEnhanced.tsx`, `MDXNewsEditor.tsx` + two unlinked `create-mdx*` admin routes, ~1,400+ lines total) have zero or no-nav-linked importers, alongside the one actually shipped (`NewsEditor.tsx`). Five dead/duplicate seed scripts at `prisma/` root shadow their live counterparts in `prisma/seeds/`.

**Business impact**
Primarily a velocity/quality tax: new contributors waste time figuring out which editor is "real" (this review's own research took real effort to trace the live path), bug reports against the dead editors are a false lead, and the dead seed scripts are a landmine for a future contributor who edits the wrong one and can't figure out why their changes don't show up.

**Security impact**
Minimal directly, though dead code is attack surface that still gets bundled/shipped in some cases (see item 18's bundle-size note) and still needs to be reasoned about during future security reviews (this review had to explicitly rule out the dead editors as live risk, which cost real analysis time that a security review under time pressure might not spend).

**Technical impact**
Pure deletion — confirm zero importers (already done for the editors during this review's research; re-verify at delete time in case something changed) and zero references in `npm run seed`'s dependency chain (already confirmed — only `prisma/seeds/seed-all.ts` and its imports are live) before removing.

**Root cause**
Iterative feature development (multiple attempts at a "better" news editor, multiple seed-script rewrites) without a cleanup step once the winning implementation was chosen — the classic pattern of migrations that succeed at building the replacement but never finish by removing the original.

**Recommended solution**
Delete: `components/admin/news/RichNewsEditor.tsx`, `components/news/NewsEditorEnhanced.tsx`, `components/news/MDXNewsEditor.tsx`, `app/admin/news/create-mdx/page.tsx`, `app/admin/news/create-mdx-example/page.tsx`, and their editor-only supporting components if not shared with the live `NewsEditor.tsx`. Delete `prisma/seed.ts`, `prisma/seed-simple.js`, `prisma/landings-seed.js`, `prisma/seed-admin.ts` (root), `prisma/persian-data-generator.ts` (root) — keeping only the `prisma/seeds/` versions. Re-run `grep -r` for each filename across the repo immediately before deleting, as a final safety check.

**Files affected**
- `components/admin/news/RichNewsEditor.tsx`
- `components/news/NewsEditorEnhanced.tsx`
- `components/news/MDXNewsEditor.tsx`
- `app/admin/news/create-mdx/page.tsx`
- `app/admin/news/create-mdx-example/page.tsx`
- `prisma/seed.ts`, `prisma/seed-simple.js`, `prisma/landings-seed.js`, `prisma/seed-admin.ts`, `prisma/persian-data-generator.ts` (all root-level, not the `prisma/seeds/` versions)

**Implementation complexity:** Low — deletion plus a final grep-based safety check per file.

**Risk level:** Low — these are already-confirmed-dead code paths; the only risk is an incomplete importer-check missing an edge case, mitigated by re-verifying immediately before deletion rather than relying solely on this review's earlier research.

**Recommended order:** 15 — first P2 item; cheap, safe, immediate clarity win, good first task once the P0/P1 batch is shipped.

---

## 16. Decide Prisma-only vs raw-SQL-only per domain

**Problem**
Several domains (`news`, `library`, `investment-models`, `skyroom`, and effectively `courses`) have two independent, sometimes behaviorally-divergent implementations of the same data access — a Prisma path and a raw-SQL (`-mysql.ts`) path. The `courses` listing divergence (item 13) is the clearest proven example of this causing an actual bug (unpublished courses leaking through one path).

**Business impact**
Ongoing risk of exactly the kind of divergence found in item 13 recurring in any of the other split domains, each time manifesting as a confusing, hard-to-reproduce bug ("why does this show different data depending on which endpoint I hit") that costs debugging time and erodes trust in the data layer.

**Security impact**
Any future divergence carries the same risk class as item 13(b) — one implementation enforcing an access/visibility rule (e.g., `published`, `draft`, ownership) that the other omits.

**Technical impact**
This is the largest, highest-effort item in the plan. For each split domain, someone has to (a) enumerate every behavioral difference between the two implementations (filters, ordering, pagination defaults, included relations), (b) decide which behavior is correct, (c) migrate all call sites to the single surviving implementation, and (d) delete the other. Given the project's own stated preference for Prisma on new code, Prisma should be the default winner unless a specific domain has a proven reason (e.g., a query Prisma can't express efficiently) to keep raw SQL.

**Root cause**
Prisma was adopted after some domains already had working raw-SQL implementations, and rather than migrating existing domains wholesale, new Prisma-based code was added alongside the old raw-SQL code without retiring it — a common outcome of incremental adoption without a dedicated migration project.

**Recommended solution**
Treat this as its own mini-project, one domain at a time, in order of risk (courses first, since item 13 already proved a real divergence there — treat item 13's fix as the first slice of this larger item, not a separate, finished task). For each domain: diff behavior, pick Prisma (default) or raw SQL (only with a documented reason), migrate call sites, delete the loser, add a regression test asserting the specific behavior that was previously divergent (e.g., "unpublished courses never appear in the public listing").

**Files affected**
- `lib/services/news-mysql.ts` / `lib/services/news-service.ts`
- `lib/services/library-mysql.ts` / `lib/services/library-service.ts`
- `lib/services/investment-models-mysql.ts` / `lib/services/investment-models-service.ts`
- `lib/services/skyroom-mysql.ts` / `lib/services/skyroom-service.ts`
- `app/api/courses/route.ts` / `lib/services/course.server.ts`
- All route handlers calling into any of the above

**Implementation complexity:** High — genuinely large in scope (multiple domains, many call sites), and requires careful behavioral verification per domain, not just a mechanical refactor.

**Risk level:** High — this is exactly the kind of change that can introduce new divergences while fixing old ones if not done with real regression tests per domain; do not attempt as one big-bang change across all domains — one domain per release, with its own test coverage, starting with `courses` (already partially scoped via item 13).

**Recommended order:** 16 — deliberately sequenced as a longer-running, lower-urgency project that starts after the immediate P0/P1 batch and item 15's quick wins; expect this to span multiple releases rather than a single sprint.

---

## 17. Resolve `Order.items`/tags schema duplication

**Problem**
`Order.items` is stored as a JSON blob that duplicates the normalized `OrderItem` table sitting right next to it in the schema — two sources of truth for the same order line items. Separately, `NewsArticle` and `DigitalBook` each have both a JSON `tags` field and a proper join-table-based tag relation (`NewsArticleTags`, `DigitalBookTags`).

**Business impact**
Any code path that writes to only one of the two representations (JSON vs normalized) silently desyncs order/tag data from what admin tooling or reporting queries against the "other" representation will show — a subtle, hard-to-detect correctness bug class rather than an acute incident, but one that erodes trust in reports/exports over time as the two representations quietly drift.

**Security impact**
None directly — this is a data-integrity issue, not an access-control one.

**Technical impact**
Resolving this requires a real data migration: determine which representation is currently authoritative in practice (check which one every write path actually updates), backfill the other from it if they've already drifted, then remove the redundant field and update every read path to use only the surviving one. This is schema surgery on tables with real production data (orders, in particular, are not safe to get wrong) — plan as a proper migration project with a backfill script, verification step, and rollback plan, not a quick schema edit.

**Root cause**
Likely an artifact of iterative development — a JSON field was probably the original quick implementation, and a normalized table was added later for better querying/reporting without the original JSON field being retired, mirroring the exact same "add the new thing, forget to remove the old thing" pattern as items 15 and 16.

**Recommended solution**
1. Audit every write path to `Order.items` and to `NewsArticle`/`DigitalBook`'s JSON `tags` fields vs. their respective join tables — determine actual current authoritative source per field.
2. Write a backfill/reconciliation script to bring both representations in sync as a starting point, and to flag any rows where they've already diverged (surface these to whoever owns order/content data for manual review before proceeding).
3. Pick the normalized table as the long-term source of truth in both cases (consistent with how the rest of the tagging system already works via join tables), update all read/write paths to use it exclusively, then drop the JSON field in a follow-up migration once all call sites are confirmed migrated.

**Files affected**
- `prisma/schema.prisma` (`Order`, `NewsArticle`, `DigitalBook` models)
- All write paths to `Order.items` (checkout/order-creation code, `app/api/checkout/route.ts` and related admin order-management routes)
- All write paths to `NewsArticle.tags`/`DigitalBook.tags` JSON fields vs. their join-table equivalents
- New Prisma migrations (backfill + eventual field removal)

**Implementation complexity:** High — real data migration with a backfill/reconciliation step against production data, not a simple schema tweak.

**Risk level:** High — the `Order.items` half of this touches financial/order data directly; a mistake in the backfill or an incomplete audit of write paths could corrupt order history. Requires a written migration plan reviewed separately from this document, a backup/rollback strategy, and ideally a dry run against a production data snapshot before executing against live data.

**Recommended order:** 17 — sequenced after item 16 (the broader Prisma-vs-raw-SQL project) since resolving which implementation is authoritative for a domain is a natural prerequisite to resolving which schema representation within that domain is authoritative; do not rush this ahead of establishing that foundation.

---

## 18. `error.tsx`/`loading.tsx` boundaries + admin SSR conversion

**Problem**
Zero route-level `loading.tsx`/`error.tsx` boundaries exist anywhere in the app tree (only a single root `not-found.tsx`). The entire admin panel (18/18 pages) is `"use client"`, forfeiting SSR/streaming entirely; several public pages are nominally server components but are thin passthrough shells to fully client-rendered content.

**Business impact**
Poor perceived performance (blank screens during data fetches, no loading skeletons) and poor resilience (an unhandled error in a server component has no graceful boundary, degrading to Next's generic error UI) directly affect user experience and, for the admin panel, staff productivity on every page load.

**Security impact**
None directly, though an unhandled server-component error with no boundary can, in some configurations, be more likely to leak stack traces/internal details to the client than a properly caught one — worth confirming Next's default error UI behavior in production mode as part of this work.

**Technical impact**
Adding `loading.tsx`/`error.tsx` is additive and low-risk. Converting admin pages to server components with client islands is a real, page-by-page refactor — each page needs its data-fetching logic split from its interactive logic, which is nontrivial for the larger admin CRUD pages already flagged as oversized (500+ lines) elsewhere in the review.

**Root cause**
The admin panel appears to have been built client-first from the start (possibly to reuse patterns/libraries more easily, or simply as the default habit of whoever built it), without revisiting the SSR tradeoff once the app matured — consistent with the broader pattern of features shipped pragmatically without a later architecture pass.

**Recommended solution**
Phase 1 (quick, do first): add a root `error.tsx`/`loading.tsx`, plus per-route versions for the highest-traffic pages (courses, news, checkout, and the admin dashboard) — this alone meaningfully improves perceived resilience and loading UX with minimal risk.
Phase 2 (larger, schedule separately): convert the highest-value admin list pages (courses, news, library listings — the ones with the most daily staff usage) to server components fetching data server-side, with client components only for interactive pieces (forms, editors, filters). Treat each page as its own small project given the complexity already noted in the giant-component findings.

**Files affected**
- New files: `app/error.tsx`, `app/loading.tsx` (if not already sufficient), plus per-route equivalents under `app/(routes)/courses/`, `app/(routes)/news/`, `app/(routes)/checkout/`, `app/admin/dashboard/`
- `app/admin/courses/**`, `app/admin/news/**`, `app/admin/library/**` (phase 2 server-component conversion)

**Implementation complexity:** Low for phase 1; High for phase 2 (real per-page refactor work across the largest, most complex pages in the app).

**Risk level:** Low for phase 1; Medium for phase 2 — converting a working client-rendered page to a server/client split risks subtly changing behavior (loading states, error handling, client-only browser API usage) if not tested carefully page by page.

**Recommended order:** 18 — phase 1 can run any time after the P0/P1 batch; phase 2 is a longer-running effort best scheduled alongside item 16's domain-by-domain work, since both touch the same admin list pages.

---

## 19. Unify date formatting

**Problem**
Three uncoordinated date-formatting strategies coexist in production: `date-fns-jalali` (1 file), `date-fns` + `faIR` locale strings without actual Jalali conversion (news components — rendering Gregorian-numbered dates on a Persian-first site), and native `Intl`/`toLocaleDateString('fa-IR')` (~30+ call sites). Two call sites omit the locale argument entirely, silently defaulting to Gregorian.

**Business impact**
Visible, user-facing inconsistency on a platform whose entire UX is built around being Persian-first — a Persian-speaking user seeing Gregorian dates on news articles (while checkout correctly shows Jalali) reads as unpolished/untrustworthy, disproportionate to how small the underlying bug is.

**Security impact**
None.

**Technical impact**
Low-risk, mechanical find-and-replace once a single helper is chosen, but touches many files (~30+ call sites) so needs a careful sweep rather than a quick fix, and should include the two locale-missing bugs as explicit test cases to prevent regression.

**Root cause**
No single date-formatting utility was established as the required convention early on, despite `lib/utils.ts` already containing a `toLocaleDateString('fa-IR')` helper that most call sites don't actually use — they inline the call instead, which is how the drift and the two locale-missing bugs both happened.

**Recommended solution**
Standardize on the existing `lib/utils.ts` helper (or, if Jalali calendar conversion is actually required — not just Persian numerals/locale strings — standardize on `date-fns-jalali` and update the helper to wrap it), then sweep every inline `toLocaleDateString`/`toLocaleString`/`date-fns` call site for user-facing dates and replace with the single helper. Add an ESLint rule or a simple grep-based CI check discouraging direct `toLocaleDateString`/`date-fns` imports for date rendering outside the helper, to prevent regression.

**Files affected**
- `lib/utils.ts` (the canonical helper to standardize on/extend)
- `components/checkout/result.tsx` (currently the only `date-fns-jalali` user)
- `components/news/NewsArticleDetail.tsx`, `components/news/ArticlePreviewCard.tsx`, `components/news/NewsDetail.tsx` (date-fns + faIR-locale-only usage)
- `app/admin/news/page.tsx` (locale-missing bug)
- `lib/hooks/useDraftRestoration.ts` (locale-missing bug)
- ~30 additional call sites using native `Intl`/`toLocaleDateString('fa-IR')` inline (enumerate via `grep -rn "toLocaleDateString\|toLocaleString" --include=*.tsx --include=*.ts`)

**Implementation complexity:** Low per-site, but broad in scope (many files) — budget for a dedicated sweep rather than treating it as a five-minute fix.

**Risk level:** Low — purely a display-layer change; worst case is a formatting regression that's immediately visible and easy to catch in review/QA.

**Recommended order:** 19 — low urgency, safe to schedule as ordinary cleanup work any time after the P0/P1 batch.

---

## 20. Fix `cart-store.ts` server-state snapshotting

**Problem**
`stores/cart-store.ts` persists full snapshotted `Course` server entities (including `price`) to `localStorage` via Zustand's `persist` middleware, rather than storing just an ID/type/quantity and joining against live server data.

**Business impact**
If a course's price changes while it sits in a user's cart, the user sees and can potentially check out at the stale, pre-change price — a direct revenue/pricing-integrity risk, not just a staleness annoyance, since checkout presumably uses whatever price the cart last knew about rather than re-validating server-side (verify this specifically as part of the fix — if checkout *does* re-validate price server-side already, this becomes a lower-severity "confusing UI" issue rather than a pricing bug, but this should be confirmed, not assumed).

**Security impact**
None directly, though it's worth confirming as part of this fix that checkout/payment logic never trusts the client-persisted price for actual charge calculation — if it does, that's a more serious finding than currently scoped and should be escalated.

**Technical impact**
Refactoring the store to hold only lightweight references (`id`, `type`, `quantity`) and reading live price/details from the React Query cache (already fetched via `useCourses`/equivalent hooks) is a contained change to the cart store and whatever components render cart contents — needs care to avoid a loading-state regression (cart item exists but its live details haven't loaded yet).

**Root cause**
Likely built for simplicity/offline-resilience (a self-contained cart that doesn't need a live query to render) without considering the staleness implication for a mutable field like price — a reasonable first implementation that wasn't revisited once the staleness risk became apparent.

**Recommended solution**
1. First, verify/confirm whether checkout re-validates price server-side against the current `Course.price` at order-creation time regardless of what the cart sent — if not, fix that first (this is more urgent than the store refactor itself, since it's the actual point where stale pricing could become a real charge).
2. Refactor `cart-store.ts` to persist only `id`/`type`/`quantity`, and have cart-rendering components join against the React Query cache (`useCourses`/relevant hook) for live price/title/availability, consistent with the project's own stated convention of not duplicating server state into Zustand.

**Files affected**
- `stores/cart-store.ts`
- Cart-rendering components (`components/checkout/**`, wherever cart contents are displayed)
- `app/api/checkout/route.ts` (verify/add server-side price re-validation as part of this item, not just item 4's auth fix)

**Implementation complexity:** Low — a contained store/component refactor, plus a verification step on the checkout price logic.

**Risk level:** Medium — cart/checkout is revenue-critical UI; needs a real end-to-end test (add to cart, wait, simulate a price change, checkout) before shipping, not just a unit test on the store in isolation.

**Recommended order:** 20 — after the broader checkout work (items 4–5) is stable, since it touches the same checkout surface and is safer to layer on top of an already-hardened checkout flow than to interleave with it.

---

## 21. Re-scope or close `enterprise-architecture-refactor` OpenSpec proposal

**Problem**
`openspec/changes/enterprise-architecture-refactor/tasks.md` marks every phase "Not Started," yet its Phase 1 SSH-key/root-script cleanup was already completed in a separate, untracked commit (`92388058`). The proposal's tracked status is now out of sync with reality in both directions — some described work is done without the plan reflecting it, and most described work (component consolidation, service-layer flattening, directory restructuring) remains genuinely undone.

**Business impact**
A stale planning document that looks authoritative (it's detailed, structured, and lives in the repo's official planning location) but doesn't reflect reality is worse than no document — it will mislead the next person who opens it into either redoing already-done work or trusting task statuses that aren't accurate.

**Security impact**
None directly.

**Technical impact**
This is a documentation/process fix, not a code fix — updating `tasks.md` to reflect actual current state, and making an explicit team decision about whether the remaining scope (directory restructuring into `features/`/`shared/`/`server/`, service-layer flattening, component consolidation) is still wanted, given that several of its goals now overlap directly with items 15 and 16 in this plan.

**Root cause**
The proposal was written as a large, multi-session (17.5-hour estimated) plan, and work on it appears to have stalled after only the lowest-effort cleanup piece was done (likely opportunistically, outside the formal plan) — a common outcome for large, unscheduled refactor proposals that compete with feature work for engineering time.

**Recommended solution**
Hold a short planning conversation (not part of this remediation execution) to decide one of two paths: (a) **re-scope and schedule** — update `tasks.md` to mark Phase 1's completed pieces as done, explicitly fold the overlapping scope from items 15/16 of this plan into it so there's one tracked source of truth instead of two, and schedule the remaining phases with real owners/timelines; or (b) **close it** — mark the proposal as superseded by the more surgical, prioritized approach in this remediation plan, and archive it per the existing `openspec/changes/archive` convention, so it stops being a stale, misleading artifact. Either outcome is acceptable; leaving it in its current inconsistent state is the only wrong answer.

**Files affected**
- `openspec/changes/enterprise-architecture-refactor/tasks.md`
- `openspec/changes/enterprise-architecture-refactor/proposal.md`
- Possibly moved to `openspec/changes/archive/` depending on the decision

**Implementation complexity:** Low — this is an update to planning documents, not code.

**Risk level:** Low — no runtime risk; the only "risk" is a team-alignment conversation that needs to actually happen rather than being silently skipped again.

**Recommended order:** 21 — last, since it's a process/documentation item best resolved once the team has seen how items 15 and 16 (which overlap with this proposal's scope) actually played out, informing a more realistic re-scope if that path is chosen.

---

## Summary: Suggested Release Batches

- **Release 1 (this week):** items 1–6 — the full P0 security/integrity fix set, plus its two prerequisites (`.env.example`, checkout auth ordering). This is the only batch that should be treated as urgent enough to interrupt other work.
- **Release 2 (this sprint):** items 7–10 — auth/defense-in-depth hardening (token TTL, CSRF, headers, rate limiting), shippable as one coordinated "harden the auth boundary" effort.
- **Release 3 (this sprint or next):** items 11–14 — data-layer correctness and consolidation (indexes, cascade fix, N+1/pagination, CORS/rate-limiter dedup).
- **Ongoing (next 1–2 quarters, not blocking):** items 15–21 — dead code removal, the Prisma-vs-raw-SQL migration project, schema deduplication, SSR conversion, date unification, cart-store fix, and OpenSpec proposal resolution. Track these as a standing backlog rather than a single release; several (16, 17) are genuinely multi-release efforts that should not be rushed to hit an arbitrary deadline given their High risk ratings.
