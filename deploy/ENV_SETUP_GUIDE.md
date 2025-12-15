# 🔐 راهنمای کامل تنظیم فایل .env

> همه چیز درباره فایل .env - از صفر تا صد!

---

## ❓ .env چیه و چرا نیازه؟

فایل `.env` شامل اطلاعات حساس پروژه است مثل:
- رمزهای دیتابیس
- کلیدهای API
- اطلاعات Object Storage
- و...

⚠️ **این فایل هیچ وقت روی گیتهاب نمیره** چون اطلاعات حساسه!

---

## 📝 ساخت فایل .env

### مرحله 1: چک کردن .env.example

اگه پروژه فایل `.env.example` داره، اول اون رو ببین:

```bash
cat .env.example
```

### مرحله 2: کپی کردن template

```bash
# اگه .env.example موجوده:
cp .env.example .env

# اگه نیست، فایل جدید بساز:
nano .env
```

---

## 🔑 اطلاعات مورد نیاز

### 1. اطلاعات دیتابیس (DATABASE_URL)

**فرمت:**
```env
DATABASE_URL="mongodb://username:password@host:port/database_name"
```

**مثال:**
```env
DATABASE_URL="mongodb://admin:mypassword123@localhost:27017/pishro"
```

**از کجا بگیری:**
- اگه از MongoDB Atlas استفاده می‌کنی: از پنل Atlas کپی کن
- اگه MongoDB رو خودت نصب کردی: اطلاعات نصبت رو بنویس

**تست اتصال:**
```bash
mongosh "mongodb://username:password@host:port/pishro"
```

---

### 2. Object Storage (iranServer S3)

این اطلاعات رو **باید از پنل iranServer** دریافت کنی:

```env
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="دریافت از iranServer"
S3_SECRET_ACCESS_KEY="دریافت از iranServer"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://pishro-videos.s3.iran-server.com"
```

#### چطور از iranServer بگیری:

1. **وارد پنل iranServer شو**
   - برو به: https://panel.iran-server.com

2. **به بخش Object Storage برو**
   - منو → Object Storage

3. **Bucket بساز** (اگه نداری)
   - اسم Bucket: `pishro-videos`
   - Region: `default`
   - Access: Public Read (برای فایل‌های HLS)

4. **Access Key بساز**
   - قسمت Access Keys
   - گزینه Create New Key
   - Access Key ID و Secret Access Key رو کپی کن
   - ⚠️ Secret Key رو فقط یک بار نشون میده! حتما ذخیرش کن

5. **Endpoint URL رو یادداشت کن**
   - معمولا: `https://s3.iran-server.com`

6. **Public URL رو یادداشت کن**
   - معمولا: `https://BUCKET_NAME.s3.iran-server.com`
   - یا: `https://s3.iran-server.com/BUCKET_NAME`

**تست اتصال:**
```bash
# با AWS CLI
aws s3 ls --endpoint-url https://s3.iran-server.com

# یا از داخل پروژه
npx tsx scripts/test-video-system.ts
```

---

### 3. AUTH_SECRET

این یک کلید تصادفی برای امنیت سیستم authentication است.

**تولید:**
```bash
openssl rand -base64 32
```

**خروجی:**
```
kL9mP2nQ4rS6tU8vX0yA1bC3dE5fG7hJ9
```

این رو کپی کن و در .env قرار بده:
```env
AUTH_SECRET="kL9mP2nQ4rS6tU8vX0yA1bC3dE5fG7hJ9"
```

⚠️ **نکات مهم:**
- باید حداقل 32 کاراکتر باشه
- باید تصادفی باشه
- هیچ وقت این رو share نکن

---

### 4. NEXTAUTH_URL

آدرس سایتت:

```env
# در مرحله development:
NEXTAUTH_URL="http://localhost:3000"

# در production:
NEXTAUTH_URL="https://your-domain.com"
```

---

### 5. سرویس پیامک (melipayamak)

```env
SMS_USERNAME="نام کاربری پنل melipayamak"
SMS_PASSWORD="رمز عبور پنل"
SMS_FROM="شماره فرستنده (خط خدماتی)"
```

**از کجا بگیری:**
- برو به پنل melipayamak
- اطلاعات API رو کپی کن

---

### 6. درگاه پرداخت (ZarinPal)

```env
ZARINPAL_MERCHANT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
ZARINPAL_CALLBACK_URL="https://your-domain.com/api/payment/verify"
```

**از کجا بگیری:**
- برو به پنل ZarinPal
- قسمت تنظیمات → Merchant ID

---

### 7. تنظیمات دیگر

```env
# دایرکتوری موقت برای پردازش ویدیو
TEMP_DIR="/tmp/video-processing"

# محیط اجرا
NODE_ENV="production"
```

---

## 📄 فایل .env کامل - Template

