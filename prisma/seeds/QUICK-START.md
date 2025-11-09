# 🚀 راهنمای سریع شروع کار

این راهنما برای راه‌اندازی سریع اسکریپت‌های seed است.

---

## ⚡ نصب سریع (3 دقیقه)

### گام 1: نصب وابستگی‌ها

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

### گام 2: اضافه کردن اسکریپت‌ها به package.json

فایل `package.json` را باز کنید و به بخش `scripts` اضافه کنید:

```json
{
  "scripts": {
    "seed": "ts-node prisma/seeds/seed-all.ts",
    "seed:reset": "npx prisma db push --force-reset && npm run seed",
    "db:studio": "npx prisma studio"
  }
}
```

### گام 3: تنظیم محیط

فایل `.env` در ریشه پروژه ایجاد/ویرایش کنید:

```env
# MongoDB Connection
DATABASE_URL="mongodb://localhost:27017/pishro"

# Environment (MUST be development for seeding)
NODE_ENV="development"
```

### گام 4: اجرای Prisma Generate

```bash
npx prisma generate
```

### گام 5: اجرای Seed

```bash
npm run seed
```

---

## 📦 فایل‌های ایجاد شده

```
prisma/seeds/
├── persian-data-generator.ts  # تولیدکننده داده فارسی
├── seed-categories.ts          # 8 دسته‌بندی
├── seed-tags.ts                # 30 برچسب
├── seed-users.ts               # 51 کاربر (1 admin + 50 user)
├── seed-courses.ts             # 40 دوره
├── seed-comments.ts            # 100 نظر
├── seed-quizzes.ts             # ~80 آزمون + ~800 سوال
├── seed-enrollments.ts         # ~150-200 ثبت‌نام
├── seed-orders.ts              # ~50-100 سفارش
├── seed-news.ts                # 30 مقاله
├── seed-books.ts               # 25 کتاب
├── seed-faqs.ts                # 40 سوال متداول
├── seed-pagecontent.ts         # ~32 محتوای صفحه
├── seed-newsletter.ts          # 100 مشترک
├── seed-all.ts                 # اجرای کل
├── README.md                   # مستندات کامل
├── QUICK-START.md              # این فایل
├── EXECUTION-PLAN.md           # برنامه اجرا
└── sample-data.md              # نمونه داده‌ها
```

---

## 🎯 دستورات پرکاربرد

```bash
# اجرای همه seedها
npm run seed

# پاک کردن دیتابیس و seed مجدد
npm run seed:reset

# باز کردن Prisma Studio (مشاهده داده‌ها)
npm run db:studio

# اجرای یک seed خاص
npx ts-node prisma/seeds/seed-users.ts
```

---

## 🔐 اطلاعات ورود

### ادمین
```
تلفن: 09123456789
رمز: Admin@123
```

### کاربران عادی
```
تلفن: (هر شماره seed شده)
رمز: User@123
```

---

## 📊 آمار داده‌های تولیدی

| مدل | تعداد |
|-----|-------|
| Categories | 8 |
| Tags | 30 |
| Users | 51 |
| Courses | 40 |
| Comments | 100 |
| Quizzes | ~80 |
| Questions | ~800 |
| Enrollments | ~150-200 |
| Orders | ~50-100 |
| News | 30 |
| Books | 25 |
| FAQs | 40 |
| Page Content | ~32 |
| Newsletter | 100 |
| **مجموع** | **~1500-1700** |

---

## ⚠️ نکات مهم

### ✅ انجام دهید
- همیشه `NODE_ENV=development` قرار دهید
- قبل از seed، `npx prisma generate` اجرا کنید
- از `npm run seed:reset` برای ریست کامل استفاده کنید

### ❌ انجام ندهید
- در production اجرا نکنید (بلاک می‌شود)
- `.env` را commit نکنید
- رمزهای پیش‌فرض را در production نگه ندارید

---

## 🐛 رفع مشکلات سریع

### خطا: "Cannot run seeds in production"
```bash
# راه‌حل
export NODE_ENV=development  # Linux/Mac
set NODE_ENV=development     # Windows
```

### خطا: "bcryptjs not found"
```bash
npm install bcryptjs @types/bcryptjs
```

### خطا: "Unique constraint failed"
```bash
npm run seed:reset  # ریست کامل و seed مجدد
```

### خطا: "Cannot connect to MongoDB"
```bash
# بررسی کنید MongoDB در حال اجرا باشد
# و DATABASE_URL در .env صحیح باشد
```

---

## 📚 مستندات کامل

برای اطلاعات بیشتر:
- **راهنمای کامل**: `prisma/seeds/README.md`
- **برنامه اجرا**: `prisma/seeds/EXECUTION-PLAN.md`
- **نمونه داده**: `prisma/seeds/sample-data.md`

---

## 🎉 تمام!

اکنون دیتابیس شما با حدود **1500-1700 رکورد** داده فارسی واقع‌گرایانه پر شده است!

```bash
# مشاهده داده‌ها
npm run db:studio
```

موفق باشید! 🚀
