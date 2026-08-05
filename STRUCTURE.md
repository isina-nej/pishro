# ساختار کد و معماری پروژه پیشرو

نسخهٔ محصول: **۱.۰.۰**  
این سند نقشهٔ مخزن، لایه‌های معماری، و قراردادهای مهم توسعه را شرح می‌دهد.

---

## ۱. نمای کلی معماری

```text
مرورگر (سایت / پنل کاربر / پنل ادمین)
        │
        ▼
Next.js 15 App Router  ── middleware (ادمین)
        │
   ┌────┴────┐
   │         │
 صفحات     Route Handlers
 (RSC/CSR)   app/api/*
   │         │
   │    ┌────┴─────────────────┐
   │    │                      │
   │  Prisma (اصلی)      mysql2 pool (auth و برخی مسیرها)
   │    │                      │
   └────┴──────── MySQL 8 ─────┘
                 │
        ┌────────┴────────┐
        │                 │
   دیسک محلی          S3 سازگار
 /opt/uploade      ویدیو / HLS / بکاپ
```

### دو سیستم احراز هویت مستقل

| سیستم | محل | جدول | نشست |
|--------|------|-------|------|
| کاربر سایت | NextAuth v5 (`auth.ts`) | `User` | JWT |
| ادمین | `lib/admin-auth.ts` + `lib/admin-jwt.ts` | `AdminUser` | کوکی `admin_access_token` / `admin_refresh_token` |

این دو را مخلوط نکنید؛ middleware فقط مسیرهای `/admin` و `/api/admin` را برای ادمین نگهبانی می‌کند.

### دو لایهٔ دسترسی به داده

| لایه | فایل | کاربرد |
|------|------|--------|
| Prisma | `lib/prisma.ts` + `prisma/schema.prisma` | اکثر دامنهٔ کسب‌وکار |
| Pool خام | `lib/db.ts` (`mysql2/promise`) | لاگین کاربر، بخشی از مسیرهای قدیمی/خاص |

قبل از تغییر auth، بررسی کنید همان فایل از Prisma استفاده می‌کند یا SQL خام.

---

## ۲. درخت سطح‌بالا

```text
app/                 # App Router: صفحات + API
components/          # UI دامنه و shadcn/ui
lib/                 # سرویس‌ها، هوک‌ها، auth، utils
prisma/              # schema، migrations، seeds
scripts/             # ابزارهای ops (بکاپ، ادمین، storage، worker)
tests/               # تست‌های Node test runner
public/              # دارایی‌های استاتیک
docker-compose.yml   # MySQL، video-processor، db-backup
```

---

## ۳. لایهٔ `app/`

### ۳.۱ صفحات عمومی — `app/(routes)/`

گروه مسیر بدون اثر روی URL. نمونه‌ها:

- بازاریابی: خانه، درباره ما، مشاوره، FAQ، تماس
- محتوا: `/courses`، `/news`، `/library`
- سرمایه‌گذاری: `/investment-plans` و صفحات مرتبط
- کاربر: `/profile`، `/checkout`، `/login`

### ۳.۲ پنل ادمین — `app/admin/`

| مسیر | نقش |
|------|-----|
| `/admin/login` | ورود (بدون شِل سایدبار) |
| `/admin/dashboard` | داشبورد |
| `/admin/crm/*` | مشتریان، سرنخ، فرصت، تیکت، سگمنت |
| `/admin/block-news` | مدیریت اخبار (مسیر رسمی) |
| `/admin/library`، `/admin/courses` | کتابخانه و دوره‌ها |
| `/admin/landing/*` | CMS صفحات لندینگ |
| `/admin/settings` | ظاهر/پالت سایت (ADMIN) |
| `/admin/reports`، `/admin/logs` | گزارش و لاگ |

ناوبری رسمی در `components/admin/shell/AdminSidebar.tsx` تعریف شده و Command Palette همان منبع را می‌خواند.

### ۳.۳ API — `app/api/`

قرارداد پاسخ: `lib/api-response.ts` (پوشش JSend-مانند با `success` / `fail` / `error`).

دامنه‌های مهم:

| پیشوند | موضوع |
|--------|--------|
| `/api/auth/*`، `/api/otp/*` | احراز کاربر / OTP |
| `/api/admin/*` | APIهای پنل ادمین (JWT ادمین) |
| `/api/courses`، `/api/user/*` | دوره و پنل کاربر |
| `/api/news`، `/api/library`، `/api/books` | محتوای عمومی |
| `/api/landing/*`، `/api/site-theme` | CMS و تم |
| `/api/uploads/*` | سرو فایل‌های استوریج محلی |
| `/api/payment/*`، `/api/checkout` | پرداخت |
| `/api/video/*` | توکن/استریم ویدیو |

---

## ۴. لایهٔ `components/`

| پوشه | مسئولیت |
|------|----------|
| `components/ui/` | اجزای shadcn (new-york) |
| `components/admin/shell/` | شِل پنل ادمین (سایدبار، تاپ‌بار، gate) |
| `components/admin/*` | فرم‌ها و صفحات تخصصی ادمین |
| `components/home`، `aboutUs`، … | بلوک‌های صفحات عمومی |
| `components/news/` | لیست/جزئیات خبر عمومی (+ CKEditor فقط در ادمین زیر `admin/news`) |
| `components/profile/` | پنل کاربر |
| `components/utils/` | ویجت‌های مشترک زنده (چت، کارت دوره، …) |

