# Pishro Platform — Architecture Review

**Scope:** full-stack review of the Next.js 15 App Router codebase (frontend, backend/API, database, auth, storage, security, performance, technical debt).
**Method:** static review of source, schema, migrations, and configuration. No code was modified. No dynamic/runtime penetration testing was performed — findings are from source inspection and should be validated against the running system before remediation is marked complete.
**Snapshot:** `main` @ `fe36dcf`, 1,175 tracked files, 150 API route handlers, 45 Prisma models, 34 service modules.

---

## 1. Current Architecture

Pishro is a Persian-language education/investment platform (courses, digital library, news, investment products) built on:

- **Framework:** Next.js 15, App Router, React 19, Turbopack dev server.
- **Routing:** `app/(routes)/` (public site, 22 pages), `app/admin/` (admin panel, 18 pages), `app/api/` (150 route handlers: 71 admin, 16 debug, 63 public/customer).
- **Data access — two independent layers against one physical MySQL database:**
  - Prisma (`prisma/schema.prisma`, 45 models, via `lib/prisma.ts`) — the primary/declared layer.
  - A raw `mysql2` pool (`lib/db.ts`, `query`/`queryOne`/`execute`) — used by customer auth, several admin-auth paths, and ~17 of 150 route handlers directly, plus the `-mysql.ts` half of several `lib/services/` domains.
  - Of 150 routes: 69 use Prisma, 17 use raw SQL directly, and the rest call into a service layer that itself picks one or the other per domain.
- **Two independent authentication systems:**
  - **Customer auth:** NextAuth v5 (`auth.ts`), Credentials provider, JWT session (30-day `maxAge`), `authorize()` does a parameterized raw-SQL lookup and a real `bcryptjs.compare`.
  - **Admin auth:** a custom JWT implementation (`lib/admin-auth.ts` issuing, `lib/admin-jwt.ts` Edge-safe verification), `admin_access_token` (non-httpOnly by design) / `admin_refresh_token` (httpOnly) cookies, enforced centrally by `middleware.ts` on `/admin/:path*` and `/api/admin/:path*` only.
- **File storage — two independent mechanisms:**
  - Local disk (`lib/services/storage-adapter.ts`) for images/books, served through `/api/uploads/[...path]`, path-traversal-guarded by `assertSafeStoragePath`.
  - S3-compatible object storage (`lib/services/object-storage-service.ts`) for course video/HLS, private-by-default via short-lived signed URLs (1h upload / 5min download).
- **Video pipeline:** ffmpeg-based HLS transcoding designed to run in a separate `video-processor` Docker container, decoupled from the Next.js process — correctly architected.
- **Frontend:** TanStack React Query (per-domain query-key factories, thoughtfully tuned `staleTime`), Zustand for client-only state, react-hook-form + Zod (schemas shared client/server where wired up), shadcn/ui "new-york" + Tailwind, RTL/Persian-first with Jalali date requirements.
- **Process:** OpenSpec (`openspec/`) governs planning for non-trivial changes. Notably, `openspec/changes/enterprise-architecture-refactor/` is an **existing, unexecuted proposal that already diagnoses a large share of the findings in this review** (component duplication, giant components, redundant service wrappers, root-directory clutter) — see §6 and §8.

This is a system that grew fast, feature-first, with two of almost everything (auth systems, data layers, storage mechanisms, CORS lists, rate limiters, news editors, course-listing implementations). None of the dualities are inherently wrong in isolation, but the seams between them are where the highest-severity issues in this review live.

---

## 2. Strengths

Worth stating plainly — this is not a codebase in crisis, and several decisions reflect real engineering judgment:

