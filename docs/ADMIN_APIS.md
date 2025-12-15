# مستندات API های ادمین

> این فایل شامل لیست کامل APIهای ادمین برای سیستم مدیریت محتوای پیشرو است.

## احراز هویت

**همه APIها:**

- نیاز به لاگین دارند (session.user)
- دسترسی فقط برای `role: "ADMIN"`
- در صورت عدم احراز هویت: `401 Unauthorized`
- در صورت عدم دسترسی: `403 Forbidden`

---

## 1. مدیریت محتوا (Content Management)

### Tags (برچسب‌ها)

#### `GET /api/admin/tags`

لیست تمام برچسب‌ها

**Query Params:**

- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)
- `search` (string) - جستجو در title, slug, description
- `published` (boolean)

**Response:** `PaginatedResponse<Tag[]>`

#### `POST /api/admin/tags`

ساخت برچسب جدید

**Body:**

```typescript
{
  slug: string (required)
  title: string (required)
  description?: string
  color?: string
  icon?: string
  published?: boolean (default: false)
  seoTitle?: string
  seoDescription?: string
}
```

**Response:** `CreatedResponse<Tag>`

#### `GET /api/admin/tags/[id]`

دریافت یک برچسب

**Response:** `SuccessResponse<Tag>`

#### `PATCH /api/admin/tags/[id]`

ویرایش برچسب

**Body:** همان فیلدهای POST (همه اختیاری)

**Response:** `SuccessResponse<Tag>`

#### `DELETE /api/admin/tags/[id]`

حذف برچسب

**Response:** `NoContentResponse`

---

### Categories (دسته‌بندی‌ها)

#### `GET /api/admin/categories`

**Query:** `page`, `limit`, `search`, `published`

**Response:** `PaginatedResponse<Category[]>`

#### `POST /api/admin/categories`

**Body:**

```typescript
{
  slug: string (required)
  title: string (required)
  description?: string
  published?: boolean
  /* سایر فیلدها */
}
```

#### `GET /api/admin/categories/[id]`

#### `PATCH /api/admin/categories/[id]`

#### `DELETE /api/admin/categories/[id]`

---

### Page Content (محتوای صفحات)

#### `GET /api/admin/page-content`

**Query:** `page`, `limit`, `search`, `published`

#### `POST /api/admin/page-content`

**Body:**

```typescript
{
  title: string (required)
  slug: string (required)
  content: string (required)
  published?: boolean
}
```

#### `GET /api/admin/page-content/[id]`

#### `PATCH /api/admin/page-content/[id]`

#### `DELETE /api/admin/page-content/[id]`

---

### About Page (صفحه درباره ما)

#### `GET /api/admin/about-page`

#### `POST /api/admin/about-page`

#### `GET /api/admin/about-page/[id]`

#### `PATCH /api/admin/about-page/[id]`

#### `DELETE /api/admin/about-page/[id]`

---

### Home Landing (صفحه اصل)

#### `GET /api/admin/home-landing`

#### `POST /api/admin/home-landing`

#### `GET /api/admin/home-landing/[id]`

#### `PATCH /api/admin/home-landing/[id]`

#### `DELETE /api/admin/home-landing/[id]`

---

## 2. دوره‌ها و آموزش (Courses & Learning)

### Courses (دوره‌ها)

#### `GET /api/admin/courses`

**Query:**

- `page`, `limit`, `search`
- `categoryId` (string)
- `published`, `featured` (boolean)
- `status` (ACTIVE | COMING_SOON | ARCHIVED)
- `level` (BEGINNER | INTERMEDIATE | ADVANCED)

**Response:** `PaginatedResponse<Course[]>` + includes category, tags, counts

#### `POST /api/admin/courses`

**Body:**

```typescript
{
  subject: string (required)
  price: number (required)
  img?: string
  rating?: number
  description?: string
  discountPercent?: number
  time?: number
  students?: number
  videosCount?: number
  categoryId?: string
  tagIds?: string[]
  slug?: string
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  language?: string (default: "FA")
  prerequisites?: string[]
  learningGoals?: string[]
  instructor?: string
  status?: "ACTIVE" | "COMING_SOON" | "ARCHIVED" (default: "ACTIVE")
  published?: boolean (default: true)
  featured?: boolean (default: false)
}
```

