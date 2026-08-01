# User Panel Audit — Pishro Customer Panel

**Scope:** `/profile/*` (customer-facing account panel) and everything it depends on: `app/(routes)/profile/**`, `components/profile/**`, `lib/hooks/useUser.ts`, `lib/services/user-service.ts`, `app/api/user/**`, plus the checkout/payment/auth paths that feed the panel's data.

**Method:** static code audit (routes, components, hooks, services, API handlers, Prisma schema). No code was changed to produce this document. Reflects the codebase as of this audit, which already includes a prior Royal Green visual redesign of this panel (theme tokens, order-detail modal, transactions page, honest "coming soon" favorites state) — those items are documented as *existing*, not as gaps.

---

## 1. Current Architecture

### 1.1 Routes, layouts, pages

```
app/(routes)/profile/
├── layout.tsx        Server Component — auth() gate, redirect("/login") if no session
│                      Renders <ProfileHeader/> + <ProfileAside/> + {children}
├── acc/page.tsx        → <ProfileMain/>            (dashboard)
├── settings/page.tsx    → <ProfileSettings/>         (personal info / pay info tabs)
├── orders/page.tsx      → <OrdersTable/>
├── transactions/page.tsx → <TransactionsTable/>
├── courses/page.tsx     → <EnrolledCourses/>
└── lists/page.tsx       → <FavoritesList/>
```

Every route page is a trivial Server Component that just renders one client component — **all real logic and data-fetching lives in `components/profile/*`, which are 100% `"use client"`.** There is no `loading.tsx`, `error.tsx`, or `not-found.tsx` anywhere under this segment, and no `app/error.tsx`/`app/global-error.tsx` exists at the root either (only `app/not-found.tsx`). An uncaught error anywhere in the panel falls through to Next.js's default (unbranded) error handling.

Auth-gating is **layout-level only** (`auth()` + `redirect()` in `profile/layout.tsx`) — `middleware.ts` does not protect `/profile/*` at all; its matcher is `['/admin/:path*', '/api/admin/:path*']` exclusively. Each `/api/user/*` route handler must (and does) independently re-check the session server-side.

### 1.2 Components (`components/profile/`, 17 files)

| File | Role |
|---|---|
| `header.tsx` | Shared header primitive (title + actions row), used by nearly every panel sub-view |
| `profileHeader.tsx` | Dashboard greeting bar (name, time-of-day greeting, date pill, decorative bell) |
| `profileAside.tsx` | Sidebar nav — 6 links + logout, mobile-horizontal / desktop-vertical |
| `profileMain.tsx` | Dashboard: hero card, profile-completion meter, 4 stat tiles, courses preview, orders preview |
| `profileSettings.tsx` | Tab switcher (شخصی / پرداخت) wrapping `AllForms` |
| `allForms.tsx` | Composes Avatar+Personal+Password forms (personal tab) or Pay form (pay tab) behind **one shared save button** |
| `personalInfoForm.tsx` | RHF+Zod form: name, phone, email, national code, Jalali birth date |
| `profileAvatarForm.tsx` | Avatar upload with client-side type/size validation (toast-based) |
| `payInfoForm.tsx` | RHF+Zod form: card number, sheba, account owner — **no format/checksum validation** |
| `passwordForm.tsx` | Opens `changePasswordModal.tsx`; its own imperative `submit()` is a no-op stub |
| `changePasswordModal.tsx` | 3-step OTP flow (request → verify → reset), hand-rolled modal (not Radix) |
| `enrolledCourses.tsx` | Paginated course grid with progress bar + completion badge |
| `ordersTable.tsx` | Paginated orders table; "مشاهده" opens a Radix `Dialog` rendering `orderDetail.tsx` |
| `orderDetail.tsx` | Presentational order-detail content (status, items, totals) — modal body only |
| `transactionsTable.tsx` | Paginated transaction history table |
| `favoritesList.tsx` | Honest "coming soon" empty state (no backend exists for this feature) |
| `emptyState.tsx` | Shared empty-state primitive reused across orders/courses/transactions/lists |

