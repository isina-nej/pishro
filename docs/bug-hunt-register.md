# Bug Hunt Register — Pishro (2026-08-03)

Evidence from HTTP smoke tests, Playwright (desktop 1440 / tablet 768 / mobile 390), screenshots under `/opt/cursor/artifacts/bug-hunt/`, and code inspection.

## Plan

1. Fix security/auth middleware gap  
2. Fix dark-on-dark hero contrast (business consulting, investment plans, about-us)  
3. Fix FAQ duplicate static placeholders → load published FAQs from DB  
4. Fix invalid SVG path arcs  
5. Fix admin login RTL icon/padding  
6. Retest affected pages at desktop + mobile  

## Confirmed bugs

| ID | Sev | Status | Title | Where | Evidence / Fix |
|----|-----|--------|-------|-------|----------------|
| B01 | High | **Fixed** | Admin pages not redirected by middleware when unauthenticated | `middleware.ts` | Retest: `/admin/dashboard` → `/admin/login?next=...` |
| B02 | High | **Fixed** | Business consulting hero: dark text on dark glass | `businessLanding.tsx` | Retest contrast ratio **17.65** (white on `#091a28`/75) |
| B03 | High | **Fixed** | Investment plans hero description low contrast | `investmentPlansHero.tsx` | Description ratio **17.65**; SVG console clean |
| B04 | High | **Fixed** | About-us hero dark `text-foreground` on dark glass | `aboutUs/heroSection.tsx` | Retest contrast ratio **17.65** |
| B05 | Medium | **Fixed** | FAQ identical placeholders | `faq/*` + `/api/faqs` | Retest: 10 unique DB questions, `dups=[]` |
| B06 | Medium | **Fixed** | Invalid SVG path arc flags | `videoPlayer.tsx`, `investmentModelsSection.tsx` | No more `arc flag` console errors |
| B07 | Medium | **Fixed** | Admin login icons/padding fight RTL | `AdminLoginForm.tsx` | Icon on physical right of identifier field |
| B08 | Low | Open | Dead duplicate FAQ component | `components/utils/QuestionsSection.tsx` | Unused; left for separate cleanup |
| B09 | Low | **Fixed** | FAQ chevron pointed up while closed | `faq/questions.tsx` | Default rotation now points down when closed |
| B10 | Medium | **Fixed** | Investment plans CTA low contrast | `investmentPlansHero.tsx` | Button text now white on emerald gradient |

## Retracted / not code bugs

| ID | Note |
|----|------|
| R01 | “All public pages redirect to admin login” — false (browser history/autocomplete). `/` returns 200. |
| R02 | Empty courses/library/news after bare `npm run seed` — base seed only; seed courses/news/books separately. |
| R03 | Copyright year — uses `new Date().getFullYear()`. |
| R04 | No horizontal overflow on scanned viewports (home/courses/faq/investment/business/about @ 390). |
| R05 | Mobile menu works (opens with nav links). |

## Retest results (post-fix)

- [x] `/admin/dashboard` without cookie → `/admin/login`
- [x] Admin login `09123456789` / `Admin@123` → `/admin/dashboard`
- [x] `/business-consulting` hero readable
- [x] `/investment-plans` description readable; no SVG path errors
- [x] `/about-us` hero readable
- [x] `/faq` unique questions from DB
- [x] `/admin/login` RTL icons
- [x] Mobile 390: no horizontal overflow on key pages

Artifacts: `/opt/cursor/artifacts/bug-hunt/retest/`
