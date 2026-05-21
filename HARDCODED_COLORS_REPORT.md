# Hardcoded Color Classes Without Dark Mode Support - Comprehensive Report

## Search Criteria
- **Directory**: `/home/sina/Documents/project/pishro/pishro`
- **File Types**: `.tsx` files only
- **Focus Areas**: `app/` and `components/` directories
- **Pattern**: Tailwind color classes (`text-gray-*`, `bg-gray-*`, `text-slate-*`, `text-black`, `bg-white`) WITHOUT `dark:` prefix

---

## Summary by Directory

### app/ Directory Issues: 40+ instances
### components/ Directory Issues: 100+ instances

---

## DETAILED FILE-BY-FILE BREAKDOWN

### APP/ DIRECTORY

#### [app/not-found.tsx](app/not-found.tsx)
- **Line 10**: `bg-gray-100 text-gray-800` - No dark mode
- **Line 23**: `text-gray-700` - No dark mode

#### [app/login/page.tsx](app/login/page.tsx)
- **Line 44**: `bg-white` - No dark mode

#### [app/admin/block-news/page.tsx](app/admin/block-news/page.tsx)
- **Line 48**: `bg-gray-100 text-gray-800` - No dark mode

#### [app/(routes)/skyroom-classes/page.tsx](app/%28routes%29/skyroom-classes/page.tsx)
- **Line 40**: `bg-white`, `text-blue-900`, `bg-gray-100` - Multiple color classes, no dark mode

#### [app/(routes)/investment-plans/page.tsx](app/%28routes%29/investment-plans/page.tsx)
- **Line 25**: `text-gray-800` - No dark mode
- **Line 28**: `text-gray-600` - No dark mode

#### [app/(routes)/courses/[categorySlug]/page.tsx](app/%28routes%29/courses/%5BcategorySlug%5D/page.tsx)
- **Line 250**: `bg-gray-100` - No dark mode
- **Line 260**: `bg-gray-50` - No dark mode
- **Line 273**: `bg-gray-50` - No dark mode
- **Line 285**: `bg-white` - No dark mode
- **Line 300**: `bg-gray-50` - No dark mode
- **Line 312**: `bg-gray-50` - No dark mode
- **Line 321**: `bg-white` - No dark mode
- **Line 327**: `text-gray-600` - No dark mode

#### [app/(routes)/courses/[categorySlug]/[courseSlug]/page.tsx](app/%28routes%29/courses/%5BcategorySlug%5D/%5BcourseSlug%5D/page.tsx)
- **Line 146**: `bg-gray-50` - No dark mode
- **Line 148**: `text-gray-600` - No dark mode
- **Line 164**: `text-gray-900` - No dark mode
- **Line 191**: `text-gray-900` - No dark mode
- **Line 197**: `text-gray-700` - No dark mode
- **Line 207**: `text-gray-600` - No dark mode
- **Line 219**: `bg-gray-200` - No dark mode
- **Line 220**: `text-gray-600` - No dark mode
- **Line 225**: `text-gray-600` - No dark mode
- **Line 226**: `text-gray-900` - No dark mode
- **Line 241**: `text-gray-400` - No dark mode
- **Line 257**: `bg-gray-200` - No dark mode
- **Line 289**: `bg-white` - No dark mode
- **Line 290**: `text-gray-900` - No dark mode
- **Line 301**: `text-gray-700` - No dark mode
- **Line 310**: `bg-white` - No dark mode
- **Line 311**: `text-gray-900` - No dark mode
- **Line 321**: `text-gray-700` - No dark mode
- **Line 331**: `bg-white` - No dark mode
- **Line 332**: `text-gray-900` - No dark mode
- **Line 340**: `text-gray-600` - No dark mode
- **Line 344**: `text-gray-900` - No dark mode
- **Line 352**: `text-gray-600` - No dark mode
- **Line 356**: `text-gray-900` - No dark mode
- **Line 363**: `text-gray-600` - No dark mode
- **Line 367**: `text-gray-900` - No dark mode
- **Line 373**: `text-gray-600` - No dark mode
- **Line 377**: `text-gray-900` - No dark mode
- **Line 383**: `text-gray-600` - No dark mode
- **Line 387**: `text-gray-900` - No dark mode