### 1.3 Navigation structure

`profileAside.tsx` renders 6 links: **اکانت شما → دوره‌های من → سفارش‌ها → تراکنش‌ها → لیست‌ها → تنظیمات پروفایل**, plus a logout button. Active state is computed with `pathname?.includes(item.link)` — a **substring match, not exact-route match**; low risk today (routes are flat, no nesting), but fragile the moment a detail route (e.g. `/profile/orders/[id]`) is reintroduced, since it would also light up the parent "سفارش‌ها" link, which is actually the desired behavior here, but the pattern doesn't generalize safely to sibling routes with overlapping prefixes.

### 1.4 Frontend architecture patterns

- **Server vs Client**: only the 6 page files and `layout.tsx` are Server Components; literally everything under `components/profile/` is client-rendered. Every page's first paint is a loading skeleton — there is no RSC-level data prefetching, despite Next.js 15 supporting it.
- **State management**: TanStack React Query exclusively for server state, single global `QueryClient` from `lib/providers/ReactQueryProvider.tsx` mounted once in the root `app/layout.tsx` (and again separately for `/admin`). No Zustand store is touched by this panel (the app has `stores/cart-store.ts` etc. for other domains, unused here).
- **Query-key factory** (`lib/hooks/useUser.ts`): `userKeys.all / me() / enrolledCourses(page,limit) / transactions(...) / orders(...)`. 9 hooks total (4 queries, 5 mutations), 1:1 with the 9 functions in `lib/services/user-service.ts`. `useUpdatePersonalInfo` has a full optimistic-update implementation (snapshot/rollback); the other mutations are invalidate-on-success only.
- **Forms**: react-hook-form + Zod, but validation schemas are defined **inline inside the component files** (`personalInfoForm.tsx`, `payInfoForm.tsx`), not under `lib/schemas/<domain>-schema.ts` as the rest of the codebase's convention dictates — this panel has drifted from that pattern.
- **UI system**: shadcn/ui `Button`, `Dialog`, `Badge` are used; however `ordersTable.tsx`/`transactionsTable.tsx` hand-roll raw `<table>` markup rather than using the existing `components/ui/table.tsx` primitive — an inconsistency, not a functional bug.
- **Design tokens**: the panel now runs inside the shared `.royal-theme` CSS-variable scope (same tokens as the admin panel — `--primary/--success/--premium/--surface-selected/--nav-active-bg/--icon-brand` plus the full shadcn palette), applied at `profile/layout.tsx`'s root wrapper.

---

## 2. Data Flow — Existing vs. Placeholder, per Section

| Section | Displays | API | Service / DB | Real or placeholder |
|---|---|---|---|---|
| **Dashboard** | Profile completion, 4 stats, 3 recent courses, 5 recent orders | `GET /api/user/me`, `/api/user/enrolled-courses`, `/api/user/orders` | `prisma.user`, `prisma.enrollment`, `prisma.order` | **Real reads**, but see §6 — the data feeding it (Orders/Enrollments) is only ever created by a **stubbed** payment flow |
| **Profile/Settings** | Personal fields, avatar, bank info, password | `PUT /api/user/personal`, `/api/user/pay`, `/api/user/avatar`, `POST /api/user/upload-avatar` | `prisma.user.update` | Real, functional. No uniqueness/format validation before write (phone/email/national code/card/sheba) |
| **Orders** | Paginated order list + detail modal | `GET /api/user/orders` | `prisma.order` (session-scoped `where: userId`) | Real reads; the underlying Order rows are only genuinely `PAID` if the (currently stubbed) payment-verify step ran |
| **Courses** | Enrolled courses + progress | `GET /api/user/enrolled-courses` | `prisma.enrollment` (course-level `progress: Int`, no per-lesson tracking) | Real, but progress granularity is a DB-level limitation, not a UI gap |
| **Transactions** | Paginated transaction history | `GET /api/user/transactions` | `prisma.transaction` (includes `order`) | Real reads; created only by `createTransaction()` inside the payment-verify callback |
| **Notifications** | — | none | no `Notification` model exists | **Fully placeholder** — the dashboard bell is explicitly decorative, no backend at all |
| **Support** | — | none | `Settings.supportEmail/supportPhone` exist but are not surfaced anywhere in the panel | **Fully placeholder** — no ticket system, no in-panel help link |

