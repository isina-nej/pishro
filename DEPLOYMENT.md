# راهنمای استقرار پیشرو — سرور خام و Docker

راهنمای عملی صفر تا صد برای بالا آوردن سایت روی VPS لینوکسی، یا با Docker Compose.

پیش‌نیازهای سخت‌افزاری/نرم‌افزاری در [README.md](./README.md) آمده است؛ این سند فرض می‌کند آن‌ها را خوانده‌اید.

---

## فهرست

1. [معماری استقرار پیشنهادی](#1-معماری-استقرار-پیشنهادی)
2. [مسیر A — سرور خام (Ubuntu + MySQL + PM2 + Nginx)](#2-مسیر-a--سرور-خام)
3. [مسیر B — Docker Compose](#3-مسیر-b--docker-compose)
4. [ساخت ادمین و تست نهایی](#4-ساخت-ادمین-و-تست-نهایی)
5. [به‌روزرسانی (Deploy مجدد)](#5-به‌روزرسانی-deploy-مجدد)
6. [پشتیبان‌گیری](#6-پشتیبان‌گیری)
7. [عیب‌یابی رایج](#7-عیب‌یابی-رایج)
8. [چک‌لیست نهایی](#8-چک‌لیست-نهایی)

---

## 1. معماری استقرار پیشنهادی

```text
اینترنت
   │
   ▼
DNS → دامنه
   │
   ▼
Nginx :80/:443  (SSL با Certbot)
   │
   ▼
Next.js (PM2) :3000
   │
   ├── MySQL :3306
   ├── /opt/uploade   (فایل‌های آپلودی)
   └── (اختیاری) S3 + video-processor + db-backup
```

مسیر کد روی سرور پیشنهادی: `/opt/pishro`  
مسیر آپلود محلی پیشنهادی: `/opt/uploade` (**خارج از ریپو**)

---

## 2. مسیر A — سرور خام

سیستم‌عامل هدف: **Ubuntu 22.04 / 24.04**.

### 2.1 آماده‌سازی سیستم

```bash
ssh root@YOUR_SERVER_IP

apt update && apt upgrade -y
apt install -y git curl wget unzip ufw build-essential
```

فایروال پایه:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

### 2.2 نصب Node.js 20 و PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # v20.x
npm -v

npm install -g pm2
pm2 -v
```

### 2.3 نصب و تنظیم MySQL 8

```bash
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql
```

ورود و ساخت دیتابیس/کاربر:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE pishro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pishro_user'@'localhost' IDENTIFIED BY 'یک_پسورد_قوی';
GRANT ALL PRIVILEGES ON pishro.* TO 'pishro_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

تست:

```bash
mysql -u pishro_user -p pishro -e "SELECT 1;"
```

### 2.4 دریافت کد

```bash
mkdir -p /opt/pishro
cd /opt/pishro
git clone https://github.com/isina-nej/pishro.git .
npm install
```

### 2.5 فایل `.env`

```bash
nano /opt/pishro/.env
```

حداقلی برای بالا آمدن سایت:

```env
NODE_ENV=production

DATABASE_URL="mysql://pishro_user:یک_پسورد_قوی@localhost:3306/pishro"
DB_HOST=localhost
DB_PORT=3306
DB_USER=pishro_user
DB_PASSWORD=یک_پسورد_قوی
DB_NAME=pishro

NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=   # openssl rand -base64 48
ADMIN_JWT_SECRET=  # openssl rand -base64 48

NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_CMS_URL=https://your-domain.com

STORAGE_DRIVER=local
UPLOAD_BASE_DIR=/opt/uploade
UPLOAD_BASE_URL=/api/uploads
```

تکمیلی (در صورت نیاز):

```env
# پیامک — برای تست بدون ارسال واقعی: SMS_SERVICE=mock
SMS_SERVICE=modirpayamak
SMS_USERNAME=
SMS_PASSWORD=
SMS_FROM=
SMS_API_URL=https://sms.modirpayamak.com

ZARINPAL_MERCHANT_ID=

# استوریج ابری / ویدیو (اختیاری) — جزئیات در .env.storage.example
STORAGE_DRIVER=s3
S3_ENDPOINT=https://YOUR_ENDPOINT
S3_BUCKET_NAME=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=us-east-1
S3_PUBLIC_URL=
VIDEO_TOKEN_SECRET=
TEMP_DIR=/tmp/video-processing
```

ساخت secret:

```bash
openssl rand -base64 48
```

### 2.6 پوشه آپلود

```bash
mkdir -p /opt/uploade
# اگر PM2 با کاربر خاصی اجرا می‌شود، owner را همان بگذارید
chown -R root:root /opt/uploade
chmod -R 755 /opt/uploade
```

### 2.7 Migration و Build

```bash
cd /opt/pishro
npx prisma generate
npx prisma migrate deploy
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

> Seed در production معمولاً غیرفعال است. داده را از پنل ادمین وارد کنید یا یک‌بار در staging با احتیاط seed بزنید.

### 2.8 اجرای اپ با PM2

```bash
cd /opt/pishro
pm2 start npm --name pishro-app -- start
pm2 save
pm2 startup
# دستور چاپ‌شده توسط pm2 startup را اجرا کنید
```

وضعیت:

```bash
pm2 status
pm2 logs pishro-app --lines 50
curl -I http://127.0.0.1:3000
```

**مهم:** فقط یک پروسس روی پورت ۳۰۰۰ داشته باشید. برای ری‌استارت بعدی:

```bash
pm2 restart pishro-app --update-env
```

نه `pm2 start` دوباره با نام جدید.

نمونهٔ `ecosystem.config.cjs` (اختیاری):

```js
module.exports = {
  apps: [
    {
      name: "pishro-app",
      cwd: "/opt/pishro",
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production", PORT: 3000 },
      max_memory_restart: "1G",
      autorestart: true,
    },
  ],
};
```

### 2.9 Nginx و SSL

```bash
apt install -y nginx
nano /etc/nginx/sites-available/pishro
```

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

```bash
ln -s /etc/nginx/sites-available/pishro /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

SSL:

```bash
# DNS دامنه باید از قبل به IP سرور اشاره کند
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
certbot renew --dry-run
```

---

## 3. مسیر B — Docker Compose

`docker-compose.yml` فعلی این سرویس‌ها را تعریف می‌کند:

| سرویس | نقش |
|--------|------|
| `mysql` | MySQL 8 |
| `video-processor` | ترنسکد HLS (FFmpeg داخل Alpine) |
| `db-backup` | بکاپ زمان‌بندی‌شده به S3 |

اپ Next.js در این فایل به‌صورت پیش‌فرض container نشده؛ الگوی رایج production:

1. MySQL (و در صورت نیاز workerها) با Compose  
2. اپ با Node روی هاست + PM2 (مسیر A)  
یا اپ را جداگانه در image خودتان بیلد کنید.

### 3.1 پیش‌نیاز Docker

```bash
# Ubuntu — نصب رسمی Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
docker compose version
```

### 3.2 فقط دیتابیس با Docker

در ریشهٔ پروژه (با `.env` آماده):

```bash
cd /opt/pishro
docker compose up -d mysql
docker compose ps
```

سپس روی هاست:

```bash
npx prisma migrate deploy
npm run build
pm2 start npm --name pishro-app -- start
```

اگر MySQL داخل Docker و اپ روی هاست است، در `.env`:

```env
DB_HOST=127.0.0.1
DATABASE_URL="mysql://pishro_user:pishro_password@127.0.0.1:3306/pishro"
```

(پورت `3306:3306` در compose باز است.)

### 3.3 Worker ویدیو

نیازمند `DATABASE_URL` و متغیرهای `S3_*` معتبر:

```bash
docker compose up -d video-processor
docker compose logs -f video-processor
```

### 3.4 بکاپ خودکار به فضای ابری

```bash
docker compose up -d db-backup
```

تنظیمات: `BACKUP_PREFIX`، `BACKUP_RETENTION_DAYS`، `BACKUP_CRON` (به وقت UTC).  
جزئیات در `.env.storage.example`.

### 3.5 توقف / پاک‌سازی

```bash
docker compose stop
docker compose down          # بدون حذف volume
# docker compose down -v   # خطرناک: دیتابیس پاک می‌شود
```

---

## 4. ساخت ادمین و تست نهایی

### ادمین

```bash
cd /opt/pishro
npx tsx scripts/create-admin.ts admin@your-domain.com 'StrongPass123!' 'مدیر سیستم'
```

ورود: `https://your-domain.com/admin/login`

### تست سریع

```bash
pm2 status
curl -I http://127.0.0.1:3000
curl -I https://your-domain.com
```

در مرورگر:

- `/` صفحه اصلی  
- `/login` ورود کاربر  
- `/admin/login` پنل ادمین  
- یک آپلود تصویر در ادمین (نوشتن در `/opt/uploade` یا S3)

---

## 5. به‌روزرسانی (Deploy مجدد)

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

اسکریپت آمادهٔ pull-based: `scripts/deploy-from-main.sh`  
نسخهٔ اجرایی روی سرور را بیرون از working tree نصب کنید:

```bash
install -m 755 /opt/pishro/scripts/deploy-from-main.sh /usr/local/bin/pishro-deploy
```

---

## 6. پشتیبان‌گیری

### دیتابیس

```bash
mkdir -p /opt/backups
mysqldump -u pishro_user -p pishro | gzip > /opt/backups/pishro-$(date +%F).sql.gz
```

یا:

```bash
npm run backup:db
```

### فایل‌های آپلود

```bash
tar -czf /opt/backups/uploade-$(date +%F).tar.gz /opt/uploade
```

### cron نمونه

```cron
0 2 * * * mysqldump -u pishro_user -p'PASSWORD' pishro | gzip > /opt/backups/pishro-$(date +\%F).sql.gz
15 2 * * * tar -czf /opt/backups/uploade-$(date +\%F).tar.gz /opt/uploade
```

---

## 7. عیب‌یابی رایج

| نشانه | علت محتمل | اقدام |
|--------|------------|--------|
| `Access denied for user` | `.env` ناهماهنگ | همخوانی `DATABASE_URL` با `DB_*`؛ تست `mysql -u ...` |
| `EADDRINUSE :::3000` | دو پروسس PM2 | `pm2 list` → حذف اضافه → یک `pishro-app` |
| PM2 online ولی سایت قطع | Nginx / پورت | `pm2 logs`، `nginx -t`، `curl 127.0.0.1:3000` |
| خطای آپلود | مسیر/مجوز/حجم | `UPLOAD_BASE_DIR`، `ls -la /opt/uploade`، `client_max_body_size` |
| OTP ارسال نمی‌شود | SMS | `SMS_SERVICE=mock` برای تست؛ سپس کلید واقعی |
| زرین‌پال fail | merchant / URL | `ZARINPAL_MERCHANT_ID` و `NEXT_PUBLIC_BASE_URL` با HTTPS |
| build کرش | کمبود RAM | `NODE_OPTIONS=--max-old-space-size=4096` یا افزایش RAM/swap |

---

## 8. چک‌لیست نهایی

- [ ] Node 20، Git، MySQL 8 نصب شده
- [ ] پیش‌نیازهای README رعایت شده
- [ ] `.env` کامل؛ secretها تصادفی و قوی
- [ ] `/opt/uploade` خارج از کد ساخته شده
- [ ] `prisma migrate deploy` موفق
- [ ] `npm run build` موفق
- [ ] فقط یک پروسس PM2: `pishro-app`
- [ ] Nginx + SSL روی دامنه
- [ ] ادمین ساخته و ورود تست شده
- [ ] بکاپ اولیه دیتابیس و آپلود گرفته شده
- [ ] (اختیاری) Compose برای worker/بکاپ در صورت نیاز به ویدیو ابری

---

## مسیرهای مهم روی سرور

| مسیر | نقش |
|------|-----|
| `/opt/pishro` | کد اپ |
| `/opt/pishro/.env` | تنظیمات محرمانه |
| `/opt/uploade` | آپلود محلی |
| `/opt/backups` | بکاپ‌ها |
| `/etc/nginx/sites-available/pishro` | پروکسی |
| لاگ PM2 | `pm2 logs pishro-app` |

---

برای درک لایه‌های کد به [STRUCTURE.md](./STRUCTURE.md) مراجعه کنید.