#### [app/(routes)/courses/[categorySlug]/[courseSlug]/not-found.tsx](app/%28routes%29/courses/%5BcategorySlug%5D/%5BcourseSlug%5D/not-found.tsx)
- **Line 27**: `text-gray-900` - No dark mode
- **Line 30**: `text-gray-600` - No dark mode
- **Line 48**: `bg-white`, `text-gray-900`, `border-gray-200` - No dark mode
- **Line 56**: `text-gray-500` - No dark mode

#### [app/(routes)/courses/[categorySlug]/[courseSlug]/loading.tsx](app/%28routes%29/courses/%5BcategorySlug%5D/%5BcourseSlug%5D/loading.tsx)
- **Line 10**: `bg-gray-50` - No dark mode
- **Line 13**: `bg-gray-200` - No dark mode
- **Line 14**: `bg-gray-200` - No dark mode
- **Line 15**: `bg-gray-200` - No dark mode
- **Line 26**: `bg-gray-200` - No dark mode
- **Line 27**: `bg-gray-200` - No dark mode
- **Line 28**: `bg-gray-200` - No dark mode
- **Line 29**: `bg-gray-200` - No dark mode
- **Line 30**: `bg-gray-200` - No dark mode
- **Line 31**: `bg-gray-200` - No dark mode
- **Line 33**: `bg-gray-200` - No dark mode
- **Line 34**: `bg-gray-200` - No dark mode
- **Line 39**: `bg-gray-200` - No dark mode
- **Line 50**: `bg-white` - No dark mode
- **Line 51**: `bg-gray-200` - No dark mode
- **Line 53**: `bg-gray-200` - No dark mode
- **Line 54**: `bg-gray-200` - No dark mode
- **Line 55**: `bg-gray-200` - No dark mode
- **Line 59**: `bg-white` - No dark mode
- **Line 60**: `bg-gray-200` - No dark mode
- **Line 62**: `bg-gray-200` - No dark mode
- **Line 63**: `bg-gray-200` - No dark mode
- **Line 64**: `bg-gray-200` - No dark mode
- **Line 71**: `bg-white` - No dark mode
- **Line 72**: `bg-gray-200` - No dark mode
- **Line 74**: `bg-gray-200` - No dark mode
- **Line 75**: `bg-gray-200` - No dark mode
- **Line 76**: `bg-gray-200` - No dark mode
- **Line 77**: `bg-gray-200` - No dark mode

#### [app/(routes)/class/[classId]/not-found.tsx](app/%28routes%29/class/%5BclassId%5D/not-found.tsx)
- **Line 10**: `text-gray-400` - No dark mode
- **Line 13**: `text-gray-800` - Has dark variant but also needs checking
- **Line 17**: `text-gray-600` - Has dark variant but also needs checking
- **Line 32**: `border-gray-300`, `bg-gray-50` - No dark mode

#### [app/(routes)/business-consulting/page.tsx](app/%28routes%29/business-consulting/page.tsx)
- **Line 25**: `text-gray-800` - No dark mode
- **Line 28**: `text-gray-600` - No dark mode

#### [app/(routes)/about-us/page.tsx](app/%28routes%29/about-us/page.tsx)
- **Line 25**: `text-gray-800` - No dark mode
- **Line 28**: `text-gray-600` - No dark mode

#### [app/(routes)/(home)/page.tsx](app/%28routes%29/%28home%29/page.tsx)
- **Line 25**: `text-gray-800` - No dark mode
- **Line 26**: `text-gray-600` - No dark mode

---

### COMPONENTS/ DIRECTORY

#### [components/footer.tsx](components/footer.tsx)
- **Line 64**: `bg-white`, `border-gray-200` - No dark mode

#### [components/checkout/stepProgress.tsx](components/checkout/stepProgress.tsx)
- **Line 20**: `bg-white` - No dark mode
- **Line 23**: `bg-gray-200` - No dark mode
- **Line 51**: `bg-gray-200` - No dark mode
- **Line 59**: `text-gray-400` - No dark mode
- **Line 71**: `text-gray-400` - No dark mode