- **No classic SQL injection found.** Every raw-SQL call site reviewed across `lib/db.ts` consumers uses parameterized `?` placeholders with a values array, including dynamic `UPDATE ... SET` builders that assemble column lists from fixed allow-lists, not user-supplied keys.
- **Real password hashing.** Customer auth uses `bcryptjs.compare` against a stored hash, not a naive equality check.
- **Fail-closed middleware.** `verifyAdminAccessTokenForMiddleware` explicitly returns `false` (never throws) on malformed/expired tokens — a stale cookie degrades to an anonymous request instead of a 500, and the design intent is documented in a comment.
- **Object storage is private-by-default.** Video/HLS access goes through short-lived signed URLs; the one `getPublicUrl()` helper that would expose objects publicly has zero call sites.
- **Path traversal is actually handled correctly.** `assertSafeStoragePath` normalizes separators, strips leading slashes, and rejects any resolved path escaping the storage root — and it's consistently used at every upload/read call site found.
- **Financial-record deletion semantics are mostly right.** `Order` and `Transaction` use `onDelete: SetNull` on their `User` relation, preserving the audit trail if a user is deleted — the correct choice for anything resembling a financial ledger (with one notable exception, §4).
- **React Query tuning is domain-aware, not boilerplate.** `staleTime`/`gcTime` differ meaningfully by domain (e.g., 10-minute staleTime for courses because "courses change less often," 0/0 for video state) with Persian comments explaining the reasoning — this is a hook layer someone actually thought about.
- **Indexing is good where it matters most for traffic:** `Course`, `NewsArticle`, `Comment`, `Quiz`, `Lesson`, `QuizAttempt` all carry composite indexes matching their real filter/sort patterns.
- **The team has already self-diagnosed much of the structural debt.** The `enterprise-architecture-refactor` OpenSpec proposal independently identifies component duplication, giant components, and redundant service layers — the same issues this review surfaces from a fresh read. That's a healthy sign, even though execution stalled (§6).
- **Security-relevant tests exist**: `admin-jwt-middleware.test.ts`, `sanitize-content.test.ts`, `security.integration.test.ts` — the team is testing auth/security surface, not just business logic.

---

## 3. Weaknesses

Structural and consistency issues that aren't acute security risks but actively cost velocity and invite regressions.

### 3.1 Duplicated cross-cutting logic (no single source of truth)
| Concern | Duplication |
|---|---|
| CORS allow-list | `lib/api-response.ts` (`ALLOWED_ORIGINS`) vs `lib/cors.ts` (`getCorsHeaders`) — independently edited, already drifted (`lib/cors.ts` includes an extra origin the other lacks). |
| Rate limiting | Shared `lib/api-security.ts:checkRateLimit` vs a bespoke, separate limiter hand-rolled inside `app/api/admin/auth/login/route.ts` — the single most security-sensitive endpoint reinvents its own throttling instead of reusing the shared one. |
| Course listing | `app/api/courses/route.ts` (raw SQL, **no `published` filter, no pagination**) vs `lib/services/course.server.ts:getCoursesByPrisma()` (Prisma, filters `published:true`, paginated) — two implementations of "list courses" with **different visible results** depending on which is called. |
| News comments | `Comment` (generic) and `NewsComment` (near-identical shape) are two parallel models/services for what is conceptually one feature. |
| Tag storage | `NewsArticle` and `DigitalBook` each have **both** a JSON `tags` field **and** a proper `NewsArticleTags`/`DigitalBookTags` join table — two sources of truth for the same relationship, clear migration leftover. |

### 3.2 Response/API inconsistency
- 114 of 150 routes use the `lib/api-response.ts` JSend envelope; the other **29 use ad hoc `NextResponse.json()`** with inconsistent shapes (`{status,message,user}` vs `{success,error}` vs bare `{error}`), concentrated in debug routes, admin auth, and several news/upload endpoints.
- `app/api/news/route.ts` and `app/api/newsletter/subscribe/route.ts` instantiate `new PrismaClient()` locally instead of importing the shared singleton from `lib/prisma.ts` — a connection-pool-exhaustion risk under load or during Next.js hot-reload in dev.

