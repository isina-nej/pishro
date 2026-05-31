# تحلیل صفحات کتابخانه (Library)

## 📌 وضعیت فعلی

### صفحه 1️⃣ لیست کتاب‌ها (`http://localhost:3000/library`)
✅ **فعال و کار می‌کند** - صفحه لیست کتاب‌ها درست کار می‌کند

### صفحه 2️⃣ جزئیات کتاب (`http://localhost:3000/library/[slug]`)
❌ **وجود ندارد** - صفحه 404 می‌دهد

---

## 📊 صفحه لیست: `http://localhost:3000/library`

### 🏗️ ساختار App
```
app/(routes)/library/
└── page.tsx (خیلی ساده - فقط LibraryPageContent رو render می‌کند)
```

### 📡 مسیر داده‌ها (Data Flow)

```
LibraryPageContent (libraryContent.tsx)
    ↓
    useBooksList() hook [React Query]
    ↓
    getBooks() service (library-service.ts)
    ↓
    axios GET request → /api/library
    ↓
    /api/library/route.ts
    ↓
    getBooks() MySQL service (library-mysql.ts)
    ↓
    SELECT * FROM DigitalBook [MySQL]
```

### 🔍 اطلاعات دریافتی

#### 1. **Query Parameters** (در API)
```javascript
// نمونه درخواست:
GET /api/library?page=1&limit=12&category=&format=&search=&sort=newest&featured=false

// Parameters:
- page: صفحه‌بندی (پیش‌فرض: 1)
- limit: تعداد کتاب‌های در یک صفحه (پیش‌فرض: 12، حداکثر: 50)
- category: دسته‌بندی (مثال: "ارز دیجیتال")
- format: فرمت کتاب (مثال: "الکترونیکی", "صوتی")
- search: جستجو در عنوان، نویسنده، توضیحات
- sort: ترتیب‌بندی (newest, oldest, rating, popular, downloads)
- featured: فقط کتاب‌های منتخب (true/false)
```

#### 2. **اطلاعات هر کتاب** (از دیتابیس)
```typescript
interface DigitalBook {
  id: string;                 // شناسه کتاب
  title: string;              // عنوان کتاب
  slug: string;               // URL-friendly نام (مثل "crypto-mindset")
  author: string;             // نویسنده
  description?: string;       // توضیحات
  cover?: string;             // URL تصویر جلد
  publisher?: string;         // ناشر
  year: number;               // سال انتشار
  pages?: number;             // تعداد صفحات
  isbn?: string;              // کد ISBN
  language: string;           // زبان
  rating: number;             // امتیاز (۰-۱۰)
  votes: number;              // تعداد رای
  views: number;              // تعداد بازدید
  downloads: number;          // تعداد دانلود
  category: string;           // دسته‌بندی
  formats?: string[];         // فرمت‌های موجود (جلد سخت، الکترونیکی، صوتی)
  isFeatured: boolean;        // آیا منتخب است؟
  price?: number;             // قیمت
  fileUrl?: string;           // لینک فایل PDF
  audioUrl?: string;          // لینک فایل صوتی
  createdAt: string;          // تاریخ ایجاد
  updatedAt: string;          // تاریخ آخرین ویرایش
}
```

#### 3. **پاسخ API** (Response Format)
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "crypto-mindset",
        "slug": "crypto-mindset",
        "title": "ذهن میلیونر کریپتو",
        "author": "آرمان صفوی",
        "rating": 9.2,
        "votes": 2780,
        "views": 15230,
        "downloads": 1250,
        "category": "ارز دیجیتال",
        "year": 2025,
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 45,
      "totalPages": 4,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### 4. **استراتژی Caching** (React Query)
```typescript
// تنظیمات caching در useBooksList():
{
  staleTime: 10 * 60 * 1000,    // ۱۰ دقیقه fresh
  gcTime: 30 * 60 * 1000,       // ۳۰ دقیقه در memory
  retry: 2,                      // دوبار retry اگر خطا
  refetchOnMount: false         // refresh نشود اگر mount شود
}
```

### 🛠️ اجزای صفحه (Components)

```
LibraryPageContent (کل صفحه)
├── LibraryHero (قسمت بالای صفحه)
│   ├── Stats: totalBooks, highlighted, newReleases, avgRating
│   └── Background image + animations
├── FilterControls (فیلترها)
│   ├── Search input
│   ├── Category dropdown
│   ├── Format dropdown
│   ├── Sort dropdown
│   └── Reset filters button
├── ResultsSummary (نتایج جستجو)
├── FeaturedRow (کتاب‌های منتخب)
├── CollectionsRow (مجموعه‌ها)
└── BookGrid (شبکه کتاب‌ها)
    └── BookCard (هر کتاب)
```

