# Project Context

Next.js 15 full-stack web app (App Router) with TypeScript.  
Uses **Auth.js v5 (OTP login)**, **Prisma ORM**, **React Query v5**, and **shadcn/ui**.  
All backend APIs live in `app/api/.../route.ts`, frontend logic in `lib/services` and `lib/hooks`.  
Architecture: modular, typed, API-first.

---

## 📂 Structure

- `app/api` → API routes (REST)
- `lib/services` → API + Prisma logic
- `lib/hooks` → React Query data hooks
- `lib/utils` → validation + helpers
- `components` → UI (client/server)
- `types` → shared TS types
- `middleware.ts` → auth + redirects

---

## 🔐 Auth

- **Auth.js v5 (beta)** with **OTP login**
- Phone format: `09xxxxxxxxx`, 11 digits
- OTP = 4 digits, expires in 2 min
- Use `auth()` → returns session
- Protect routes with session check
- Responses: `unauthorizedResponse()`, `successResponse()`, etc.

---

## 🧩 Coding Rules

- Strict **TypeScript** (no `any`)
- **kebab-case** filenames except react components with .tsx name use **camelCase** style for theme
- Error messages in **Persian**
- All data via `lib/services` (no direct DB in UI)
- Validate input before saving/fetching
- Consistent API responses via `api-response.ts`
- Hooks use **React Query v5** with proper keys
- UI built with **shadcn/ui**

---

## ⚙️ Stack

| Tool           | Version |
| -------------- | ------- |
| Next.js        | 15      |
| React          | 19      |
| TypeScript     | 5.6+    |
| Auth.js        | v5      |
| Prisma         | latest  |
| TanStack Query | v5      |
| Tailwind CSS   | 3.4     |
| Axios          | latest  |

---

## 🧠 AI Coding Guide

- Follow **Next.js App Router** conventions
- Use **async/await** and explicit types
- Keep logic modular (services, hooks, utils)
- Always return typed API responses
- Use existing helpers: `auth()`, `prisma`, `api-response`
- For frontend, cache with React Query
- Keep design clean, responsive, consistent

---

## 🧪 Example Patterns

**API:**

```ts
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return unauthorizedResponse("Login required");

  try {
    const data = await prisma.model.findMany();
    return successResponse(data);
  } catch {
    return errorResponse("Database error", "DATABASE_ERROR");
  }
}
```
