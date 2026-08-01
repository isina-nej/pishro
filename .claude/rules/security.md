# Security Rules

## Authentication boundaries
- Admin routes/pages are protected centrally by `middleware.ts` matching `/admin/:path*` and `/api/admin/:path*` — don't add ad hoc auth checks inside individual admin route handlers as a substitute for this; add them as a defense-in-depth complement if the handler does something especially sensitive.
- Admin JWTs are verified with `ADMIN_JWT_SECRET`, falling back to `NEXTAUTH_SECRET` if unset (`lib/admin-jwt.ts`). Don't assume these secrets are the same value in production — treat `ADMIN_JWT_SECRET` as the source of truth and only rely on the fallback for local/dev convenience.
- `verifyAdminAccessTokenForMiddleware` deliberately returns `false` (not a throw) on any malformed/stale token — a stale cookie must behave like an anonymous request, not a 500. Preserve this fail-closed-but-non-throwing behavior in any related code.

## SQL injection
- Raw SQL goes through `lib/db.ts`'s `query`/`queryOne`/`execute`, which use `mysql2` parameterized placeholders (`?`) with a values array — **always** pass user-derived values via the `values` array, never via string interpolation into the SQL string. This applies to every `-mysql.ts` service file and any route calling `query()`/`execute()` directly.
- Some routes build static SQL with no user input (e.g. `SELECT * FROM Course ORDER BY createdAt DESC` in `app/api/courses/route.ts`) — that's fine as-is, but any addition of a `WHERE`/filter clause driven by request input must use a placeholder.

## Path traversal / file storage
- `lib/services/storage-adapter.ts`'s `assertSafeStoragePath(storageRoot, relativePath)` resolves the target path and rejects anything that escapes `storageRoot`. Any new code that writes/reads a file based on a path derived from user input (upload filenames, slugs, IDs) must go through this function (or an equivalent check) rather than joining paths manually.

## CORS
- Allow-lists exist independently in `lib/api-response.ts` (`ALLOWED_ORIGINS`) and `lib/cors.ts` (`getCorsHeaders`). A change to allowed origins must be made in **both** places — see `architecture.md`.
- `addCorsHeaders`/`corsPreflightResponse`-style helpers always set `Access-Control-Allow-Credentials: true`; do not pair that with a wildcard `*` origin — the existing pattern reflects back a specific matched origin from the allow-list, keep that behavior.

## Rate limiting
- `lib/api-security.ts`'s `checkRateLimit` is an **in-process `Map`**, not Redis/shared state — it does not work correctly across multiple server instances or serverless cold starts. Treat it as best-effort abuse mitigation for a single-instance deployment, not a hard security boundary. Don't extend it to protect something that genuinely needs a distributed rate limiter without flagging the limitation.

## HTML/content sanitization — two implementations, prefer the real one
- `lib/sanitize-content.ts`'s `sanitizeContent`/`isContentSafe` are **regex-based** HTML sanitizers (strip `<script>`, `on*` handlers, `javascript:`/`data:` URLs). Regex-based HTML sanitization is inherently bypassable and should be treated as a legacy/weak layer.
- The codebase also has real sanitizers available: `dompurify` / `isomorphic-dompurify` (already used in `lib/markdown-processor.ts`). **For any new code path that renders user-supplied HTML (news articles, comments, editor output), use `isomorphic-dompurify`, not `sanitizeContent`.** Don't extend the regex-based sanitizer with more patterns as a fix for a bypass — replace the call site with DOMPurify instead.

## Security headers
- `lib/api-security.ts` defines a `securityHeaders` object (CSP, X-Frame-Options, etc.) and `addSecurityHeaders(response)`. New API routes that return HTML or handle sensitive admin actions should apply these headers via the existing helper rather than hand-rolling new ones.

## Secrets and env
- Iranian payment (`zarinpal`) and SMS (`melipayamak`) provider credentials, S3 credentials, `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_JWT_SECRET` all come from env vars — never hardcode fallback values for secrets (a hardcoded DB password fallback already exists in `lib/db.ts` for local dev; do not replicate that pattern for anything that could run in a shared/production environment).
