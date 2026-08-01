# Backend Rules

## API response envelope
- `lib/api-response.ts` implements a JSend-style envelope (`status: "success" | "fail" | "error"`) with helper constructors: `successResponse`, `createdResponse`, `errorResponse`, `paginatedResponse`, plus `ErrorCodes`/`HttpStatus` constants. New route handlers should return through these helpers instead of raw `NextResponse.json(...)`, so the response shape stays consistent across the API surface.
- Example of the established pattern (`app/api/courses/route.ts`):
  ```ts
  return successResponse(data);
  // ...
  return errorResponse("خطایی در دریافت دوره‌ها رخ داد", ErrorCodes.DATABASE_ERROR);
  ```
  Error messages returned to clients are Persian; internal `console.error` logging can stay in English.

## Route handler structure
- Handlers are thin: parse/validate input (often via a `lib/schemas/*` zod schema), call a service function (`lib/services/*-service.ts`), map errors to the response envelope. Business logic belongs in the service layer, not inline in `route.ts`.
- Some domains still query the raw MySQL pool directly from the route handler rather than through a service (e.g. `app/api/courses/route.ts` calls `query()` from `lib/db.ts` inline). Match the existing pattern of the file you're editing rather than introducing a service layer mid-file unless the task is specifically a refactor.

## Validation
- Request bodies are validated with Zod schemas from `lib/schemas/` (`CourseCreateSchema`, `CourseUpdateSchema` via `.partial()`, etc.). Reuse/extend these schemas for new fields instead of hand-rolling manual checks in the handler.

## CORS
- CORS handling is duplicated between `lib/api-response.ts` (`addCorsHeaders`, `ALLOWED_ORIGINS`) and `lib/cors.ts` (`getCorsHeaders`). Check which one a given route already imports and stay consistent within that route/domain; if you must change allowed origins, update both files (see `architecture.md`/`security.md`).

## Rate limiting & security headers
- `lib/api-security.ts` provides `checkRateLimit(clientId, endpoint)` (in-memory, per-instance — see `security.md`) and `addSecurityHeaders(response)`/`securityHeaders`. These are opt-in per route today (used in the news/editor admin endpoints), not applied globally via middleware — apply them explicitly in new sensitive routes (admin writes, uploads) rather than assuming they're already active.

## Admin vs public API routes
- `/api/admin/*` is protected centrally by `middleware.ts` (see `architecture.md`) — admin route handlers can assume the request already passed JWT verification by the time they run, but should still use `lib/admin-auth.ts`/`getAdminUserFromRequest`-style helpers if they need the actual admin user identity/role, not just "is authenticated."
- Public `/api/*` routes have no such gate; any auth check needed there (e.g. "is this the owner of this order") must be done explicitly inside the handler using the NextAuth session, not assumed from middleware.

## File uploads
- Upload endpoints choose between the local-disk adapter (`lib/services/storage-adapter.ts`) and S3 object storage (`lib/services/object-storage-service.ts`) depending on the media type — video uploads go through S3 + the HLS pipeline; most other uploads (images, book files) go through local disk. Validate file type/size in the route before calling either adapter; both adapters assume the caller already validated the input.

## Debug endpoints
- `app/api/debug/*` exists for development use. Don't add new production business logic there, and flag if a task touches these routes since they may need to be gated or removed before deployment.