---

## 🔗 صفحه جزئیات: `http://localhost:3000/library/[slug]`

### ⚠️ **مسئله: صفحه وجود ندارد!**

فی‌الوقت فقط این Route وجود دارد:
```
app/(routes)/library/
└── page.tsx
```

اما نیازمند این است:
```
app/(routes)/library/
├── page.tsx
└── [slug]/
    └── page.tsx  ❌ وجود ندارد!
```

### 🛠️ برای ساخت صفحه جزئیات نیاز به:

#### 1. **ایجاد فایل صفحه**
```
app/(routes)/library/[slug]/page.tsx
```

#### 2. **مسیر داده‌های مورد نیاز**
```
BookDetailPage ([slug]/page.tsx)
    ↓
    useBookDetail() hook [React Query]
    ↓
    getBookById() service
    ↓
    axios GET request → /api/library/[id]
    ↓
    /api/library/[id]/route.ts  ❌ وجود ندارد!
    ↓
    getBookBySlug() MySQL service
    ↓
    SELECT * FROM DigitalBook WHERE slug = ? [MySQL]
```

#### 3. **API Endpoint مورد نیاز**
```
app/api/library/[id]/
└── route.ts  ❌ وجود ندارد!
```

---

## 📋 خلاصه

### موجود ✅
- ✅ صفحه لیست کتاب‌ها (`/library`)
- ✅ API برای لیست کتاب‌ها (`GET /api/library`)
- ✅ MySQL service برای دریافت تک کتاب (`getBookBySlug()`)
- ✅ React Query hook برای جزئیات (`useBookDetail()`)
- ✅ Component برای نمایش جزئیات (`BookDetail.tsx`)

### ناقص ❌
- ❌ صفحه جزئیات کتاب (`/library/[slug]`)
- ❌ API برای دریافت تک کتاب (`/api/library/[id]`)

---

## 🎯 اطلاعات مشخص

### چه اطلاعاتی دریافت می‌شود؟

#### صفحه لیست:
```
✓ لیست ۱۲ کتاب در صفحه اول
✓ جزئیات هر کتاب: عنوان، نویسنده، امتیاز، دانلود، بازدید، فرمت
✓ اطلاعات صفحه‌بندی
✓ امکان فیلترکردن بر اساس دسته‌بندی، فرمت، جستجو
```

#### صفحه جزئیات (هنوز ساخته نشده):
```
✗ تمام جزئیات کتاب: عنوان، نویسنده، توضیحات، ناشر
✗ تصویر جلد
✗ لینک‌های دانلود (PDF، صوتی)
✗ امتیاز و تعداد رای‌ها
✗ برچسب‌ها و دسته‌بندی
✗ فرمت‌های موجود
✗ اطلاعات انتشار
```

### طریقه دریافت اطلاعات

#### لیست کتاب‌ها:
1. کاربر صفحه `/library` رو بر می‌کند
2. Next.js صفحه `page.tsx` رو render می‌کند
3. Component `LibraryPageContent` لود می‌شود
4. Hook `useBooksList()` اجرا می‌شود
5. React Query درخواست `GET /api/library` فرستاده می‌دهد
6. API route کتاب‌ها رو از MySQL دریافت می‌کند
7. داده‌ها رو به Component برمی‌گرداند
8. Component کتاب‌ها رو نمایش می‌دهد

#### جزئیات کتاب (اگر ساخته شود):
1. کاربر صفحه `/library/crypto-mindset` رو بر می‌کند
2. Next.js slug رو دریافت می‌کند
3. Hook `useBookDetail("crypto-mindset")` اجرا می‌شود
4. React Query درخواست `GET /api/library/crypto-mindset` فرستاده می‌دهد
5. API route کتاب رو از MySQL دریافت می‌کند
6. Component کتاب رو نمایش می‌دهد

---

## 💡 توصیات

برای ساخت صفحه جزئیات کتاب، نیاز به:

1. **ایجاد صفحه**: `app/(routes)/library/[slug]/page.tsx`
2. **ایجاد API**: `app/api/library/[id]/route.ts`
3. **استفاده از**: `BookDetail.tsx` component (که قبلاً ساخته شده)
4. **تنظیم routing**: برای دریافت slug و تبدیل به ID

