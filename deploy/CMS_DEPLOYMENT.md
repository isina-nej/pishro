# 🎨 راهنمای Deploy پروژه CMS (Pishro Admin)

این راهنما مراحل کامل راه‌اندازی پنل مدیریت (CMS) پروژه پیشرو را در همان سرور شرح می‌دهد.

---

## 📋 فهرست مطالب

1. [معماری سیستم](#معماری-سیستم)
2. [پیش‌نیازها](#پیش‌نیازها)
3. [نصب MongoDB](#نصب-mongodb)
4. [Deploy پروژه CMS](#deploy-پروژه-cms)
5. [تنظیم Nginx](#تنظیم-nginx)
6. [تست و راه‌اندازی](#تست-و-راه‌اندازی)
7. [عیب‌یابی](#عیب‌یابی)

---

## 🏗️ معماری سیستم

```
┌────────────────────────────────────────┐
│         Server: 178.239.147.136        │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Main Site   │  │  CMS Panel   │   │
│  │ Port: 3000   │  │ Port: 3001   │   │
│  │ /opt/pishro  │  │ /opt/pishro- │   │
│  │              │  │     admin    │   │
│  └──────┬───────┘  └──────┬───────┘   │
│         │                 │           │
│         └────────┬────────┘           │
│                  │                    │
│         ┌────────▼────────┐           │
│         │    MongoDB      │           │
│         │   Port: 27017   │           │
│         │                 │           │
│         │ DB: pishro      │ ← Main    │
│         │ DB: pishro_admin│ ← CMS     │
│         └─────────────────┘           │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │          Nginx (Port 80/443)    │  │
│  │                                 │  │
│  │  domain.com → Main Site (3000) │  │
│  │  admin.domain.com → CMS (3001) │  │
│  └─────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

---

## ✅ پیش‌نیازها

قبل از شروع، مطمئن شوید که:

- [ ] سرور Ubuntu 20.04+ آماده است
- [ ] پروژه اصلی (pishro) قبلاً deploy شده و در حال اجراست
- [ ] Node.js 20 نصب شده است
- [ ] MongoDB نصب و راه‌اندازی شده است (اگر نه، به [نصب MongoDB](#نصب-mongodb) بروید)
- [ ] دسترسی sudo دارید
- [ ] پورت 3001 آزاد است

---

## 🗄️ نصب MongoDB

اگر MongoDB را هنوز نصب نکرده‌اید:

```bash
# روش سریع (مراجعه کنید به MONGODB_SETUP.md برای جزئیات کامل)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### ایجاد Database و کاربر برای CMS

```bash
# اتصال به MongoDB
mongosh -u admin -p --authenticationDatabase admin
```

```javascript
// ایجاد database و کاربر برای CMS
use pishro_admin

db.createUser({
  user: "pishro_admin_user",
  pwd: "cms-secure-password-456",
  roles: [
    { role: "readWrite", db: "pishro_admin" },
    { role: "dbAdmin", db: "pishro_admin" }
  ]
})

// تست
exit
```

```bash
# تست اتصال
mongosh "mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"
```

**⚠️ نکته:** رمز عبور قوی انتخاب کنید و آن را در جای امنی ذخیره کنید.

---

## 🚀 Deploy پروژه CMS

### 1. Clone کردن Repository

```bash
# انتقال به دایرکتوری /opt
cd /opt

# Clone پروژه CMS
sudo git clone https://github.com/amir-9/pishro-admin.git pishro-admin
cd pishro-admin

# تغییر مالکیت
sudo chown -R $USER:$USER /opt/pishro-admin
```

### 2. نصب Dependencies

```bash
npm install
```

### 3. ایجاد فایل `.env`

```bash
# کپی کردن .env.example
cp .env.example .env

# ویرایش .env
nano .env
```

**محتوای فایل `.env` برای CMS:**

```env
# ===========================================
# DATABASE - CMS دیتابیس جداگانه برای
# ===========================================
DATABASE_URL="mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"

# ===========================================
# OBJECT STORAGE (iranServer S3)
# ===========================================
# ⚠️ همان اطلاعات پروژه اصلی را استفاده کنید
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
# AUTH
# ===========================================
# تولید کنید: openssl rand -base64 32
AUTH_SECRET="your-different-secret-key-for-cms-32-chars"
NEXTAUTH_URL="http://178.239.147.136:3001"
# یا اگر دامنه دارید:
# NEXTAUTH_URL="https://admin.your-domain.com"

# ===========================================
# SMS PROVIDER (melipayamak)
# ===========================================
# همان اطلاعات پروژه اصلی
SMS_USERNAME="your-sms-username"
SMS_PASSWORD="your-sms-password"
SMS_FROM="your-sms-number"

# ===========================================
# PAYMENT (ZarinPal)
# ===========================================
# همان اطلاعات پروژه اصلی
ZARINPAL_MERCHANT_ID="your-merchant-id"
ZARINPAL_CALLBACK_URL="http://178.239.147.136:3001/api/payment/verify"
```

**نکات مهم:**
- ✅ `DATABASE_URL` باید به database جداگانه (`pishro_admin`) اشاره کند
- ✅ `AUTH_SECRET` باید متفاوت از پروژه اصلی باشد
- ✅ `NEXTAUTH_URL` باید پورت 3001 یا subdomain مخصوص را داشته باشد
- ✅ اطلاعات S3 می‌تواند مشترک باشد (همان bucket)

### 4. Setup Database (Prisma)

```bash
# تولید Prisma Client
npx prisma generate

# Push schema به database
npx prisma db push

# (اختیاری) اجرای seeders
npm run seed
```

### 5. Build کردن پروژه

```bash
npm run build
```

اگر خطایی وجود نداشت، پروژه آماده deployment است.

---

## 🎯 راه‌اندازی با PM2

### نصب PM2 (اگر نصب نکرده‌اید)

```bash
sudo npm install -g pm2
```

### شروع CMS با PM2

```bash
cd /opt/pishro-admin

# شروع CMS در پورت 3001
PORT=3001 pm2 start npm --name "pishro-cms" -- start

# ذخیره کردن لیست processها
pm2 save

# فعال‌سازی startup در boot
pm2 startup
# دستور خروجی را اجرا کنید
```

### مدیریت با PM2

```bash
# مشاهده وضعیت
pm2 status

# مشاهده logs
pm2 logs pishro-cms

# توقف
pm2 stop pishro-cms

# restart
pm2 restart pishro-cms

# حذف از لیست
pm2 delete pishro-cms
```

---

## 🌐 تنظیم Nginx (اختیاری اما توصیه می‌شود)

اگر می‌خواهید از subdomain یا SSL استفاده کنید:

### 1. نصب Nginx

```bash
sudo apt-get install -y nginx
```

### 2. ایجاد فایل تنظیمات برای CMS

```bash
sudo nano /etc/nginx/sites-available/pishro-cms
```

**محتوای فایل (بدون SSL):**

```nginx
server {
    listen 80;
    server_name admin.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**محتوای فایل (با IP و پورت مشخص):**

```nginx
server {
    listen 80;
    server_name 178.239.147.136;

    # CMS در مسیر /admin
    location /admin {
        rewrite ^/admin(.*)$ $1 break;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # پروژه اصلی در root
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. فعال‌سازی تنظیمات

```bash
# ایجاد symlink
sudo ln -s /etc/nginx/sites-available/pishro-cms /etc/nginx/sites-enabled/

# تست تنظیمات
sudo nginx -t

# reload Nginx
sudo systemctl reload nginx
```

### 4. تنظیم DNS (اگر از subdomain استفاده می‌کنید)

در پنل مدیریت domain خود:

```
Type: A
Name: admin
Value: 178.239.147.136
TTL: 3600
```

### 5. نصب SSL با Let's Encrypt

```bash
# نصب certbot
sudo apt-get install -y certbot python3-certbot-nginx

# دریافت گواهینامه برای subdomain
sudo certbot --nginx -d admin.your-domain.com

# تست تمدید خودکار
sudo certbot renew --dry-run
```

---

## ✅ تست و راه‌اندازی

### 1. بررسی پروسه‌ها

```bash
# بررسی PM2
pm2 status

# باید هر دو پروژه در حال اجرا باشند:
# - pishro-app (پورت 3000)
# - pishro-cms (پورت 3001)
```

### 2. تست دسترسی

```bash
# تست پورت پروژه اصلی
curl http://localhost:3000

# تست پورت CMS
curl http://localhost:3001

# تست از خارج سرور (اگر firewall باز است)
curl http://178.239.147.136:3000
curl http://178.239.147.136:3001
```

### 3. باز کردن پورت‌ها در Firewall (اگر نیاز است)

```bash
# باز کردن پورت 3000 و 3001
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

# یا اگر از Nginx استفاده می‌کنید
sudo ufw allow 'Nginx Full'
```

### 4. دسترسی از مرورگر

بدون Nginx:
- پروژه اصلی: `http://178.239.147.136:3000`
- CMS: `http://178.239.147.136:3001`

با Nginx و subdomain:
- پروژه اصلی: `https://your-domain.com`
- CMS: `https://admin.your-domain.com`

---

## 🔄 بروزرسانی پروژه CMS

```bash
cd /opt/pishro-admin

# دانلود آخرین تغییرات
git pull origin main

# نصب dependencies جدید
npm install

# اجرای migrations
npx prisma generate
npx prisma db push

# Build مجدد
npm run build

# Restart با PM2
pm2 restart pishro-cms
```

---

## 🔍 عیب‌یابی

### CMS شروع نمی‌شود

```bash
# بررسی logs
pm2 logs pishro-cms

# بررسی اینکه پورت 3001 آزاد است
sudo netstat -tulpn | grep 3001

# در صورت اشغال بودن، فرآیند را kill کنید
sudo kill -9 <PID>

# شروع مجدد
PORT=3001 pm2 restart pishro-cms
```

### خطای اتصال به Database

```bash
# بررسی DATABASE_URL در .env
cat .env | grep DATABASE_URL

# تست اتصال دستی
mongosh "mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"

# بررسی وضعیت MongoDB
sudo systemctl status mongod
```

### صفحه 404 نمایش می‌دهد

```bash
# بررسی که build درست انجام شده
ls -la /opt/pishro-admin/.next

# build مجدد
cd /opt/pishro-admin
npm run build

# restart
pm2 restart pishro-cms
```

### Nginx خطا می‌دهد

```bash
# بررسی تنظیمات
sudo nginx -t

# مشاهده logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# restart nginx
sudo systemctl restart nginx
```

### دو پروژه به هم conflict دارند

این مشکل معمولاً به دلیل استفاده از یک database یا AUTH_SECRET یکسان است:

**راه‌حل:**
1. مطمئن شوید هر پروژه database جداگانه دارد
2. `AUTH_SECRET` هر پروژه باید متفاوت باشد
3. `NEXTAUTH_URL` هر پروژه باید به پورت صحیح اشاره کند

---

## 📊 نظارت

### Monitoring با PM2

```bash
# نمایش monitoring
pm2 monit

# نمایش وضعیت
pm2 status

# مشاهده logs زنده
pm2 logs

# مشاهده مصرف منابع
pm2 list
```

### بررسی منابع سیستم

```bash
# CPU و RAM
htop

# فضای دیسک
df -h

# بررسی پورت‌های باز
sudo netstat -tulpn | grep -E '3000|3001|27017'
```

---

## 🔐 نکات امنیتی

### 1. تغییر رمزهای پیش‌فرض

- ✅ رمز MongoDB کاربر admin
- ✅ رمز MongoDB کاربر CMS
- ✅ AUTH_SECRET در .env
- ✅ تمام رمزهای سرویس‌های خارجی

### 2. محدود کردن دسترسی

```bash
# فقط localhost به MongoDB دسترسی داشته باشد
sudo nano /etc/mongod.conf
```

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
```

### 3. استفاده از SSL

برای production حتماً SSL را فعال کنید:

```bash
sudo certbot --nginx -d your-domain.com -d admin.your-domain.com
```

### 4. Backup منظم

```bash
# Backup روزانه از هر دو database
crontab -e
```

```bash
# Backup ساعت 2 صبح
0 2 * * * mongodump --uri="mongodb://pishro_user:PASSWORD@localhost:27017/pishro" --out=/backup/pishro-$(date +\%Y\%m\%d)
0 2 * * * mongodump --uri="mongodb://pishro_admin_user:PASSWORD@localhost:27017/pishro_admin" --out=/backup/cms-$(date +\%Y\%m\%d)
```

---

## 📝 خلاصه

پس از اتمام این مراحل:

- ✅ MongoDB نصب و دو database جداگانه دارید
- ✅ پروژه اصلی در پورت 3000 در حال اجراست
- ✅ پروژه CMS در پورت 3001 در حال اجراست
- ✅ هر دو پروژه با PM2 مدیریت می‌شوند
- ✅ (اختیاری) Nginx برای مدیریت domain/subdomain تنظیم شده
- ✅ (اختیاری) SSL نصب شده است

### دسترسی‌ها:

**بدون Nginx:**
- Main Site: `http://178.239.147.136:3000`
- CMS Panel: `http://178.239.147.136:3001`

**با Nginx:**
- Main Site: `https://your-domain.com`
- CMS Panel: `https://admin.your-domain.com`

---

## 📚 مستندات مرتبط

- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - راهنمای کامل نصب MongoDB
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - راهنمای deploy پروژه اصلی
- [SERVER_SETUP.md](./SERVER_SETUP.md) - چک‌لیست نصب سرور
- [NGINX_SETUP.md](./NGINX_SETUP.md) - راهنمای تنظیم Nginx (اگر موجود باشد)

---

**موفق باشید! 🚀**