### 3.3 Frontend: SSR benefit is mostly theoretical
- The admin panel is **100% `"use client"`** (18/18 pages) — zero server rendering, zero streaming, in a framework chosen specifically for those capabilities.
- Public pages are nominally server components but several are thin passthrough shells whose entire body is a client component doing its own client-side fetch (`app/(routes)/news/page.tsx`, `app/(routes)/(home)/page.tsx` — SSR is used only for `generateMetadata`, not content). Genuine server-side data fetching (`app/(routes)/courses/page.tsx`, which queries the DB directly in the page) is the exception rather than the pattern.
- **Zero route-level `loading.tsx`/`error.tsx` boundaries exist anywhere in the tree** — only a single root `not-found.tsx`. Any thrown error or slow fetch has no graceful boundary.
- A stray malformed directory `app/admin/library/\[id\]` (literal escaped brackets from a bad `mkdir`) sits dead alongside the real `[id]` route.

### 3.4 Dead code
- **Three abandoned news editor implementations** (`RichNewsEditor.tsx` 574 ln, `NewsEditorEnhanced.tsx` 392 ln, `MDXNewsEditor.tsx` 507 ln + two unlinked `create-mdx*` admin routes) — ~1,400+ lines with zero or no-nav-linked importers, alongside the one actually shipped (`NewsEditor.tsx`, 499 ln, imported from `app/admin/news/create/page.tsx`).
- **Five dead/duplicate seed scripts** at `prisma/` root (`seed.ts` 57KB, `seed-simple.js`, `landings-seed.js`, `seed-admin.ts`, `persian-data-generator.ts`) shadow their live counterparts in `prisma/seeds/`, which is the only path actually wired to `npm run seed`.
- `getFeaturedNews()` in `news-mysql.ts` and `getPublicUrl()` in `object-storage-service.ts` have zero callers.
- `components/utils/slider.tsx` (unused Swiper carousel) coexists with `components/ui/slider.tsx` (the actually-used Radix range input) — same filename, unrelated purpose, a standing foot-gun for the next import autocomplete.

