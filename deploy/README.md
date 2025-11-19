# 📂 Deployment Files

این پوشه شامل تمام فایل‌های لازم برای deploy و راه‌اندازی سیستم پردازش ویدیو پیشرو است.

---

## 🎯 کدوم راهنما رو بخونم؟

### 🆕 تازه کار هستی و تا حالا با SSH کار نکردی؟
👉 **شروع کن از:** [`BEGINNER_GUIDE.md`](./BEGINNER_GUIDE.md)

### ⚡ می‌خوای سریع راه‌اندازی کنی؟
👉 **ببین:** [`QUICK_START.md`](./QUICK_START.md) - تمام دستورات در یک صفحه

### 🔐 نمی‌دونی فایل .env رو چطور بسازی؟
👉 **راهنما:** [`ENV_SETUP_GUIDE.md`](./ENV_SETUP_GUIDE.md) - همه چیز درباره .env

### 🔧 Developer هستی و می‌خوای جزئیات فنی رو بدونی؟
👉 **مطالعه کن:** [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) - راهنمای کامل تکنیکال

---

## 📁 محتویات

### 1. **BEGINNER_GUIDE.md** 🎓 (جدید!)
راهنمای کامل برای مبتدیان که هیچ تجربه‌ای با SSH ندارن.

**شامل:**
- آموزش اتصال به سرور با SSH (Windows و Mac/Linux)
- توضیح قدم به قدم هر دستور
- راهنمای ساخت فایل .env از صفر
- عیب‌یابی مشکلات رایج
- نکات امنیتی ساده

**برای چه کسی:**
- کسانی که اولین بار سرور راه‌اندازی می‌کنند
- کسانی که با SSH آشنا نیستند
- کسانی که می‌خواهند هر مرحله رو به تفصیل بفهمند

**استفاده:**
```bash
cat deploy/BEGINNER_GUIDE.md
```

---

### 2. **QUICK_START.md** ⚡ (جدید!)
خلاصه تمام دستورات در یک صفحه - فقط کپی و پیست!

**شامل:**
- تمام دستورات به صورت آماده کپی
- بدون توضیحات اضافی
- مناسب برای مراجعه سریع

**برای چه کسی:**
- کسانی که قبلا سرور راه‌اندازی کردن
- کسانی که فقط به دستورات نیاز دارند

**استفاده:**
```bash
cat deploy/QUICK_START.md
```

---

### 3. **ENV_SETUP_GUIDE.md** 🔐 (جدید!)
راهنمای کامل ساخت و مدیریت فایل .env

**شامل:**
- توضیح .env چیه و چرا لازمه
- راهنمای دریافت اطلاعات از iranServer
- تولید AUTH_SECRET
- تست و عیب‌یابی .env
- نکات امنیتی

**برای چه کسی:**
- کسانی که نمی‌دونند .env چیه
- کسانی که نیاز به راهنما برای پر کردن .env دارند

**استفاده:**
```bash
cat deploy/ENV_SETUP_GUIDE.md
```

---

### 4. **DEPLOYMENT_GUIDE.md** 📚
راهنمای کامل و گام‌به‌گام برای deployment سیستم.

**شامل:**
- معماری سیستم
- پیش‌نیازها
- آماده‌سازی سرور
- نصب dependencies
- تنظیم Object Storage (iranServer)
- راه‌اندازی Worker
- تست و Monitoring
- عیب‌یابی
- نگهداری

**برای چه کسی:**
- Developers با تجربه
- کسانی که جزئیات فنی می‌خواهند

**استفاده:**
```bash
cat deploy/DEPLOYMENT_GUIDE.md
```

---

### 5. **SERVER_SETUP.md** ✅
چک‌لیست کامل نصب و تنظیم سرور.

**شامل:**
- نصب FFmpeg
- نصب Node.js 20
- نصب Docker
- ساخت دایرکتوری‌های موقت
- راه‌اندازی Worker (3 روش)
- تست سیستم
- تنظیمات Production

**استفاده:**
```bash
# مشاهده چک‌لیست
cat deploy/SERVER_SETUP.md
```

---

### 6. **setup-ubuntu.sh** 🚀
اسکریپت خودکار نصب dependencies در Ubuntu 20.04+.

**نصب می‌کند:**
- FFmpeg 4.2+
- Node.js 20 LTS
- Docker (اختیاری)
- ابزارهای کمکی (git, curl, wget, etc.)

**استفاده:**
```bash
# روی سرور اجرا کنید
sudo bash deploy/setup-ubuntu.sh
```

