# Architecture Rules

Extracted from the current codebase. These describe how the system is actually wired, not an aspirational target — several points below are dualities/inconsistencies that exist in the repo today and must be worked around, not silently "fixed" as a side effect of an unrelated task.

## Route structure (`app/`)
- `app/(routes)/` — public/customer-facing pages (route group, no URL segment).
- `app/admin/` — admin panel UI.
- `app/api/` — route handlers, organized by domain, plus `app/api/admin/*` and `app/api/debug/*`.
- `app/api/debug/*` are development/debug endpoints — never assume they are safe to leave reachable in a production deployment; flag if a task touches them.

## Two independent auth systems
- **Customer auth**: NextAuth v5 (`auth.ts`), Credentials provider, JWT session strategy, session data (`id`, `phone`, `role`) attached via `jwt`/`session` callbacks.
- **Admin auth**: a fully separate, custom JWT implementation (`lib/admin-auth.ts` for issuing, `lib/admin-jwt.ts` for Edge-safe verification using Web Crypto). Cookies: `admin_access_token` / `admin_refresh_token`. Enforced centrally in `middleware.ts` (matcher: `/admin/:path*`, `/api/admin/:path*`).
- Do not reuse NextAuth session helpers (`auth()`, `useSession`) to protect admin routes, and do not reuse admin JWT helpers to protect customer routes — they are not interchangeable and are validated by different code paths.

## Dual data access: Prisma + raw MySQL pool
- `prisma/schema.prisma` (MySQL) is the primary schema, accessed via `lib/prisma.ts`.
- `lib/db.ts` exposes a second, independent `mysql2/promise` pool (`query`, `queryOne`, `execute`) used directly by customer auth, some admin auth code, and several API routes (e.g. `app/api/courses/route.ts` queries `Course` with raw SQL, not Prisma).
- Several `lib/services/` domains are split into `<domain>-mysql.ts` (raw SQL) wrapped by `<domain>-service.ts` — e.g. `news-mysql.ts`/`news-service.ts`, `library-mysql.ts`/`library-service.ts`, `skyroom-mysql.ts`/`skyroom-service.ts`, `investment-models-mysql.ts`/`investment-models-service.ts`.
- **Before touching a data-access file, check which layer it actually uses.** Do not assume a route/service uses Prisma just because Prisma is configured — grep for `lib/db` vs `lib/prisma` imports first.

## Dual file storage
- **Local disk** (`lib/services/storage-adapter.ts`): writes under `UPLOAD_BASE_DIR`/`UPLOAD_STORAGE_PATH` (default `/opt/uploade`), served via `/api/uploads`.
- **S3-compatible object storage** (`lib/services/object-storage-service.ts`, `@aws-sdk/client-s3`): used specifically for course videos/HLS output; works against AWS or S3-compatible providers (Arvan Cloud, Liara) via `S3_*` env vars.
- These are not interchangeable — video upload/streaming code paths use S3; most other uploads (images, thumbnails, book files) use the local-disk adapter. Check which one an existing feature uses before adding new upload logic.

## Video processing pipeline
- HLS transcoding (`lib/services/hls-transcoding-service.ts`) is designed to run in the separate `video-processor` container defined in `docker-compose.yml` (ffmpeg on Alpine, driven by `scripts/video-processor-worker.ts`), not inside the Next.js server process. Don't add synchronous ffmpeg calls to API routes.

## Duplicated cross-cutting config (known issue, not a bug to silently fix)
- CORS allow-lists are defined independently in **two places**: `ALLOWED_ORIGINS` in `lib/api-response.ts` and a separate list in `lib/cors.ts`. If a task requires adding/removing an allowed origin, update both files and say so explicitly — don't assume one is authoritative.

## Spec-driven change workflow (OpenSpec)
- `openspec/config.yaml` (`schema: spec-driven`) governs planning for non-trivial changes. Proposals/design/tasks live under `openspec/changes/<change-name>/`; accepted specs under `openspec/specs/<capability>/spec.md`.
- Before starting significant work in an area, check `openspec/changes/` for an in-flight design doc covering it.

## Graphify knowledge graph
- Per `AGENTS.md`, prefer `graphify query "<question>"` / `graphify path "<A>" "<B>"` / `graphify explain "<concept>"` over raw grep for codebase questions when `graphify-out/graph.json` exists, and run `graphify update .` after code changes.
