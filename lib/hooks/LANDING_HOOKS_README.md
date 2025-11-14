# راهنمای استفاده از هوک‌های Landing Pages

این فایل راهنمای استفاده از هوک‌های React Query برای صفحات Landing را توضیح می‌دهد.

## هوک‌های موجود

### 1. useHomeLanding
برای دریافت داده‌های صفحه اصلی (Home Landing) و مراحل اسکرولر موبایل

### 2. useAboutPage
برای دریافت داده‌های صفحه درباره ما

### 3. useInvestmentConsulting
برای دریافت داده‌های صفحه مشاوره سرمایه‌گذاری

### 4. useInvestmentPlans
برای دریافت داده‌های صفحه سبدهای سرمایه‌گذاری

---

## نحوه استفاده در کامپوننت‌های Client

برای استفاده از هوک‌ها در کامپوننت‌های کلاینت، باید از الگوی زیر استفاده کنید:

### مثال 1: استفاده در کامپوننت با initialData (برای SSR)

```tsx
"use client";

import { useAboutPage } from "@/lib/hooks";
import type { AboutPageData } from "@/types/landing";

interface AboutUsContentProps {
  initialData?: AboutPageData;
}

export default function AboutUsContent({ initialData }: AboutUsContentProps) {
  const { data, isLoading, error } = useAboutPage();

  // استفاده از initialData اگر هنوز داده از API نیامده
  const aboutPage = data || initialData;

  if (isLoading && !initialData) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت اطلاعات</div>;
  }

  if (!aboutPage) {
    return <div>اطلاعاتی یافت نشد</div>;
  }

  return (
    <div>
      <h1>{aboutPage.heroTitle}</h1>
      <p>{aboutPage.heroDescription}</p>
      {/* بقیه کامپوننت‌ها */}
    </div>
  );
}
```

### مثال 2: استفاده در کامپوننت Home

```tsx
"use client";

import { useHomeLanding } from "@/lib/hooks";
import type { HomeLandingResponse } from "@/types/landing";

interface HomePageContentProps {
  initialData?: HomeLandingResponse;
}

export default function HomePageContent({ initialData }: HomePageContentProps) {
  const { data, isLoading, error } = useHomeLanding();

  const landingData = data || initialData;

  if (isLoading && !initialData) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!landingData) {
    return <div>اطلاعاتی یافت نشد</div>;
  }

  const { landing, mobileSteps } = landingData;

  return (
    <div>
      <h1>{landing.heroTitle}</h1>
      {/* استفاده از mobile steps */}
      {mobileSteps.map((step) => (
        <div key={step.id}>{step.title}</div>
      ))}
    </div>
  );
}
```

### مثال 3: استفاده در کامپوننت Investment Consulting

```tsx
"use client";

import { useInvestmentConsulting } from "@/lib/hooks";
import type { InvestmentConsultingData } from "@/types/landing";

interface InvestmentPageContentProps {
  initialData?: InvestmentConsultingData;
}

export default function InvestmentPageContent({
  initialData
}: InvestmentPageContentProps) {
  const { data, isLoading } = useInvestmentConsulting();

  const consultingData = data || initialData;

  if (isLoading && !initialData) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!consultingData) {
    return <div>اطلاعاتی یافت نشد</div>;
  }

  return (
    <div>
      <h1>{consultingData.title}</h1>
      <p>{consultingData.description}</p>
      {consultingData.phoneNumber && (
        <a href={`tel:${consultingData.phoneNumber}`}>
          {consultingData.phoneNumber}
        </a>
      )}
    </div>
  );
}
```

### مثال 4: استفاده در کامپوننت Investment Plans

```tsx
"use client";

import { useInvestmentPlans } from "@/lib/hooks";
import type { InvestmentPlansData } from "@/types/landing";

interface InvestmentPlansPageContentProps {
  initialData?: InvestmentPlansData;
}

export default function InvestmentPlansPageContent({
  initialData
}: InvestmentPlansPageContentProps) {
  const { data, isLoading } = useInvestmentPlans();

  const plansData = data || initialData;

  if (isLoading && !initialData) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!plansData) {
    return <div>اطلاعاتی یافت نشد</div>;
  }

  return (
    <div>
      <h1>{plansData.title}</h1>
      <p>{plansData.description}</p>

      {/* نمایش plans */}
      {plansData.plans.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.label}</h3>
          <p>{plan.description}</p>
        </div>
      ))}

      {/* نمایش tags */}
      {plansData.tags.map((tag) => (
        <span key={tag.id}>{tag.title}</span>
      ))}
    </div>
  );
}
```

---

## مزایای این الگو

1. **SSR Support**: داده‌ها در سرور fetch می‌شوند و به کامپوننت پاس داده می‌شوند
2. **SEO Friendly**: محتوای صفحه در HTML اولیه موجود است
3. **بهبود Performance**: کاربر محتوا را فوراً می‌بیند
4. **Client-side Refresh**: امکان به‌روزرسانی داده‌ها در سمت کلاینت
5. **Type Safety**: استفاده کامل از TypeScript types

---

## نکات مهم

1. همیشه `initialData` را به عنوان fallback استفاده کنید
2. از `isLoading && !initialData` برای نمایش loading استفاده کنید
3. همه کامپوننت‌های pageContent باید `"use client"` داشته باشند
4. صفحات اصلی (page.tsx) باید Server Components باشند
5. از `generateMetadata` برای SEO استفاده کنید

---

## ساختار فایل‌ها

```
app/(routes)/(home)/page.tsx         → Server Component با SSR
components/home/homeContent.tsx       → Client Component با hook

app/(routes)/about-us/page.tsx        → Server Component با SSR
components/aboutUs/pageContent.tsx    → Client Component با hook

و غیره...
```