**زمان اجرا:** حدود 5-10 دقیقه

---

### 7. **systemd-worker.service** ⚙️
فایل systemd service برای اجرای Worker به صورت service.

**ویژگی‌ها:**
- اجرای خودکار در startup
- Restart خودکار در صورت خطا
- مدیریت با systemctl
- Logging با journald

**استفاده:**
```bash
# کپی کردن فایل
sudo cp deploy/systemd-worker.service /etc/systemd/system/pishro-worker.service

# راه‌اندازی service
sudo systemctl daemon-reload
sudo systemctl enable pishro-worker
sudo systemctl start pishro-worker

# بررسی وضعیت
sudo systemctl status pishro-worker

# مشاهده logs
sudo journalctl -u pishro-worker -f
```

---

## 🎯 شروع سریع

### گام 1: آماده‌سازی سرور
```bash
# اجرای اسکریپت نصب خودکار
sudo bash deploy/setup-ubuntu.sh
```

### گام 2: تنظیم پروژه
```bash
# Clone repository
git clone <repo-url> /opt/pishro
cd /opt/pishro

# نصب dependencies
npm install

# ایجاد .env
cp .env.example .env
nano .env  # تنظیم متغیرهای محیطی

# Build
npm run build
```

### گام 3: راه‌اندازی Worker

**روش A: Docker Compose (توصیه می‌شود)**
```bash
docker compose up -d video-processor
docker compose logs -f video-processor
```

**روش B: systemd Service**
```bash
sudo cp deploy/systemd-worker.service /etc/systemd/system/pishro-worker.service
sudo systemctl enable --now pishro-worker
sudo journalctl -u pishro-worker -f
```

**روش C: اجرای دستی (فقط تست)**
```bash
npx tsx scripts/video-processor-worker.ts
```

### گام 4: تست سیستم
```bash
npx tsx scripts/test-video-system.ts
```

---

## 📋 چک‌لیست Deployment

- [ ] سرور Ubuntu 20.04+ آماده است
- [ ] FFmpeg نصب شده (اجرای `setup-ubuntu.sh`)
- [ ] Node.js 20 نصب شده
- [ ] Docker نصب شده (اختیاری)
- [ ] Repository clone شده در `/opt/pishro`
- [ ] فایل `.env` با اطلاعات صحیح ساخته شده
- [ ] Dependencies نصب شده (`npm install`)
- [ ] Build موفق بوده (`npm run build`)
- [ ] Database متصل است
- [ ] Object Storage (iranServer S3) تنظیم شده ⏳
- [ ] Worker در حال اجرا است
- [ ] تست سیستم موفق بوده (`test-video-system.ts`)
- [ ] Next.js app در حال اجرا است (`pm2` یا `systemd`)

---

## 🔑 اطلاعات مورد نیاز

### ✅ در دسترس
- DATABASE_URL (MongoDB)
- AUTH_SECRET
- SMS credentials
- Payment gateway credentials

### ⏳ نیاز به دریافت از **iranServer**
```env
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="???"
S3_SECRET_ACCESS_KEY="???"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="???"
```

**وقتی این اطلاعات را دریافت کردید:**
1. فایل `.env` را ویرایش کنید
2. Worker را restart کنید
3. یک ویدیو تستی آپلود کنید
4. لذت ببرید! 🎉

---

## 🆘 پشتیبانی

### راهنماها
1. **DEPLOYMENT_GUIDE.md** - راهنمای کامل
2. **SERVER_SETUP.md** - چک‌لیست نصب

### عیب‌یابی
```bash
# Worker logs (Docker)
docker compose logs -f video-processor

# Worker logs (systemd)
sudo journalctl -u pishro-worker -f

# بررسی FFmpeg
ffmpeg -version

# تست سیستم
npx tsx scripts/test-video-system.ts

# بررسی فضای دیسک
df -h
```

### مشکلات رایج
| مشکل | راه‌حل |
|------|--------|
| Worker اجرا نمی‌شود | بررسی logs و FFmpeg |
| خطای اتصال به S3 | بررسی credentials در `.env` |
| خطای FFmpeg | `sudo apt-get install --reinstall ffmpeg` |
| فضای دیسک پر | پاکسازی `/tmp/video-processing` |

---

## 📞 گزارش مشکل

اگر مشکلی پیش آمد:
1. لاگ‌های خطا را بررسی کنید
2. اسکریپت تست را اجرا کنید
3. به GitHub Issues مراجعه کنید

---

**موفق باشید! 🚀**
