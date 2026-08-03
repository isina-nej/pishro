# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Detailed, topic-specific rules (architecture decisions, coding conventions, security considerations, database rules, frontend patterns, backend patterns) live in `.claude/rules/`: `architecture.md`, `coding-style.md`, `security.md`, `database.md`, `frontend.md`, `backend.md`. Read the relevant file(s) before making non-trivial changes in that area.

## Commands

```bash
npm run dev              # Start dev server (Next.js + Turbopack)
npm run build             # Production build
npm run lint               # ESLint (also run before considering a task done)
npm run test               # Run all tests: node --test over tests/**/*.test.ts
npm run test:unit          # Run a single suite (tests/course-management-schema.test.ts)
npx tsc --noEmit           # Type-check without emitting (tsconfig has noEmit: true)

npm run seed                # Run prisma/seeds/seed-all.ts (tsx)
npm run seed:reset          # prisma migrate reset --force, then seed
npm run db:studio           # Prisma Studio
```

- Tests use Node's built-in test runner (`node --import tsx --test`), not Jest/Vitest. To run a single test file directly: `node --import tsx --test tests/api/news.integration.test.ts`.
- `next.config.ts` sets `eslint.ignoreDuringBuilds: true`, so `npm run build` will succeed even with lint errors — run `npm run lint` separately.
- MySQL + a video-processing worker (ffmpeg → HLS) run via `docker-compose.yml`; `DATABASE_URL` and S3 env vars are required for the video worker.

## Architecture

This is a Next.js 15 (App Router) platform for Pishro, a Persian-language education/investment platform (courses, digital library, news/blog, investment products). UI strings and a large part of the domain (seed data, SMS provider) are Persian/Iran-specific (Jalali dates, Zarinpal payment gateway, Melipayamak/Modirpayamak SMS).

### Route structure (`app/`)
- `app/(routes)/` — public marketing/customer pages (about-us, courses, library, news, checkout, profile, investment-plans, etc.) via a route group.
- `app/admin/` — admin panel UI (courses, news, library, dashboard, block-news editor).
- `app/api/` — route handlers, mirroring the above domains plus `api/admin/*`, `api/debug/*`, `api/video/*`, `api/uploads/*`.

### Two independent auth systems — do not conflate them
1. **Customer auth**: NextAuth v5 (`auth.ts`), Credentials provider, JWT session strategy. `authorize()` queries the `User` table via **raw SQL** through `lib/db.ts` (a `mysql2/promise` pool), not Prisma.
2. **Admin auth**: a custom JWT implementation, independent of NextAuth — `lib/admin-auth.ts` (issuing/validating tokens against `AdminUser`) and `lib/admin-jwt.ts` (Edge-safe verification using Web Crypto, for use in `middleware.ts`). Tokens live in `admin_access_token` / `admin_refresh_token` cookies. `middleware.ts` matches `/admin/:path*` and `/api/admin/:path*`, redirects unauthenticated admin page requests to `/admin/login`, and returns 401 JSON for unauthenticated `/api/admin/*` calls.

### Data access: Prisma is primary, but a raw MySQL pool coexists
- `prisma/schema.prisma` (MySQL provider) defines ~45 models and is the primary data layer via `lib/prisma.ts`.
- `lib/db.ts` exposes a separate raw `mysql2` pool (`query`/`queryOne`/`execute`) used where Prisma isn't wired up yet (customer auth, some admin auth paths). When touching auth code, check which layer a given file actually uses before assuming Prisma.
- Several domains under `lib/services/` follow a two-file split: `<domain>-mysql.ts` (raw SQL implementation) wrapped by `<domain>-service.ts` (used by routes/hooks) — e.g. `news-mysql.ts`/`news-service.ts`, `library-mysql.ts`/`library-service.ts`, `skyroom-mysql.ts`/`skyroom-service.ts`, `investment-models-mysql.ts`/`investment-models-service.ts`. Prefer the `-service.ts` entry point when calling into these from routes/hooks.

### API response & CORS conventions
- `lib/api-response.ts` implements a JSend-style envelope (`status: "success" | "fail" | "error"`) with helpers like `createdResponse`, `errorResponse`, `ErrorCodes`, `HttpStatus` — use these instead of ad hoc `NextResponse.json`.
- CORS allow-lists are currently defined **twice**, independently: `ALLOWED_ORIGINS` in `lib/api-response.ts` and a separate list in `lib/cors.ts`. If you change allowed origins, update both (or consolidate) — they are not the same source of truth.

### File storage: two separate mechanisms
- **Local disk** via `lib/services/storage-adapter.ts`: writes under `UPLOAD_BASE_DIR`/`UPLOAD_STORAGE_PATH` (default `/opt/uploade`), served through `/api/uploads` (default `UPLOAD_BASE_URL`). Includes `assertSafeStoragePath` to prevent path traversal — reuse it for any new file path from user input.
- **S3-compatible object storage** via `lib/services/object-storage-service.ts` (`@aws-sdk/client-s3`), used specifically for course video uploads and HLS output; works against AWS or S3-compatible providers (Arvan Cloud, Liara, etc.) via `S3_ENDPOINT`/`S3_*` env vars.
- Video transcoding to HLS (`lib/services/hls-transcoding-service.ts`) is designed to run in the `video-processor` container (`docker-compose.yml`, ffmpeg on Alpine) driven by `scripts/video-processor-worker.ts`, not in the Next.js server process.

### Frontend conventions
- shadcn/ui, "new-york" style, configured in `components.json`; aliases `@/components`, `@/components/ui`, `@/lib`, `@/hooks` map via the `@/*` path in `tsconfig.json`.
- Rich text/news editing has multiple overlapping implementations in `components/admin/news/` and `components/news/` (Tiptap-based `RichNewsEditor`, `NewsEditor`, `NewsEditorEnhanced`, MDX-based `MDXNewsEditor`) — check `lib/hooks/useNews.ts` / `lib/hooks/use-block-news.ts` and `lib/services/mdx-news-service.ts` vs `lib/services/block-news-service.ts` to see which pipeline a given page actually uses before extending the editor.
- Known duplicated components exist across feature folders (e.g. `pageContent.tsx` repeated per-feature under `components/<feature>/pageContent.tsx`, and `components/utils/` duplicating things also in `components/ui/` such as `slider.tsx`/`ThemeToggle.tsx`). When fixing a bug in one of these, check for sibling copies before assuming a single edit covers all usages.

### Spec-driven change workflow (OpenSpec)
This repo uses [OpenSpec](openspec/config.yaml) (`schema: spec-driven`) for planning non-trivial changes: proposals/design/tasks live under `openspec/changes/<change-name>/`, and accepted specs under `openspec/specs/<capability>/spec.md`. Check `openspec/changes/` for in-flight design docs relevant to the area you're touching before starting significant work there.

### Graphify knowledge graph
Per `AGENTS.md`, this repo has a code knowledge graph in `graphify-out/`. For codebase questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over raw grep when `graphify-out/graph.json` exists, and run `graphify update .` after making code changes.

`graphify-out/` is **gitignored and not committed** — the graph is derived from the source tree, and committing it produced huge generated diffs on every code change. So a fresh clone has no graph at all:

```bash
graphify update .          # generate graphify-out/ before the first query
```

Run this once after cloning (and after pulling a batch of changes) — until then `graphify-out/graph.json` won't exist and the query commands above have nothing to read, so fall back to grep/ripgrep rather than assuming the graph is stale or broken.