#### `GET /api/admin/courses/[id]`

#### `PATCH /api/admin/courses/[id]`

#### `DELETE /api/admin/courses/[id]`

---

### Lessons (درس‌ها)

#### `GET /api/admin/lessons`

**Query:** `page`, `limit`, `courseId`, `search`, `published`

#### `POST /api/admin/lessons`

**Body:**

```typescript
{
  courseId: string (required)
  title: string (required)
  content?: string
  videoUrl?: string
  duration?: number
  order?: number
  published?: boolean
}
```

#### `GET /api/admin/lessons/[id]`

#### `PATCH /api/admin/lessons/[id]`

#### `DELETE /api/admin/lessons/[id]`

---

### Enrollments (ثبت‌نام‌ها)

#### `GET /api/admin/enrollments`

**Query:** `page`, `limit`, `userId`, `courseId`, `status`

#### `POST /api/admin/enrollments`

#### `GET /api/admin/enrollments/[id]`

#### `PATCH /api/admin/enrollments/[id]`

#### `DELETE /api/admin/enrollments/[id]`

---

### Skyroom Classes (کلاس‌های آنلاین/همایش‌ها)

#### `GET /api/admin/skyroom-classes`

لیست تمام لینک‌های همایش/کلاس آنلاین

**Response:** `SuccessResponse<SkyRoomClass[]>`

#### `POST /api/admin/skyroom-classes`

ایجاد لینک همایش جدید

**Body:**

```typescript
{
  meetingLink: string (required, must be valid URL)
  published?: boolean (default: false)
}
```

**Response:** `SuccessResponse<SkyRoomClass>`

**Validation:**

- لینک همایش الزامی است
- باید فرمت URL معتبر داشته باشد

#### `GET /api/admin/skyroom-classes/[id]`

#### `PATCH /api/admin/skyroom-classes/[id]`

#### `DELETE /api/admin/skyroom-classes/[id]`

---

## 3. آزمون‌ها (Quizzes & Assessment)

### Quizzes (آزمون‌ها)

#### `GET /api/admin/quizzes`

**Query:** `page`, `limit`, `courseId`, `published`

#### `POST /api/admin/quizzes`

**Body:**

```typescript
{
  courseId: string (required)
  title: string (required)
  description?: string
  passingScore?: number
  timeLimit?: number
  published?: boolean
}
```

#### `GET /api/admin/quizzes/[id]`

#### `PATCH /api/admin/quizzes/[id]`

#### `DELETE /api/admin/quizzes/[id]`

---

### Quiz Questions (سوالات)

#### `GET /api/admin/quiz-questions`

**Query:** `page`, `limit`, `quizId`

#### `POST /api/admin/quiz-questions`

**Body:**

```typescript
{
  quizId: string (required)
  question: string (required)
  options: string[] (required)
  correctAnswer: number (required)
  points?: number
}
```

#### `GET /api/admin/quiz-questions/[id]`

#### `PATCH /api/admin/quiz-questions/[id]`

#### `DELETE /api/admin/quiz-questions/[id]`

---

### Quiz Attempts (تلاش‌های آزمون)

#### `GET /api/admin/quiz-attempts`

**Query:** `page`, `limit`, `userId`, `quizId`

#### `POST /api/admin/quiz-attempts`

#### `GET /api/admin/quiz-attempts/[id]`

#### `PATCH /api/admin/quiz-attempts/[id]`

#### `DELETE /api/admin/quiz-attempts/[id]`

---

## 4. منابع و محتوا (Content & Resources)

### Books (کتاب‌ها)

#### `GET /api/admin/books`

**Query:** `page`, `limit`, `search`, `published`, `featured`

#### `POST /api/admin/books`

**Body:**

```typescript
{
  title: string (required)
  author?: string
  description?: string
  coverImage?: string
  fileUrl?: string
  price?: number
  published?: boolean
  featured?: boolean
}
```

#### `GET /api/admin/books/[id]`

#### `PATCH /api/admin/books/[id]`

#### `DELETE /api/admin/books/[id]`

---

### Certificates (گواهینامه‌ها)

#### `GET /api/admin/certificates`

**Query:** `page`, `limit`, `userId`, `courseId`

#### `POST /api/admin/certificates`

