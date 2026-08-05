# پیشرو (Pishro)

پلتفرم وب آموزش و سرمایه‌گذاری مبتنی بر **Next.js 15** (App Router)، **Prisma**، **MySQL 8** و رابط کاربری فارسی (RTL).

این مخزن شامل سایت عمومی، پنل کاربر، پنل ادمین، APIها، و سرویس‌های جانبی (آپلود، پرداخت، پیامک، پردازش ویدیو) است.

---

## اسناد

| سند | محتوا |
|-----|--------|
| [README.md](./README.md) | معرفی، پیش‌نیازها، راه‌اندازی محلی |
| [STRUCTURE.md](./STRUCTURE.md) | معماری و ساختار کد |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | نصب صفر تا صد روی سرور خام یا Docker |

---

## پیش‌نیازها (قبل از نصب)

این موارد را **قبل** از `npm install` یا deploy آماده کنید.

### سخت‌افزار پیشنهادی

| محیط | CPU | RAM | دیسک |
|------|-----|-----|------|
| توسعه محلی | ۲ هسته | ۴ GB | ۲۰ GB آزاد |
| سرور تولید (حداقل) | ۲ vCPU | ۲ GB | ۴۰ GB SSD |
| سرور تولید (پیشنهادی) | ۴ vCPU | ۴ GB+ | ۸۰ GB SSD |

> بیلد Next.js حافظه‌بر است. روی سرور ۲ GB در صورت کرش build، swap یا RAM بیشتر لازم است.

### نرم‌افزار

| ابزار | نسخه پیشنهادی | الزام |
|--------|----------------|--------|
| Node.js | **20 LTS** | بله |
| npm | همراه Node 20 | بله |
| Git | ۲.x | بله |
| MySQL | **۸.۰** | بله (محلی یا Docker) |
| Docker + Compose | اختیاری | برای MySQL/worker/بکاپ |
| Nginx + Certbot | اختیاری | فقط production با دامنه |
| PM2 | اختیاری | فقط production روی سرور خام |
| FFmpeg | اختیاری | فقط worker ترنسکد ویدیو (در container نصب می‌شود) |

### دسترسی‌ها و سرویس‌های خارجی (اختیاری ولی برای قابلیت کامل)

- دامنه + رکورد DNS از نوع `A` به IP سرور (برای SSL)
- درگاه زرین‌پال (`ZARINPAL_MERCHANT_ID`) برای پرداخت واقعی
- سرویس پیامک (Melipayamak / Modirpayamak / IPPanel) برای OTP
- فضای شیء S3-سازگار (مثلاً پارس‌پک) برای ویدیو/HLS و بکاپ ابری

بدون این‌ها سایت بالا می‌آید؛ پرداخت واقعی، OTP واقعی و ترنسکد ویدیو کار نمی‌کند.

### مسیر ذخیره‌سازی فایل

آپلودهای ادمین/کاربر باید **خارج از فولدر کد** باشند:

```bash
# پیش‌فرض پیشنهادی
UPLOAD_BASE_DIR=/opt/uploade
```

یا با `STORAGE_DRIVER=s3` روی باکت ابری. مسیر نسبی یا داخل ریپو پشتیبانی امنیتی/عملیاتی ندارد.

---

## راه‌اندازی سریع (توسعه محلی)

### ۱) کلون و وابستگی‌ها

```bash
git clone https://github.com/isina-nej/pishro.git
cd pishro
npm install
```

### ۲) MySQL

با Docker:

```bash
docker compose up -d mysql
```

یا MySQL محلی با دیتابیس `pishro` و کاربر اختصاصی.

### ۳) فایل `.env`

در ریشه پروژه بسازید (نمونه حداقلی):

```env
NODE_ENV=development

DATABASE_URL="mysql://pishro_user:pishro_password@localhost:3306/pishro"
DB_HOST=localhost
DB_PORT=3306
DB_USER=pishro_user
DB_PASSWORD=pishro_password
DB_NAME=pishro

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-me
ADMIN_JWT_SECRET=dev-admin-secret-change-me

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

STORAGE_DRIVER=local
UPLOAD_BASE_DIR=/opt/uploade
UPLOAD_BASE_URL=/api/uploads
```

```bash
mkdir -p /opt/uploade   # یا مسیر مطلق دیگر خارج از ریپو
```

تنظیمات فضای ابری نمونه: `.env.storage.example`.

### ۴) اسکیم و داده نمونه

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed          # فقط در non-production
```

پس از seed معمولاً:

- ادمین: `09123456789` / `Admin@123`
- کاربر نمونه: شمارهٔ seed‌شده / `User@123`

### ۵) اجرای اپ

```bash
npm run dev
```

آدرس پیش‌فرض: [http://localhost:3000](http://localhost:3000)  
پنل ادمین: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## دستورهای اصلی

```bash
npm run dev           # توسعه (Turbopack)
npm run build         # بیلد تولید
npm run start         # اجرای بیلد
npm run lint          # ESLint
npm run test          # تست‌های Node test runner
npx tsc --noEmit      # تایپ‌چک

npm run seed          # داده نمونه
npm run seed:reset    # ریست migration + seed
npm run db:studio     # Prisma Studio

npm run backup:db     # بکاپ دیتابیس (نیازمند env)
npm run storage:check # تست اتصال استوریج
```

ساخت ادمین دستی:

```bash
npx tsx scripts/create-admin.ts admin@example.com 'StrongPass123!' 'مدیر'
```

---

## استقرار تولید

راهنمای کامل سرور خام (Nginx + PM2 + SSL) و مسیر Docker در **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

خلاصهٔ به‌روزرسانی روی سرور موجود:

```bash
cd /opt/pishro
git pull --ff-only origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart pishro-app --update-env
pm2 save
```

---

## لایسنس و مالکیت

پروژه خصوصی/اختصاصی پیشرو. بدون مجوز مالک، استفادهٔ عمومی یا بازنشر مجاز نیست.
