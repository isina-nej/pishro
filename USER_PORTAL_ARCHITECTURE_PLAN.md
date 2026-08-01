# User Portal Architecture Plan — Pishro Customer Portal

**Status:** architecture/design document only. No application code was changed to produce this. Builds directly on `USER_PANEL_AUDIT.md` — every recommendation below references a specific finding from that audit rather than proposing changes in the abstract.

**Grounding principle:** reuse the codebase's existing conventions wherever possible (JSend response envelope in `lib/api-response.ts`, Prisma as the primary data layer per `database.md`, the `<domain>-service.ts` pattern, the React Query key-factory pattern in `useUser.ts`, the `.royal-theme` token system already shared between admin and profile). New infrastructure is proposed only where a real gap exists, not as a parallel architecture.

---

## 1. Product Vision

### What the portal becomes
Today's `/profile/*` is an **account panel** — a place to view what already happened (orders, transactions, enrollments) and edit static fields. The target is a **Customer Portal**: the place a Pishro customer *lives* between purchases — where they resume learning, track their financial history with confidence, get proactively notified, get help, and are nudged toward their next purchase or completion, all backed by data a future CRM can consume.

### Main user journeys
1. **Purchase → Learn → Complete → Advocate**: buy a course → resume learning seamlessly → finish and receive a certificate → leave a review / get recommended the next course / refer a friend.
2. **Onboarding**: first login → profile-completion nudge (exists today) → first-lesson start → early engagement signal captured.
3. **Financial trust journey**: purchase → real payment confirmation → order + transaction + (future) receipt visible immediately → no ambiguity about payment status (this depends on Phase 0 — see §10).
4. **Support journey**: something goes wrong (payment, access, content) → self-service ticket → resolution → closed-loop notification.
5. **Re-engagement journey**: enrollment goes idle → reminder → returns → resumes exactly where they left off.

### Business goals
- Increase **course completion rate** (currently unmeasurable at the lesson level — see audit §3, Courses).
- Increase **repeat purchase rate** via recommendations, wishlist, and investment-portfolio cross-sell.
- Reduce **support cost** by making the portal self-service (status visibility, tickets) instead of phone/manual.
- Build a **first-party data asset**: every meaningful customer action becomes a queryable event, ready for CRM/segmentation (§9), without requiring a CRM to exist yet.
- Build **trust**: a portal that shows accurate, real-money-backed purchase history depends on fixing the stubbed payment flow first (Phase 0) — no amount of UI polish substitutes for that.

### How it improves retention, sales, and CX
- **Retention**: notifications + reminders + certificates + resume-learning close the loop that currently ends the moment a user leaves the dashboard.
- **Sales**: wishlist reduces purchase friction; recommendations and a visible investment-portfolio section create cross-sell surface area that exists in the data today (`UserInvestmentPortfolio`) but is invisible in the UI.
- **CX**: a real support channel and consistent empty/loading/error states remove the two biggest sources of quiet frustration identified in the audit (no help path, unbranded error fallback).

---

## 2. Information Architecture