#### `GET /api/admin/certificates/[id]`

#### `PATCH /api/admin/certificates/[id]`

#### `DELETE /api/admin/certificates/[id]`

---

## 5. اخبار و نظرات (News & Comments)

### News (اخبار)

#### `GET /api/admin/news`

**Query:** `page`, `limit`, `search`, `categoryId`, `published`, `featured`

#### `POST /api/admin/news`

**Body:**

```typescript
{
  title: string (required)
  slug: string (required)
  excerpt: string (required)
  content: string (required)
  coverImage?: string
  author?: string
  category?: string
  tags?: string[]
  categoryId?: string
  tagIds?: string[]
  published?: boolean (default: false)
  publishedAt?: Date
  featured?: boolean (default: false)
  readingTime?: number
}
```

#### `GET /api/admin/news/[id]`

#### `PATCH /api/admin/news/[id]`

#### `DELETE /api/admin/news/[id]`

---

### Comments (نظرات دوره‌ها)

#### `GET /api/admin/comments`

**Query:** `page`, `limit`, `courseId`, `userId`, `approved`

#### `POST /api/admin/comments`

#### `GET /api/admin/comments/[id]`

#### `PATCH /api/admin/comments/[id]`

#### `DELETE /api/admin/comments/[id]`

---

### News Comments (نظرات اخبار)

#### `GET /api/admin/news-comments`

**Query:** `page`, `limit`, `newsId`, `userId`, `approved`

#### `POST /api/admin/news-comments`

#### `GET /api/admin/news-comments/[id]`

#### `PATCH /api/admin/news-comments/[id]`

#### `DELETE /api/admin/news-comments/[id]`

---

## 6. سرمایه‌ گذاری و کسب‌وکار (Investment & Business)

### Investment Plans (طرح‌های سرمایه‌ گذاری)

#### `GET /api/admin/investment-plans`

**Query:** `page`, `limit`, `published`

#### `POST /api/admin/investment-plans`

**Body:**

```typescript
{
  title: string (required)
  description: string (required)
  image?: string
  plansIntroCards?: any[]
  minAmount?: number (default: 10)
  maxAmount?: number (default: 10000)
  amountStep?: number (default: 10)
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  published?: boolean (default: false)
}
```

#### `GET /api/admin/investment-plans/[id]`

#### `PATCH /api/admin/investment-plans/[id]`

#### `DELETE /api/admin/investment-plans/[id]`

---

### Investment Plan Items (آیتم‌های طرح)

#### `GET /api/admin/investment-plan-items`

#### `POST /api/admin/investment-plan-items`

#### `GET /api/admin/investment-plan-items/[id]`

#### `PATCH /api/admin/investment-plan-items/[id]`

#### `DELETE /api/admin/investment-plan-items/[id]`

---

### Investment Tags (برچسب‌های سرمایه‌ گذاری)

#### `GET /api/admin/investment-tags`

#### `POST /api/admin/investment-tags`

#### `GET /api/admin/investment-tags/[id]`

#### `PATCH /api/admin/investment-tags/[id]`

#### `DELETE /api/admin/investment-tags/[id]`

---

### Investment Models (مدل‌های سرمایه‌ گذاری)

#### `POST /api/admin/investment-models`

ایجاد مدل سرمایه‌ گذاری جدید

**Body:**

```typescript
{
  investmentModelsPageId: string (required)
  type: "in-person" | "online" (required)
  title: string (required, min: 3 chars)
  description: string (required, min: 10 chars)
  icon: string (required)
  color: string (required)
  gradient: string (required)
  features?: string[]
  benefits?: string[]
  ctaText: string (required, min: 3 chars)
  ctaLink?: string
  ctaIsScroll?: boolean (default: false)
  contactTitle?: string
  contactDescription?: string
  contacts?: any[]
  order?: number (default: 0)
  published?: boolean (default: true)
}
```

**Response:** `CreatedResponse<InvestmentModel>`

#### `GET /api/admin/investment-models/[id]`

دریافت یک مدل سرمایه‌ گذاری

**Response:** `SuccessResponse<InvestmentModel>`

#### `PATCH /api/admin/investment-models/[id]`

ویرایش مدل سرمایه‌ گذاری