#### [components/checkout/sidebar.tsx](components/checkout/sidebar.tsx)
- **Line 56**: `bg-white/20` - Has white but with opacity
- **Line 70**: `text-gray-600` - No dark mode
- **Line 74**: `text-gray-500` - No dark mode
- **Line 93**: `text-gray-600` - No dark mode
- **Line 118**: `text-gray-600` - No dark mode
- **Line 123**: `text-gray-500` - No dark mode
- **Line 132**: `text-gray-500` - No dark mode
- **Line 177**: `bg-white`, `border-gray-100` - No dark mode
- **Line 180**: `text-gray-600` - No dark mode
- **Line 186**: `text-gray-600` - No dark mode

#### [components/checkout/result.tsx](components/checkout/result.tsx)
- **Line 30**: `text-gray-600` - No dark mode
- **Line 38**: `text-gray-600` - No dark mode
- **Line 41**: `text-gray-500` - No dark mode
- **Line 50**: `text-gray-500` - No dark mode
- **Line 87**: `bg-white`, `border-gray-100` - No dark mode
- **Line 90**: `text-gray-500` - No dark mode
- **Line 91**: `text-gray-800` - No dark mode
- **Line 94**: `text-gray-500` - No dark mode
- **Line 95**: `text-gray-800` - No dark mode
- **Line 102**: `text-gray-700` - No dark mode
- **Line 109**: `bg-gray-50`, `border-gray-100` - No dark mode
- **Line 112**: `text-gray-800` - No dark mode
- **Line 114**: `text-gray-500` - No dark mode
- **Line 119**: `text-gray-700` - No dark mode
- **Line 129**: `text-gray-600` - No dark mode
- **Line 130**: `text-gray-800` - No dark mode
- **Line 137**: `text-gray-600` - No dark mode
- **Line 138**: `text-gray-800` - No dark mode
- **Line 145**: `text-gray-600` - No dark mode

#### [components/faq/header.tsx](components/faq/header.tsx)
- **Line 17**: `text-black` - No dark mode

#### [components/utils/RatingStars.tsx](components/utils/RatingStars.tsx)
- **Line 19**: `text-gray-200`, `fill-gray-200` - No dark mode

#### [components/checkout/paymentProcessing.tsx](components/checkout/paymentProcessing.tsx)
- **Line 47**: `bg-white` - No dark mode
- **Line 71**: `text-gray-900` - No dark mode
- **Line 76**: `text-gray-600` - No dark mode
- **Line 90**: `text-gray-500` - No dark mode
- **Line 99**: `text-gray-500` - No dark mode
- **Line 106**: `bg-gray-50` - No dark mode
- **Line 108**: `text-gray-600` - No dark mode
- **Line 109**: `text-gray-900` - No dark mode
- **Line 130**: `text-gray-500`, `text-gray-700` - No dark mode

#### [components/utils/steps/stepsSection.tsx](components/utils/steps/stepsSection.tsx)
- **Line 43**: `bg-gray-50/50` - No dark mode
- **Line 75**: `text-gray-900` - No dark mode
- **Line 78**: `text-gray-600` - No dark mode
- **Line 88**: `text-gray-300` - No dark mode
- **Line 173**: `text-gray-800` - No dark mode
- **Line 176**: `text-gray-600` - No dark mode

#### [components/courses/CourseDetailModal.tsx](components/courses/CourseDetailModal.tsx)
- **Line 133**: `bg-gray-950` - No dark mode
- **Line 242**: `text-gray-400` - No dark mode
- **Line 249**: `text-gray-400` - No dark mode
- **Line 259**: `text-gray-500` - No dark mode
- **Line 268**: `text-gray-500` - No dark mode
- **Line 279**: `text-gray-500` - No dark mode
- **Line 288**: `text-gray-500` - No dark mode
- **Line 322**: `text-gray-400` - No dark mode
- **Line 335**: `text-gray-400` - No dark mode
- **Line 346**: `text-gray-400` - No dark mode
- **Line 349**: `text-gray-500` - No dark mode
- **Line 367**: `text-gray-400` - No dark mode
- **Line 383**: `text-gray-600` - No dark mode

