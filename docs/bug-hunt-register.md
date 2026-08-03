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

| ID | Sev | Status | Title | Where | Evidence |
|----|-----|--------|-------|-------|----------|
| B01 | High | Open | Admin pages not redirected by middleware when unauthenticated | `middleware.ts` | Unauth `/admin/dashboard` returns 200 HTML; client may redirect, APIs 401. Should server-redirect to `/admin/login`. |
| B02 | High | Open | Business consulting hero: dark text on dark glass | `components/business-consulting/businessLanding.tsx` | Screenshot `desktop_business-consulting.png`; classes `text-foreground` on `bg-[#091a28]/50`. |
| B03 | High | Open | Investment plans hero description low contrast | `components/investment-plans/investmentPlansHero.tsx` | `text-muted-foreground` (#5A615C) on dark glass; screenshot `desktop_investment-plans.png`. |
| B04 | High | Open | About-us hero inherits dark `text-foreground` on dark glass | `components/aboutUs/heroSection.tsx` | Same glass pattern; risk in light theme. |
| B05 | Medium | Open | FAQ shows 4 identical placeholder questions | `public/data.tsx` + `components/faq/questions.tsx` | Playwright found duplicate Q×4; DB has 40 FAQs but page ignores them. |
| B06 | Medium | Open | Invalid SVG path arc flags | `videoPlayer.tsx:178`, `investmentModelsSection.tsx:421` | Console: `Expected arc flag ('0' or '1')` for `a9 9 0 1-18`. |
| B07 | Medium | Open | Admin login icons/padding fight RTL text start | `AdminLoginForm.tsx` | Leading icons on physical left; password eye on physical right (RTL text start). |
| B08 | Low | Open | Dead duplicate FAQ component | `components/utils/QuestionsSection.tsx` | Same static `faqData`; unused. |

## Retracted / not code bugs

| ID | Note |
|----|------|
| R01 | “All public pages redirect to admin login” — false (browser history/autocomplete). `/` returns 200. |
| R02 | Empty courses/library/news — seed gap (`npm run seed` only base data). After seeding courses/news/books, lists populate. |
| R03 | Copyright year “wrong” — uses `new Date().getFullYear()`. |
| R04 | No horizontal overflow found on scanned viewports. |
| R05 | Mobile menu works (opens with nav links). |

## Retest checklist

- [ ] `/admin/dashboard` without cookie → redirect `/admin/login`
- [ ] `/business-consulting` hero readable (light text)
- [ ] `/investment-plans` hero description readable
- [ ] `/about-us` hero readable
- [ ] `/faq` unique questions from DB
- [ ] `/investment-plans` no SVG path console error
- [ ] `/admin/login` inputs look correct in RTL
- [ ] Mobile 390: home, courses, faq, investment-plans, business-consulting
