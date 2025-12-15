# ⚡ راهنمای سریع راه‌اندازی - یک صفحه‌ای

> خلاصه کامل تمام دستورات - فقط کپی و پیست کن!

---

## 1️⃣ اتصال به سرور

```bash
ssh root@آدرس_IP_سرورت
```

---

## 2️⃣ نصب ابزارها (یک دستور)

```bash
cd /tmp && \
git clone https://github.com/amir-9/pishro.git && \
cd pishro && \
sudo bash deploy/setup-ubuntu.sh
```

وقتی پرسید "Install Docker?", بزن `y`

---

## 3️⃣ نصب MongoDB (بر روی سرور)

```bash
# نصب MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

# شروع MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**ایجاد کاربر و Database:**

```bash
# اتصال به MongoDB
mongosh
```

```javascript
// کاربر Admin
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

// Database CMS
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

**فعال کردن Authentication:**

```bash
sudo nano /etc/mongod.conf
```

اضافه کن:
```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

**جزئیات کامل:** `deploy/MONGODB_SETUP.md`

---

## 4️⃣ آماده‌سازی پروژه اصلی

```bash
# رفتن به پوشه مناسب
cd /opt

# دانلود پروژه
sudo git clone https://github.com/amir-9/pishro.git pishro
cd pishro

# دسترسی
sudo chown -R $USER:$USER /opt/pishro

# نصب بسته‌ها
npm install
```

---

## 5️⃣ ساخت فایل .env

```bash
# باز کردن ادیتور
nano .env
```

**محتوای فایل:** (اطلاعات خودت رو جایگذاری کن)

```env
# استفاده از MongoDB محلی
DATABASE_URL="mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro"

S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="از iranServer دریافت کن"
S3_SECRET_ACCESS_KEY="از iranServer دریافت کن"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://your-bucket.s3.iran-server.com"

TEMP_DIR="/tmp/video-processing"
NODE_ENV="production"

AUTH_SECRET="با دستور پایین تولید کن"
NEXTAUTH_URL="https://your-domain.com"

SMS_USERNAME="نام کاربری پیامک"
SMS_PASSWORD="رمز پیامک"
SMS_FROM="شماره فرستنده"

ZARINPAL_MERCHANT_ID="مرچنت آیدی"
ZARINPAL_CALLBACK_URL="https://your-domain.com/api/payment/verify"
```

**ذخیره:** `Ctrl + O` → `Enter` → `Ctrl + X`

**تولید AUTH_SECRET:**
```bash
openssl rand -base64 32
```
(خروجی رو کپی کن و در .env قرار بده)

---

## 6️⃣ Build و Setup

```bash
# ساخت دایرکتوری موقت
sudo mkdir -p /tmp/video-processing
sudo chmod 777 /tmp/video-processing

# راه‌اندازی دیتابیس
npx prisma generate
npx prisma db push

# Build
npm run build
```

---

## 7️⃣ راه‌اندازی پردازشگر ویدیو

**انتخاب کن یکی رو:**

### گزینه A: Docker (آسان‌تر)
```bash
docker compose up -d video-processor
docker compose logs -f video-processor
```

### گزینه B: systemd (پایدارتر)
```bash
sudo cp deploy/systemd-worker.service /etc/systemd/system/pishro-worker.service
sudo systemctl daemon-reload
sudo systemctl enable pishro-worker
sudo systemctl start pishro-worker
sudo journalctl -u pishro-worker -f
```

---

## 8️⃣ راه‌اندازی Next.js (پروژه اصلی)

```bash
# نصب PM2
sudo npm install -g pm2

# راه‌اندازی
pm2 start npm --name "pishro-app" -- start

# ذخیره و startup
pm2 save
pm2 startup
# دستوری که نشون میده رو اجرا کن

# چک کردن
pm2 status
```

---

## 9️⃣ Deploy پروژه CMS (اختیاری)

```bash
# دانلود CMS
cd /opt
sudo git clone https://github.com/amir-9/pishro-admin.git pishro-admin
cd pishro-admin
sudo chown -R $USER:$USER /opt/pishro-admin

# نصب
npm install

# ساخت .env
cp .env.example .env
nano .env
```

**محتوای .env برای CMS:**

```env
DATABASE_URL="mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"

# همان اطلاعات S3 پروژه اصلی
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="از iranServer دریافت کن"
S3_SECRET_ACCESS_KEY="از iranServer دریافت کن"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://your-bucket.s3.iran-server.com"

TEMP_DIR="/tmp/video-processing"
NODE_ENV="production"

# AUTH_SECRET متفاوت از پروژه اصلی
AUTH_SECRET="different-secret-for-cms-32-chars"
NEXTAUTH_URL="http://178.239.147.136:3001"

