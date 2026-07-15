# راهنمای صفر تا صد راه‌اندازی پیشرو روی سرور خام

این سند برای deploy پروژه **Pishro** (Next.js 15 + Prisma + MySQL) روی یک VPS خام نوشته شده است.

---

## فهرست

1. [معماری و پیش‌نیازها](#1-معماری-و-پیش‌نیازها)
2. [آماده‌سازی سرور](#2-آماده‌سازی-سرور)
3. [نصب MySQL و ساخت دیتابیس](#3-نصب-mysql-و-ساخت-دیتابیس)
4. [دریافت کد پروژه](#4-دریافت-کد-پروژه)
5. [تنظیم فایل env](#5-تنظیم-فایل-env)
6. [پوشه آپلود و دسترسی‌ها](#6-پوشه-آپلود-و-دسترسی‌ها)
7. [Migration و Build](#7-migration-و-build)
8. [اجرای اپ با PM2](#8-اجرای-اپ-با-pm2)
9. [تنظیم Nginx و SSL](#9-تنظیم-nginx-و-ssl)
10. [ساخت کاربر ادمین](#10-ساخت-کاربر-ادمین)
11. [تست نهایی](#11-تست-نهایی)
12. [آپدیت بعدی (Deploy مجدد)](#12-آپدیت-بعدی-deploy-مجدد)
13. [عیب‌یابی مشکلات رایج](#13-عیب‌یابی-مشکلات-رایج)
14. [پشتیبان‌گیری](#14-پشتیبان‌گیری)
15. [اختیاری: Worker پردازش ویدیو](#15-اختیاری-worker-پردازش-ویدیو)

---

## 1. معماری و پیش‌نیازها

### معماری پیشنهادی

```text
کاربر
  ↓
دامنه (HTTPS)
  ↓
Nginx (پورت 80/443)
  ↓
Next.js با PM2 (پورت 3000)
  ↓
MySQL (پورت 3306)
  +
پوشه آپلود محلی (/opt/uploade)
  +
(اختیاری) S3 برای ویدیو
```

### حداقل مشخصات سرور

| مورد | حداقل | پیشنهادی |
|------|--------|----------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 22.04 / 24.04 | Ubuntu 24.04 |

> `npm run build` روی Next.js حافظه می‌خورد. اگر build وسط کار کرش کرد، RAM را بالاتر ببرید یا swap اضافه کنید.

### نرم‌افزارهای لازم

- Node.js 20 LTS
- npm
- Git
- MySQL 8
- Nginx
- PM2
- Certbot (برای SSL)

### دامنه

قبل از SSL، DNS دامنه را به IP سرور اشاره بدهید:

```text
A     @              -> IP_SERVER
A     www            -> IP_SERVER
```

---

## 2. آماده‌سازی سرور

با کاربر `root` یا یک کاربر sudo وارد سرور شوید:

```bash
ssh root@YOUR_SERVER_IP
```

### 2.1 به‌روزرسانی سیستم

```bash
apt update && apt upgrade -y
```

### 2.2 نصب ابزارهای پایه

```bash
apt install -y git curl wget unzip ufw
```

### 2.3 نصب Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

### 2.4 نصب PM2

```bash
npm install -g pm2
pm2 -v
```

### 2.5 نصب Nginx

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 2.6 فایروال

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

### 2.7 (اختیاری) Swap برای سرورهای کم‌حافظه

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 3. نصب MySQL و ساخت دیتابیس

### 3.1 نصب MySQL

```bash
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql
```

### 3.2 سخت‌کردن امنیت (اختیاری ولی توصیه‌شده)

```bash
mysql_secure_installation
```

### 3.3 ساخت دیتابیس و یوزر

وارد MySQL شوید:

```bash
mysql
```

دستورات SQL:

```sql
CREATE DATABASE pishro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'pishro_user'@'localhost' IDENTIFIED BY 'یک_پسورد_قوی_اینجا';
GRANT ALL PRIVILEGES ON pishro.* TO 'pishro_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

تست اتصال:

```bash
mysql -u pishro_user -p pishro -e "SELECT 1;"
```

> **مهم:** از یوزر `root` MySQL برای اپلیکیشن استفاده نکنید. هم `DATABASE_URL` و هم `DB_*` باید با همین یوزر ساخته‌شده یکی باشند.

---

## 4. دریافت کد پروژه

مسیر پیشنهادی روی سرور:

```bash
mkdir -p /opt/pishro
cd /opt/pishro
```

### روش A: Clone از GitHub (پیشنهادی)

```bash
git clone https://github.com/isina-nej/pishro.git .
```

### روش B: آپلود دستی

فایل zip پروژه را به `/opt/pishro` منتقل و extract کنید.

### نصب dependencyها

```bash
cd /opt/pishro
npm install
```

---

## 5. تنظیم فایل env

در ریشه پروژه فایل `.env` بسازید:

```bash
cd /opt/pishro
nano .env
```

### 5.1 env حداقلی (برای بالا آمدن سایت)

```env
NODE_ENV=production

# Database (Prisma + mysql2 هر دو از این‌ها استفاده می‌کنند)
DATABASE_URL="mysql://pishro_user:یک_پسورد_قوی_اینجا@localhost:3306/pishro"
DB_HOST=localhost
DB_PORT=3306
DB_USER=pishro_user
DB_PASSWORD=یک_پسورد_قوی_اینجا
DB_NAME=pishro

# Auth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=یک_رشته_خیلی_طولانی_و_رندوم
ADMIN_JWT_SECRET=یک_رشته_خیلی_طولانی_و_دیگر

# Public URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_CMS_URL=https://your-domain.com

# Uploads
UPLOAD_BASE_DIR=/opt/uploade
```

### 5.2 env تکمیلی (برای قابلیت‌های بیشتر)

```env
# SMS / OTP (یکی از سرویس‌ها را فعال کنید)
SMS_SERVICE=modirpayamak
SMS_USERNAME=
SMS_PASSWORD=
SMS_FROM=
SMS_API_URL=https://sms.modirpayamak.com

# یا IPPanel / Payamak
PAYAMAK_API_URL=https://edge.ippanel.com/v1
PAYAMAK_API_KEY=
IPPANEL_API_KEY=
IPPANEL_FROM_NUMBER=+983000505
IPPANEL_PATTERN_CODE=

# برای تست بدون ارسال واقعی SMS
# SMS_SERVICE=mock

# Payment
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Video / Object Storage (اختیاری)
S3_REGION=default
S3_ENDPOINT=https://your-s3-endpoint
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=videos
S3_PUBLIC_ENDPOINT=https://your-s3-endpoint
VIDEO_TOKEN_SECRET=یک_رشته_امن_برای_توکن_ویدیو
TEMP_DIR=/tmp/video-processing
```

### 5.3 نکات مهم env

1. `NEXT_PUBLIC_BASE_URL` باید دقیقاً همان دامنه نهایی با `https` باشد.
2. `DATABASE_URL` و `DB_USER/DB_PASSWORD` باید با هم سازگار باشند.
3. فایل `.env` را commit نکنید.
4. برای ساخت secret:

```bash
openssl rand -base64 48
```

---

## 6. پوشه آپلود و دسترسی‌ها

پروژه به‌صورت پیش‌فرض از `/opt/uploade` استفاده می‌کند:

```bash
mkdir -p /opt/uploade
chown -R root:root /opt/uploade
chmod -R 755 /opt/uploade
```

اگر کاربر دیگری اپ را اجرا می‌کند، owner را همان کاربر بگذارید.

---

## 7. Migration و Build

```bash
cd /opt/pishro

# تولید Prisma Client
npx prisma generate

# اعمال migrationها روی دیتابیس
npx prisma migrate deploy

# build تولید
npm run build
```

### نکته درباره خطاهای DB هنگام build

ممکن است حین `next build` پیام‌هایی مثل `Access denied for user` ببینید. اگر build در نهایت `Compiled successfully` شد، معمولاً build موفق است؛ ولی برای runtime حتماً env دیتابیس را درست کنید.

### seed دیتابیس

اسکریپت seed در production عمداً بلاک شده:

```text
Cannot run seeds in production environment!
```

برای محیط اولیه:

- یا دیتا را از پنل ادمین وارد کنید
- یا موقتاً با احتیاط و فقط یک‌بار در staging/dev seed بزنید

---

## 8. اجرای اپ با PM2

### 8.1 اولین بار

```bash
cd /opt/pishro
pm2 start npm --name pishro-app -- start
pm2 save
pm2 startup
```

دستوری که `pm2 startup` چاپ می‌کند (مثل `systemctl enable pm2-root`) را اجرا کنید.

### 8.2 بررسی وضعیت

```bash
pm2 status
pm2 logs pishro-app --lines 50
```

باید چیزی شبیه این ببینید:

```text
✓ Ready in ...
Local: http://localhost:3000
```

### 8.3 فایل ecosystem (پیشنهادی)

فایل `ecosystem.config.cjs` در ریشه پروژه:

```js
module.exports = {
  apps: [
    {
      name: "pishro-app",
      cwd: "/opt/pishro",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "1G",
      autorestart: true,
    },
  ],
};
```

اجرای مجدد با ecosystem:

```bash
pm2 delete pishro-app
pm2 start ecosystem.config.cjs
pm2 save
```

### 8.4 نکته مهم PM2

اگر سایت قبلاً با `pishro-app` بالا بوده:

- **دوباره** `pm2 start npm --name pishro ...` نزنید
- فقط `pm2 restart pishro-app --update-env`

دو پروسس همزمان روی پورت 3000 باعث خطای `EADDRINUSE` می‌شود.

---

## 9. تنظیم Nginx و SSL

### 9.1 کانفیگ Nginx

```bash
nano /etc/nginx/sites-available/pishro
```

محتوا:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 550M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

فعال‌سازی:

```bash
ln -s /etc/nginx/sites-available/pishro /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

> `client_max_body_size 550M` به‌خاطر آپلود ویدیو/فایل در پروژه لازم است.

### 9.2 SSL با Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

تست تمدید خودکار:

```bash
certbot renew --dry-run
```

---

## 10. ساخت کاربر ادمین

پنل ادمین: `https://your-domain.com/admin/login`

### روش پیشنهادی

```bash
cd /opt/pishro
npx tsx scripts/create-admin.ts admin@your-domain.com 'StrongPass123!' 'مدیر سیستم'
```

اگر ادمین از قبل وجود داشت، ایمیل دیگری بزنید یا از پنل/DB ویرایش کنید.

---

## 11. تست نهایی

### 11.1 تست سرویس‌ها

```bash
pm2 status
curl -I http://127.0.0.1:3000
curl -I https://your-domain.com
```

### 11.2 تست دستی در مرورگر

- صفحه اصلی: `/`
- ورود کاربر: `/login`
- پنل ادمین: `/admin/login`
- فوتر: شماره تماس و اینماد
- آپلود تصویر در ادمین (اگر استفاده می‌کنید)

### 11.3 تست دیتابیس از API

```bash
curl https://your-domain.com/api/debug/db-status
```

> endpointهای debug را در production در صورت امکان محدود/غیرفعال کنید.

---

## 12. آپدیت بعدی (Deploy مجدد)

هر بار که کد جدید push شد:

```bash
cd /opt/pishro
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart pishro-app --update-env
pm2 save
```

اگر فقط تغییر UI/متن بود و migration جدید نداشتید:

```bash
cd /opt/pishro
git pull origin main
npm run build
pm2 restart pishro-app --update-env
```

---

## 13. عیب‌یابی مشکلات رایج

### 13.1 `Access denied for user 'root'@'localhost'`

**علت:** `.env` اشتباه است یا `DATABASE_URL` با `DB_USER/DB_PASSWORD` ناهماهنگ است.

**راه‌حل:**

```bash
nano /opt/pishro/.env
mysql -u pishro_user -p pishro -e "SELECT 1;"
npm run build
pm2 restart pishro-app --update-env
```

---

### 13.2 `EADDRINUSE: address already in use :::3000`

**علت:** دو پروسس PM2 همزمان روی پورت 3000.

**راه‌حل:**

```bash
pm2 status
pm2 stop pishro
pm2 delete pishro
pm2 restart pishro-app --update-env
pm2 save
```

---

### 13.3 سایت بالا نیست ولی PM2 online است

```bash
pm2 logs pishro-app --lines 100
nginx -t
systemctl status nginx
curl http://127.0.0.1:3000
```

---

### 13.4 آپلود فایل خطا می‌دهد

1. `UPLOAD_BASE_DIR` درست باشد
2. پوشه وجود داشته باشد و permission درست باشد
3. در Nginx مقدار `client_max_body_size` کافی باشد

```bash
ls -la /opt/uploade
```

---

### 13.5 پرداخت زرین‌پال کار نمی‌کند

1. `ZARINPAL_MERCHANT_ID` در env یا تنظیمات ادمین
2. `NEXT_PUBLIC_BASE_URL` باید HTTPS و دامنه واقعی باشد
3. callback: `https://your-domain.com/api/payment/verify`

---

### 13.6 SMS/OTP ارسال نمی‌شود

1. `SMS_SERVICE` را درست تنظیم کنید
2. برای تست اولیه: `SMS_SERVICE=mock`
3. API key و pattern code سرویس پیامک را بررسی کنید

---

### 13.7 build خیلی کند یا کرش می‌کند

```bash
free -h
df -h
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 14. پشتیبان‌گیری

### 14.1 بکاپ دیتابیس

```bash
mkdir -p /opt/backups
mysqldump -u pishro_user -p pishro | gzip > /opt/backups/pishro-$(date +%F).sql.gz
```

### 14.2 بکاپ فایل‌های آپلود

```bash
tar -czf /opt/backups/uploade-$(date +%F).tar.gz /opt/uploade
```

### 14.3 cron روزانه (اختیاری)

```bash
crontab -e
```

```cron
0 2 * * * mysqldump -u pishro_user -p'PASSWORD' pishro | gzip > /opt/backups/pishro-$(date +\%F).sql.gz
15 2 * * * tar -czf /opt/backups/uploade-$(date +\%F).tar.gz /opt/uploade
```

---

## 15. اختیاری: Worker پردازش ویدیو

اگر از آپلود/پردازش ویدیو استفاده می‌کنید، پروژه `docker-compose.yml` برای MySQL و worker دارد.

> برای production معمولاً MySQL جداگانه روی سرور کافی است و فقط worker را در صورت نیاز اجرا کنید.

```bash
cd /opt/pishro
docker compose up -d video-processor
```

نیازمند:

- Docker
- FFmpeg (داخل container نصب می‌شود)
- تنظیمات `S3_*` در env

---

## چک‌لیست نهایی

- [ ] Node 20 نصب شده
- [ ] MySQL ساخته و تست شده
- [ ] `.env` کامل و درست
- [ ] `/opt/uploade` ساخته شده
- [ ] `npx prisma migrate deploy` اجرا شده
- [ ] `npm run build` موفق
- [ ] PM2 فقط یک پروسس (`pishro-app`)
- [ ] Nginx + SSL فعال
- [ ] ادمین ساخته شده
- [ ] سایت روی دامنه باز می‌شود
- [ ] بکاپ اولیه گرفته شده

---

## مسیرهای مهم پروژه

| مسیر | توضیح |
|------|--------|
| `/opt/pishro` | ریشه پروژه |
| `/opt/pishro/.env` | تنظیمات محیطی |
| `/opt/uploade` | فایل‌های آپلودی |
| `/root/.pm2/logs/` | لاگ PM2 |
| `/etc/nginx/sites-available/pishro` | کانفیگ Nginx |

---

## دستورهای پرکاربرد

```bash
# وضعیت
pm2 status
pm2 logs pishro-app --lines 50

# ری‌استارت
pm2 restart pishro-app --update-env

# deploy
cd /opt/pishro && git pull && npm install && npx prisma migrate deploy && npm run build && pm2 restart pishro-app --update-env

# nginx
nginx -t && systemctl reload nginx
```

---

**آخرین به‌روزرسانی:** 2026-06-22  
**نسخه پروژه:** Next.js 15 + Prisma 6 + MySQL 8