#### [components/debug/ScrollStatus.tsx](components/debug/ScrollStatus.tsx)
- **Line 25**: `text-gray-400` - No dark mode
- **Line 29**: `text-gray-400` - No dark mode
- **Line 33**: `text-gray-400` - No dark mode

#### [components/utils/Logo.tsx](components/utils/Logo.tsx)
- **Line 20**: `text-gray-500` - No dark mode

#### [components/checkout/payMain.tsx](components/checkout/payMain.tsx)
- **Line 61**: `bg-white`, `border-gray-100` - No dark mode
- **Line 66**: `bg-white/20` - Has white with opacity
- **Line 93**: `text-gray-900` - No dark mode
- **Line 96**: `text-gray-500` - No dark mode
- **Line 108**: `text-gray-500` - No dark mode
- **Line 109**: `text-gray-400` - No dark mode
- **Line 117**: `text-gray-500` - No dark mode
- **Line 129**: `text-gray-500` - No dark mode
- **Line 152**: `text-gray-600` - No dark mode
- **Line 155**: `text-gray-500` - No dark mode
- **Line 164**: `text-gray-500` - No dark mode
- **Line 171**: `bg-gray-100` - No dark mode
- **Line 172**: `text-gray-300` - No dark mode
- **Line 174**: `text-gray-500` - No dark mode

#### [components/utils/UserLevelSelection.tsx](components/utils/UserLevelSelection.tsx)
- **Line 118**: `bg-white` - No dark mode
- **Line 126**: `text-gray-200` - No dark mode
- **Line 131**: `bg-white` - No dark mode
- **Line 149**: `text-gray-600` - No dark mode
- **Line 156**: `text-gray-600` - No dark mode
- **Line 181**: `text-gray-600` - No dark mode

#### [components/courses/courseCard.tsx](components/courses/courseCard.tsx)
- **Line 45**: `bg-white/20` - Has white with opacity
- **Line 79**: `text-slate-400` - No dark mode
- **Line 84**: `text-slate-400` - No dark mode
- **Line 105**: `text-slate-400` - No dark mode

#### [components/checkout/pageContent.tsx](components/checkout/pageContent.tsx)
- **Line 93**: `text-gray-900` - No dark mode
- **Line 98**: `text-gray-600` - No dark mode

#### [components/utils/Landing3.tsx](components/utils/Landing3.tsx)
- **Line 92**: `text-gray-600` - No dark mode
- **Line 122**: `bg-gray-50` - No dark mode
- **Line 127**: `text-gray-700` - No dark mode
- **Line 204**: `text-gray-800` - No dark mode
- **Line 298**: `text-gray-600` - No dark mode

#### [components/utils/ThemeToggle.tsx](components/utils/ThemeToggle.tsx)
- **Line 26**: `text-slate-700` - No dark mode

#### [components/utils/FormatTime.tsx](components/utils/FormatTime.tsx)
- **Line 42**: `text-gray-900` - No dark mode

#### [components/courses/courseDetailsModal.tsx](components/courses/courseDetailsModal.tsx)
- **Line 136**: `bg-white/20` - Has white with opacity
- **Line 145**: `bg-white/20` - Has white with opacity
- **Line 160**: `text-slate-300` - No dark mode
- **Line 217**: `text-slate-300` - No dark mode
- **Line 229**: `text-slate-400` - No dark mode
- **Line 237**: `text-slate-400` - No dark mode
- **Line 245**: `text-slate-400` - No dark mode
- **Line 253**: `text-slate-400` - No dark mode
- **Line 298**: `text-slate-300` - No dark mode
- **Line 305**: `text-slate-400` - No dark mode
- **Line 309**: `text-slate-400` - No dark mode
- **Line 315**: `text-slate-400` - No dark mode
- **Line 328**: `text-slate-400` - No dark mode