# همان اطلاعات SMS و Payment
SMS_USERNAME="نام کاربری پیامک"
SMS_PASSWORD="رمز پیامک"
SMS_FROM="شماره فرستنده"

ZARINPAL_MERCHANT_ID="مرچنت آیدی"
ZARINPAL_CALLBACK_URL="http://178.239.147.136:3001/api/payment/verify"
```

**Setup و راه‌اندازی CMS:**

```bash
# Setup database
npx prisma generate
npx prisma db push

# Build
npm run build

# راه‌اندازی با PM2 در پورت 3001
PORT=3001 pm2 start npm --name "pishro-cms" -- start
pm2 save

# باز کردن پورت
sudo ufw allow 3001/tcp
```

**جزئیات کامل CMS:** `deploy/CMS_DEPLOYMENT.md`

---

## 🔟 تست سیستم

```bash
npx tsx scripts/test-video-system.ts
```

---

## 🌐 باز کردن سایت‌ها

**پروژه اصلی:**
```
http://178.239.147.136:3000
```

**پنل مدیریت (CMS):**
```
http://178.239.147.136:3001
```

---

## 📊 دستورات مفید

### دیدن وضعیت
```bash
pm2 status                              # وضعیت Next.js (هر دو پروژه)
docker compose ps                       # وضعیت Docker
sudo systemctl status pishro-worker     # وضعیت Worker
sudo systemctl status mongod            # وضعیت MongoDB
```

### دیدن لاگ‌ها
```bash
pm2 logs pishro-app                     # لاگ پروژه اصلی
pm2 logs pishro-cms                     # لاگ CMS
docker compose logs -f video-processor  # لاگ Worker (Docker)
sudo journalctl -u pishro-worker -f     # لاگ Worker (systemd)
sudo tail -f /var/log/mongodb/mongod.log # لاگ MongoDB
```

### Restart کردن
```bash
pm2 restart pishro-app                  # Restart پروژه اصلی
pm2 restart pishro-cms                  # Restart CMS
docker compose restart video-processor  # Restart Worker (Docker)
sudo systemctl restart pishro-worker    # Restart Worker (systemd)
sudo systemctl restart mongod           # Restart MongoDB
```

### چک کردن منابع
```bash
df -h       # فضای دیسک
htop        # CPU و RAM
```

---

## 🔧 عیب‌یابی سریع

### خطای FFmpeg
```bash
sudo apt-get install --reinstall ffmpeg
ffmpeg -version
```

### خطای اتصال به دیتابیس
```bash
cat .env | grep DATABASE_URL
```

### سایت باز نمیشه
```bash
pm2 restart pishro-app
pm2 logs pishro-app
```

### Worker کار نمی‌کنه
```bash
# Docker
docker compose restart video-processor
docker compose logs video-processor

# systemd
sudo systemctl restart pishro-worker
sudo journalctl -u pishro-worker -n 50
```

### پاکسازی فضا
```bash
sudo rm -rf /tmp/video-processing/*
docker system prune -a
```

---

## 🔒 امنیت (مهم!)

```bash
# فایروال
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# SSL (اگه دامنه داری)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🎯 چک‌لیست سریع

- [ ] به سرور SSH کردم
- [ ] FFmpeg و Node.js نصب شدن (`ffmpeg -version` و `node -v`)
- [ ] MongoDB نصب و راه‌اندازی شد (`sudo systemctl status mongod`)
- [ ] Database و کاربرها ساخته شدن
- [ ] پروژه اصلی clone شد (`cd /opt/pishro`)
- [ ] فایل .env پروژه اصلی ساخته شد
- [ ] Build پروژه اصلی موفق بود (`npm run build`)
- [ ] Worker راه افتاد (لاگ‌ها رو دیدم)
- [ ] پروژه اصلی راه افتاد (`pm2 status`)
- [ ] (اختیاری) پروژه CMS clone و راه‌اندازی شد
- [ ] تست موفق بود (`npx tsx scripts/test-video-system.ts`)
- [ ] سایت اصلی باز میشه (`http://178.239.147.136:3000`)
- [ ] (اختیاری) CMS باز میشه (`http://178.239.147.136:3001`)

---

## ℹ️ راهنماهای بیشتر

- **نصب MongoDB:** `deploy/MONGODB_SETUP.md` - راهنمای کامل MongoDB
- **Deploy CMS:** `deploy/CMS_DEPLOYMENT.md` - راهنمای کامل پنل مدیریت
- **مبتدی:** `deploy/BEGINNER_GUIDE.md` - راهنمای کامل قدم به قدم
- **تکنیکال:** `deploy/DEPLOYMENT_GUIDE.md` - جزئیات فنی کامل
- **چک‌لیست:** `deploy/SERVER_SETUP.md` - چک‌لیست نصب
- **خلاصه:** `deploy/README.md` - نمای کلی

---

**موفق باشی! 🚀**