| Section | Purpose | User value | Required data |
|---|---|---|---|
| **Dashboard** | Command center — one glance at learning, orders, and what to do next | Orientation, reduces "where do I find X" friction | `User` + stats, `Enrollment` (recent), `Order` (recent), `Notification` (unread count), `UserInvestmentPortfolio` (summary) |
| **Profile** | Identity & trust — who the platform thinks this user is | Confidence that account info/verification is correct | `User` core fields, `phoneVerified`, new email-verification flag |
| **Learning Center** | Everything about active/completed learning (supersedes today's flat "Courses" tab) | Single place to resume, track, and complete courses | `Enrollment`, new `LessonProgress`, new `UserCertificate`, `Comment` (reviews) |
| **Orders** | Purchase history + itemized detail | Proof of what was bought and when | `Order`, `OrderItem` |
| **Payments & Transactions** | Financial ledger, separate from *what* was bought | Financial transparency, dispute-readiness | `Transaction`, linked `Order` |
| **Notifications** | In-app event feed | Proactive awareness instead of having to check manually | new `Notification` |
| **Support Center** | Self-service help | Resolve issues without leaving the portal | new `SupportTicket` / `SupportTicketMessage` |
| **Wishlist/Favorites** | Saved-for-later courses | Lower-friction path back to a purchase decision | new `Wishlist` |
| **Certificates** | Proof of completion | Shareable credential, motivates completion | new `UserCertificate` |
| **Investment Portfolio** | Surfacing owned investment products | Currently real data with zero UI surface — a pure win | existing `UserInvestmentPortfolio` (no new model) |
| **Settings** | Security & preferences, split from "Profile" (identity) | Clear mental model: *Profile = who I am, Settings = how the account behaves* | `User` security fields, new `notificationPreferences` (JSON on `User` for MVP), (future) `UserSession` |

**IA correction vs. today**: the current "تنظیمات پروفایل" tab conflates identity editing (name, email) with security (password) and financial info (bank payout). The target IA splits this: **Profile** owns identity fields + verification status; **Settings** owns password/security, notification preferences, and (later) session management. Bank payout info stays attached to Profile (it's identity/payout data, not a security setting) — a minor but clarifying regrouping, not a rewrite.

---

## 3. UX Architecture

### Mobile-first
Today's sidebar degrades to a horizontally-scrollable pill row on mobile (audit §4) with no "more" affordance once the nav grows past 6 items. Target: a **bottom tab bar on mobile** (≤5 primary destinations: Dashboard, Learning, Orders, Notifications, More) with secondary items (Transactions, Wishlist, Certificates, Support, Settings) collapsed under "More" — a standard, well-understood mobile pattern that scales past 6 items without silent overflow. Desktop keeps the existing vertical sidebar, just with more items grouped under light section headers (Learning / Financial / Account).

### Dashboard layout
Three zones, in priority order:
1. **Status strip** — profile completion, unread notifications, any action-required item (e.g. a pending order).
2. **Continue learning** — the single highest-intent action (resume last-active lesson), promoted above generic stat tiles.
3. **Activity & recommendations** — recent orders/transactions preview, "recommended next course" (§7), investment-portfolio summary.

### User lifecycle journeys
- **First login**: welcome state, profile-completion checklist (extends the existing % meter), prompt to browse courses if none purchased yet.
- **Active learner**: dashboard leads with "continue learning," Learning Center shows in-progress vs completed split.
- **Idle learner** (no activity N days): triggers a reminder notification (§8) — this is a lifecycle state the portal must be able to detect, which requires `UserActivity`/`LessonProgress` timestamps to exist (they don't today).
- **Post-completion**: certificate issuance + review prompt + "what's next" recommendation, replacing the current dead-end after a course hits 100%.
- **Support-seeking**: any Orders/Transactions row gets a contextual "مشکلی دارید؟" entry point into a pre-filled support ticket (order id attached automatically).

### Empty / loading / error states
- **Empty states**: the shared `EmptyState` component (already built this session) becomes the standard for every new section (Notifications, Wishlist, Support, Certificates) — no new pattern needed, just consistent reuse.
- **Loading states**: today every page is client-fetch-only, so every navigation shows a skeleton (audit §4). Target: adopt Next.js's RSC-prefetch-then-hydrate pattern (§4) so first paint on navigation is often already-populated, with skeletons reserved for genuinely uncached data.
- **Error handling**: add `error.tsx` at `app/(routes)/profile/` (currently absent, audit §1/§4) with a branded fallback and a retry action, plus per-section granularity where a single failed widget (e.g. recommendations) shouldn't take down the whole dashboard — wrap independently-failable widgets in their own error boundary.

### Engagement/retention features
- Streaks or simple "days active this month" counter (cheap, derived from `UserActivity`).
- Milestone moments: course-completion celebration + certificate download prompt.
- Personalized "continue where you left off" always visible until dismissed.
- Gamified profile completion extended: the existing premium/gold badge at 100% completion (built this session) becomes the template for other milestone badges (first course completed, first certificate, etc.) — same token system, no new design language.

---

## 4. Frontend Architecture

### Component structure
Keep the existing flat `components/profile/` structure for what exists today (17 files, all still coherent), but **new domains get their own subfolder** once they're added, rather than growing the flat directory further:
```
components/profile/
├── dashboard/         (existing: profileMain, profileHeader, statTiles...)
├── learning/          (existing enrolledCourses + new: lessonProgressBar, certificateCard, reviewPrompt)
├── orders/            (existing ordersTable, orderDetail)
├── payments/           (existing transactionsTable)
├── notifications/      (new: notificationBell, notificationFeed, notificationItem)
├── support/            (new: ticketList, ticketThread, newTicketForm)
├── wishlist/           (new: wishlistGrid, wishlistCard)
├── settings/           (existing forms, regrouped per §2's Profile/Settings split)
└── shared/             (emptyState, badge re-exports, pageHeader, dataTable wrapper)
```
This is a *reorganization to apply as new domains land*, not a rename sweep of existing files — avoids unnecessary churn on working code.

### Shared components (new or formalized)
- `EmptyState` — already exists, keep as the single empty-state primitive.
- `Badge` — already extended with `success`/`premium` this session; add a `warning` variant backed by new `--warning`/`--warning-foreground` royal-theme tokens (mirroring how `--success`/`--premium` were added) so "pending" states stop being inline `amber-*` classes repeated in three files (audit-noted inconsistency).
- `DataTable` — a thin wrapper around the existing (currently unused) `components/ui/table.tsx`, adopted by Orders/Transactions/Wishlist/Support instead of each hand-rolling `<table>` markup.
- `PageHeader` — formalize the existing `header.tsx` primitive's role explicitly as the shared section-header component (title + actions), used by every new section too.
- `NotificationBell` / `NotificationFeed` — new, replaces the currently-decorative bell.
- `StatCard`, `ActivityFeed` — new, used by Dashboard.

### Design system / Royal Green token usage
No new design system — extend the existing one:
- All new sections mount inside the already-shared `.royal-theme` scope (`app/(routes)/profile/layout.tsx` already wraps the whole panel).
- New semantic tokens follow the exact pattern already established for `--success`/`--premium`/`--surface-selected`/`--nav-active-bg`/`--icon-brand`: add `--warning`/`--warning-foreground` the same way, in both `:root .royal-theme` and `.dark .royal-theme` blocks in `globals.css`.
- Gold/`premium` stays reserved for genuinely premium moments (100% profile completion today; extend to certificate-earned and VIP-tier moments later) — do not let it become a generic "highlight" color, per the design spec's own ~5–10% usage rule.

### Server Component vs. Client Component strategy
Today: every page is a thin Server Component wrapper around a fully client component that fetches on mount (audit §1). Target: **prefetch on the server, hydrate on the client** — the standard Next.js + TanStack Query pattern:
1. Each `page.tsx` (still a Server Component) calls the relevant service function directly (e.g. `getUserOrders` via Prisma, server-side) and prefetches it into a `QueryClient`.
2. The page dehydrates that client and passes it through a `HydrationBoundary` wrapping the existing client component.
3. The client component's `useQuery` call (same hook, same key, unchanged) resolves instantly from the hydrated cache on first paint, then behaves exactly as it does today for refetches/pagination/mutations.

This removes the "always a skeleton flash" problem without rewriting any of the existing client-side interaction logic — it's additive at the page-boundary only.

### React Query strategy
Extend the existing `userKeys` factory pattern in `lib/hooks/useUser.ts` with parallel factories per new domain, exactly matching the established shape:
```
notificationKeys = { all, list(page), unreadCount() }
wishlistKeys = { all, list() }
ticketKeys = { all, list(status?), detail(id) }
certificateKeys = { all, list() }
```
Mutations continue to invalidate the relevant `*.all` key on success, matching today's convention. No new state-management library — React Query remains the only server-state layer for this panel, per the existing `frontend.md` rule.

### Form architecture
Move the currently-inline Zod schemas (`personalInfoForm.tsx`, `payInfoForm.tsx`) into `lib/schemas/user-profile-schema.ts`, and give new forms (support ticket creation, notification preferences) their own `lib/schemas/<domain>-schema.ts` files from the start — matching the documented convention that schemas are shared between client validation and server route validation, rather than continuing the drift the audit found.

### Accessibility improvements
- Replace `changePasswordModal.tsx`'s hand-rolled overlay with the existing Radix `Dialog` primitive (already used correctly for the order-detail modal) — removes the audit-flagged inconsistency (no focus trap/Escape/`aria-modal` today).
- New notification dropdown and support-ticket dialogs use Radix `Popover`/`Dialog` from the start, not custom overlays.
- Every new interactive element inherits the `.royal-theme` `--ring` focus token already defined, so focus-visible styling stays consistent without new work.

---

## 5. Backend Architecture

### Required APIs (new)
| Endpoint | Method(s) | Purpose |
|---|---|---|
| `/api/user/notifications` | GET, PATCH (mark read), PATCH (mark all read) | Notification feed |
| `/api/user/wishlist` | GET, POST, DELETE | Save/remove/list wishlist courses |
| `/api/user/certificates` | GET (list), GET `/[id]` (detail/download) | Certificate access |
| `/api/user/orders/[id]` | GET | Dedicated order detail (today's UI reuses the already-loaded list — fine at small scale, doesn't scale past page 1, per audit §5) |
| `/api/user/support/tickets` | GET, POST | List/create tickets |
| `/api/user/support/tickets/[id]/messages` | GET, POST | Ticket thread |
| `/api/user/lessons/[lessonId]/progress` | POST | Record granular lesson progress (distinct from the existing course-level `PATCH /api/user/enrollment`) |
| `/api/user/investment-portfolio` | GET | Surface `UserInvestmentPortfolio` in the portal (confirm whether an equivalent already exists elsewhere before building — audit did not find one under `/api/user/*`) |
| `/api/user/settings/notifications` | GET, PUT | Notification preferences |
| `/api/user/phone-change` | POST (request), POST (verify) | Phone number change, reusing OTP infra — **blocked on Phase 0's OTP fixes** |
| `/api/user/sessions` | GET, DELETE `/[id]` | Device/session management — stretch goal, see §6's `UserSession` caveat |

### Missing endpoints to prioritize
Of the above, `/api/user/notifications`, `/api/user/orders/[id]`, and `/api/user/lessons/[lessonId]/progress` unlock the most user-facing value for the least backend risk (all pure-additive, no changes to existing endpoints) — see roadmap phasing.

### Service layer changes
New `lib/services/<domain>-service.ts` files following the existing convention, all Prisma-backed (per `database.md`'s "prefer Prisma for new data-access code" rule — none of these are raw-SQL domains today, so no reason to introduce that pattern):
- `notification-service.ts`
- `wishlist-service.ts`
- `support-service.ts`
- `certificate-service.ts`
- `lesson-progress-service.ts`

Existing services untouched except: `user-service.ts` gains the client-side wrapper functions for the new endpoints above (matching its current 1:1 function-per-endpoint pattern).

### Security requirements
- Apply `lib/api-security.ts`'s `addSecurityHeaders`/`checkRateLimit` to **all** `/api/user/*` routes and especially `checkout`, `payment/verify`, `otp/*` — audit §5 found zero coverage today anywhere in the customer-facing surface.
- Fix the malformed raw SQL in `otp/send`, `forgot-password/request`, `otp/verify` (audit §5) — a reliability *and* security prerequisite (a route that throws on a valid retry path is also a route that's hard to reason about for abuse).
- Restore real Zarinpal signature/amount verification in `payment/verify` — currently accepts `Status=OK` with no cryptographic check, which is a critical trust and fraud gap, not just a "finish the feature" item.
- Consolidate the two parallel OTP systems (local DB vs. IPPanel proxy) into one before building the phone-change flow on top of either.
- Every new endpoint follows the existing ownership-check pattern already used correctly by most `/api/user/*` routes (session-scoped `where: { userId: session.user.id }`, or explicit ownership verification like `enrollment/route.ts`'s pattern) — no new pattern needed, just consistent application.

### Rate limiting requirements
Per-endpoint budgets, all via the existing `checkRateLimit(clientId, endpoint)`:
- OTP send / phone-change request: strict (e.g. 3 per 10 minutes per phone).
- Checkout / payment-verify: moderate, abuse-focused (prevent order-spam), independent of the payment gateway's own idempotency.
- Support ticket creation: moderate (prevent spam tickets).
- Notification mark-read, wishlist toggle: high/cheap limits (these are low-risk, high-frequency UI actions).

**Caveat to carry forward** (per `security.md`): `checkRateLimit` is in-memory and single-instance. If the production deployment ever runs multiple server instances, payment/OTP endpoints need a real distributed limiter (Redis-backed) instead — flag this explicitly rather than assuming the current implementation is sufficient once these become higher-value abuse targets.

---

## 6. Database Architecture

No migrations are created here — model design only, for future implementation.

### `Notification`
**Purpose**: in-app event record per user; the single source for the notification feed and unread badge.
**Main fields**: `id`, `userId`, `type` (enum: `ORDER_STATUS`, `ENROLLMENT_REMINDER`, `PAYMENT`, `SECURITY`, `SUPPORT`, `SYSTEM`), `title`, `body`, `link?` (deep link into the portal), `read: Boolean @default(false)`, `readAt?`, `createdAt`.
**Relations**: belongs to `User`.
**Note**: channel-agnostic by design — whether a notification is *also* emailed/SMS'd is a delivery-layer concern (see `notificationPreferences`, not a new model for MVP), not something this table needs to encode.

### `Wishlist`
**Purpose**: saved-for-later courses.
**Main fields**: `id`, `userId`, `courseId`, `createdAt`.
**Relations**: belongs to `User`, belongs to `Course`. Unique on `[userId, courseId]`.

### `LessonProgress`
**Purpose**: per-lesson completion tracking — fixes the audit's finding that `Enrollment.progress` is course-level only, capping resume-playback and analytics.
**Main fields**: `id`, `userId`, `lessonId`, `enrollmentId`, `completed: Boolean`, `watchedSeconds: Int` (drives resume-exactly-where-left-off), `completedAt?`, `lastAccessedAt`.
**Relations**: belongs to `User`, belongs to `Lesson`, belongs to `Enrollment`. Unique on `[userId, lessonId]`.
**Note**: `Enrollment.progress` becomes a **derived/cached** value computed from this table's rows (recomputed on write, or via a periodic job) rather than the sole source of truth. This is a meaningful architectural shift for existing code that writes `Enrollment.progress` directly (`PATCH /api/user/enrollment`) — that endpoint's role narrows to course-level completion flagging once lesson-level tracking exists, worth resolving explicitly at implementation time.

### `UserCertificate`
**Purpose**: issued completion certificate per user per course. **Named `UserCertificate`, not `Certificate`**, to avoid collision with the schema's existing `Certificate` model (which belongs to the public About page's company credentials, per the audit — an unrelated concept that happens to share the obvious name).
**Main fields**: `id`, `userId`, `courseId`, `enrollmentId`, `certificateNumber` (unique, human-referenceable), `issuedAt`, `pdfUrl?` (via the existing local-disk `storage-adapter.ts`, consistent with how other non-video files are stored), `verificationCode` (for a public `/certificates/verify/[code]` trust page).
**Relations**: belongs to `User`, belongs to `Course`, belongs to `Enrollment`.

### `SupportTicket` + `SupportTicketMessage`
**Purpose**: self-service support ticketing, replacing the current zero support surface.
**`SupportTicket` fields**: `id`, `userId`, `subject`, `category` (enum: `ORDER`, `PAYMENT`, `COURSE`, `ACCOUNT`, `OTHER`), `status` (enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), `priority?`, `relatedOrderId?`, `relatedCourseId?`, `createdAt`, `updatedAt`.
**`SupportTicketMessage` fields**: `id`, `ticketId`, `senderRole` (enum: `USER`, `ADMIN`), `senderId`, `body`, `attachmentUrl?`, `createdAt`.
**Relations**: `SupportTicket` belongs to `User`, has many `SupportTicketMessage`; each message belongs to its ticket. `senderId` intentionally isn't a typed relation to either `User` or `AdminUser` (the two auth systems are independent per `architecture.md`) — keep it as an id + role pair rather than forcing a polymorphic relation.

### `UserActivity`
**Purpose**: append-only lightweight event log — the raw feed that powers engagement signals, reminders, and (later) CRM export. Deliberately generic rather than one table per event type.
**Main fields**: `id`, `userId`, `eventType` (string, e.g. `login`, `lesson_started`, `lesson_completed`, `course_purchased`, `support_ticket_opened`), `metadata: Json`, `createdAt`.
**Relations**: belongs to `User`.
**Note**: written server-side at the actual point of truth (e.g. `payment/verify` writes `course_purchased`, the new lesson-progress endpoint writes `lesson_completed`) — never trust a client-reported event for anything business-relevant.

### `UserSession` (stretch — architectural decision required before building)
**Purpose**: active-session/device visibility ("log out other devices").
**Main fields**: `id`, `userId`, `deviceLabel?`, `ipAddress?`, `lastActiveAt`, `createdAt`, `revokedAt?`.
**Relations**: belongs to `User`.
**Caveat**: NextAuth's customer sessions are currently **stateless JWTs** (per `auth.ts`). A `UserSession` table only enables real revocation if either (a) the customer auth strategy moves to database-backed sessions, or (b) JWT validation is extended to check against this table on every request (added latency/complexity). This is a genuine architecture decision, not a drop-in model — flagged for explicit discussion before scheduling.

### Simpler alternative noted: `notificationPreferences`
Rather than a dedicated `NotificationPreference` model for MVP, add a single `notificationPreferences: Json?` column to `User` (channel/category booleans as JSON). Promote to a real model only if per-category granularity actually gets used — avoids over-modeling a feature before it has real usage data.

---

## 7. Learning Experience Design

- **Course progress**: shift from `Enrollment.progress` as ground truth to a value **derived from `LessonProgress`** (percentage of lessons completed). This is more accurate and unlocks per-lesson UI (checkmarks in a lesson list) that doesn't exist today.
- **Lesson tracking**: the video player periodically posts `watchedSeconds` (throttled, not per-frame) to the new lesson-progress endpoint, plus an explicit `completed` event when a lesson ends — this is what makes "resume exactly where you left off" possible, versus today's "resume at the first lesson of the course" logic in `profileMain.tsx`.
- **Continue learning**: centralize into one shared helper (e.g. `getResumeLessonForEnrollment()`) used by both the Dashboard and the Learning Center, fixing the audit-noted inconsistency where only the dashboard computes a deep link today.
- **Certificates**: auto-issue a `UserCertificate` when all lessons in an enrollment are marked complete in `LessonProgress`; generate a PDF via the existing storage adapter; expose a public, shareable verification page — turns completion into a shareable, LinkedIn-style artifact rather than a dead end.
- **Reviews**: prompt for a review (via notification, not a blocking modal) after certificate issuance; write to the **existing** `Comment.rating` field — no new review model needed, this is purely a UI/notification-trigger addition on top of data the schema already supports.
- **Recommendations**: a `recommendation-service.ts` computing simple, explainable rules server-side for v1 — same category as completed/purchased courses, or popular-in-category. Explicitly **not** ML-based in v1; that's a later iteration once there's enough `UserActivity`/`Enrollment` volume to justify it.

---

## 8. Customer Engagement System

- **Notifications**: event-driven, hooked into existing lifecycle points — `payment/verify` success → `ORDER_STATUS` notification; enrollment created → welcome/first-lesson nudge; course completed → certificate + review-prompt notification. MVP delivery channel is **in-app only**; email/SMS/push delivery is a deliberately separate, later concern (no push library exists in the project today, per the audit).
- **Reminders**: idle-enrollment nudges (no `LessonProgress` activity in N days) require a scheduled process. Consistent with the existing architectural pattern of not running long-lived work inside the Next.js server process (the `video-processor` worker in `docker-compose.yml` is the existing precedent) — recommend a small, separate scheduled worker rather than embedding cron logic in an API route.
- **User activity tracking**: write `UserActivity` rows server-side at the actual point of truth (payment verification, lesson-progress endpoint, ticket creation) — never client-reported for anything that matters.
- **Personalized recommendations**: v1 rule-based, reading from `UserActivity` + `Enrollment` + `Order` (§7).
- **CRM data collection points**: this system's entire output (`Notification`, `UserActivity`, `LessonProgress`, `SupportTicket`) is designed to be the raw material for §9 — engagement isn't just a UX feature here, it's the data pipeline.

---

## 9. CRM Integration Points

The principle: **this app exposes raw, queryable signals; a future CRM/BI layer computes scoring and segmentation from them.** Do not build a live scoring engine inside the customer portal — scoring models change frequently and shouldn't require app redeploys.

| CRM need | Source in this architecture |
|---|---|
| **Purchases** | `Order` + `Transaction` (amount, course, date, payment status) — already structurally clean, just needs an export/webhook layer once a CRM is chosen |
| **Course behavior** | `LessonProgress` + `UserActivity` (completion depth, time-to-complete, drop-off points) |
| **Last activity** | Simplest option: add a plain `lastSeenAt: DateTime?` directly on `User`, updated on meaningful requests — cheaper than deriving it from `UserSession`, which may not exist (§6 caveat) |
| **Support history** | `SupportTicket`/`SupportTicketMessage` — volume, category breakdown, resolution time per customer |
| **Engagement score** | **Not computed in this app.** Expose the raw signals above; let the CRM/BI layer define and version the scoring formula |
| **Customer segmentation** | Same principle — a future aggregate endpoint (extending the currently-unused `app/api/admin/users` route into something like `/api/admin/customers/[id]/profile`) exposes enrollment count, total spend, last activity, ticket count, verification status, letting the CRM segment however it needs, without this app encoding segment definitions |

This keeps the customer portal and the future CRM cleanly separated: the portal is the system of record for raw events, the CRM is the system of intelligence built on top of them.

---

## 10. Implementation Roadmap

### Phase 0 — Security & Payment Foundation
**Goal**: make every downstream feature trustworthy. Nothing in Phases 1–5 is worth building on top of data that can't be trusted.
**Features**: none user-facing — this is entirely foundation work.
**Technical requirements**: fix malformed OTP SQL (`otp/send`, `forgot-password/request`, `otp/verify`); restore real Zarinpal request + signature/amount-verified callback in `checkout`/`payment/verify`; consolidate the two parallel OTP systems into one; apply rate limiting + security headers across `checkout`/`otp`/`payment`/`auth`/`/api/user/*`; add `error.tsx` at the profile route segment (and root, if still absent).
**Dependencies**: none — this is the prerequisite for everything else.
**Priority**: Critical.

### Phase 1 — Core Customer Portal
**Goal**: bring the existing panel's architecture and IA up to the target standard before adding new domains on top of it.
**Features**: Profile/Settings IA split (§2); dedicated `/profile/orders/[id]` route.
**Technical requirements**: adopt the RSC-prefetch + hydration pattern (§4) for existing pages; move inline Zod schemas to `lib/schemas/`; adopt `components/ui/table.tsx` for Orders/Transactions; replace `changePasswordModal`'s custom overlay with Radix `Dialog`; add `User.lastSeenAt`.
**Dependencies**: Phase 0 (trustworthy underlying data).
**Priority**: High.

### Phase 2 — Learning Experience
**Goal**: turn "courses I bought" into a real learning product with progress, resume, and completion rewards.
**Features**: per-lesson progress + resume-playback; `UserCertificate` issuance + public verification page; review prompts on completion; v1 rule-based recommendations.
**Technical requirements**: `LessonProgress` model + `POST /api/user/lessons/[lessonId]/progress`; `UserCertificate` model + `/api/user/certificates`; `recommendation-service.ts`; unify "continue learning" logic across Dashboard and Learning Center.
**Dependencies**: Phase 1 (stable data-fetch pattern to build the new UI on).
**Priority**: High — direct retention/conversion impact.

### Phase 3 — Notifications & Engagement
**Goal**: close the loop — the portal proactively tells the user what happened and what to do next.
**Features**: in-app notification bell + feed (replacing the decorative bell); event notifications for order/payment/enrollment/completion; idle-enrollment reminders.
**Technical requirements**: `Notification` model + `/api/user/notifications`; event hooks at `payment/verify`, enrollment creation, lesson-progress completion; `UserActivity` logging; a separate scheduled worker for reminder generation (not embedded in the Next.js process).
**Dependencies**: Phase 0 (trustworthy events to notify about), Phase 2 (completion/certificate events to notify about).
**Priority**: Medium-High.

### Phase 4 — Support System
**Goal**: give customers (and support staff) a real resolution path.
**Features**: customer-facing ticket creation + thread view; contextual "having an issue with this order?" entry points; admin-side ticket queue; admin customer-lookup UI (finally consuming the existing `app/api/admin/users` endpoint).
**Technical requirements**: `SupportTicket` + `SupportTicketMessage` models; `/api/user/support/tickets*`; an interim low-effort win that can ship *before* full ticketing — simply wiring the existing `Settings.supportEmail`/`supportPhone` + the public `/faq` page into the portal as a visible link.
**Dependencies**: benefits from Phase 3's notification infra (ticket-reply notifications) but isn't blocked by it.
**Priority**: Medium.

### Phase 5 — CRM Integration
**Goal**: make the customer portal's data consumable by whatever CRM/BI layer the business adopts next.
**Features**: `Wishlist` (also a strong CRM/segmentation signal, not just a UX nicety); investment-portfolio surfaced in the Dashboard (cross-sell data point already sitting unused in `UserInvestmentPortfolio`); an aggregate customer-profile endpoint for CRM/admin consumption; export/webhook layer for `Order`/`Transaction`/`UserActivity`/`SupportTicket`.
**Technical requirements**: `Wishlist` model + `/api/user/wishlist`; `/api/user/investment-portfolio`; extend `app/api/admin/users` toward a per-customer aggregate profile endpoint.
**Dependencies**: Phases 0–4 — this phase mostly consumes what earlier phases produce (purchases, activity, support history all need to exist first).
**Priority**: Medium — a business-value multiplier once the underlying data foundation is in place, not a standalone deliverable.

---

*This document is an architecture proposal only. No migrations, code, or configuration were created or modified.*
