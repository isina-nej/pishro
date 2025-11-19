# 📚 راهنمای کامل Deployment سیستم پیشرو

این راهنما مراحل کامل راه‌اندازی سیستم پردازش ویدیو در سرور Ubuntu 20.04+ را شرح می‌دهد.

---

## 📋 فهرست مطالب

1. [معماری سیستم](#معماری-سیستم)
2. [پیش‌نیازها](#پیش‌نیازها)
3. [آماده‌سازی سرور](#آماده‌سازی-سرور)
4. [نصب Dependencies](#نصب-dependencies)
5. [نصب و تنظیم MongoDB](#نصب-و-تنظیم-mongodb)
6. [تنظیم Object Storage](#تنظیم-object-storage)
7. [Deploy کردن پروژه اصلی](#deploy-کردن-پروژه-اصلی)
8. [Deploy کردن پروژه CMS](#deploy-کردن-پروژه-cms)
9. [راه‌اندازی Worker](#راه‌اندازی-worker)
10. [تست و Monitoring](#تست-و-monitoring)
11. [عیب‌یابی](#عیب‌یابی)
12. [نگهداری](#نگهداری)

---

## 🏗️ معماری سیستم

سیستم پیشرو شامل دو پروژه اصلی است که در یک سرور اجرا می‌شوند:

```
┌────────────────────────────────────────────────┐
│            Server: 178.239.147.136             │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Main Site       │  │  CMS Panel       │   │
│  │  (Port 3000)     │  │  (Port 3001)     │   │
│  │  User Frontend   │  │  Admin Panel     │   │
│  └────────┬─────────┘  └────────┬─────────┘   │
│           │                     │             │
│           └──────────┬──────────┘             │
│                      │                        │
│           ┌──────────▼──────────┐             │
│           │      MongoDB        │             │
│           │   (Port 27017)      │             │
│           │                     │             │
│           │  DB: pishro         │  ← Main    │
│           │  DB: pishro_admin   │  ← CMS     │
│           └──────────┬──────────┘             │
│                      │                        │
│           ┌──────────▼──────────┐             │
│           │  Object Storage     │             │
│           │  (iranServer S3)    │             │
│           └──────────┬──────────┘             │
│                      │                        │
│           ┌──────────▼──────────┐             │
│           │   Video Worker      │             │
│           │  (FFmpeg Processing)│             │
│           └─────────────────────┘             │
│                                                │
└────────────────────────────────────────────────┘
```

**جریان کار:**
1. کاربر ویدیو را آپلود می‌کند → ذخیره در Object Storage
2. وضعیت ویدیو در Database به `UPLOADED` تغییر می‌کند
3. Worker ویدیوهای `UPLOADED` را پیدا کرده و با FFmpeg پردازش می‌کند
4. فایل‌های HLS به Object Storage آپلود می‌شوند
5. وضعیت ویدیو به `READY` تغییر می‌کند

---

## 🔧 پیش‌نیازها

### الزامات سرور

| مورد | حداقل | توصیه شده |
|------|-------|-----------|
| CPU | 2 Cores | 4+ Cores |
| RAM | 2 GB | 4+ GB |
| Storage | 20 GB | 50+ GB SSD |
| OS | Ubuntu 20.04 | Ubuntu 22.04 LTS |
| Network | 100 Mbps | 1 Gbps |

### نرم‌افزارها
- Ubuntu 20.04+
- FFmpeg 4.2+
- Node.js 20 LTS
- Docker 20+ (اختیاری)
- Git

### سرویس‌های خارجی
- ✅ **MongoDB** (Atlas یا self-hosted)
- ⏳ **iranServer Object Storage** (اطلاعات S3 از شما نیاز داریم)

---

## 🖥️ آماده‌سازی سرور

### 1. اتصال به سرور

```bash
ssh user@your-server-ip
```

### 2. بروزرسانی سیستم

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 3. ایجاد کاربر (اختیاری اما توصیه می‌شود)

```bash
# ایجاد کاربر جدید
sudo adduser pishro
sudo usermod -aG sudo pishro

# تنظیم SSH key برای کاربر جدید
sudo mkdir -p /home/pishro/.ssh
sudo cp ~/.ssh/authorized_keys /home/pishro/.ssh/
sudo chown -R pishro:pishro /home/pishro/.ssh
sudo chmod 700 /home/pishro/.ssh
sudo chmod 600 /home/pishro/.ssh/authorized_keys

# سوییچ به کاربر جدید
su - pishro
```

---

## 📦 نصب Dependencies

### گزینه A: نصب خودکار (توصیه می‌شود)

```bash
# دانلود پروژه
cd /tmp
git clone https://github.com/amir-9/pishro.git
cd pishro

# اجرای اسکریپت نصب
sudo bash deploy/setup-ubuntu.sh
```

اسکریپت بالا به صورت خودکار موارد زیر را نصب می‌کند:
- ✅ FFmpeg
- ✅ Node.js 20 LTS
- ✅ Docker (با سوال از شما)
- ✅ ابزارهای کمکی

### گزینه B: نصب دستی

مراجعه کنید به: [SERVER_SETUP.md](./SERVER_SETUP.md)

### تایید نصب

```bash
# بررسی FFmpeg
ffmpeg -version
ffprobe -version

# بررسی Node.js
node --version    # باید v20.x.x باشد
npm --version

# بررسی Docker (اگر نصب کردید)
docker --version
```

---

## 🗄️ نصب و تنظیم MongoDB

### چرا MongoDB روی سرور؟

برای استفاده در production، توصیه می‌شود MongoDB را روی همان سرور نصب کنید تا:
- ✅ اتصال سریع‌تر و کم‌تاخیر باشد
- ✅ هزینه‌های خدمات ابری کاهش یابد
- ✅ کنترل کامل بر database داشته باشید

### نصب سریع

```bash
# برای جزئیات کامل، مراجعه کنید به: deploy/MONGODB_SETUP.md

# نصب MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

# شروع MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# بررسی وضعیت
sudo systemctl status mongod
```

### ایجاد کاربر Admin

```bash
mongosh
```

```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "your-very-secure-password",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" }
  ]
})

exit
```

### فعال‌سازی Authentication

```bash
sudo nano /etc/mongod.conf
```

اضافه کردن:
```yaml
security:
  authorization: enabled

net:
  port: 27017
  bindIp: 127.0.0.1
```

```bash
sudo systemctl restart mongod
```

### ایجاد Database برای پروژه اصلی

```bash
mongosh -u admin -p --authenticationDatabase admin
```

```javascript
// Database پروژه اصلی
use pishro

db.createUser({
  user: "pishro_user",
  pwd: "pishro-secure-password-123",
  roles: [
    { role: "readWrite", db: "pishro" },
    { role: "dbAdmin", db: "pishro" }
  ]
})
```

### ایجاد Database برای CMS

```javascript
// Database پروژه CMS
use pishro_admin

db.createUser({
  user: "pishro_admin_user",
  pwd: "cms-secure-password-456",
  roles: [
    { role: "readWrite", db: "pishro_admin" },
    { role: "dbAdmin", db: "pishro_admin" }
  ]
})

exit
```

### تست اتصال

```bash
# تست پروژه اصلی
mongosh "mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro"

# تست CMS
mongosh "mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"
```

**⚠️ مهم:** رمزهای عبور قوی انتخاب کنید و در جای امن ذخیره کنید.

**📚 راهنمای کامل:** برای جزئیات بیشتر، به `deploy/MONGODB_SETUP.md` مراجعه کنید.

---

## 🗄️ تنظیم Object Storage (iranServer)

### اطلاعات مورد نیاز

برای راه‌اندازی سیستم، به اطلاعات زیر از **iranServer** نیاز دارید:

```
✅ S3 Endpoint     : https://s3.iran-server.com (یا آدرس خاص شما)
✅ Region          : default (یا region خاص شما)
⏳ Access Key ID   : (باید از iranServer دریافت کنید)
⏳ Secret Access Key: (باید از iranServer دریافت کنید)
✅ Bucket Name     : pishro-videos (یا نام دلخواه شما)
✅ Public URL      : https://your-bucket.s3.iran-server.com
```

### مراحل دریافت اطلاعات از iranServer

1. وارد پنل iranServer شوید
2. به بخش Object Storage بروید
3. Bucket جدید ایجاد کنید (یا از bucket موجود استفاده کنید)
4. Access Key و Secret Key ایجاد کنید
5. Endpoint URL را یادداشت کنید

### ساخت Bucket (اگر ندارید)

می‌توانید از AWS CLI یا Web Panel استفاده کنید:

```bash
# اگر AWS CLI نصب کردید
aws s3 mb s3://pishro-videos --endpoint-url https://s3.iran-server.com

# تنظیم دسترسی عمومی برای فایل‌های HLS
aws s3api put-bucket-policy --bucket pishro-videos \
  --policy '{"Version":"2012-10-17","Statement":[{"Sid":"PublicRead","Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::pishro-videos/*"}]}' \
  --endpoint-url https://s3.iran-server.com
```

---

## 🚀 Deploy کردن پروژه اصلی

### 1. Clone کردن Repository

```bash
# انتقال به دایرکتوری مناسب
cd /opt

# Clone پروژه
sudo git clone https://github.com/amir-9/pishro.git pishro
cd pishro

# تغییر مالکیت (اگر با کاربر دیگری کار می‌کنید)
sudo chown -R $USER:$USER /opt/pishro
```

### 2. نصب Dependencies

```bash
npm install
```

### 3. ایجاد فایل `.env`

```bash
nano .env
```

**محتوای فایل `.env`:**

```env
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="mongodb://username:password@host:port/pishro"

# ===========================================
# OBJECT STORAGE (iranServer S3)
# ===========================================
# ⚠️ این اطلاعات را باید از iranServer دریافت کنید
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="YOUR_ACCESS_KEY_HERE"
S3_SECRET_ACCESS_KEY="YOUR_SECRET_KEY_HERE"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://your-bucket.s3.iran-server.com"

# ===========================================
# TEMP DIRECTORY
# ===========================================
TEMP_DIR="/tmp/video-processing"

# ===========================================
# NODE ENVIRONMENT
# ===========================================
NODE_ENV="production"

# ===========================================
# AUTH (برای Next.js)
# ===========================================
AUTH_SECRET="your-random-secret-key-at-least-32-characters-long"
NEXTAUTH_URL="https://your-domain.com"

# ===========================================
# SMS PROVIDER (melipayamak)
# ===========================================
SMS_USERNAME="your-sms-username"
SMS_PASSWORD="your-sms-password"
SMS_FROM="your-sms-number"

# ===========================================
# PAYMENT (ZarinPal)
# ===========================================
ZARINPAL_MERCHANT_ID="your-merchant-id"
ZARINPAL_CALLBACK_URL="https://your-domain.com/api/payment/verify"
```

**تولید AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. ایجاد دایرکتوری‌های موقت

```bash
sudo mkdir -p /tmp/video-processing
sudo chmod 777 /tmp/video-processing
```

### 5. Setup Database (Prisma)

```bash
# اجرای migrations
npx prisma generate
npx prisma db push

# (اختیاری) اجرای seeders
npm run seed
```

### 6. Build کردن پروژه

```bash
npm run build
```

اگر خطایی وجود نداشت، پروژه آماده deployment است.

### 7. تست اجرای Next.js

```bash
# اجرای به صورت موقت
npm start

# یا با PM2 (توصیه می‌شود)
npm install -g pm2
pm2 start npm --name "pishro-app" -- start
pm2 save
pm2 startup
```

---

## 🎨 Deploy کردن پروژه CMS

حالا که پروژه اصلی آماده است، پنل مدیریت (CMS) را در پورت 3001 راه‌اندازی می‌کنیم.

### 1. Clone کردن Repository CMS

```bash
cd /opt
sudo git clone https://github.com/amir-9/pishro-admin.git pishro-admin
cd pishro-admin
sudo chown -R $USER:$USER /opt/pishro-admin
```

### 2. نصب Dependencies

```bash
npm install
```

### 3. ایجاد فایل `.env` برای CMS

```bash
cp .env.example .env
nano .env
```

**محتوای فایل `.env` برای CMS:**

```env
# Database جداگانه برای CMS
DATABASE_URL="mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"

# همان Object Storage
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="YOUR_ACCESS_KEY_HERE"
S3_SECRET_ACCESS_KEY="YOUR_SECRET_KEY_HERE"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://your-bucket.s3.iran-server.com"

TEMP_DIR="/tmp/video-processing"
NODE_ENV="production"

# AUTH_SECRET متفاوت از پروژه اصلی
AUTH_SECRET="different-secret-key-for-cms-32-characters-long"
NEXTAUTH_URL="http://178.239.147.136:3001"

# همان اطلاعات SMS و Payment
SMS_USERNAME="your-sms-username"
SMS_PASSWORD="your-sms-password"
SMS_FROM="your-sms-number"

ZARINPAL_MERCHANT_ID="your-merchant-id"
ZARINPAL_CALLBACK_URL="http://178.239.147.136:3001/api/payment/verify"
```

**نکات مهم:**
- ✅ `DATABASE_URL` به database جداگانه اشاره کند (`pishro_admin`)
- ✅ `AUTH_SECRET` متفاوت از پروژه اصلی باشد
- ✅ `NEXTAUTH_URL` پورت 3001 داشته باشد

### 4. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Build

```bash
npm run build
```

### 6. راه‌اندازی با PM2

```bash
PORT=3001 pm2 start npm --name "pishro-cms" -- start
pm2 save
```

### 7. بررسی وضعیت

```bash
pm2 status
# باید هر دو پروژه در حال اجرا باشند:
# - pishro-app (پورت 3000)
# - pishro-cms (پورت 3001)
```

### 8. باز کردن پورت 3001 در Firewall (اگر نیاز است)

```bash
sudo ufw allow 3001/tcp
```

**🎉 تبریک!** هر دو پروژه در حال اجرا هستند:
- Main Site: `http://178.239.147.136:3000`
- CMS Panel: `http://178.239.147.136:3001`

**📚 راهنمای کامل CMS:** برای جزئیات بیشتر، مانند تنظیم Nginx و subdomain، به `deploy/CMS_DEPLOYMENT.md` مراجعه کنید.

---

## 🎬 راه‌اندازی Worker

Worker مسئول پردازش ویدیوها با FFmpeg است. سه روش برای اجرای آن داریم:

### روش 1: Docker Compose (توصیه می‌شود) ⭐

**مزایا:**
- ✅ راحت‌ترین روش
- ✅ ایزوله از سیستم اصلی
- ✅ مدیریت آسان
- ✅ خودکار restart در صورت خطا

```bash
# شروع worker
docker compose up -d video-processor

# مشاهده logs
docker compose logs -f video-processor

# توقف worker
docker compose stop video-processor

# restart worker
docker compose restart video-processor

# حذف کامل
docker compose down
```

### روش 2: systemd Service

**مزایا:**
- ✅ Native به سیستم عامل
- ✅ مدیریت با systemctl
- ✅ اجرای خودکار در startup

**مراحل:**

```bash
# 1. کپی کردن service file
sudo cp deploy/systemd-worker.service /etc/systemd/system/pishro-worker.service

# 2. ویرایش مسیرها (در صورت نیاز)
sudo nano /etc/systemd/system/pishro-worker.service

# تغییرات احتمالی:
# - WorkingDirectory: مسیر پروژه
# - User: کاربر اجرا کننده
# - EnvironmentFile: مسیر فایل .env

# 3. راه‌اندازی service
sudo systemctl daemon-reload
sudo systemctl enable pishro-worker
sudo systemctl start pishro-worker

# 4. بررسی وضعیت
sudo systemctl status pishro-worker

# 5. مشاهده logs
sudo journalctl -u pishro-worker -f
```

**دستورات مفید:**

```bash
# شروع
sudo systemctl start pishro-worker

# توقف
sudo systemctl stop pishro-worker

# Restart
sudo systemctl restart pishro-worker

# غیرفعال کردن (از startup)
sudo systemctl disable pishro-worker

# مشاهده logs (50 خط آخر)
sudo journalctl -u pishro-worker -n 50

# مشاهده live logs
sudo journalctl -u pishro-worker -f
```

### روش 3: اجرای دستی (فقط برای تست)

```bash
cd /opt/pishro
npx tsx scripts/video-processor-worker.ts
```

این روش فقط برای تست است و در صورت قطع SSH متوقف می‌شود.

---

## 🧪 تست و Monitoring

### 1. اجرای اسکریپت تست

```bash
cd /opt/pishro
npx tsx scripts/test-video-system.ts
```

این اسکریپت موارد زیر را بررسی می‌کند:
- ✅ اتصال به MongoDB
- ✅ اتصال به Object Storage (S3)
- ✅ وجود FFmpeg و ffprobe
- ✅ دسترسی به دایرکتوری موقت
- ✅ متغیرهای محیطی

### 2. تست دستی ویدیو

یک ویدیو کوچک از طریق UI آپلود کنید و مراحل زیر را دنبال کنید:

```bash
# 1. مشاهده logs برای پیدا کردن videoId
docker compose logs -f video-processor
# یا
sudo journalctl -u pishro-worker -f

# 2. بررسی database
mongo
use pishro
db.videos.find({ processingStatus: "PROCESSING" })
db.videos.find({ processingStatus: "READY" })

# 3. بررسی فایل‌های S3
# وارد پنل iranServer شوید و bucket را بررسی کنید
```

### 3. Monitoring با htop

```bash
sudo apt-get install -y htop
htop
```

در htop می‌توانید مصرف CPU و RAM را ببینید.

### 4. Monitoring Logs

```bash
# Next.js logs (با PM2)
pm2 logs pishro-app

# Worker logs (Docker)
docker compose logs -f video-processor

# Worker logs (systemd)
sudo journalctl -u pishro-worker -f

# Nginx logs (اگر استفاده می‌کنید)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 5. بررسی فضای دیسک

```bash
# کل دیسک
df -h

# دایرکتوری موقت
du -sh /tmp/video-processing

# پاکسازی فایل‌های قدیمی (بالای 7 روز)
find /tmp/video-processing -type f -mtime +7 -delete
```

---

## 🔍 عیب‌یابی

### مشکل: Worker اجرا نمی‌شود

**علل احتمالی:**
1. FFmpeg نصب نیست
2. Node.js نصب نیست یا نسخه قدیمی است
3. Environment variables اشتباه هستند
4. دسترسی به دایرکتوری موقت وجود ندارد

**راه‌حل:**
```bash
# بررسی FFmpeg
ffmpeg -version
ffprobe -version

# بررسی Node.js
node --version  # باید v20.x.x باشد

# بررسی logs
docker compose logs video-processor
# یا
sudo journalctl -u pishro-worker -n 50

# بررسی دایرکتوری موقت
ls -la /tmp/video-processing
```

### مشکل: خطای اتصال به S3

**علل احتمالی:**
1. Credentials اشتباه هستند
2. Endpoint نادرست است
3. Bucket وجود ندارد
4. Network issue

**راه‌حل:**
```bash
# بررسی environment variables
env | grep S3

# تست اتصال دستی
npx tsx scripts/test-video-system.ts

# بررسی اتصال شبکه
curl -I https://s3.iran-server.com
```

### مشکل: خطای FFmpeg

**علل احتمالی:**
1. فرمت ویدیو پشتیبانی نمی‌شود
2. فایل خراب است
3. فضای دیسک پر است
4. FFmpeg به درستی نصب نیست

**راه‌حل:**
```bash
# تست FFmpeg با فایل نمونه
ffmpeg -i /path/to/sample.mp4 -c:v libx264 -c:a aac output.mp4

# بررسی فضای دیسک
df -h

# نصب مجدد FFmpeg
sudo apt-get install --reinstall ffmpeg
```

### مشکل: فضای دیسک پر است

**راه‌حل:**
```bash
# بررسی فضا
df -h

# پیدا کردن بزرگترین فایل‌ها
du -ah / | sort -rh | head -n 20

# پاکسازی دایرکتوری موقت
sudo rm -rf /tmp/video-processing/*

# پاکسازی Docker (اگر استفاده می‌کنید)
docker system prune -a --volumes

# پاکسازی logs قدیمی
sudo journalctl --vacuum-time=7d
```

### مشکل: Database connection error

**راه‌حل:**
```bash
# بررسی DATABASE_URL در .env
cat .env | grep DATABASE_URL

# تست اتصال به MongoDB
mongo "mongodb://username:password@host:port/pishro"

# یا با mongosh
mongosh "mongodb://username:password@host:port/pishro"
```

---

## 🛠️ نگهداری

### Backup منظم

#### 1. Backup از Database
```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/pishro" --out=/backup/mongo-$(date +%Y%m%d)

# فشرده‌سازی
tar -czf /backup/mongo-$(date +%Y%m%d).tar.gz /backup/mongo-$(date +%Y%m%d)
```

#### 2. Backup از .env
```bash
cp /opt/pishro/.env /backup/env-$(date +%Y%m%d).backup
```

#### 3. Backup خودکار با Cron
```bash
# ویرایش crontab
crontab -e

# اضافه کردن (هر شب ساعت 2)
0 2 * * * mongodump --uri="YOUR_MONGO_URI" --out=/backup/mongo-$(date +\%Y\%m\%d) && tar -czf /backup/mongo-$(date +\%Y\%m\%d).tar.gz /backup/mongo-$(date +\%Y\%m\%d)
```

### بروزرسانی پروژه

```bash
cd /opt/pishro

# دانلود آخرین تغییرات
git pull origin main

# نصب dependencies جدید
npm install

# اجرای migrations
npx prisma generate
npx prisma db push

# Build مجدد
npm run build

# Restart services
pm2 restart pishro-app
docker compose restart video-processor
# یا
sudo systemctl restart pishro-worker
```

### بروزرسانی سیستم

```bash
# هر هفته یا ماه
sudo apt-get update
sudo apt-get upgrade -y

# بروزرسانی Node.js (در صورت نیاز)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# بروزرسانی npm
sudo npm install -g npm@latest
```

### پاکسازی منظم

```bash
# پاکسازی فایل‌های موقت (روزانه)
find /tmp/video-processing -type f -mtime +1 -delete

# پاکسازی logs قدیمی (هفتگی)
sudo journalctl --vacuum-time=7d

# پاکسازی Docker (ماهانه، اگر استفاده می‌کنید)
docker system prune -a
```

### نظارت بر عملکرد

```bash
# بررسی CPU و RAM
htop

# بررسی فضای دیسک
df -h

# بررسی uptime
uptime

# بررسی وضعیت services
systemctl status pishro-worker
pm2 status
docker compose ps
```

---

## 📊 مانیتورینگ پیشرفته (اختیاری)

### نصب Prometheus + Grafana

برای نظارت حرفه‌ای می‌توانید از Prometheus و Grafana استفاده کنید:

```bash
# استفاده از Docker Compose
# فایل docker-compose.monitoring.yml را در پروژه قرار دهید
```

### نصب Uptime Monitoring

از سرویس‌های رایگان مثل:
- UptimeRobot
- Pingdom
- StatusCake

---

## 🔐 امنیت

### تنظیمات Firewall

```bash
# نصب UFW
sudo apt-get install -y ufw

# تنظیمات پایه
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# فعال‌سازی
sudo ufw enable
sudo ufw status
```

### تنظیم SSL با Let's Encrypt

```bash
# نصب certbot
sudo apt-get install -y certbot python3-certbot-nginx

# دریافت گواهینامه
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# تست تمدید خودکار
sudo certbot renew --dry-run
```

### بروزرسانی‌های امنیتی

```bash
# فعال‌سازی automatic security updates
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📞 پشتیبانی

### مستندات بیشتر
- [SERVER_SETUP.md](./SERVER_SETUP.md) - چک‌لیست نصب
- [Repository Issues](https://github.com/amir-9/pishro/issues) - گزارش مشکل

### اطلاعات مورد نیاز برای گزارش مشکل
1. نسخه سیستم عامل: `lsb_release -a`
2. نسخه Node.js: `node --version`
3. نسخه FFmpeg: `ffmpeg -version | head -n1`
4. Logs: خطاهای موجود در logs
5. Environment: متغیرهای محیطی (بدون credentials)

---

## ✅ خلاصه

پس از اتمام این راهنما:
- ✅ سرور شما آماده است
- ✅ FFmpeg نصب شده
- ✅ Next.js app در حال اجراست
- ✅ Worker در حال پردازش ویدیوهاست
- ✅ Object Storage متصل است
- ✅ سیستم مانیتور می‌شود

**تنها چیز باقی‌مانده: دریافت اطلاعات S3 از iranServer** ⏳

وقتی اطلاعات را دریافت کردید:
1. فایل `.env` را ویرایش کنید
2. Worker را restart کنید
3. یک ویدیو تستی آپلود کنید
4. لذت ببرید! 🎉

---

**موفق باشید! 🚀**
