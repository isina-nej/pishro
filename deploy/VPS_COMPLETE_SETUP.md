# 🚀 راهنمای کامل راه‌اندازی سیستم پیشرو در VPS

> این راهنما برای کسانی است که می‌خواهند **تمام سیستم پیشرو** را در یک VPS راه‌اندازی کنند.
> شامل: **پروژه اصلی پیشرو** + **پنل مدیریت (CMS)** + **دیتابیس MongoDB** + **سیستم پردازش ویدیو**

---

## 📋 فهرست مطالب

1. [درباره این راهنما](#-درباره-این-راهنما)
2. [پیش‌نیازها](#-پیشنیازها)
3. [مرحله ۱: نصب و راه‌اندازی MongoDB](#-مرحله-۱-نصب-و-راهاندازی-mongodb)
4. [مرحله ۲: تنظیم و راه‌اندازی پروژه اصلی پیشرو](#-مرحله-۲-تنظیم-و-راهاندازی-پروژه-اصلی-پیشرو)
5. [مرحله ۳: راه‌اندازی پنل مدیریت (CMS)](#-مرحله-۳-راهاندازی-پنل-مدیریت-cms)
6. [مرحله ۴: راه‌اندازی سیستم پردازش ویدیو](#-مرحله-۴-راهاندازی-سیستم-پردازش-ویدیو)
7. [مرحله ۵: تست و بررسی نهایی](#-مرحله-۵-تست-و-بررسی-نهایی)
8. [راه‌اندازی خودکار با یک اسکریپت](#-راهاندازی-خودکار-با-یک-اسکریپت)
9. [مدیریت و نگهداری](#-مدیریت-و-نگهداری)
10. [عیب‌یابی](#-عیبیابی)

---

## 📖 درباره این راهنما

### چه چیزهایی راه‌اندازی می‌شود؟

1. **MongoDB Database**

   - دیتابیس اصلی برای پروژه پیشرو
   - دیتابیس جداگانه برای پنل مدیریت (CMS)
   - تنظیمات امنیتی و backup

2. **پروژه اصلی پیشرو**

   - سایت اصلی با Next.js
   - API های بکند
   - Authentication با OTP
   - پرداخت و سایر امکانات

3. **پنل مدیریت (CMS)**

   - پنل ادمین جداگانه
   - مدیریت محتوا، دوره‌ها، کاربران
   - گزارش‌گیری و آمار

4. **سیستم پردازش ویدیو**
   - تبدیل ویدیوها به فرمت HLS
   - آپلود به Object Storage
   - ویدیوهای غیرقابل دانلود

### چه کسانی می‌توانند از این راهنما استفاده کنند؟

- ✅ کسانی که تجربه کار با Terminal/Shell ندارند
- ✅ توسعه‌دهندگانی که می‌خواهند سریع شروع کنند
- ✅ افرادی که می‌خواهند همه چیز را یکجا راه‌اندازی کنند

### نکات مهم قبل از شروع

⚠️ **مهم:**

- این راهنما برای Ubuntu 20.04 یا بالاتر نوشته شده است
- همه دستورات را **دقیقاً** کپی و اجرا کنید
- اگر خطایی دیدید، به بخش [عیب‌یابی](#-عیبیابی) مراجعه کنید
- اطلاعات حساس (رمزها) را در جای امنی ذخیره کنید

---

## ✅ پیش‌نیازها

### ۱. سرور VPS

باید یک سرور VPS با مشخصات زیر داشته باشید:

- **سیستم‌عامل:** Ubuntu 20.04 یا بالاتر
- **RAM:** حداقل 4GB (توصیه: 8GB)
- **فضای دیسک:** حداقل 40GB (توصیه: 100GB)
- **CPU:** حداقل 2 Core
- **IP عمومی:** برای دسترسی از اینترنت

### ۲. دسترسی SSH

باید بتوانید به سرور خود با SSH وصل شوید:

```bash
ssh root@http://178.239.147.136/
```

یا اگر کاربر دیگری دارید:

```bash
ssh your_username@http://178.239.147.136/
```

### ۳. دامنه (Domain) - اختیاری

برای استفاده از SSL/HTTPS، یک دامنه نیاز دارید:

- دامنه را به IP سرورتان وصل کنید (تنظیمات DNS)
- اگر دامنه ندارید، می‌توانید با IP کار کنید (HTTP)

### ۴. حساب Object Storage (iranServer)

برای ذخیره ویدیوها نیاز دارید:

- یک حساب در iranServer
- یک Bucket ساخته باشید
- Access Key و Secret Key داشته باشید

**راهنما:** [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)

---

## 🗄️ مرحله ۱: نصب و راه‌اندازی MongoDB

MongoDB دیتابیس اصلی سیستم پیشرو است.

### گام ۱-۱: اتصال به سرور

```bash
# وصل شدن به سرور
ssh root@http://178.239.147.136/

# یا با کاربر خاص
ssh your_username@http://178.239.147.136/
```

### گام ۱-۲: بروزرسانی سیستم

```bash
# بروزرسانی لیست بسته‌ها
sudo apt-get update

# بروزرسانی سیستم
sudo apt-get upgrade -y
```

**⏱️ زمان تقریبی:** ۲-۵ دقیقه

### گام ۱-۳: نصب MongoDB

```bash
# نصب dependencies
sudo apt-get install -y gnupg curl

# اضافه کردن MongoDB public GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# ایجاد list file برای MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# بروزرسانی package database
sudo apt-get update

# نصب MongoDB
sudo apt-get install -y mongodb-org

# شروع MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# بررسی وضعیت
sudo systemctl status mongod
```

**✅ باید ببینید:** `active (running)` به رنگ سبز

**⏱️ زمان تقریبی:** ۵-۱۰ دقیقه

### گام ۱-۴: ساخت کاربر Admin در MongoDB

```bash
# وارد MongoDB shell شوید
mongosh

# در MongoDB shell این دستورات را اجرا کنید:
use admin

db.createUser({
  user: "admin",
  pwd: "sdfjkdsDFsd7943r8eDFA",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" }
  ]
})
```

**نکته:** `sdfjkdsDFsd7943r8eDFA` را با یک رمز قوی جایگزین کنید (حتماً ذخیره کنید!)

```bash
# خروج از MongoDB shell
exit
```

### گام ۱-۵: فعال‌سازی Authentication

```bash
# ویرایش فایل تنظیمات MongoDB
sudo nano /etc/mongod.conf
```

در انتهای فایل، این خطوط را اضافه کنید:

```yaml
security:
  authorization: enabled
```

**ذخیره فایل:**

- `Ctrl + O` → `Enter` → `Ctrl + X`

```bash
# Restart MongoDB
sudo systemctl restart mongod

# بررسی وضعیت
sudo systemctl status mongod
```

**✅ باید ببینید:** `active (running)` به رنگ سبز

### گام ۱-۶: ساخت دیتابیس و کاربر برای پروژه اصلی

```bash
# اتصال به MongoDB با کاربر admin
mongosh -u admin -p --authenticationDatabase admin

# رمز admin را وارد کنید
```

در MongoDB shell:

```javascript
// ساخت database و کاربر برای پروژه اصلی
use pishro

db.createUser({
  user: "pishro_user",
  pwd: "sdfjkdsDFsd7943r8eDFA",
  roles: [
    { role: "readWrite", db: "pishro" },
    { role: "dbAdmin", db: "pishro" }
  ]
})
```

**نکته:** `sdfjkdsDFsd7943r8eDFA` را با یک رمز قوی جایگزین کنید (ذخیره کنید!)

### گام ۱-۷: ساخت دیتابیس و کاربر برای پنل مدیریت

```javascript
// ساخت database و کاربر برای CMS
use pishro_admin

db.createUser({
  user: "pishro_admin_user",
  pwd: "CMS_DB_PASSWORD_456",
  roles: [
    { role: "readWrite", db: "pishro_admin" },
    { role: "dbAdmin", db: "pishro_admin" }
  ]
})
```

**نکته:** `CMS_DB_PASSWORD_456` را با یک رمز قوی جایگزین کنید (ذخیره کنید!)

```javascript
// خروج از MongoDB shell
exit;
```

### گام ۱-۸: تست اتصال

```bash
# تست اتصال به database پروژه اصلی
mongosh "mongodb://pishro_user:sdfjkdsDFsd7943r8eDFA@localhost:27017/pishro"

# اگر وارد shell شدید، یعنی موفق بودید!
# برای خروج:
exit

# تست اتصال به database CMS
mongosh "mongodb://pishro_admin_user:CMS_DB_PASSWORD_456@localhost:27017/pishro_admin"

# خروج:
exit
```

**✅ موفقیت:** اگر بدون خطا وارد shell شدید، MongoDB شما آماده است!

**⏱️ زمان کل مرحله ۱:** ۱۵-۲۰ دقیقه

---

## 🎯 مرحله ۲: تنظیم و راه‌اندازی پروژه اصلی پیشرو

### گام ۲-۱: نصب Node.js

```bash
# نصب Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی نصب
node --version  # باید v20.x.x نمایش دهد
npm --version
```

**⏱️ زمان تقریبی:** ۳-۵ دقیقه

### گام ۲-۲: نصب Git

```bash
# نصب Git
sudo apt-get install -y git

# بررسی نصب
git --version
```

### گام ۲-۳: Clone کردن پروژه

```bash
# ایجاد پوشه برای پروژه‌ها
sudo mkdir -p /opt/pishro

# تغییر مالکیت به کاربر فعلی
sudo chown -R $USER:$USER /opt/pishro

# Clone کردن پروژه اصلی
cd /opt
git clone https://github.com/amirhosseinself/pishro.git pishro

# رفتن به پوشه پروژه
cd /opt/pishro
```

**نکته:** آدرس repository را با آدرس واقعی پروژه خود جایگزین کنید.

**⏱️ زمان تقریبی:** ۲-۳ دقیقه

### گام ۲-۴: نصب Dependencies

```bash
# نصب packages
npm install
```

**⏱️ زمان تقریبی:** ۳-۵ دقیقه (بسته به سرعت اینترنت)

### گام ۲-۵: ساخت فایل .env

```bash
# کپی کردن فایل نمونه
cp .env.example .env

# ویرایش فایل .env
nano .env
```

محتوای فایل .env را به شکل زیر پر کنید:

```env
# ===========================================
# 🗄️ DATABASE
# ===========================================
DATABASE_URL="mongodb://pishro_user:sdfjkdsDFsd7943r8eDFA@localhost:27017/pishro"

# ===========================================
# ☁️ OBJECT STORAGE (iranServer S3)
# ===========================================
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="your-access-key-from-iranserver"
S3_SECRET_ACCESS_KEY="your-secret-key-from-iranserver"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://pishro-videos.s3.iran-server.com"

# ===========================================
# 📁 TEMP DIRECTORY
# ===========================================
TEMP_DIR="/tmp/video-processing"

# ===========================================
# ⚙️ NODE ENVIRONMENT
# ===========================================
NODE_ENV="production"

# ===========================================
# 🔐 AUTHENTICATION
# ===========================================
AUTH_SECRET="generate-this-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://http://178.239.147.136/:3000"

# ===========================================
# 📱 SMS PROVIDER (melipayamak)
# ===========================================
SMS_USERNAME="your-sms-username"
SMS_PASSWORD="your-sms-password"
SMS_FROM="your-sms-sender-number"

# ===========================================
# 💳 PAYMENT GATEWAY (ZarinPal)
# ===========================================
ZARINPAL_MERCHANT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
ZARINPAL_CALLBACK_URL="http://http://178.239.147.136/:3000/api/payment/verify"
```

**مهم:**

- `sdfjkdsDFsd7943r8eDFA` را با رمزی که در مرحله ۱ ساختید جایگزین کنید
- اطلاعات Object Storage را از پنل iranServer بگیرید
- `http://178.239.147.136/` را با IP سرور خود جایگزین کنید

**ساخت AUTH_SECRET:**

```bash
# در یک terminal دیگر اجرا کنید:
openssl rand -base64 32
```

خروجی را کپی کنید و در فایل .env قرار دهید.

**ذخیره فایل:**

- `Ctrl + O` → `Enter` → `Ctrl + X`

**⏱️ زمان تقریبی:** ۱۰-۱۵ دقیقه

### گام ۲-۶: راه‌اندازی Prisma و ساخت Database Schema

```bash
# Generate کردن Prisma Client
npx prisma generate

# Push کردن schema به MongoDB
npx prisma db push
```

**✅ باید ببینید:**

```
Your database is now in sync with your Prisma schema. Done in XXms
✔ Generated Prisma Client
```

**⏱️ زمان تقریبی:** ۲-۳ دقیقه

### گام ۲-۷: Build کردن پروژه

```bash
# Build کردن Next.js
npm run build
```

**⏱️ زمان تقریبی:** ۵-۱۰ دقیقه

### گام ۲-۸: نصب PM2 برای مدیریت پروسه

```bash
# نصب PM2 به صورت global
sudo npm install -g pm2

# بررسی نصب
pm2 --version
```

### گام ۲-۹: اجرای پروژه با PM2

```bash
# اجرای پروژه
pm2 start npm --name "pishro-app" -- start

# ذخیره لیست پروسه‌ها
pm2 save

# تنظیم startup script
pm2 startup

# دستور خروجی را کپی و اجرا کنید (شبیه این):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_user --hp /home/your_user
```

**بررسی وضعیت:**

```bash
pm2 status
pm2 logs pishro-app
```

**✅ موفقیت:** اگر وضعیت `online` است، پروژه شما در حال اجرا است!

**⏱️ زمان کل مرحله ۲:** ۳۰-۴۵ دقیقه

### تست پروژه اصلی

```bash
# تست سایت
curl http://localhost:3000
```

یا در مرورگر باز کنید:

```
http://http://178.239.147.136/:3000
```

---

## 👨‍💼 مرحله ۳: راه‌اندازی پنل مدیریت (CMS)

اگر پنل مدیریت شما در یک repository جداگانه است:

### گام ۳-۱: Clone کردن پروژه CMS

```bash
# Clone کردن پروژه CMS
cd /opt
git clone https://github.com/amirhosseinself/pishro-admin.git pishro-admin

# رفتن به پوشه
cd /opt/pishro-admin
```

### گام ۳-۲: نصب Dependencies

```bash
npm install
```

### گام ۳-۳: ساخت فایل .env

```bash
# کپی کردن فایل نمونه
cp .env.example .env

# ویرایش فایل .env
nano .env
```

محتوا (مشابه پروژه اصلی ولی با DATABASE_URL متفاوت):

```env
# ===========================================
# 🗄️ DATABASE (CMS Database)
# ===========================================
DATABASE_URL="mongodb://pishro_admin_user:CMS_DB_PASSWORD_456@localhost:27017/pishro_admin"

# سایر تنظیمات مشابه پروژه اصلی...
NODE_ENV="production"
AUTH_SECRET="generate-different-secret-for-cms"
NEXTAUTH_URL="http://http://178.239.147.136/:3001"
```

**نکته:** پورت CMS را `3001` قرار دهید تا با پروژه اصلی تداخل نداشته باشد.

**ذخیره فایل:** `Ctrl + O` → `Enter` → `Ctrl + X`

### گام ۳-۴: راه‌اندازی Prisma

```bash
npx prisma generate
npx prisma db push
```

### گام ۳-۵: Build و اجرا

```bash
# Build
npm run build

# اجرا با PM2
pm2 start npm --name "pishro-admin" -- start -- -p 3001

# ذخیره
pm2 save
```

**بررسی:**

```bash
pm2 status
```

**⏱️ زمان کل مرحله ۳:** ۲۰-۳۰ دقیقه

### تست پنل مدیریت

در مرورگر باز کنید:

```
http://http://178.239.147.136/:3001
```

---

## 🎬 مرحله ۴: راه‌اندازی سیستم پردازش ویدیو

### گام ۴-۱: نصب FFmpeg

```bash
# نصب FFmpeg
sudo apt-get install -y ffmpeg

# بررسی نصب
ffmpeg -version
ffprobe -version
```

**⏱️ زمان تقریبی:** ۲-۳ دقیقه

### گام ۴-۲: ایجاد پوشه موقت

```bash
# ایجاد پوشه برای فایل‌های موقت
sudo mkdir -p /tmp/video-processing
sudo chmod 777 /tmp/video-processing
```

### گام ۴-۳: نصب Docker و Docker Compose

```bash
# حذف نسخه‌های قدیمی
sudo apt-get remove docker docker-engine docker.io containerd runc

# نصب dependencies
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# اضافه کردن Docker repository
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# نصب Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# فعال‌سازی Docker
sudo systemctl enable docker
sudo systemctl start docker

# بررسی نصب
docker --version
docker compose version
```

**⏱️ زمان تقریبی:** ۵-۱۰ دقیقه

### گام ۴-۴: اجرای Video Processor با Docker

```bash
# رفتن به پوشه پروژه اصلی
cd /opt/pishro

# اجرای video processor
docker compose up -d video-processor

# بررسی وضعیت
docker compose ps

# مشاهده logs
docker compose logs -f video-processor
```

**✅ موفقیت:** اگر پیام `Starting video processor worker...` را دیدید، سیستم پردازش ویدیو در حال کار است!

**⏱️ زمان کل مرحله ۴:** ۱۵-۲۰ دقیقه

---

## ✅ مرحله ۵: تست و بررسی نهایی

### تست ۱: بررسی وضعیت MongoDB

```bash
# بررسی وضعیت MongoDB
sudo systemctl status mongod

# اتصال به MongoDB
mongosh -u admin -p --authenticationDatabase admin

# در MongoDB shell:
show dbs
exit
```

### تست ۲: بررسی پروژه اصلی و CMS

```bash
# بررسی وضعیت PM2
pm2 status

# باید دو پروسه ببینید:
# - pishro-app (online)
# - pishro-admin (online)
```

در مرورگر:

- پروژه اصلی: `http://http://178.239.147.136/:3000`
- پنل مدیریت: `http://http://178.239.147.136/:3001`

### تست ۳: بررسی سیستم پردازش ویدیو

```bash
# بررسی وضعیت Docker
docker compose ps

# مشاهده logs
docker compose logs video-processor
```

### تست ۴: اجرای اسکریپت تست کامل

```bash
cd /opt/pishro
npx tsx scripts/test-video-system.ts
```

این اسکریپت همه قسمت‌های سیستم را تست می‌کند.

---

## ⚡ راه‌اندازی خودکار با یک اسکریپت

اگر می‌خواهید تمام مراحل بالا را با یک دستور اجرا کنید:

```bash
# دانلود و اجرای اسکریپت راه‌اندازی خودکار
cd /opt/pishro
sudo bash deploy/auto-setup.sh
```

این اسکریپت:

1. MongoDB را نصب و تنظیم می‌کند
2. پروژه اصلی را راه‌اندازی می‌کند
3. پنل مدیریت را راه‌اندازی می‌کند
4. سیستم پردازش ویدیو را راه‌اندازی می‌کند
5. همه چیز را تست می‌کند

**⏱️ زمان تقریبی:** ۲۰-۳۰ دقیقه

---

## 🛠️ مدیریت و نگهداری

### دستورات مفید برای مدیریت روزانه

#### بررسی وضعیت سیستم

```bash
# بررسی MongoDB
sudo systemctl status mongod

# بررسی پروژه‌ها
pm2 status

# بررسی Docker
docker compose ps

# بررسی فضای دیسک
df -h
```

#### مشاهده Logs

```bash
# Logs پروژه اصلی
pm2 logs pishro-app

# Logs پنل مدیریت
pm2 logs pishro-admin

# Logs سیستم ویدیو
docker compose logs -f video-processor
```

#### Restart کردن سرویس‌ها

```bash
# Restart MongoDB
sudo systemctl restart mongod

# Restart پروژه اصلی
pm2 restart pishro-app

# Restart پنل مدیریت
pm2 restart pishro-admin

# Restart سیستم ویدیو
docker compose restart video-processor
```

#### بروزرسانی پروژه‌ها

```bash
# بروزرسانی پروژه اصلی
cd /opt/pishro
git pull
npm install
npm run build
pm2 restart pishro-app

# بروزرسانی پنل مدیریت
cd /opt/pishro-admin
git pull
npm install
npm run build
pm2 restart pishro-admin
```

### Backup خودکار

راهنمای کامل Backup: [MONGODB_SETUP.md](./MONGODB_SETUP.md#-backup-و-restore)

```bash
# Backup دستی
mongodump --uri="mongodb://pishro_user:PASSWORD@localhost:27017/pishro" --out=/backup/mongo-$(date +%Y%m%d)

# تنظیم Backup خودکار (Cron)
crontab -e

# اضافه کردن این خط برای backup روزانه ساعت 2 صبح:
0 2 * * * mongodump --uri="mongodb://pishro_user:PASSWORD@localhost:27017/pishro" --out=/backup/mongo-$(date +\%Y\%m\%d)
```

---

## 🐛 عیب‌یابی

### مشکل ۱: MongoDB شروع نمی‌شود

```bash
# بررسی logs
sudo tail -50 /var/log/mongodb/mongod.log

# بررسی پورت
sudo netstat -tulpn | grep 27017

# Restart
sudo systemctl restart mongod
```

### مشکل ۲: پروژه‌ها خطای Database می‌دهند

```bash
# بررسی connection string در .env
cd /opt/pishro
cat .env | grep DATABASE_URL

# تست اتصال
mongosh "$(cat .env | grep DATABASE_URL | cut -d'=' -f2 | tr -d '\"')"

# اگر اتصال برقرار شد:
exit

# Restart پروژه
pm2 restart pishro-app
```

### مشکل ۳: سیستم ویدیو کار نمی‌کند

```bash
# بررسی FFmpeg
which ffmpeg
ffmpeg -version

# بررسی logs
cd /opt/pishro
docker compose logs video-processor

# Restart
docker compose restart video-processor
```

### مشکل ۴: سایت باز نمی‌شود

```bash
# بررسی PM2
pm2 status

# بررسی پورت‌ها
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001

# بررسی firewall
sudo ufw status

# اگر بسته است، باز کنید:
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
```

### مشکل ۵: خطای "Out of Memory"

```bash
# بررسی مصرف حافظه
free -h

# محدود کردن مصرف MongoDB
sudo nano /etc/mongod.conf

# اضافه کردن:
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1

# Restart
sudo systemctl restart mongod
```

---

## 📚 منابع بیشتر

- **راهنمای MongoDB:** [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- **راهنمای تنظیم .env:** [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)
- **راهنمای SSL:** [SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md)
- **راهنمای سرور:** [SERVER_SETUP.md](./SERVER_SETUP.md)

---

## 📞 پشتیبانی

اگر با مشکلی مواجه شدید:

1. ابتدا بخش [عیب‌یابی](#-عیبیابی) را بخوانید
2. Logs را بررسی کنید
3. به داکیومنت‌های بالا مراجعه کنید
4. از GitHub Issues استفاده کنید

---

## ✅ چک‌لیست نهایی

پس از اتمام راه‌اندازی، این موارد را بررسی کنید:

- [ ] MongoDB نصب و در حال اجرا است
- [ ] دو database (pishro و pishro_admin) ساخته شده‌اند
- [ ] کاربرهای database با authentication ساخته شده‌اند
- [ ] پروژه اصلی build شده و با PM2 در حال اجرا است
- [ ] پنل مدیریت build شده و با PM2 در حال اجرا است
- [ ] سیستم پردازش ویدیو با Docker در حال اجرا است
- [ ] FFmpeg نصب شده است
- [ ] فایل‌های .env برای هر دو پروژه تنظیم شده‌اند
- [ ] Prisma schema در هر دو database push شده است
- [ ] تمام تست‌ها موفقیت‌آمیز بوده‌اند
- [ ] Backup خودکار تنظیم شده است
- [ ] Firewall تنظیم شده است

---

**🎉 تبریک! سیستم پیشرو شما با موفقیت راه‌اندازی شد!**

**موفق باشید! 🚀**
