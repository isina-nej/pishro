# Coding Style Rules

Conventions observed in the existing codebase. Match them when editing nearby code, even where they differ from generic best practice, unless the user asks for a cleanup pass.

## TypeScript
- `tsconfig.json`: `strict: true` but `noImplicitAny: false` — implicit `any` is tolerated in this codebase (raw SQL row shapes are frequently typed as `any` or cast with `as`). Don't treat existing `any` usage as something to eagerly eliminate outside the task at hand.
- Path alias: `@/*` maps to the repo root (`@/lib/...`, `@/components/...`, `@/app/...`). Always use it instead of relative `../../../` imports.
- `noEmit: true` — type-check with `npx tsc --noEmit`, there is no separate `tsc` build step.

## Linting
- `eslint.config.mjs` extends `next/core-web-vitals` + `next/typescript`, with one override: `@typescript-eslint/no-unused-vars` is an **error**, but variables/args prefixed with `_` are exempt (`argsIgnorePattern: "^_"`, `varsIgnorePattern: "^_"`). Prefix intentionally-unused parameters with `_` rather than disabling the rule inline.
- `next.config.ts` sets `eslint.ignoreDuringBuilds: true` — `npm run build` will NOT catch lint errors. Always run `npm run lint` separately before considering a change done.

## Naming conventions
- React hooks: `useX` in `lib/hooks/` (e.g. `useCourses.ts`, `useAdminAuth.ts`), mostly camelCase filenames; a few historical exceptions use kebab-case (`use-toast.ts`, `use-media-query.ts`, `use-block-news.ts`) — match the existing file's convention rather than renaming it.
- React Query hooks follow a **query-key-factory** pattern per domain, e.g. `courseKeys = { all, list(), detail(id) }` in `lib/hooks/useCourses.ts`. When adding a new query/mutation for an existing domain, extend that domain's key factory instead of hardcoding a new key array.
- Services: `lib/services/<domain>-service.ts` as the consumer-facing entry point; `<domain>-mysql.ts` for the raw-SQL implementation when a domain uses that split (see architecture.md).
- Zod schemas live in `lib/schemas/<domain>-schema.ts`, exported as `<Entity>CreateSchema` / `<Entity>UpdateSchema` (update schemas are frequently `CreateSchema.partial()`).

## Language of user-facing strings
- Validation error messages, UI copy, and many inline comments are written in **Persian (Farsi)**, e.g. `"عنوان الزامی است"` in `lib/schemas/course-management-schema.ts`, or Persian error strings in API responses (`app/api/courses/route.ts`). Keep new user-facing strings and validation messages in Persian to match the rest of the app, unless a file/domain is already English-only (e.g. internal error `console.error` logs are typically English).

## Comments
- Existing files often carry a short Persian or English block comment at the top explaining the file's purpose (`// @/lib/services/storage-adapter.ts` + a one-line Persian description), and JSDoc-style `/** ... */` blocks above exported functions describing what they do. This is the established convention in this codebase — when extending an existing file, match its existing header/JSDoc style rather than leaving new exports uncommented.

## File organization
- `lib/` is organized by concern but not strictly layered: `lib/services/`, `lib/hooks/`, `lib/schemas/`, `lib/utils/`, `lib/helpers/`, `lib/types/`, `lib/constants/`, `lib/providers/`, `lib/contexts/`, plus several flat top-level utility files (`lib/utils.ts`, `lib/get-base-url.ts`, `lib/role-utils.ts`, etc.). When adding a new utility, prefer the existing sub-folder that matches its concern over adding another flat `lib/*.ts` file.
- Known duplicate components exist across feature folders (e.g. `pageContent.tsx` repeated per-feature under `components/<feature>/pageContent.tsx`, and `components/utils/` duplicating `components/ui/` files like `slider.tsx`/`ThemeToggle.tsx`). When fixing a bug in one of these, search for sibling copies before assuming a single edit is sufficient.