**Body:** همان فیلدهای POST (همه اختیاری)

**Response:** `SuccessResponse<InvestmentModel>`

#### `DELETE /api/admin/investment-models/[id]`

حذف مدل سرمایه‌ گذاری

**Response:** `NoContentResponse`

---

### Investment Models Page (صفحه مدل‌های سرمایه‌ گذاری)

#### `GET /api/admin/investment-models-page`

لیست تمام صفحات مدل‌های سرمایه‌ گذاری

**Query Params:**

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `published` (boolean)

**Response:** `PaginatedResponse<InvestmentModelsPage[]>`

#### `POST /api/admin/investment-models-page`

ایجاد صفحه جدید

**Body:**

```typescript
{
  additionalInfoTitle?: string
  additionalInfoContent?: string
  published?: boolean (default: true)
}
```

**Response:** `CreatedResponse<InvestmentModelsPage>`

#### `GET /api/admin/investment-models-page/[id]`

دریافت یک صفحه

**Response:** `SuccessResponse<InvestmentModelsPage>`

#### `PATCH /api/admin/investment-models-page/[id]`

ویرایش صفحه

**Body:** همان فیلدهای POST (همه اختیاری)

**Response:** `SuccessResponse<InvestmentModelsPage>`

#### `DELETE /api/admin/investment-models-page/[id]`

حذف صفحه (به صورت cascade مدل‌های مرتبط نیز حذف می‌شوند)

**Response:** `NoContentResponse`

---

### Business Consulting (مشاوره کسب‌وکار)

#### `GET /api/admin/business-consulting`

#### `POST /api/admin/business-consulting`

#### `GET /api/admin/business-consulting/[id]`

#### `PATCH /api/admin/business-consulting/[id]`

#### `DELETE /api/admin/business-consulting/[id]`

---

## 7. کاربران و تیم (User & Account Management)

### Users (کاربران)

#### `GET /api/admin/users`

**Query:**

- `page`, `limit`, `search`
- `role` (USER | ADMIN)
- `phoneVerified` (boolean)

**Response:** شامل \_count برای comments, orders, enrollments, transactions

#### `POST /api/admin/users`

**Body:**

```typescript
{
  phone: string (required) - فرمت: 09XXXXXXXXX
  password: string (required)
  role?: "USER" | "ADMIN" (default: "USER")
  firstName?: string
  lastName?: string
  email?: string
  nationalCode?: string
  phoneVerified?: boolean (default: false)
}
```

#### `GET /api/admin/users/[id]`

#### `PATCH /api/admin/users/[id]`

#### `DELETE /api/admin/users/[id]`

---

### Team Members (اعضای تیم)

#### `GET /api/admin/team-members`

#### `POST /api/admin/team-members`

#### `GET /api/admin/team-members/[id]`

#### `PATCH /api/admin/team-members/[id]`

#### `DELETE /api/admin/team-members/[id]`

---

## 8. سفارشات و تراکنش‌ها (Commerce & Orders)

### Orders (سفارشات)

#### `GET /api/admin/orders`

**Query:**

- `page`, `limit`
- `userId` (string)
- `status` (PENDING | PAID | FAILED)
- `startDate`, `endDate` (ISO date strings)

**Response:** شامل user, orderItems (با course), transactions

#### `GET /api/admin/orders/[id]`

#### `PATCH /api/admin/orders/[id]`

---

### Transactions (تراکنش‌ها)

#### `GET /api/admin/transactions`

**Query:** `page`, `limit`, `userId`, `orderId`, `status`

#### `POST /api/admin/transactions`

#### `GET /api/admin/transactions/[id]`

#### `PATCH /api/admin/transactions/[id]`

#### `DELETE /api/admin/transactions/[id]`

---

## 9. ارتباطات (Communication & Newsletter)

### Newsletter Subscribers (مشترکین خبرنامه)

#### `GET /api/admin/newsletter-subscribers`

**Query:** `page`, `limit`, `search`, `active`

#### `POST /api/admin/newsletter-subscribers`

#### `GET /api/admin/newsletter-subscribers/[id]`

#### `PATCH /api/admin/newsletter-subscribers/[id]`

#### `DELETE /api/admin/newsletter-subscribers/[id]`

#### `POST /api/admin/newsletter-subscribers/broadcast-sms`