### 3.5 Inconsistent conventions
- **Three uncoordinated date-formatting strategies** in production simultaneously: `date-fns-jalali` (1 file), `date-fns` + `faIR` locale strings without Jalali conversion (news components — Gregorian numbers on a Persian site), and native `Intl`/`toLocaleDateString('fa-IR')` (~30+ call sites). Two call sites (`app/admin/news/page.tsx:268`, `useDraftRestoration.ts:96`) call `toLocaleDateString()`/`toLocaleString()` with **no locale at all**, silently falling back to Gregorian.
- `stores/cart-store.ts` persists full snapshotted `Course` server entities (including `price`) to `localStorage` via Zustand `persist` — a stale-price bug waiting to happen if a course price changes while it sits in a cart, and a direct violation of the project's own "don't duplicate server data into Zustand" convention.
- ~180MB of `.backup*`/`.video-opt-test` directories sit in the working tree (correctly gitignored, but still repo-root clutter and a source of confusion about what's live).

---

## 4. Security Risks

Ranked by exploitability and blast radius. All are source-derived findings; treat "confirmed" as "confirmed by reading the code path," not by live exploitation.

### 🔴 Critical

**S1 — Unauthenticated destructive/data-dumping debug API surface ships to production.**
`middleware.ts`'s matcher only covers `/admin/:path*` and `/api/admin/:path*`; **`/api/debug/*` (16 route handlers) has no auth guard and no `NODE_ENV` gate anywhere in the route files themselves.** Concretely:
- `app/api/debug/clear/route.ts` — `DELETE` handler runs `prisma.digitalBook.deleteMany({})`, wiping every book, callable by anyone.
- `app/api/debug/seed-courses/route.ts`, `seed-test/route.ts` — `GET` handlers that write seed data into production tables, triggerable by simply visiting a URL.
- `app/api/debug/check-admin/route.ts` — leaks the first 20 characters of a real admin's bcrypt hash and phone-verification status, no auth.
- `app/api/debug/find-admin/route.ts` — queries a hardcoded admin phone number and leaks `error.stack` on failure.
- `db-status`, `category-columns`, `check-courses`, `courses-data` — dump raw table/schema contents with zero auth.
This is the single highest-severity finding in the review: a live, unauthenticated admin surface with destructive write and data-exfiltration capability.

**S2 — Payment verification can be spoofed to grant free paid enrollments.**
`app/api/payment/verify/route.ts` is a `GET` handler, **unauthenticated**, that marks any `orderId` as `PAID` and creates the corresponding enrollment whenever the caller passes `Status=OK` as a query parameter — the real Zarinpal signature/authority verification is commented out and replaced with a "fake"/test path. Anyone who can construct the URL (order IDs are likely sequential or guessable) can grant themselves a paid course or investment product for free.

**S3 — Checkout trusts a client-supplied `userId` with no session check.**
`app/api/checkout/route.ts` reads `userId` from the request body and uses it directly to create orders, with no `auth()` session validation — unlike the parallel `app/api/user/pay/route.ts`, which correctly checks the session. This allows creating orders (and, combined with S2, enrollments) on behalf of an arbitrary user ID.

### 🟠 High

**S4 — Stored XSS via unsanitized news content rendering.**
`components/news/NewsArticleDetail.tsx` and `NewsDetail.tsx` render `article.content` via `dangerouslySetInnerHTML` with **no sanitization at render time**. The only sanitization anywhere in the pipeline is a single call to the regex-based `sanitizeContent` (`lib/sanitize-content.ts`) at *creation* time in `app/api/news/create/route.ts` — a legacy, admittedly-weak, bypassable sanitizer (per its own doc comment and the project's own security rules, which call it out as legacy/weak). The real sanitizer (`isomorphic-dompurify`) is used only in `lib/markdown-processor.ts` and never touches the news-article render path. Net effect: content that bypasses the weak regex filter at creation renders unsanitized on every article view.

**S5 — Hardcoded database credential fallback.**
`lib/db.ts:9-11`:
```
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || 'pishro_password',
database: process.env.DB_NAME || 'pishro',
```
A misconfigured deployment (missing env vars) doesn't fail fast — it silently connects with a known default credential. This is called out explicitly as a forbidden pattern in the project's own security rules ("a hardcoded DB password fallback already exists in `lib/db.ts` for local dev; do not replicate this pattern for anything that could run in shared/production"), i.e., the team already knows this line is a liability.

### 🟡 Medium

**S6 — CSRF defense is single-layer (SameSite=Lax only).** No explicit CSRF token or `Origin`/`Referer` validation exists anywhere in the app. `SameSite=Lax` blocks classic cross-site form POST CSRF in modern browsers, but middleware validates JWT presence only — it never checks request origin. Given S4 (stored XSS), a successful script injection could ride ambient session/admin cookies for same-origin requests, compounding the impact.

**S7 — Admin access token is non-httpOnly by design, and there's no server-side revocation.** `admin_access_token` is deliberately readable by JS (comment in `login/route.ts` confirms this is intentional, to send it as `Authorization: Bearer`), which means any XSS anywhere in the admin panel is an instant, complete token theft — no cookie-theft mitigation applies. Compounding this: refresh "rotation" issues new token pairs but never revokes the old ones; there is no denylist. A captured token (via XSS, log leakage, or the verbose `console.log` in `middleware.ts` that logs token presence on every request) remains valid until natural expiry (24h access / 7d refresh, or 30d if `rememberMe`).

**S8 — Security headers/CSP are applied to almost nothing, and the CSP itself is weak.** `lib/api-security.ts`'s `securityHeaders`/`addSecurityHeaders` are wired into only 2 of 150 routes. The CSP that does exist allows `'unsafe-inline'` for both `script-src` and `style-src` — which would not block the exact class of injection described in S4 even where it is applied.

**S9 — No effective rate limiting on abuse-prone endpoints.** The shared in-memory limiter (already a single-instance-only mechanism, per the project's own docs) is used in exactly 2-3 routes. OTP/SMS send endpoints, `checkout`, `payment/verify`, and essentially all admin write endpoints have no rate limiting at all — SMS-bombing and credential-stuffing/brute-force exposure on the endpoints that most need it.

**S10 — Financial-record cascade inconsistency.** `UserInvestmentPortfolio.userId` uses `onDelete: Cascade`, unlike `Order`/`Transaction` which correctly use `SetNull`. Deleting a `User` permanently destroys their investment purchase records (`purchasePrice`, `expectedReturn`, dates) — a financial/audit record with no equivalent audit-trail preservation.

### Low / hygiene
- Debug/admin-auth routes leak `error.stack` or raw error objects to clients in several places (`app/api/debug/find-admin`, `login-debug`, `courses-data`, `admin/block-news`, upload-temp routes).
- No `.env.example` exists to document required env vars — plausibly part of why the hardcoded fallback in S5 exists at all.
- `middleware.ts`'s auth-bypass exclusion for admin API routes is substring-based (`!pathname.includes('/login')`) rather than an exact segment match — currently safe, but fragile if a future route happens to contain "login" anywhere in its path.

---

## 5. Performance Risks

- **N+1 query in order history.** `app/api/user/orders/route.ts` runs a paginated `findMany` on `Order`, then issues one additional `prisma.course.findMany` per order via `Promise.all` — parallelized but still N extra round-trips per page instead of one batched `IN` query.
- **Unbounded, unfiltered course list.** `app/api/courses/route.ts` runs `SELECT * FROM Course ORDER BY createdAt DESC` with no `LIMIT`/pagination and no `published` filter — grows linearly with catalog size and returns unpublished courses to whatever calls it (also a data-exposure concern, not just performance).
- **Missing indexes on the tables most likely to need them.** `Order`, `Transaction`, and `User` have **zero `@@index` annotations** beyond implicit FK/unique indexes — no index on `Order.status`, `Transaction.status`/`type`/`createdAt`, or `User.role`/`email`/`createdAt`, despite these being exactly the columns an admin dashboard would filter/sort by (order status, transaction ledger reporting, user role lookups).
- **Two independent, fixed-size connection pools against the same MySQL instance.** Prisma's own pool plus `lib/db.ts`'s `mysql2` pool (`connectionLimit: 10`, not env-tunable) compete for `max_connections` — combined with the stray `new PrismaClient()` instantiations noted in §3.2, this is a plausible source of connection exhaustion under concurrent load, and would be very hard to diagnose in production without knowing both pools exist.
- **Admin editor bundle is not code-split.** The live Tiptap-based editor stack (`NewsEditor.tsx` + supporting components) and the ~1,400 lines of dead alternate editors are all imported eagerly rather than via `next/dynamic` (only 5 files in the whole repo use `next/dynamic`). Since every admin page is already `"use client"` (§3.3), this bundle likely ships in full on every admin page load regardless of whether the editor is used.
- **Admin panel forfeits streaming/SSR entirely** (§3.3) — every admin page pays full client-side fetch waterfall cost with no server-rendered first paint.
- **`LIMIT ${limit} OFFSET ${skip}` built via string interpolation** rather than bound parameters in `news-mysql.ts`/`library-mysql.ts` — not currently exploitable (values are server-clamped), but it's a fragile pattern that silently stops being safe the moment a future caller forgets to clamp.

---

## 6. Technical Debt

This section is deliberately distinct from "weaknesses" (§3) — these are known, named, sizeable liabilities that should be tracked and paid down on a schedule rather than fixed incidentally.

1. **Two data-access layers for the same database, indefinitely.** Every domain that splits into `<domain>-mysql.ts` + `<domain>-service.ts` (news, library, investment-models, skyroom) is carrying a second implementation of filtering/pagination/ordering logic that can — and per §3.1's course-listing example, already does — drift from the Prisma equivalent.
2. **The `enterprise-architecture-refactor` OpenSpec proposal exists, diagnoses much of this review, and is unexecuted.** `tasks.md` marks every phase "Not Started," yet Phase 1's SSH-key/root-script cleanup was already done in a separate commit (`92388058`) outside the tracked plan — the proposal's status is now out of sync with reality in both directions (some work done without updating tasks.md; most work not done at all). This should either be actively re-scoped and executed, or explicitly closed/superseded so it stops being a stale source of truth.
3. **Two parallel comment systems** (`Comment`, `NewsComment`) and **two parallel tagging representations** (JSON field + join table) on the same models — schema-level duplication that will need a real migration to resolve, not just a code change.
4. **`Order.items: Json` duplicates the normalized `OrderItem` table** — two sources of truth for order line items in the same row.
5. **Five dead seed scripts** sitting alongside their live counterparts (§3.4) — genuine risk of a future contributor editing the wrong file and quietly diverging from what `npm run seed` actually runs.
6. **Squashed/rebaselined migration history.** The first migration (`20260517020459_add_admin_user_model`) is 1,060 lines and creates nearly the entire schema despite its name — real incremental migration history was discarded at some point. Subsequent migrations look organic, but at least one (`add_digital_book_status`) is a destructive drop+recreate that would lose data if replayed against a populated table rather than being written as an in-place rename.
7. **No `.env.example`.** Contributes directly to S5 and to onboarding friction — there's no documented list of required environment variables anywhere in the repo.
8. **Dead component/editor sprawl** (§3.4) is large enough (~1,400 lines of unused editor code alone) that it materially affects bundle size, search-result noise, and "which one is real" onboarding confusion — exactly the problem the OpenSpec proposal in point 2 was written to solve.

---

## 7. Recommended Improvements

Grouped by theme, not by urgency — see §8 for sequencing.

**Security**
- Delete `app/api/debug/*` entirely, or gate every handler behind both an explicit admin-auth check and a `NODE_ENV !== 'production'` guard enforced at the route level (not just by convention).
- Restore real Zarinpal signature/authority verification in `payment/verify`; require an authenticated session and validate order ownership before marking anything `PAID`.
- Require `auth()` session validation in `checkout`, matching the pattern already correctly used in `user/pay`.
- Replace `dangerouslySetInnerHTML={{ __html: article.content }}` with DOMPurify-sanitized output at render time (defense in depth, not just at creation) — this is exactly the substitution the project's own security rules already prescribe for this class of problem.
- Remove the hardcoded credential fallback in `lib/db.ts`; fail fast (throw at startup) if required DB env vars are missing, and ship a `.env.example` so there's no incentive to lean on a fallback.
- Wire `addSecurityHeaders` into `middleware.ts` (or a shared response wrapper) so it applies globally instead of to 2 routes; tighten the CSP to drop `'unsafe-inline'` where feasible (nonce-based or hashed inline scripts).
- Add `Origin`/`Referer` validation for state-changing admin requests as a second CSRF layer beyond `SameSite=Lax`.
- Implement actual rate limiting (Redis-backed or equivalent shared store, not the current in-memory `Map`) on OTP/SMS send, login, checkout, and payment-verify endpoints at minimum.

**Data layer**
- Add `@@index` on `Order.status`/`createdAt`, `Transaction.status`/`type`/`createdAt`, `User.role`/`createdAt`.
- Change `UserInvestmentPortfolio.userId` from `Cascade` to `SetNull` to match the audit-preservation pattern used for `Order`/`Transaction`.
- Pick one implementation per domain and delete the other: either migrate `courses`/`news`/`library`/`investment-models`/`skyroom` fully onto Prisma (preferred, per the project's own stated preference for new data-access code), or formally document why the raw-SQL path is authoritative and delete the divergent Prisma path.
- Resolve the `Order.items` JSON vs `OrderItem` table duplication and the JSON-tags-vs-join-table duplication on `NewsArticle`/`DigitalBook` with an actual data migration, not a new field.

**Frontend**
- Add root-level `error.tsx`/`loading.tsx`, and per-route boundaries for the highest-traffic pages (courses, news, checkout) at minimum.
- Convert at least the read-heavy admin list pages (courses, news, library) to server components with client islands for interactivity, to recover the SSR/streaming benefit the framework is paying for.
- Move the live Tiptap editor bundle behind `next/dynamic` so it's not shipped on every admin page load.
- Consolidate date formatting behind the existing `lib/utils.ts` `toLocaleDateString('fa-IR')` helper; delete the two Gregorian-locale call sites.
- Change `cart-store.ts` to persist only `id`/`type`/`quantity` and join against the React Query cache for live price/details, per the project's own "don't duplicate server state into Zustand" convention.

**Process**
- Explicitly decide the fate of `openspec/changes/enterprise-architecture-refactor/`: re-scope and schedule it, or close it and note what's already been done outside the plan, so it stops silently drifting from reality.

---

## 8. Refactoring Priorities

### P0 — This week (security-critical, small blast radius to fix, large blast radius if left)
1. Remove or lock down `app/api/debug/*` (S1).
2. Fix `payment/verify` signature validation and auth (S2).
3. Add session auth check to `checkout` (S3).
4. Sanitize news content with DOMPurify at render time (S4).
5. Remove hardcoded DB credential fallback; fail fast instead (S5).

### P1 — This sprint (real exposure, moderate effort)
6. Add `Origin` validation / CSRF hardening for admin mutations (S6).
7. Apply `addSecurityHeaders`/tightened CSP globally via middleware (S8).
8. Stand up real rate limiting (shared store) on OTP/login/checkout/payment (S9).
9. Add missing indexes on `Order`, `Transaction`, `User` (§5).
10. Fix `UserInvestmentPortfolio` cascade behavior (S10).
11. Fix the N+1 in `user/orders`, and add pagination + `published` filtering to `app/api/courses/route.ts` (§5, §3.1).
12. Consolidate CORS allow-lists and rate-limiter implementations into one source each (§3.1).
13. Consider server-side revocation (or at least much shorter TTL + rotation-on-suspicion) for admin tokens given S7's non-httpOnly design (S7).

### P2 — Next sprint / scheduled cleanup (debt paydown, not urgent but compounding)
14. Delete the three dead news editor implementations and the five dead seed scripts (§3.4, §6.5, §6.8).
15. Decide and execute: Prisma-only or raw-SQL-only per domain for `news`/`library`/`investment-models`/`skyroom` (§6.1, §7).
16. Resolve `Order.items` JSON/`OrderItem` duplication and `NewsArticle`/`DigitalBook` JSON-tags/join-table duplication (§6.3, §6.4).
17. Add `error.tsx`/`loading.tsx` boundaries; convert top admin list pages to server components (§3.3, §7).
18. Unify date formatting on the existing `lib/utils.ts` helper (§3.5).
19. Fix the `cart-store.ts` server-state snapshotting (§3.5).
20. Re-scope or close the `enterprise-architecture-refactor` OpenSpec proposal and reconcile `tasks.md` with what's actually been done (§6.2).
21. Add `.env.example`; document required environment variables (§6.7).

---

*This review reflects a source-code read at a point in time. Before acting on any Critical/High security finding, reproduce it against the actual running application/environment (e.g., confirm `/api/debug/*` is genuinely reachable in the production deployment, confirm the payment bypass against the real Zarinpal integration path) — some findings may already be mitigated by infrastructure-level controls (e.g., a reverse proxy blocking `/api/debug/*`) not visible from source alone.*
