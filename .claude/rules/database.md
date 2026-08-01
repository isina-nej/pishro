# Database Rules

## Two access layers, one physical database
- Both Prisma (`prisma/schema.prisma`, MySQL provider, via `lib/prisma.ts`) and a raw `mysql2` pool (`lib/db.ts`) point at the **same** MySQL database. They are not separate databases — schema changes made via Prisma migrations affect tables that raw-SQL code also queries directly by table/column name.
- When changing a Prisma model's fields (rename, type change, drop), you must also check for raw SQL in `lib/db.ts`-based services and `-mysql.ts` files that reference the same table/columns by string — Prisma's type system will not catch breakage there.
- Prefer Prisma for new data-access code unless the surrounding file/domain already uses the raw pool (see `architecture.md`); don't introduce a third pattern.

## Migrations
- Standard Prisma migration workflow applies (`prisma migrate dev`, `prisma migrate reset --force` used by `npm run seed:reset`). `docker-compose.yml` mounts `./prisma/migrations` into the MySQL container's `docker-entrypoint-initdb.d`, so migrations are also what provisions a fresh local MySQL container.
- `prisma/schema.prisma` is the single source of truth for table/column names used by Prisma; raw SQL callers must match those names exactly (MySQL, so case-sensitivity of identifiers depends on the OS/config — don't assume case-insensitivity).

## Seeding
- `prisma/seeds/seed-all.ts` is the orchestrator entry point (`npm run seed`); it composes individual `seed-<domain>.ts` files (books, categories, comments, courses, enrollments, faqs, news, newsletter, orders, pagecontent, quizzes, tags, users) plus `seed-admin.ts`.
- `prisma/persian-data-generator.ts` / `prisma/seeds/persian-data-generator.ts` (`PersianDataGenerator`) is the shared fake-data generator for Persian names/content — reuse it for any new seed rather than writing ad hoc Persian Lorem-ipsum.
- There are legacy/alternate seed scripts at the repo root of `prisma/` (`seed.ts`, `seed-simple.js`, `landings-seed.js`) alongside the `prisma/seeds/` versions. Treat `prisma/seeds/seed-all.ts` and its imports as the active path; don't assume the loose top-level scripts are still wired into `npm run seed`.

## Model/table conventions
- Models are PascalCase singular (`User`, `AdminUser`, `Course`, `Chapter`, `NewsArticle`, `DigitalBook`, etc.) — raw SQL in `lib/db.ts`-based code uses the same PascalCase singular table names (e.g. `SELECT * FROM Course`, `SELECT * FROM User WHERE phone = ?`). Keep this alignment if adding a new table.
- Many-to-many tag relations use explicit join models (`CourseTags`, `NewsArticleTags`, `DigitalBookTags`, `CategoryTags`) rather than implicit Prisma many-to-many — follow this pattern for any new tagging/join relationship instead of an implicit relation.

## Storage paths in the database
- File paths stored on models (thumbnails, videos, book files) are relative paths resolved through `lib/services/storage-adapter.ts`'s `assertSafeStoragePath`/`getStorageConfig`, not absolute filesystem paths — don't persist absolute paths or paths outside the configured storage root.
