# 📋 چک‌لیست نصب و تنظیم سرور پیشرو

این چک‌لیست برای راه‌اندازی سیستم پردازش ویدیو در سرور Ubuntu 20.04+ است.

---

## ✅ پیش‌نیازها

- [ ] سرور Ubuntu 20.04 یا بالاتر
- [ ] دسترسی root یا sudo
- [ ] حداقل 2GB RAM
- [ ] حداقل 20GB فضای ذخیره‌سازی
- [ ] اتصال به اینترنت

---

## 📦 مرحله 1: نصب Dependencies

### گزینه A: نصب خودکار (توصیه می‌شود)
```bash
cd /path/to/pishro
sudo bash deploy/setup-ubuntu.sh
```

### گزینه B: نصب دستی

#### 1. بروزرسانی سیستم
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

#### 2. نصب FFmpeg
```bash
sudo apt-get install -y ffmpeg

# بررسی نصب
ffmpeg -version
ffprobe -version
```

#### 3. نصب Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی نصب
node --version  # باید v20.x.x نمایش دهد
npm --version
```

#### 4. نصب Docker (اختیاری - برای استفاده از Docker Compose)
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
```

---

## 🗂️ مرحله 2: آماده‌سازی پروژه

### 1. Clone کردن Repository
```bash
git clone <repository-url> /opt/pishro
cd /opt/pishro
```

### 2. نصب Dependencies
```bash
npm install
```

### 3. ایجاد فایل .env
```bash
cp .env.example .env
nano .env  # یا vim .env
```

**متغیرهای ضروری:**
```env
# Database
DATABASE_URL="mongodb://username:password@host:port/database"

# iranServer S3 (Object Storage)
S3_ENDPOINT="https://s3.iran-server.com"  # یا endpoint خاص شما
S3_REGION="default"
S3_ACCESS_KEY_ID="YOUR_ACCESS_KEY_HERE"
S3_SECRET_ACCESS_KEY="YOUR_SECRET_KEY_HERE"
S3_BUCKET_NAME="pishro-videos"
S3_PUBLIC_URL="https://your-bucket.s3.iran-server.com"

# Temp Directory
TEMP_DIR="/tmp/video-processing"

# Node Environment
NODE_ENV="production"

# Auth (اگر worker نیاز داشت)
AUTH_SECRET="your-secret-key"
```

### 4. ایجاد دایرکتوری‌های موقت
```bash
sudo mkdir -p /tmp/video-processing
sudo chmod 777 /tmp/video-processing
```

### 5. تست Build
```bash
npm run build
```

---

## 🎬 مرحله 3: راه‌اندازی Video Processing Worker

### گزینه A: استفاده از Docker Compose (توصیه می‌شود)

```bash
# شروع worker
docker compose up -d video-processor

# مشاهده logs
docker compose logs -f video-processor

# توقف worker
docker compose down
```

### گزینه B: استفاده از systemd

1. کپی کردن service file:
```bash
sudo cp deploy/systemd-worker.service /etc/systemd/system/pishro-worker.service
```

2. ویرایش مسیرها در service file:
```bash
sudo nano /etc/systemd/system/pishro-worker.service
```

3. راه‌اندازی service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable pishro-worker
sudo systemctl start pishro-worker
```

4. بررسی وضعیت:
```bash
sudo systemctl status pishro-worker
sudo journalctl -u pishro-worker -f
```

### گزینه C: اجرای دستی (برای تست)

```bash
cd /opt/pishro
npx tsx scripts/video-processor-worker.ts
```

---

## 🧪 مرحله 4: تست سیستم

### 1. اجرای اسکریپت تست
```bash
npx tsx scripts/test-video-system.ts
```

### 2. بررسی FFmpeg
```bash
ffmpeg -version
ffprobe -version
```

### 3. بررسی اتصال به Object Storage
از اسکریپت تست استفاده کنید یا به صورت دستی:
```bash
# این کد را در یک فایل test-s3.ts ذخیره کنید
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const data = await s3Client.send(new ListBucketsCommand({}));
console.log("Buckets:", data.Buckets);
```

### 4. بررسی اتصال به Database
```bash
npx prisma db push  # یا prisma migrate deploy
```

---

## 🔄 مرحله 5: تنظیمات Production

### 1. تنظیم Firewall
```bash
# اگر از ufw استفاده می‌کنید
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. تنظیم Nginx (اختیاری - برای Next.js app)
```bash
sudo apt-get install -y nginx

# فایل config را در /etc/nginx/sites-available/pishro ایجاد کنید
sudo nano /etc/nginx/sites-available/pishro
```

Example config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

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

```bash
# فعال‌سازی site
sudo ln -s /etc/nginx/sites-available/pishro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. تنظیم SSL با Let's Encrypt (اختیاری)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. تنظیم Monitoring
```bash
# نصب htop برای نظارت بر منابع
sudo apt-get install -y htop

# مشاهده resource usage
htop
```

---

## 🔍 عیب‌یابی

### Worker اجرا نمی‌شود
```bash
# بررسی logs
sudo journalctl -u pishro-worker -n 50

# یا اگر از Docker استفاده می‌کنید
docker compose logs video-processor
```

### FFmpeg یافت نمی‌شود
```bash
which ffmpeg
which ffprobe

# نصب مجدد
sudo apt-get install --reinstall ffmpeg
```

### خطای اتصال به S3
- بررسی کنید که credentials درست هستند
- بررسی کنید که endpoint صحیح است
- اطمینان حاصل کنید که bucket وجود دارد

### خطای فضای دیسک
```bash
# بررسی فضای دیسک
df -h

# پاکسازی فایل‌های موقت
sudo rm -rf /tmp/video-processing/*

# پاکسازی Docker volumes (اگر استفاده می‌کنید)
docker system prune -a --volumes
```

---

## 📊 نظارت و نگهداری

### بررسی منظم
- هر روز: بررسی logs برای خطاها
- هر هفته: بررسی فضای دیسک و پاکسازی فایل‌های موقت
- هر ماه: بروزرسانی packages و dependencies

### Logs مهم
```bash
# Worker logs
sudo journalctl -u pishro-worker -f

# Docker logs
docker compose logs -f video-processor

# Next.js logs (اگر با pm2 اجرا می‌کنید)
pm2 logs pishro
```

### Backup
- هر روز: backup از database
- هر هفته: backup از فایل‌های .env و تنظیمات

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های خطا را بررسی کنید
2. اسکریپت تست را اجرا کنید
3. به documentation مراجعه کنید: `deploy/DEPLOYMENT_GUIDE.md`

---

**✅ پس از تکمیل این چک‌لیست، سیستم پردازش ویدیوی شما آماده است!**