ارسال پیامک گروهی به تمام اعضای خبرنامه

**Body:**

```typescript
{
  message: string (required, max: 500 chars)
}
```

**Response:**

```typescript
{
  total: number        // تعداد کل اعضا
  success: number      // تعداد ارسال موفق
  failed: number       // تعداد ارسال ناموفق
  failedPhones: string[]  // شماره‌های ناموفق
  message: string      // پیام خلاصه
}
```

**نکات:**

- فقط ادمین دسترسی دارد
- حداکثر طول پیام: 500 کاراکتر
- دیلی 200ms بین هر ارسال برای جلوگیری از اورلود سرویس SMS

---

### FAQs (سوالات متداول)

#### `GET /api/admin/faqs`

**Query:** `page`, `limit`, `search`, `published`

#### `POST /api/admin/faqs`

**Body:**

```typescript
{
  question: string (required)
  answer: string (required)
  order?: number
  published?: boolean
}
```

#### `GET /api/admin/faqs/[id]`

#### `PATCH /api/admin/faqs/[id]`

#### `DELETE /api/admin/faqs/[id]`

---

## 10. داشبورد و تحلیل (Dashboard & Analytics)

### Dashboard Stats (آمار کلی)

#### `GET /api/admin/dashboard/stats`

بدون پارامتر

**Response:**

```typescript
{
  totalUsers: number;
  totalCourses: number;
  totalOrders: number;
  totalRevenue: number;
  /* سایر آمارها */
}
```

**Cache:** 5 دقیقه

---

### Device Stats (آمار دستگاه‌ها)

#### `GET /api/admin/dashboard/devices`

**Query:**

- `period` (monthly | yearly) - **required**

**Response:** `DeviceStats`

**Cache:** بر اساس period

---

### Monthly Payments (پرداخت‌های ماهانه)

#### `GET /api/admin/dashboard/payments/monthly`

**Response:** آمار پرداخت‌های ماهانه

---

### Weekly Profit (سود هفتگی)

#### `GET /api/admin/dashboard/profit/weekly`

**Response:** آمار سود هفتگی

---

## 11. ابزارها و رابط کاربری (UI & Utility)

### Mobile Scroller Steps

#### `GET /api/admin/mobile-scroller-steps`

#### `POST /api/admin/mobile-scroller-steps`

#### `GET /api/admin/mobile-scroller-steps/[id]`

#### `PATCH /api/admin/mobile-scroller-steps/[id]`

#### `DELETE /api/admin/mobile-scroller-steps/[id]`

---

### Resume Items (آیتم‌های رزومه)

#### `GET /api/admin/resume-items`

#### `POST /api/admin/resume-items`

#### `GET /api/admin/resume-items/[id]`

#### `PATCH /api/admin/resume-items/[id]`

#### `DELETE /api/admin/resume-items/[id]`

---

## 12. نگهداری و ابزارها (Maintenance & Utilities)

### Revalidate (بازخوانی کش)

#### `POST /api/admin/revalidate`

بازخوانی دستی کش ISR

**Body:**

```typescript
{
  path?: string | string[]
  tag?: string | string[]
  type?: "path" | "tag" (default: "path")
}
```

**Examples:**

```json
// یک مسیر
{ "path": "/courses/airdrop" }

// چند مسیر
{ "path": ["/courses/airdrop", "/courses/nft"] }

// بر اساس tag
{ "tag": "category", "type": "tag" }
```

**Response:**

```typescript
{
  revalidated: string[]
  failed?: string[]
  timestamp: string
}
```

#### `GET /api/admin/revalidate`

لیست مسیرهای قابل بازخوانی

---

### Fix UpdatedAt

#### `POST /api/admin/fix-updatedAt`

تصحیح فیلد updatedAt رکوردها

---

### Seed Quizzes

#### `POST /api/admin/seed/quizzes`

ایجاد داده‌های تستی برای آزمون‌ها

---

## 13. رسانه و آپلود (Media & Uploads)

### Images (مدیریت تصاویر)

#### `GET /api/admin/images`

لیست تمام تصاویر با صفحه‌بندی و فیلتر

**Query Params:**

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `search` (string) - جستجو در عنوان، توضیحات، alt
- `category` (ImageCategory) - دسته‌بندی تصویر

