# پیشرو (Pishro)

پلتفرم کامل وب برای **آموزش** و **سرمایه‌گذاری** — سایت عمومی، پنل کاربر، پنل ادمین و APIها.

ساخته‌شده با **Next.js 15** (App Router)، **Prisma**، **MySQL 8**، رابط فارسی RTL و استقرار آمادهٔ production.

---

## وضعیت پروژه

نسخهٔ **۱.۰.۰** — محصول آمادهٔ استقرار. قابلیت‌های اختیاری (پیامک واقعی، زرین‌پال، S3/ویدیو HLS) با تنظیم env فعال می‌شوند؛ بدون آن‌ها هستهٔ سایت و پنل‌ها قابل اجراست.

| سند | توضیح |
|-----|--------|
| [README.md](./README.md) | معرفی، پیش‌نیازها، شروع سریع |
| [STRUCTURE.md](./STRUCTURE.md) | معماری و ساختار کد |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | استقرار صفر تا صد (سرور خام / Docker) |
| [SECURITY.md](./SECURITY.md) | گزارش آسیب‌پذیری |
| [LICENSE](./LICENSE) | حقوق مالکیت |

---

## پیش‌نیازها (قبل از نصب)

### سخت‌افزار

| محیط | CPU | RAM | دیسک |
|------|-----|-----|------|
| توسعه | ۲ هسته | ۴ GB | ۲۰ GB آزاد |
| تولید (حداقل) | ۲ vCPU | ۲ GB | ۴۰ GB SSD |
| تولید (پیشنهادی) | ۴ vCPU | ۴ GB+ | ۸۰ GB SSD |

### نرم‌افزار

- **Node.js 20 LTS** و npm  
- Git  
- **MySQL 8** (محلی یا Docker)  
- اختیاری production: Nginx، Certbot، PM2، Docker Compose  

### سرویس‌های خارجی (اختیاری)

| سرویس | برای |
|--------|------|
| زرین‌پال | پرداخت واقعی |
| Melipayamak / Modirpayamak / IPPanel | OTP واقعی |
| S3 سازگار (مثلاً پارس‌پک) | ویدیو، HLS، بکاپ ابری |

### مسیر آپلود

فایل‌های آپلودی باید **خارج از فولدر کد** باشند:

```bash
UPLOAD_BASE_DIR=/opt/uploade
```

---

## شروع سریع (توسعه)

```bash
git clone https://github.com/isina-nej/pishro.git
cd pishro
cp .env.example .env
# مقادیر DB و secretها را ویرایش کنید

mkdir -p /opt/uploade   # یا مسیر مطلق دیگر خارج از ریپو
npm install

# MySQL را بالا بیاورید، سپس:
npx prisma generate
npx prisma migrate deploy
npm run seed            # فقط non-production

npm run dev
```

- سایت: http://localhost:3000  
- ادمین: http://localhost:3000/admin/login  

پس از seed (فقط محیط توسعه): ادمین نمونه `09123456789` / `Admin@123` — **هرگز در production استفاده نکنید.**

نمونهٔ متغیرهای ابری: `.env.storage.example`.

---

## قابلیت‌های اصلی

- سایت بازاریابی و CMS لندینگ  
- دوره‌ها، اخبار، کتابخانه دیجیتال  
- پنل کاربر (پروفایل، سفارش، پشتیبانی)  
- پنل ادمین: CRM، محتوا، گزارش، ظاهر سایت  
- آپلود امن خارج از ریپو / یا S3  
- آمادگی پرداخت و پیامک  

جزئیات معماری: [STRUCTURE.md](./STRUCTURE.md).

---

## دستورها

```bash
npm run dev
npm run build && npm run start
npm run lint
npm run test
npx tsc --noEmit

npm run seed / npm run seed:reset
npm run db:studio
npm run backup:db
npm run storage:check
```

ادمین دستی:

```bash
npx tsx scripts/create-admin.ts admin@example.com 'StrongPass123!' 'مدیر'
```

---

## استقرار تولید

راهنمای کامل: **[DEPLOYMENT.md](./DEPLOYMENT.md)** (Ubuntu + PM2 + Nginx + SSL و مسیر Docker).

به‌روزرسانی سریع روی سرور موجود:

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

## امنیت و مالکیت

- گزارش آسیب‌پذیری: [SECURITY.md](./SECURITY.md)  
- حقوق اثر: [LICENSE](./LICENSE) — تمام حقوق محفوظ است؛ استفاده/بازنشر بدون مجوز کتبی مجاز نیست.

---

## پشتیبانی

- ایمیل: info@pishrosarmaye.com  
- صفحهٔ تماس در اپ: `/contact`