**Checkout/payment flow that populates all of the above** (`POST /api/checkout` → gateway redirect → `GET /api/payment/verify`): the real Zarinpal `PaymentRequest`/`PaymentVerification` calls are **commented out** in both files. `checkout` returns a hardcoded fake sandbox pay URL; `payment/verify` treats any `Status=OK` query param as a successful payment with no signature or amount verification. This means every Order/Transaction/Enrollment currently visible in the panel was created through a **non-production payment path** — a critical caveat for interpreting "what's real" throughout this audit.

---

## 3. Feature Inventory

### Dashboard
**Existing:** greeting header with Jalali date, profile-completion meter (gold-accented at 100%), 4 stat tiles (enrollments / avg. progress / orders / recent paid orders), 3-course learning preview, 5-order recent-activity preview, "learning status" card (join date, phone-verified flag), one contextual "next best action" nudge.
**Missing:** no real notification feed (bell is decorative), no activity timeline beyond the two preview lists, no investment-portfolio summary despite a whole `UserInvestmentPortfolio` product line existing in the schema (dashboard never surfaces it), no upcoming live-class/Skyroom reminders despite a Skyroom feature existing elsewhere in the app.

### Profile / Settings
**Existing:** avatar upload (2MB limit, type-checked, toast errors), personal info form (name/phone/email/national code/Jalali birth date), bank payout form (card/sheba/owner), 3-step OTP password change.
**Missing:** no email-verification indicator (phone has `phoneVerified`, email does not), no phone-number-change flow, no account deletion / data export (no self-service GDPR-style controls), no 2FA, no active-session/device management, no format/checksum validation on card number or IBAN before persisting, and the personal-tab "save" button silently triggers 3 independent forms at once (including a no-op stub for the password form) — a confusing save affordance.

### Orders
**Existing:** paginated table (10/page), status badges (paid/pending/failed), in-panel detail modal (fixed this session — previously linked to a non-existent route).
**Missing:** no invoice/receipt PDF, no reorder/repurchase action, no cancellation for pending orders, no date-range search/filter in the UI (API only filters by `status`), no click-through from an order row to the resulting course enrollment.