**Response:** `PaginatedResponse<Image[]>`

#### `POST /api/admin/images`

آپلود تصویر جدید (multipart/form-data)

**Body (FormData):**

```typescript
{
  file: File (required) - فایل تصویر
  category?: ImageCategory (default: "OTHER")
  title?: string
  description?: string
  alt?: string
  tags?: string (comma-separated)
}
```

**Response:** `CreatedResponse<Image>`

**نکات:**

- فایل الزامی است
- فرمت باید یکی از فرمت‌های معتبر تصویر باشد
- Category باید یکی از مقادیر enum باشد

#### `GET /api/admin/images/[id]`

دریافت یک تصویر

**Response:** `SuccessResponse<Image>`

#### `PATCH /api/admin/images/[id]`

ویرایش متادیتای تصویر

**Body:**

```typescript
{
  title?: string
  description?: string
  alt?: string
  tags?: string[]
  category?: ImageCategory
  published?: boolean
}
```

**Response:** `SuccessResponse<Image>`

#### `DELETE /api/admin/images/[id]`

حذف تصویر (از دیتابیس و storage)

**Response:** `SuccessResponse`

#### `GET /api/admin/images/stats`

دریافت آمار تصاویر کاربر

**Response:**

```typescript
{
  total: number
  byCategory: Record<string, number>
  totalSize: number
}
```

---

### Videos (مدیریت ویدیوها)

#### `GET /api/admin/videos`

لیست تمام ویدیوها با فیلتر و صفحه‌بندی

**Query Params:**

- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) - جستجو در عنوان، توضیحات
- `status` (VideoProcessingStatus) - وضعیت پردازش (PENDING, PROCESSING, COMPLETED, FAILED)

**Response:** `PaginatedResponse<Video[]>` + includes processing status

#### `POST /api/admin/videos`

ایجاد ویدیوی جدید و شروع پردازش HLS

**Body:**

```typescript
{
  title: string (required)
  videoId: string (required)
  originalPath: string (required)
  fileSize: number (required)
  fileFormat: string (required)
  description?: string
  duration?: number
  width?: number
  height?: number
  bitrate?: number
  codec?: string
  frameRate?: number
  startProcessing?: boolean (default: true)
}
```

**Response:** `SuccessResponse<Video>`

**نکات:**

- videoId باید یکتا باشد
- پردازش HLS به صورت background انجام می‌شود
- startProcessing = true به صورت خودکار پردازش را شروع می‌کند

#### `GET /api/admin/videos/[videoId]`

دریافت اطلاعات یک ویدیو

**Response:** `SuccessResponse<Video>`

#### `PUT /api/admin/videos/[videoId]`

بروزرسانی اطلاعات یک ویدیو

**Body:**

```typescript
{
  title?: string
  description?: string
  processingStatus?: VideoProcessingStatus
  hlsPath?: string
  thumbnailPath?: string
  duration?: number
  width?: number
  height?: number
  qualities?: string[]
  /* سایر فیلدها */
}
```

**Response:** `SuccessResponse<Video>`

#### `DELETE /api/admin/videos/[videoId]`

حذف یک ویدیو (شامل فایل‌ها از storage)

**Response:** `SuccessResponse`

#### `GET /api/admin/videos/stats`

دریافت آمار جامع ویدیوها

**Response:**

```typescript
{
  total: number
  byStatus: Record<VideoProcessingStatus, number>
  totalSize: number
  totalDuration: number
}
```

#### `POST /api/admin/videos/upload-url`

دریافت Signed Upload URL برای آپلود مستقیم ویدیو از مرورگر

**Body:**

```typescript
{
  fileName: string (required)
  fileSize: number (required)
  fileFormat: string (required) - mp4, mov, avi, mkv, webm
  title: string (required)
  description?: string
}
```

**Response:**

```typescript
{
  uploadUrl: string        // URL برای آپلود
  videoId: string          // شناسه یکتا
  storagePath: string      // مسیر در storage
  uniqueFileName: string   // نام فایل یکتا
  expiresAt: number        // زمان انقضا (timestamp)
  metadata: {
    title: string
    description?: string
    fileSize: number
    fileFormat: string
  }
}
```

**نکات:**

