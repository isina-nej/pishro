# Frontend Rules

## Data fetching
- TanStack React Query is the standard for server-state; hooks live in `lib/hooks/use<Domain>.ts` and export a **query-key factory** per domain (e.g. `courseKeys = { all, list(), detail(id) }` in `useCourses.ts`, `bookKeys`, `newsKeys`, `commentKeys`, `orderKeys`, `userKeys`, `videoKeys`, `blockNewsKeys`, `adminCourseKeys`, `chapterKeys`, `lessonKeys`). When adding a query/mutation to an existing domain, extend its existing key factory rather than inventing new ad hoc keys — this keeps cache invalidation (`queryClient.invalidateQueries`) correct.
- `staleTime`/`gcTime`/`refetchOnMount` are tuned per-hook based on how often the underlying data changes (e.g. courses list uses a 10-minute `staleTime` since courses rarely change). Match the tuning style of sibling hooks in the same domain rather than defaulting to React Query's global defaults.
- The service functions called by hooks (`lib/services/*-service.ts`) are the actual network layer; hooks should stay thin wrappers around `useQuery`/`useMutation` + a service call, not contain fetch logic directly.

## Forms & validation
- Forms use `react-hook-form` + `@hookform/resolvers` + `zod`. Validation schemas live in `lib/schemas/<domain>-schema.ts` and are shared between client-side form validation and (where applicable) server-side route validation — reuse the same schema on both sides instead of duplicating validation rules.
- Validation messages are Persian strings embedded directly in the schema (see `coding-style.md`).

## State management
- Global client state (not server state) uses Zustand, in `stores/` (`cart-store.ts`, `investmentStore.ts`, `scroll-store.ts`, `user-level-store.ts`). Use Zustand for cross-component UI/client state; use React Query for anything that originates from the server/database — don't duplicate server data into a Zustand store.

## Components
- shadcn/ui, "new-york" style (`components.json`), Tailwind CSS with CSS variables, `neutral` base color, `lucide-react` icon library. `@/components/ui` holds shadcn primitives; feature components live under `components/<feature>/`.
- Multiple overlapping rich-text/news-editor implementations coexist: Tiptap-based (`RichNewsEditor`, `NewsEditor`, `NewsEditorEnhanced` in `components/admin/news/` and `components/news/`) and MDX-based (`MDXNewsEditor`, `useMDXEditor`, backed by `lib/services/mdx-news-service.ts`). Before extending "the" news editor, check which pipeline the specific page actually renders (`lib/hooks/useNews.ts`/`use-block-news.ts` vs the MDX hook) — they are not the same feature.
- Known duplicate components exist per-feature (`pageContent.tsx` copied into several `components/<feature>/` folders; `components/utils/` duplicating `components/ui/` items like `slider.tsx`/`ThemeToggle.tsx`). Check for sibling copies before assuming an edit in one location covers all usages.

## Persian/RTL & localization
- The app is Persian-first: `date-fns-jalali` for Jalali (Persian) calendar dates, Persian UI copy throughout. New date displays/inputs should use the Jalali utilities already in use rather than the Gregorian `date-fns`/native `Date` formatting, to stay consistent with existing pages.
- Iranian third-party integrations are UI-adjacent: Zarinpal (payment) in checkout flows, Melipayamak/Modirpayamak (SMS/OTP) in auth flows — treat these as fixed external providers, not swappable abstractions, unless a task explicitly asks to add a provider.

## Media
- Video playback uses `plyr-react`/`hls.js` against HLS streams produced by the video-processing pipeline (see `architecture.md`); don't wire a new video player to raw MP4 URLs from the S3 videos folder — the app streams via HLS through `app/api/video/*`/`app/api/uploads/*`.