### Courses
**Existing:** paginated grid (9/page), progress bar, completion badge, thumbnail, enrollment date, deep-links into the course player.
**Missing:** no per-lesson completion breakdown (schema only stores a single course-level `progress` percentage), no completion certificates (no user-facing certificate model exists — the schema's `Certificate` model belongs to the public About page, not customers), no post-completion review prompt despite `Comment.rating` already supporting reviews, no sort/filter (by progress, recently accessed), inconsistent "continue where you left off" logic (the dashboard preview computes a first-lesson deep link; the full courses grid does not).

### Transactions
**Existing (added this session):** paginated table, type label (payment/refund/withdrawal), status badge, ref number, description; schema links each transaction to its order.
**Missing:** no CSV/export, no date-range filter (not supported by the API either), no receipt download, no click-through to the linked order despite the relation existing in the data.

### Notifications
**Existing:** nothing. No `Notification` Prisma model, no API route, no UI feed — confirmed by schema grep and API directory listing. The header bell is now explicitly non-interactive (decorative only).
**Missing:** the entire feature, full stack — order-status changes, payment failures, enrollment reminders, security/OTP alerts currently produce zero in-app or push signal. No push/realtime library (`socket.io`, `web-push`, `pusher`, etc.) is installed anywhere in `package.json`.

### Support
**Existing:** nothing customer-facing. `Settings.supportEmail`/`supportPhone` exist in the DB but aren't rendered anywhere in the panel; a public `/faq` page exists but isn't linked from the panel.
**Missing:** no ticket/chat system, no in-panel help/FAQ link, no "contact us about this order" CTA. On the operator side, `app/api/admin/users/route.ts` exists but **no admin UI page consumes it** — support staff currently have no interface to look up a customer's account at all.

---

## 4. UX Review

- **Mobile**: sidebar nav degrades to a horizontally-scrollable pill row on small screens (reasonable pattern), but with 6 items plus a separate logout button there's no visible "more" affordance — items can scroll off-screen without a clear cue.
- **Navigation**: active-state matching via `pathname?.includes()` is a substring check (see §1.3) — works today, fragile if nested detail routes are added later.
- **Loading states**: consistent spinner treatment across orders/courses/transactions (good), but because every fetch is client-side-only, every navigation into the panel shows a skeleton flash — avoidable with RSC-level prefetching.
- **Empty states**: now consistent via the shared `EmptyState` component (orders/courses/transactions/lists) — this was inconsistent/absent before this session's redesign.
- **Error handling**: no `error.tsx` anywhere in this route segment or at the app root (only `app/not-found.tsx` exists) — an uncaught server error currently falls through to Next.js's default unbranded error page. React Query failures surface via a one-shot toast with no retry affordance in the UI.
- **Accessibility**: the order-detail modal uses Radix `Dialog` (accessible: focus trap, Escape-to-close, `aria-modal` by default). `changePasswordModal.tsx`, by contrast, is a **hand-rolled** `fixed inset-0` overlay with none of that — no focus trap, no Escape handling, no `aria-modal` — an inconsistent, less-accessible modal implementation sitting right next to a properly accessible one.
- **User journey**: post-purchase, there's no explicit "what happens next" moment beyond landing back on `/checkout/result`; the dashboard's single "complete your profile" nudge is the only lifecycle prompt in the entire panel — no re-engagement path for stalled enrollments, abandoned pending orders, or post-completion moments.

---

## 5. Backend Capability

**Existing APIs backing the panel** (`app/api/user/*`, 10 routes): `me`, `personal`, `pay`, `avatar`, `upload-avatar`, `orders`, `transactions`, `enrollment`, `enrolled-courses`, `lessons/[lessonId]/stream`. All are session-scoped correctly except `avatar/route.ts`, which uses a raw `NextResponse.json` error shape instead of the shared `lib/api-response` envelope used everywhere else. **None** of the customer-facing routes (including `checkout`, `payment/verify`, `otp/*`) use `lib/api-security.ts`'s rate limiting or security headers — those are only wired into a couple of admin/news routes.

**Missing APIs**: `/api/user/notifications`, `/api/user/orders/[id]` (detail still comes from the already-loaded list page — fine at small scale, won't scale past page 1), `/api/user/wishlist`, `/api/user/certificates`, `/api/user/sessions` (device management), `/api/user/phone-change`, any support/ticket endpoint, any CSV/PDF export endpoint.

**Existing DB models supporting the panel**: `User`, `Order`/`OrderItem`, `Enrollment`, `Transaction`, `Course`/`Chapter`/`Lesson`, `Comment` (doubles as course reviews via its `rating` field), `QuizAttempt`, `UserInvestmentPortfolio`. **Confirmed absent** (grepped the schema directly): `Notification`, `Wishlist`/`Favorite`, `Cart`/`CartItem` (cart is simulated via `Order{status: PENDING}`), `Address`, dedicated `Review`/`Rating` model, and any user-facing `Certificate` (the schema's `Certificate` model belongs to the public About page, unrelated).

### Technical limitations / bugs surfaced during this audit (not fixed — documentation only)

- **Payment flow is stubbed**: real Zarinpal request/verification calls are commented out in `checkout/route.ts` and `payment/verify/route.ts`; the latter accepts `Status=OK` with no cryptographic or amount verification. This is the single biggest limitation — it means every Order/Enrollment/Transaction currently in the system was created through a non-production path.
- **Malformed raw SQL** in `otp/send/route.ts`, `auth/forgot-password/request/route.ts`, and `otp/verify/route.ts` (missing `=` in `UPDATE ... SET`/`WHERE` clauses) — will throw on the "row already exists" branch. The equivalent logic in `auth/signup/route.ts` is written correctly, suggesting a copy-paste divergence.
- **Two parallel OTP systems** coexist: a local DB-backed one (`otp/*` + `Otp`/`TempUser` tables) and a separate IPPanel-hosted proxy (`auth/verify-otp`, `send-sms-otp`, etc.) — unclear which is actually live in production.
- **`auth/login/route.ts`** issues a custom JWT with NextAuth's `signIn()` commented out, so it's disconnected from the session mechanism `/api/user/*` actually relies on.
- **`Order.items` (Json)** duplicates the relational `OrderItem[]` — two sources of truth for order contents.
- **`Enrollment.progress`** is a single course-level integer — no per-lesson completion record exists, which caps any future "resume exactly where you left off" or per-lesson analytics feature.

---

## 6. Recommended Improvements

**Features to add**: real notification system (schema + API + bell UI), wishlist/favorites backend (the "لیست‌ها" tab is already scaffolded and waiting for this), a dedicated `/profile/orders/[id]` route in addition to the modal (bookmarkable/shareable detail URL), course-completion certificates, per-lesson progress tracking, a support/contact entry point wired to the existing `supportEmail`/`supportPhone` settings, an investment-portfolio summary on the dashboard, CSV export for transactions, and an admin-side customer-lookup UI to finish what `app/api/admin/users` started.

**UX improvements**: move first-paint data fetching to RSC where practical to remove the skeleton flash, switch nav active-state to exact-route matching, unify the hand-rolled tables onto `components/ui/table.tsx`, replace `changePasswordModal.tsx`'s custom overlay with Radix `Dialog` for accessibility parity with the rest of the panel, give each settings form its own explicit save affordance instead of one shared button covering three forms, add phone-change and format validation for bank fields.

**Business opportunities**: surface investment portfolios and cross-sell prompts on the dashboard, "recommended next course" based on order/enrollment history, review prompts after course completion (the data model already supports it via `Comment.rating`), gamified profile-completion (the premium/gold token and Badge system built for this redesign are already positioned for this), a referral program (currently no schema support — greenfield).

**Retention/conversion levers**: idle-enrollment nudges (progress stalled N+ days with no notification infra to deliver them today), post-purchase receipt/download to reinforce value, "continue learning" reminders (blocked on notification infra), visible support channel to reduce purchase anxiety before checkout.

---

## 7. Future User Portal Roadmap (indicative phasing, not scheduled)

1. **Foundation fixes** — restore real Zarinpal integration, fix the malformed OTP SQL, consolidate the two OTP systems into one, add `error.tsx` boundaries, add rate limiting to `checkout`/`otp`/`payment` routes.
2. **Core feature gaps** — Notification model + API + UI, Wishlist model + API + UI, `/profile/orders/[id]` route, phone-number-change flow.
3. **Engagement & retention** — completion certificates, per-lesson progress tracking, post-completion review prompts, dashboard investment-portfolio summary, transaction CSV export.
4. **Support & business tooling** — lightweight support/contact flow (or full ticketing), admin customer-lookup UI, referral system, deeper gamification on top of the existing profile-completion/premium-badge mechanics.

---

*This document is a point-in-time audit. No implementation was performed.*