- URL معتبر برای 1 ساعت است
- حداکثر حجم: 5GB
- فقط فرمت‌های ویدیویی مجاز هستند

---

### Upload Video (آپلود مستقیم ویدیو)

#### `POST /api/admin/upload-video`

آپلود مستقیم ویدیو به سرور (multipart/form-data)

**Body (FormData):**

```typescript
{
  video: File (required) - فایل ویدیو
}
```

**Response:**

```typescript
{
  videoUrl: string       // URL نسبی فایل
  filename: string       // نام فایل ذخیره شده
  fileSize: number       // حجم فایل
  fileType: string       // نوع MIME
}
```

**محدودیت‌ها:**

- حداکثر حجم: 256MB
- فرمت‌های مجاز: mp4, mov, avi, mkv, webm
- فقط ادمین دسترسی دارد

**نکته:** برای فایل‌های بزرگ‌تر از 256MB از `/api/admin/videos/upload-url` استفاده کنید

---

## 14. تنظیمات سیستم (System Settings)

### Settings (تنظیمات سایت)

#### `GET /api/admin/settings`

دریافت تنظیمات فعلی سایت (فقط ادمین)

**Response:** `SuccessResponse<Settings>`

**Schema:**

```typescript
{
  id: string
  zarinpalMerchantId?: string   // شناسه پذیرنده زرین‌پال
  siteName?: string              // نام سایت
  siteDescription?: string       // توضیحات سایت
  supportEmail?: string          // ایمیل پشتیبانی
  supportPhone?: string          // تلفن پشتیبانی
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### `PATCH /api/admin/settings`

بروزرسانی تنظیمات سایت (فقط ادمین)

**Body:**

```typescript
{
  zarinpalMerchantId?: string  // 36 کاراکتر (UUID format)
  siteName?: string
  siteDescription?: string
  supportEmail?: string
  supportPhone?: string
}
```

**Response:** `SuccessResponse<Settings>`

**نکات:**

- حداقل یک فیلد برای به‌روزرسانی الزامی است
- zarinpalMerchantId باید دقیقا 36 کاراکتر باشد (فرمت UUID)
- فقط ادمین دسترسی دارد

---

## توضیحات کلی

### Response Types

```typescript
// موفقیت‌آمیز با داده
SuccessResponse<T> = {
  success: true
  message: string
  data: T
}

// ساخت موفقیت‌آمیز
CreatedResponse<T> = {
  success: true
  message: string
  data: T
  status: 201
}

// صفحه‌بندی شده
PaginatedResponse<T> = {
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// بدون محتوا
NoContentResponse = {
  status: 204
}

// خطا
ErrorResponse = {
  success: false
  message: string
  code: string
}

// خطای اعتبارسنجی
ValidationErrorResponse = {
  success: false
  message: string
  errors: Record<string, string>
}
```

### نکات مهم

1. **همه APIها CRUD کامل دارند** (GET list, POST, GET by id, PATCH, DELETE) مگر مواردی که ذکر شده
2. **Pagination** در همه GET لیست‌ها به صورت یکسان عمل می‌کند
3. **فیلترها** در هر API متفاوت است (به Query Params هر endpoint مراجعه شود)
4. **Slug یکتا** در تمام موجودیت‌های دارای slug باید یکتا باشد
5. **Cache** برخی APIهای dashboard کش دارند (5-10 دقیقه)
6. **Soft Delete** برخی موجودیت‌ها ممکن است soft delete داشته باشند
7. **Cascading Delete** روابط به صورت خودکار مدیریت می‌شوند

### فیلدهای مشترک

اکثر موجودیت‌ها این فیلدها را دارند:

- `id` (string, UUID)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `published` (boolean)
- `slug` (string, unique)

---

**تاریخ آخرین بروزرسانی:** 2025-11-21

**تعداد کل APIها:** 85+ endpoint

**نسخه:** 1.1.0

**تغییرات نسخه 1.1.0:**
- ✅ اضافه شدن بخش "رسانه و آپلود" شامل Images, Videos, Upload Video
- ✅ اضافه شدن بخش "تنظیمات سیستم" شامل Settings
- ✅ تکمیل Investment Models و Investment Models Page با تمام CRUDها
- ✅ اضافه شدن 20+ endpoint جدید به مستندات