#### [components/checkout/itemCard.tsx](components/checkout/itemCard.tsx)
- **Line 77**: `text-gray-600 bg-gray-50` - No dark mode
- **Line 96**: `bg-white`, `border-gray-100` - No dark mode
- **Line 133**: `bg-gray-300` - No dark mode
- **Line 142**: `text-gray-400` - No dark mode
- **Line 165**: `text-gray-900` - No dark mode
- **Line 170**: `text-gray-600` - No dark mode
- **Line 198**: `text-gray-500` - No dark mode
- **Line 201**: `text-gray-400` - No dark mode
- **Line 218**: `text-gray-500` - No dark mode
- **Line 242**: `bg-white`, `border-gray-100` - No dark mode
- **Line 259**: `bg-white/20` - Has white with opacity
- **Line 279**: `text-gray-600` - No dark mode
- **Line 280**: `text-gray-900` - No dark mode
- **Line 290**: `text-gray-600` - No dark mode
- **Line 291**: `text-gray-900` - No dark mode
- **Line 311**: `text-gray-600` - No dark mode
- **Line 317**: `text-gray-500` - No dark mode
- **Line 328**: `text-gray-500` - No dark mode
- **Line 339**: `text-gray-500` - No dark mode

#### [components/utils/AlibabaSlider.tsx](components/utils/AlibabaSlider.tsx)
- **Line 79**: `bg-gray-200`, `text-gray-600` - No dark mode

#### [components/checkout/emptyCart.tsx](components/checkout/emptyCart.tsx)
- **Line 33**: `text-gray-400` - No dark mode
- **Line 57**: `text-gray-800` - No dark mode
- **Line 66**: `text-gray-600` - No dark mode
- **Line 95**: `hover:bg-gray-50` - No dark mode
- **Line 109**: `text-gray-500` - No dark mode

#### [components/courses/doctorExplanationVideo.tsx](components/courses/doctorExplanationVideo.tsx)
- **Line 39**: `text-gray-900` - No dark mode
- **Line 42**: `text-gray-600` - No dark mode
- **Line 46**: `bg-gray-900` - No dark mode

#### [components/admin/videoUploader.tsx](components/admin/videoUploader.tsx)
- **Line 113**: `bg-white` - No dark mode
- **Line 114**: `text-gray-800` - No dark mode
- **Line 123**: `text-gray-700` - No dark mode
- **Line 134**: `text-gray-500` - No dark mode
- **Line 137**: `text-gray-600` - No dark mode
- **Line 147**: `text-gray-700` - No dark mode
- **Line 166**: `text-gray-700` - No dark mode
- **Line 185**: `text-gray-700` - No dark mode
- **Line 188**: `text-gray-700` - No dark mode
- **Line 192**: `bg-gray-200` - No dark mode
- **Line 205**: `disabled:bg-gray-300` - No dark mode

#### [components/auth/OtpForm.tsx](components/auth/OtpForm.tsx)
- **Line 123**: `text-gray-600`, `text-gray-900`, `bg-gray-100` - No dark mode
- **Line 137**: `text-gray-900` - No dark mode
- **Line 138**: `text-gray-600` - No dark mode
- **Line 140**: `text-gray-900` - No dark mode
- **Line 189**: `text-gray-600` - No dark mode
- **Line 190**: `text-gray-900` - No dark mode
- **Line 196**: `hover:bg-gray-50`, `border-gray-300` - No dark mode
- **Line 234**: `text-gray-500` - No dark mode

#### [components/courses/ctaSection.tsx](components/courses/ctaSection.tsx)
- **Line 45**: `bg-white` - No dark mode
- **Line 46**: `bg-white` - No dark mode
- **Line 56**: `bg-white/20` - Has white with opacity
- **Line 91**: `bg-white` - No dark mode

#### [components/utils/QA.tsx](components/utils/QA.tsx)
- **Line 49**: `bg-white` - No dark mode
- **Line 51**: `text-gray-800` - No dark mode
- **Line 59**: `text-gray-700` - No dark mode
- **Line 66**: `bg-gray-50` - No dark mode
- **Line 75**: `bg-gray-50` - No dark mode
- **Line 81**: `bg-gray-50` - No dark mode

