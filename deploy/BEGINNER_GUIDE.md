# 🚀 راهنمای راه‌اندازی سایت برای مبتدیان

> این راهنما برای کسانی است که تا حالا با SSH کار نکردن! همه چیز رو قدم به قدم توضیح میدیم 😊

---

## 📋 فهرست

1. [قبل از شروع: چیزایی که باید داشته باشی](#1-قبل-از-شروع-چیزایی-که-باید-داشته-باشی)
2. [اتصال به سرور (SSH)](#2-اتصال-به-سرور-ssh)
3. [نصب ابزارهای لازم](#3-نصب-ابزارهای-لازم)
4. [آماده کردن پروژه](#4-آماده-کردن-پروژه)
5. [ساخت فایل .env (مهم!)](#5-ساخت-فایل-env-مهم)
6. [نصب و راه‌اندازی](#6-نصب-و-راه‌اندازی)
7. [راه‌اندازی پردازشگر ویدیو](#7-راه‌اندازی-پردازشگر-ویدیو)
8. [راه‌اندازی Next.js](#8-راه‌اندازی-nextjs)
9. [تست سیستم](#9-تست-سیستم)
10. [مشکلات رایج و حل اونها](#10-مشکلات-رایج-و-حل-اونها)

---

## 1. قبل از شروع: چیزایی که باید داشته باشی

### ✅ اطلاعاتی که باید در اختیار داشته باشی:

#### الف) اطلاعات سرور
```
آدرس IP سرور: _________________
نام کاربری: ____________________ (معمولا root یا ubuntu)
رمز عبور: ______________________
```

#### ب) اطلاعات دیتابیس (MongoDB)
```
DATABASE_URL: mongodb://username:password@host:port/pishro
```

#### ج) اطلاعات Object Storage (iranServer)
⚠️ **این اطلاعات رو باید از پنل iranServer دریافت کنی:**
```
S3_ENDPOINT: https://s3.iran-server.com
S3_ACCESS_KEY_ID: _______________
S3_SECRET_ACCESS_KEY: ___________
S3_BUCKET_NAME: pishro-videos
S3_PUBLIC_URL: __________________
```

#### د) اطلاعات پیامک (melipayamak)
```
SMS_USERNAME: __________________
SMS_PASSWORD: __________________
SMS_FROM: ______________________
```

#### ه) اطلاعات درگاه پرداخت (ZarinPal)
```
ZARINPAL_MERCHANT_ID: __________
```

---

## 2. اتصال به سرور (SSH)

### برای کاربران Windows:

#### گزینه 1: استفاده از PowerShell (ساده‌تر)

1. **باز کردن PowerShell:**
   - کلیدهای `Windows + X` رو بزن
   - گزینه "Windows PowerShell" رو انتخاب کن

2. **اتصال به سرور:**
   ```powershell
   ssh root@آدرس_IP_سرورت
   ```

   **مثال:**
   ```powershell
   ssh root@185.12.34.56
   ```

3. **اولین بار که وصل میشی:**
   - یک پیام می‌آد که میگه: `Are you sure you want to continue connecting?`
   - تایپ کن: `yes` و Enter بزن

4. **وارد کردن رمز عبور:**
   - رمز عبور سرور رو بنویس
   - ⚠️ وقتی تایپ می‌کنی، هیچی نمایش داده نمیشه (نگران نباش، داره تایپ میشه!)
   - Enter بزن

#### گزینه 2: استفاده از PuTTY (گرافیکی‌تر)

1. **دانلود PuTTY:**
   - برو به: https://www.putty.org/
   - دانلود و نصب کن

2. **باز کردن PuTTY:**
   - در قسمت `Host Name`: آدرس IP سرور رو بنویس
   - در قسمت `Port`: عدد 22 رو بنویس
   - روی `Open` کلیک کن

3. **وارد کردن اطلاعات:**
   - اول نام کاربری رو بنویس (مثلا `root`)
   - بعد رمز عبور رو بنویس

### برای کاربران Mac/Linux:

1. **باز کردن Terminal:**
   - Mac: `Cmd + Space` بزن و تایپ کن `Terminal`
   - Linux: `Ctrl + Alt + T`

2. **اتصال:**
   ```bash
   ssh root@آدرس_IP_سرورت
   ```

### ✅ موفق شدی وصل بشی اگه:
یک خط شبیه این ببینی:
```
root@your-server:~#
```

---

## 3. نصب ابزارهای لازم

حالا که به سرور وصل شدی، باید ابزارهای لازم رو نصب کنی.

### روش آسان: اجرای اسکریپت خودکار ⭐

این کار همه چیز رو به صورت خودکار نصب می‌کنه:

```bash
# رفتن به پوشه موقت
cd /tmp

# دانلود پروژه
git clone https://github.com/amir-9/pishro.git

# رفتن به پوشه پروژه
cd pishro

# اجرای اسکریپت نصب
sudo bash deploy/setup-ubuntu.sh
```

**توضیح:**
- این اسکریپت FFmpeg، Node.js 20، و Docker رو نصب می‌کنه
- وقتی ازت پرسید "Do you want to install Docker?", تایپ کن `y` و Enter بزن
- صبر کن تا نصب تموم شه (حدود 5-10 دقیقه)

### ✅ چک کردن که نصب موفق بوده:

```bash
# چک کردن FFmpeg
ffmpeg -version

# چک کردن Node.js
node --version

# باید ببینی: v20.x.x
```

---

## 4. آماده کردن پروژه

### 1. رفتن به پوشه مناسب:

```bash
cd /opt
```

### 2. دانلود پروژه:

```bash
sudo git clone https://github.com/isina-nej/pishro.git pishro
cd pishro
```
sudo git clone https://github.com/amir-9/pishro.git pishro

### 3. دادن دسترسی به پوشه:

```bash
sudo chown -R $USER:$USER /opt/pishro
```

### 4. نصب بسته‌های پروژه:

```bash
npm install
```

**توضیح:** این کار همه بسته‌های مورد نیاز پروژه رو نصب می‌کنه. ممکنه چند دقیقه طول بکشه.

---

## 5. ساخت فایل .env (مهم!)

⚠️ **خیلی مهم:** فایل `.env` اطلاعات حساس پروژه رو داره و روی گیتهاب نیست. باید خودت بسازیش!

### 1. باز کردن ادیتور:

```bash
nano .env
```

**توضیح:** nano یک ادیتور متن سادست. حالا یه صفحه خالی باز میشه.

### 2. کپی کردن این محتوا و جایگذاری اطلاعات خودت:

```env
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="mongodb://username:password@host:port/pishro"

# ===========================================
# OBJECT STORAGE (iranServer S3)
# ===========================================
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="اینجا رو با Access Key خودت پر کن"
S3_SECRET_ACCESS_KEY="اینجا رو با Secret Key خودت پر کن"
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
# AUTH
# ===========================================
AUTH_SECRET="این رو باید تولید کنی - توضیح پایین"
NEXTAUTH_URL="https://your-domain.com"

# ===========================================
# SMS PROVIDER (melipayamak)
# ===========================================
SMS_USERNAME="نام کاربری پیامک"
SMS_PASSWORD="رمز عبور پیامک"
SMS_FROM="شماره فرستنده"

# ===========================================
# PAYMENT (ZarinPal)
# ===========================================
ZARINPAL_MERCHANT_ID="مرچنت آیدی زرین پال"
ZARINPAL_CALLBACK_URL="https://your-domain.com/api/payment/verify"
```

### 3. ذخیره کردن فایل در nano:

- `Ctrl + O` بزن (برای ذخیره)
- Enter بزن (تایید نام فایل)
- `Ctrl + X` بزن (برای خروج)

### 4. تولید AUTH_SECRET:

```bash
openssl rand -base64 32
```

یک رشته تصادفی بهت نشون میده. کپیش کن و دوباره فایل .env رو باز کن:

```bash
nano .env
```

و AUTH_SECRET رو با این مقدار پر کن.

---

## 6. نصب و راه‌اندازی

### 1. ساخت دایرکتوری موقت:

```bash
sudo mkdir -p /tmp/video-processing
sudo chmod 777 /tmp/video-processing
```

### 2. راه‌اندازی دیتابیس:

```bash
npx prisma generate
npx prisma db push
```

**توضیح:** این کارها ساختار دیتابیس رو آماده می‌کنه.

### 3. Build کردن پروژه:

```bash
npm run build
```

**توضیح:** این کار پروژه رو برای production آماده می‌کنه. ممکنه چند دقیقه طول بکشه.

### اگر build خطا داد (مشکل مربوط به `sharp`)

اگر در هنگام build با خطایی مشابه زیر روبرو شدید:

```
Error: Could not load the "sharp" module using the linux-x64 runtime
Unsupported CPU: Prebuilt binaries for linux-x64 require v2 microarchitecture
```

در این حالت، `sharp` از باینری‌های prebuilt استفاده کرده که با CPU سرور شما سازگار نیست. برای رفع مشکل:

1) نصب پیش‌نیازهای libvips و ابزار ساخت از apt:
```bash
sudo apt-get update
sudo apt-get install -y pkg-config libvips-dev libcairo2-dev libjpeg-dev libpng-dev libwebp-dev libgif-dev libexif-dev build-essential
```

2) بازسازی/نصب دوبارهٔ `sharp` از سورس:
```bash
# حذف node_modules (و درصورت لزوم package-lock.json)
rm -rf node_modules
npm ci --include=optional

# یا فقط بازسازی sharp
npm rebuild sharp --build-from-source
```

3) دوباره build پروژه:
```bash
npm run build
```

این باید مشکلِ ناسازگاری باینری را رفع کند، چون `sharp` از سورس ساخته می‌شود و متناسب با CPU سرور شما خواهد بود.

نکته: اگر شما در سروری با CPU خیلی قدیمی یا محدود کار می‌کنید، ممکن است مدت ساخت طول بکشد؛ در این حالت اجرای اپ با Docker در ماشینی مدرن یا استفاده از یک سرور با معماری جدید توصیه می‌شود.


### ✅ اگه هیچ خطایی ندیدی، آفرین! موفق شدی 🎉

---

## 7. راه‌اندازی پردازشگر ویدیو

پردازشگر ویدیو مسئول تبدیل ویدیوهاست. دو روش راه‌اندازی داریم:

### روش 1: با Docker (آسان‌تر) ⭐

```bash
# راه‌اندازی
docker compose up -d video-processor

# دیدن لاگ‌ها (برای چک کردن که داره کار می‌کنه)
docker compose logs -f video-processor
```

برای خروج از لاگ‌ها: `Ctrl + C`

### روش 2: با systemd (پایدارتر)

```bash
# کپی کردن فایل service
sudo cp deploy/systemd-worker.service /etc/systemd/system/pishro-worker.service

# راه‌اندازی
sudo systemctl daemon-reload
sudo systemctl enable pishro-worker
sudo systemctl start pishro-worker

# چک کردن وضعیت
sudo systemctl status pishro-worker

# دیدن لاگ‌ها
sudo journalctl -u pishro-worker -f
```

### ✅ چک کردن که کار می‌کنه:

باید در لاگ‌ها چیزی شبیه این ببینی:
```
🎬 Video processing worker started
📊 Polling interval: 30 seconds
✓ Database connected
✓ FFmpeg available
```

---

## 8. راه‌اندازی Next.js

### 1. نصب PM2 (مدیر پروسه):

```bash
sudo npm install -g pm2
```

### 2. راه‌اندازی Next.js با PM2:

```bash
pm2 start npm --name "pishro-app" -- start
```

### 3. ذخیره تنظیمات PM2:

```bash
pm2 save
pm2 startup
```

یک دستور بهت نشون میده، اون رو کپی کن و اجرا کن.

### 4. چک کردن وضعیت:

```bash
pm2 status
```

باید ببینی که `pishro-app` در حالت `online` هست.

### 5. دیدن لاگ‌ها:

```bash
pm2 logs pishro-app
```

---

## 9. تست سیستم

### 1. تست خودکار:

```bash
cd /opt/pishro
npx tsx scripts/test-video-system.ts
```

این اسکریپت همه چیز رو چک می‌کنه:
- ✅ اتصال به MongoDB
- ✅ اتصال به Object Storage
- ✅ FFmpeg
- ✅ فایل .env
- ✅ دایرکتوری موقت

### 2. باز کردن سایت در مرورگر:

```
http://آدرس_IP_سرورت:3000
```

**مثال:**
```
http://185.12.34.56:3000
```

اگه سایت باز شد، یعنی موفق شدی! 🎉

---

## 10. مشکلات رایج و حل اونها

### مشکل 1: نمی‌تونم به سرور وصل شم (SSH)

**راه‌حل:**
- چک کن که آدرس IP درست باشه
- چک کن که پورت 22 باز باشه
- از هاست خودت بپرس که آیا باید از VPN استفاده کنی

### مشکل 2: خطا میده که FFmpeg پیدا نمیشه

**راه‌حل:**
```bash
# نصب مجدد FFmpeg
sudo apt-get update
sudo apt-get install --reinstall ffmpeg

# چک کردن
ffmpeg -version
```

### مشکل 3: خطای اتصال به دیتابیس

**راه‌حل:**
- چک کن که DATABASE_URL در فایل .env درست باشه
- تست اتصال:
```bash
cat .env | grep DATABASE_URL
```

### مشکل 4: خطای S3 (Object Storage)

**راه‌حل:**
- مطمئن شو که Access Key و Secret Key رو درست وارد کردی
- برو تو پنل iranServer و دوباره چک کن
- مطمئن شو که Bucket ساخته شده

### مشکل 5: سایت باز نمیشه

**راه‌حل:**
```bash
# چک کردن Next.js
pm2 status

# اگه stopped بود:
pm2 restart pishro-app

# دیدن خطاها:
pm2 logs pishro-app
```

### مشکل 6: پردازشگر ویدیو کار نمی‌کنه

**راه‌حل:**

اگه از Docker استفاده کردی:
```bash
docker compose logs video-processor
docker compose restart video-processor
```

اگه از systemd استفاده کردی:
```bash
sudo journalctl -u pishro-worker -n 50
sudo systemctl restart pishro-worker
```

### مشکل 7: خطای build مربوط به بسته `sharp`

اگر هنگام اجرای `npm run build` با خطای مشابه زیر مواجه شدید:

```
Error: Could not load the "sharp" module using the linux-x64 runtime
Unsupported CPU: Prebuilt binaries for linux-x64 require v2 microarchitecture
```

راه‌حل: `sharp` به‌صورت پیش‌فرض از باینری‌های prebuilt استفاده می‌کند که ممکن است با CPU سرور شما هم‌خوانی نداشته باشد، در این حالت باید `sharp` را از سورس بسازید یا پیش‌نیازهای `libvips` را نصب کنید.

دستورهای پیشنهادی:

```bash
# نصب پیش نیازها
sudo apt-get update
sudo apt-get install -y pkg-config libvips-dev libcairo2-dev libjpeg-dev libpng-dev libwebp-dev libgif-dev libexif-dev build-essential

# بازسازی sharp و نصب دوباره
cd /opt/pishro
rm -rf node_modules
npm ci --include=optional
npm rebuild sharp --build-from-source

# دوباره تلاش برای ساخت
npm run build
```

اگر باز هم خطا دارید، خروجی کامل `npm run build` را اینجا paste کنید تا کمک کنم خطا را دقیق‌تر بررسی کنیم.


---

## 📞 کمک بیشتر

### دستورات مفید برای مشاهده وضعیت:

```bash
# وضعیت همه چیز
pm2 status
docker compose ps
sudo systemctl status pishro-worker

# دیدن لاگ‌ها
pm2 logs pishro-app
docker compose logs -f video-processor
sudo journalctl -u pishro-worker -f

# چک کردن فضای دیسک
df -h

# چک کردن استفاده از منابع
htop
```

### قطع اتصال از سرور:

وقتی کارت تموم شد:
```bash
exit
```

---

## 🔒 نکات امنیتی مهم

### 1. هیچ وقت فایل .env رو کامیت نکن!

فایل .env اطلاعات حساس داره. هیچ وقت نباید روی گیتهاب بره.

### 2. رمزهای قوی استفاده کن

AUTH_SECRET باید خیلی قوی باشه (حداقل 32 کاراکتر).

### 3. فایروال رو فعال کن

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 4. SSL نصب کن (برای HTTPS)

وقتی دامنه رو به سرور وصل کردی:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ✅ چک‌لیست نهایی

- [ ] به سرور وصل شدم
- [ ] FFmpeg و Node.js نصب شدن
- [ ] پروژه رو clone کردم
- [ ] فایل .env رو ساختم و پر کردم
- [ ] پروژه رو build کردم
- [ ] پردازشگر ویدیو راه افتاد
- [ ] Next.js راه افتاد
- [ ] تست سیستم موفق بود
- [ ] سایت تو مرورگر باز میشه

---

## 🎉 تبریک!

اگه همه مراحل رو طی کردی، سایتت الان روی سرور در حال اجراست!

برای هر سوالی که داری، می‌تونی به فایل‌های زیر مراجعه کنی:
- `deploy/DEPLOYMENT_GUIDE.md` - راهنمای تکنیکال کامل
- `deploy/SERVER_SETUP.md` - چک‌لیست نصب
- `deploy/README.md` - خلاصه

**موفق باشی! 🚀**