الگوی رایج صفحه: `page.tsx` مسیر → `*PageContent` / `pageContent.tsx` دامنه.

---

## ۵. لایهٔ `lib/`

| مسیر | مسئولیت |
|------|----------|
| `lib/services/*-service.ts` | ورودی دامنه برای route/hook |
| `lib/services/*-mysql.ts` | پیاده‌سازی SQL خام در برخی دامنه‌ها |
| `lib/services/storage-adapter.ts` | façade آپلود (`local` / `s3`) |
| `lib/services/object-storage-service.ts` | S3 برای ویدیو/HLS |
| `lib/hooks/` | React Query و هوک‌های کلاینت |
| `lib/schemas/` | Zod |
| `lib/theme/` | پالت‌های لندینگ / پنل |
| `lib/admin-auth.ts`، `admin-jwt.ts` | احراز ادمین |
| `auth.ts` | NextAuth کاربر |

قرارداد سرویس‌ها: از route مستقیماً SQL ننویسید؛ از `*-service.ts` وارد شوید مگر مسیر عمداً خام باشد.

---

## ۶. داده و seed

```text
prisma/
  schema.prisma      # مدل‌ها (MySQL)
  migrations/        # تاریخچهٔ schema
  seeds/             # seed-all و seedهای دامنه
```

- اعمال در production: `npx prisma migrate deploy`
- دادهٔ دمو: `npm run seed` (در `NODE_ENV=production` معمولاً بلاک است)

فایل `database/schema-and-seed.sql` مرجع/میراثی است؛ منبع حقیقت schema همان Prisma است.

---

## ۷. استوریج فایل

| حالت | تنظیم | محل فیزیکی/منطقی |
|------|--------|-------------------|
| محلی | `STORAGE_DRIVER=local` | `UPLOAD_BASE_DIR` (پیش‌فرض `/opt/uploade`) |
| ابری | `STORAGE_DRIVER=s3` | باکت `S3_*` |
| ویدیو دوره | همیشه S3-oriented | `object-storage-service` + worker HLS |

سرو محلی از `/api/uploads/[...path]` با `assertSafeStoragePath` (جلوگیری از path traversal).

جزئیات env ابری: `.env.storage.example`.

---

## ۸. فرانت‌اند و تم

- Tailwind + shadcn/ui
- فونت فارسی پروژه (مثلاً IRANYekanX) از layout ریشه
- تم ادمین با کلاس `.royal-theme` از سایت عمومی جدا می‌شود
- پالت سایت عمومی از تنظیمات ادمین (`/admin/settings`) خوانده می‌شود

---

## ۹. تست

```text
tests/
  *.test.ts                 # واحد / منطق
  api/*.integration.test.ts # HTTP؛ فقط اگر سرور بالا و TEST_BASE_URL ست باشد
```

اجرا:

```bash
npm run test
node --import tsx --test tests/<file>.test.ts
```

---

## ۱۰. اسکریپت‌های عملیاتی (`scripts/`)

| فایل | کاربرد |
|------|--------|
| `create-admin.ts` | ساخت کاربر ادمین |
| `backup-database.ts` | بکاپ MySQL (و آپلود به S3 در صورت تنظیم) |
| `storage-check.ts` | تست اتصال استوریج |
| `migrate-storage-to-cloud.ts` | مهاجرت فایل محلی → باکت |
| `video-processor-worker.ts` | worker ترنسکد HLS |
| `deploy-from-main.sh` | دیپلوی pull-based روی سرور |

---

## ۱۱. قراردادهای توسعه

1. **پاسخ API:** از `lib/api-response.ts` استفاده کنید؛ `NextResponse.json` خام نسازید مگر استثناء مشخص.
2. **CORS:** لیست origin در `lib/api-response.ts` و `lib/cors.ts` هم‌زمان به‌روز شود.
3. **آپلود:** فقط از `storage-adapter`؛ مسیر را خارج از ریپو نگه دارید.
4. **اخبار ادمین:** مسیر رسمی `/admin/block-news` است.
5. **نقش ادمین:** `ADMIN` / `MODERATOR` / `VIEWER` — منو در سایدبار بر اساس نقش فیلتر می‌شود.
6. **زبان UI:** متن‌های کاربر/ادمین فارسی باشند مگر فایل از قبل انگلیسی‌محور باشد.

---

## ۱۲. نقشهٔ ذهنی دامنه‌ها

| دامنه | UI ادمین | API / سرویس کلیدی |
|-------|----------|-------------------|
| اخبار | `admin/block-news` | `/api/admin/block-news`، `block-news-service` |
| دوره | `admin/courses` | `/api/admin/courses`، هوک‌های `useAdminCourses` |
| کتابخانه | `admin/library` | سرویس library + آپلود PDF/صوت |
| CRM | `admin/crm/*` | `/api/admin/crm/*` |
| لندینگ | `admin/landing/*` | `/api/landing/*`، `/api/admin/...` |
| تم سایت | `admin/settings` | `/api/admin/settings`، `/api/site-theme` |
| پرداخت | checkout عمومی | `/api/payment`، Zarinpal |

برای جزئیات استقرار به [DEPLOYMENT.md](./DEPLOYMENT.md) و برای شروع سریع به [README.md](./README.md) مراجعه کنید.