#### [components/aboutUs/certificatesGallery.tsx](components/aboutUs/certificatesGallery.tsx)
- **Line 39**: `text-gray-800` - No dark mode
- **Line 42**: `text-gray-600` - No dark mode
- **Line 58**: `bg-gray-200` - No dark mode
- **Line 75**: `text-gray-200` - No dark mode
- **Line 99**: `text-gray-600` - No dark mode
- **Line 119**: `bg-white/10` - Has white with opacity
- **Line 139**: `bg-white/10` - Has white with opacity
- **Line 144**: `text-gray-200` - No dark mode

#### [components/courses/coursesPageContent.tsx](components/courses/coursesPageContent.tsx)
- **Line 66**: `bg-white/85` - Has white with opacity
- **Line 86**: `text-slate-600` - No dark mode
- **Line 89**: `text-slate-900` - No dark mode
- **Line 96**: `text-slate-900` - No dark mode
- **Line 104**: `text-slate-500` - No dark mode
- **Line 135**: `text-slate-500` - No dark mode
- **Line 141**: `border-slate-300`, `bg-white`, `text-slate-700`, `hover:bg-slate-50` - No dark mode

#### [components/auth/ForgotPasswordForm.tsx](components/auth/ForgotPasswordForm.tsx)
- **Line 156**: `text-gray-900` - No dark mode
- **Line 157**: `text-gray-600` - No dark mode
- **Line 223**: `text-gray-600`, `text-gray-900`, `bg-gray-100` - No dark mode
- **Line 231**: `text-gray-900` - No dark mode
- **Line 232**: `text-gray-600` - No dark mode

#### [components/business-consulting/businessLanding.tsx](components/business-consulting/businessLanding.tsx)
- **Line 54**: `bg-white/10`, `bg-white/20` - Has white with opacity
- **Line 59**: `bg-white` - No dark mode
- **Line 64**: `text-gray-900` - No dark mode
- **Line 67**: `text-gray-600` - No dark mode
- **Line 87**: `text-gray-400`, `text-gray-600` - No dark mode
- **Line 97**: `bg-white/10`, `bg-white/20` - Has white with opacity
- **Line 102**: `bg-white` - No dark mode
- **Line 107**: `text-gray-900` - No dark mode
- **Line 110**: `text-gray-600` - No dark mode
- **Line 131**: `text-gray-400`, `text-gray-600` - No dark mode
- **Line 141**: `bg-white/10`, `bg-white/20` - Has white with opacity
- **Line 146**: `bg-white` - No dark mode
- **Line 151**: `text-gray-900` - No dark mode
- **Line 154**: `text-gray-600` - No dark mode
- **Line 168**: `text-gray-400`, `text-gray-600` - No dark mode

#### [components/video/videoPlayer.tsx](components/video/videoPlayer.tsx)
- **Line 184**: `text-gray-300` - No dark mode

#### [components/checkout/result.tsx](components/checkout/result.tsx) - Already listed above

---

## Statistics

- **Total Files Affected**: 50+
- **Total Issues Found**: 200+
- **Most Common Issues**:
  1. `bg-white` (30+ instances)
  2. `text-gray-600` (40+ instances)
  3. `text-gray-900` (30+ instances)
  4. `bg-gray-50` (15+ instances)
  5. `text-gray-700` (15+ instances)

---

## Recommendations

1. **Priority 1**: Add `dark:` variants to all color classes
2. **Priority 2**: Consider using CSS variables or Tailwind theme tokens instead of hardcoded colors
3. **Priority 3**: Create a standardized color palette in `tailwind.config.ts`
4. **Priority 4**: Run automated linter/formatter to enforce dark mode support

---

## Example Fixes

### Before:
```tsx
<h1 className="text-gray-800">Title</h1>
```

### After:
```tsx
<h1 className="text-gray-800 dark:text-gray-100">Title</h1>
```

---

## Generated Report
- **Date**: 2026-05-10
- **Search Pattern**: Tailwind color classes without `dark:` prefix
- **Scope**: `/home/sina/Documents/project/pishro/pishro` (app/ and components/ dirs)
