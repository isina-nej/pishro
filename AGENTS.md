## Cursor Cloud specific instructions

Pishro is a single Next.js 15 (App Router) app plus a MySQL database. Standard dev/build/lint/test/seed commands live in `CLAUDE.md` and `package.json` — use those, this section only covers non-obvious cloud caveats.

- MySQL 8 runs locally on the VM (installed via apt, baked into the snapshot; the `docker-compose.yml` MySQL/video-processor services are NOT used here since Docker is not installed). It does not auto-start on boot — run `sudo service mysql start` before anything that touches the DB. Seeded data persists in the snapshot at `/var/lib/mysql`.
- DB credentials/schema are already provisioned: database `pishro`, user `pishro_user` / password `pishro_password` (root password is also `pishro_password`). A gitignored `.env` at the repo root holds `DATABASE_URL`, the raw-pool `DB_*` vars, dev auth secrets, and `UPLOAD_*` paths — both Prisma and the raw `mysql2` pool (`lib/db.ts`) read it. If `.env` is ever missing, recreate it (see the values above) and set `UPLOAD_BASE_DIR`/`UPLOAD_STORAGE_PATH` to a writable absolute path **outside the repo** (e.g. `/var/lib/pishro/uploads` or `/opt/uploade`). Paths inside `/workspace` are rejected and fall back to `/opt/uploade`.
- Start the app with `npm run dev` (Next.js + Turbopack on port 3000). Apply schema changes with `npx prisma migrate deploy`; repopulate demo data with `npm run seed` (or `npm run seed:reset` to reset first). Seeds print login creds: admin `09123456789` / `Admin@123`, any seeded user phone / `User@123`.
- Optional services are NOT wired up in this environment: the ffmpeg→HLS `video-processor`, S3 object storage (`S3_*`), Zarinpal payments, SMS/OTP providers, and crypto market APIs. Course-video transcoding, real payments, and phone-verification/OTP flows will not work without those external credentials.
- Testing: `npm run test` uses Node's built-in runner and passes with the DB up; the HTTP integration tests under `tests/api/*.integration.test.ts` and `tests/user-course-api.test.ts` auto-SKIP unless a dev server is running and `TEST_BASE_URL=http://localhost:3000` is set. Running them against a live server currently surfaces several pre-existing failures (e.g. a test hits `/api/user/courses/:id`, which does not exist — the real route is `/api/user/enrolled-courses` — plus rate-limit/security-header assertions the app does not satisfy in dev). These are app/test mismatches, not environment problems.
- `npm run build` ignores ESLint errors (`next.config.ts` sets `eslint.ignoreDuringBuilds: true`), so run `npm run lint` separately. `npm run lint` currently reports pre-existing errors in the repo.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
