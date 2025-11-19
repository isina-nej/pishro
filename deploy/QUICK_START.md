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

## 3️⃣ آماده‌سازی پروژه

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

## 4️⃣ ساخت فایل .env

```bash
# باز کردن ادیتور
nano .env
```

**محتوای فایل:** (اطلاعات خودت رو جایگذاری کن)

```env
DATABASE_URL="mongodb://username:password@host:port/pishro"

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

## 5️⃣ Build و Setup

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

## 6️⃣ راه‌اندازی پردازشگر ویدیو

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

## 7️⃣ راه‌اندازی Next.js

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

## 8️⃣ تست سیستم

```bash
npx tsx scripts/test-video-system.ts
```

---

## 🌐 باز کردن سایت

```
http://آدرس_IP_سرورت:3000
```

---

## 📊 دستورات مفید

### دیدن وضعیت
```bash
pm2 status                              # وضعیت Next.js
docker compose ps                       # وضعیت Docker
sudo systemctl status pishro-worker     # وضعیت Worker
```

### دیدن لاگ‌ها
```bash
pm2 logs pishro-app                     # لاگ Next.js
docker compose logs -f video-processor  # لاگ Worker (Docker)
sudo journalctl -u pishro-worker -f     # لاگ Worker (systemd)
```

### Restart کردن
```bash
pm2 restart pishro-app                  # Restart Next.js
docker compose restart video-processor  # Restart Worker (Docker)
sudo systemctl restart pishro-worker    # Restart Worker (systemd)
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
- [ ] پروژه clone شد (`cd /opt/pishro`)
- [ ] فایل .env ساخته شد (`ls -la .env`)
- [ ] Build موفق بود (`npm run build`)
- [ ] Worker راه افتاد (لاگ‌ها رو دیدم)
- [ ] Next.js راه افتاد (`pm2 status`)
- [ ] تست موفق بود (`npx tsx scripts/test-video-system.ts`)
- [ ] سایت باز میشه (`http://IP:3000`)

---

## ℹ️ راهنماهای بیشتر

- **مبتدی:** `deploy/BEGINNER_GUIDE.md` - راهنمای کامل قدم به قدم
- **تکنیکال:** `deploy/DEPLOYMENT_GUIDE.md` - جزئیات فنی کامل
- **چک‌لیست:** `deploy/SERVER_SETUP.md` - چک‌لیست نصب
- **خلاصه:** `deploy/README.md` - نمای کلی

---

**موفق باشی! 🚀**