```env
# ===========================================
# 🗄️ DATABASE
# ===========================================
DATABASE_URL="mongodb://username:password@host:port/pishro"

# ===========================================
# ☁️ OBJECT STORAGE (iranServer S3)
# ===========================================
S3_ENDPOINT="https://s3.iran-server.com"
S3_REGION="default"
S3_ACCESS_KEY_ID="your-access-key-id"
S3_SECRET_ACCESS_KEY="your-secret-access-key"
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
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

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
ZARINPAL_CALLBACK_URL="https://your-domain.com/api/payment/verify"
```

---

## ✅ چک‌لیست تکمیل .env

- [ ] DATABASE_URL پر شده
- [ ] S3_ACCESS_KEY_ID از iranServer دریافت شده
- [ ] S3_SECRET_ACCESS_KEY از iranServer دریافت شده
- [ ] S3_BUCKET_NAME تنظیم شده
- [ ] S3_PUBLIC_URL درست است
- [ ] AUTH_SECRET با openssl تولید شده
- [ ] NEXTAUTH_URL آدرس دامنه یا IP سرور است
- [ ] SMS credentials تنظیم شده
- [ ] ZARINPAL_MERCHANT_ID تنظیم شده
- [ ] فایل .env ذخیره شده (`ls -la .env`)

---

## 🧪 تست فایل .env

### 1. چک کردن که فایل موجود است:
```bash
ls -la .env
```

باید ببینی:
```
-rw-r--r-- 1 user user 1234 Nov 19 10:00 .env
```

### 2. دیدن محتوای فایل (بدون اطلاعات حساس):
```bash
cat .env | grep -v "SECRET\|PASSWORD\|KEY"
```

### 3. چک کردن متغیرهای خاص:
```bash
# چک DATABASE_URL
cat .env | grep DATABASE_URL

# چک S3
cat .env | grep S3_ENDPOINT
```

### 4. تست سیستم:
```bash
npx tsx scripts/test-video-system.ts
```

این اسکریپت همه متغیرهای .env رو چک می‌کنه.

---

## 🔒 امنیت فایل .env

### 1. مطمئن شو که در .gitignore هست:

```bash
cat .gitignore | grep .env
```

باید ببینی:
```
.env
.env.local
.env.production
```

### 2. تنظیم permission مناسب:

```bash
chmod 600 .env
```

این کار فقط به owner اجازه خوندن و نوشتن میده.

### 3. هیچ وقت commit نکن:

```bash
# چک کردن که tracked نیست
git status

# اگه اشتباهی add شده:
git rm --cached .env
git commit -m "Remove .env from git"
```

---

## 🔄 بروزرسانی .env

اگه نیاز شد .env رو تغییر بدی:

### 1. ویرایش:
```bash
nano .env
```

### 2. ذخیره:
- `Ctrl + O` → `Enter` → `Ctrl + X`

### 3. Restart سرویس‌ها:

```bash
# Next.js
pm2 restart pishro-app

# Worker (Docker)
docker compose restart video-processor

# Worker (systemd)
sudo systemctl restart pishro-worker
```

---

## 💾 Backup از .env

### یک بار backup بگیر:
```bash
cp .env .env.backup
```

### Backup با تاریخ:
```bash
cp .env .env.backup.$(date +%Y%m%d)
```

### Restore کردن:
```bash
cp .env.backup .env
```

⚠️ **مهم:** backup هم اطلاعات حساس داره! امن نگهش دار.

---

## 🐛 عیب‌یابی

### خطا: "Environment variable not found"

**راه‌حل:**
```bash
# چک کن که فایل موجود است
ls -la .env

# چک کن که متغیر خاصی موجود است
cat .env | grep VARIABLE_NAME

# مطمئن شو که بدون فاصله نوشته شده:
# ✅ درست: DATABASE_URL="..."
# ❌ غلط: DATABASE_URL = "..."
```

### خطا: "Permission denied"

**راه‌حل:**
```bash
chmod 600 .env
```

### خطا: "Invalid DATABASE_URL"

**راه‌حل:**
```bash
# فرمت رو چک کن
cat .env | grep DATABASE_URL

# باید شبیه این باشه:
# mongodb://user:pass@host:port/dbname
```

### خطا: "S3 connection failed"

**راه‌حل:**
1. چک کن credentials درست باشن
2. چک کن endpoint درست باشه
3. از پنل iranServer دوباره بررسی کن
4. تست کن:
```bash
npx tsx scripts/test-video-system.ts
```

---

## 📚 منابع بیشتر

- **راهنمای مبتدیان:** `deploy/BEGINNER_GUIDE.md`
- **شروع سریع:** `deploy/QUICK_START.md`
- **راهنمای کامل:** `deploy/DEPLOYMENT_GUIDE.md`

---

## 🎯 خلاصه

1. ✅ فایل .env رو بساز
2. ✅ تمام اطلاعات رو پر کن
3. ✅ با اسکریپت تست کن
4. ✅ سرویس‌ها رو راه‌اندازی کن
5. ✅ هیچ وقت commit نکن!

**موفق باشی! 🚀**
