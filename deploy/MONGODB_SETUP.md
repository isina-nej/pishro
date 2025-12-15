# 🗄️ راهنمای نصب و تنظیم MongoDB در سرور

این راهنما مراحل نصب MongoDB 7.0 در Ubuntu 20.04+ را شرح می‌دهد.

---

## 📋 فهرست مطالب

1. [نصب MongoDB](#نصب-mongodb)
2. [تنظیمات امنیتی](#تنظیمات-امنیتی)
3. [ایجاد کاربر و Database](#ایجاد-کاربر-و-database)
4. [تنظیم دسترسی از راه دور](#تنظیم-دسترسی-از-راه-دور)
5. [Backup و Restore](#backup-و-restore)
6. [عیب‌یابی](#عیب‌یابی)

---

## 🚀 نصب MongoDB

### روش 1: نصب با apt (توصیه می‌شود)

```bash
# 1. نصب dependencies
sudo apt-get install -y gnupg curl

# 2. اضافه کردن MongoDB public GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# 3. ایجاد list file برای MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 4. بروزرسانی package database
sudo apt-get update

# 5. نصب MongoDB
sudo apt-get install -y mongodb-org

# 6. شروع MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 7. بررسی وضعیت
sudo systemctl status mongod
```

### روش 2: نصب با Docker (سریع برای تست)

```bash
# اجرای MongoDB در Docker
docker run -d \
  --name pishro-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD="sdfjkdsDFsd7943r8eDFA" \
  -v mongodb_data:/data/db \
  --restart unless-stopped \
  mongo:7.0

# بررسی logs
docker logs -f pishro-mongo

# اتصال به MongoDB shell
docker exec -it pishro-mongo mongosh -u admin -p "sdfjkdsDFsd7943r8eDFA"
```

---

## 🔐 تنظیمات امنیتی

### 1. فعال‌سازی Authentication

ویرایش فایل تنظیمات MongoDB:

```bash
sudo nano /etc/mongod.conf
```

اضافه کردن خطوط زیر:

```yaml
security:
  authorization: enabled

net:
  port: 27017
  bindIp: 127.0.0.1,178.239.147.136
```

**نکته:** `YOUR_SERVER_IP` را با IP سرور خود جایگزین کنید. اگر فقط به صورت local استفاده می‌کنید، فقط `127.0.0.1` کافی است.

### 2. ایجاد کاربر Admin

اتصال به MongoDB بدون authentication:

```bash
mongosh
```

ایجاد کاربر admin:

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
```

خروج و restart MongoDB:

```bash
exit
sudo systemctl restart mongod
```

---

## 👤 ایجاد کاربر و Database برای پروژه

### 1. اتصال با کاربر Admin

```bash
mongosh -u admin -p --authenticationDatabase admin
```

### 2. ایجاد Database و کاربر برای پروژه اصلی (pishro)

```javascript
// سوییچ به database پیشرو
use pishro

// ایجاد کاربر برای پروژه
db.createUser({
  user: "pishro_user",
  pwd: "pishro-secure-password-123",
  roles: [
    { role: "readWrite", db: "pishro" },
    { role: "dbAdmin", db: "pishro" }
  ]
})
```

### 3. ایجاد Database و کاربر برای پروژه CMS (pishro-admin)

```javascript
// سوییچ به database CMS
use pishro_admin

// ایجاد کاربر برای CMS
db.createUser({
  user: "pishro_admin_user",
  pwd: "cms-secure-password-456",
  roles: [
    { role: "readWrite", db: "pishro_admin" },
    { role: "dbAdmin", db: "pishro_admin" }
  ]
})
```

### 4. تست اتصال

```bash
# تست اتصال به database پروژه اصلی
mongosh "mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro"

# تست اتصال به database CMS
mongosh "mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"
```

---

## 🌐 تنظیم دسترسی از راه دور (اختیاری)

اگر می‌خواهید از یک سرور دیگر به MongoDB دسترسی داشته باشید:

### 1. تغییر bindIp

```bash
sudo nano /etc/mongod.conf
```

```yaml
net:
  port: 27017
  bindIp: 0.0.0.0 # برای دسترسی از همه IPها
```

### 2. تنظیم Firewall

```bash
# باز کردن پورت MongoDB
sudo ufw allow 27017/tcp

# یا فقط برای IP خاص
sudo ufw allow from YOUR_CLIENT_IP to any port 27017
```

### 3. Restart MongoDB

```bash
sudo systemctl restart mongod
```

**⚠️ هشدار امنیتی:**

- هرگز MongoDB را بدون authentication به اینترنت متصل نکنید
- از IP whitelist استفاده کنید
- از VPN یا SSH Tunnel استفاده کنید
- در production، از MongoDB Atlas یا replica set استفاده کنید

---

## 💾 Backup و Restore

### Backup

```bash
# Backup کل دیتابیس
mongodump --uri="mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro" --out=/backup/mongo-$(date +%Y%m%d)

# Backup تنها یک collection
mongodump --uri="mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro" --collection=users --out=/backup/users-$(date +%Y%m%d)

# فشرده‌سازی backup
tar -czf /backup/mongo-$(date +%Y%m%d).tar.gz /backup/mongo-$(date +%Y%m%d)
```

### Restore

```bash
# Restore از backup
mongorestore --uri="mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro" /backup/mongo-20240101/pishro/

# Restore با drop کردن collection‌های موجود
mongorestore --uri="mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro" --drop /backup/mongo-20240101/pishro/
```

### Backup خودکار با Cron

```bash
# ویرایش crontab
crontab -e

# اضافه کردن backup روزانه در ساعت 2 صبح
0 2 * * * mongodump --uri="mongodb://pishro_user:YOUR_PASSWORD@localhost:27017/pishro" --out=/backup/mongo-$(date +\%Y\%m\%d) && tar -czf /backup/mongo-$(date +\%Y\%m\%d).tar.gz /backup/mongo-$(date +\%Y\%m\%d) && rm -rf /backup/mongo-$(date +\%Y\%m\%d)

# پاکسازی backupهای قدیمی‌تر از 7 روز
0 3 * * * find /backup -name "mongo-*.tar.gz" -mtime +7 -delete
```

---

## 🔧 تنظیمات Production

### محدود کردن مصرف حافظه

```bash
sudo nano /etc/mongod.conf
```

```yaml
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2 # محدود کردن به 2GB RAM
```

### فعال‌سازی Log Rotation

```yaml
systemLog:
  destination: file
  logRotate: reopen
  path: /var/log/mongodb/mongod.log
  logAppend: true
```

### Restart برای اعمال تغییرات

```bash
sudo systemctl restart mongod
```

---

## 📊 Monitoring و نظارت

### بررسی وضعیت

```bash
# وضعیت service
sudo systemctl status mongod

# مشاهده logs
sudo tail -f /var/log/mongodb/mongod.log

# اتصال به MongoDB shell
mongosh -u admin -p --authenticationDatabase admin
```

### دستورات مفید در MongoDB shell

```javascript
// نمایش دیتابیس‌ها
show dbs

// سوییچ به database
use pishro

// نمایش collections
show collections

// آمار دیتابیس
db.stats()

// آمار collection
db.users.stats()

// تعداد documents
db.users.countDocuments()

// مشاهده فضای دیسک
db.runCommand({ dbStats: 1, scale: 1024*1024 })
```

### نظارت بر عملکرد

```javascript
// استفاده از admin database
use admin

// بررسی عملیات فعلی
db.currentOp()

// بررسی وضعیت سرور
db.serverStatus()

// kill کردن عملیات
db.killOp(opid)
```

---

## 🔍 عیب‌یابی

### MongoDB شروع نمی‌شود

```bash
# بررسی logs
sudo tail -50 /var/log/mongodb/mongod.log

# بررسی وضعیت
sudo systemctl status mongod

# بررسی پورت
sudo netstat -tulpn | grep 27017

# بررسی دسترسی به فایل‌ها
sudo ls -la /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb
```

### خطای Authentication

```bash
# غیرفعال موقت authentication
sudo nano /etc/mongod.conf
# کامنت کردن security section

# restart
sudo systemctl restart mongod

# ساخت کاربر مجدد
mongosh
use admin
db.createUser(...)

# فعال مجدد authentication
# uncomment security section و restart
```

### فضای دیسک پر

```bash
# بررسی فضا
df -h
du -sh /var/lib/mongodb/*

# فشرده‌سازی دیتابیس
mongosh
use pishro
db.runCommand({ compact: 'collectionName' })

# یا repair کردن
sudo systemctl stop mongod
sudo -u mongodb mongod --repair --dbpath /var/lib/mongodb
sudo systemctl start mongod
```

### مشکل Connection

```bash
# بررسی firewall
sudo ufw status

# بررسی bindIp
cat /etc/mongod.conf | grep bindIp

# تست اتصال
telnet localhost 27017
mongosh --host localhost --port 27017
```

---

## 📝 Connection Strings

پس از تنظیم MongoDB، در فایل `.env` پروژه‌ها از این connection strings استفاده کنید:

### برای پروژه اصلی (pishro):

```env
DATABASE_URL="mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro"
```

### برای پروژه CMS (pishro-admin):

```env
DATABASE_URL="mongodb://pishro_admin_user:cms-secure-password-456@localhost:27017/pishro_admin"
```

### اگر MongoDB روی سرور دیگری است:

```env
DATABASE_URL="mongodb://username:password@SERVER_IP:27017/database_name"
```

### با SSL/TLS:

```env
DATABASE_URL="mongodb://username:password@SERVER_IP:27017/database_name?ssl=true&authSource=admin"
```

---

## 🔷 راه‌اندازی Prisma با MongoDB

پس از نصب MongoDB و ایجاد database، باید Prisma را راه‌اندازی کنید.

### 1. بررسی فایل .env

مطمئن شوید که در فایل `.env` پروژه، connection string درست تنظیم شده است:

```bash
# مشاهده فایل .env
cat .env | grep DATABASE_URL
```

باید خروجی شبیه این ببینید:
```
DATABASE_URL="mongodb://pishro_user:your-password@localhost:27017/pishro"
```

### 2. تست اتصال به MongoDB

قبل از اجرای Prisma، اتصال به MongoDB را تست کنید:

```bash
# تست اتصال با mongosh
mongosh "mongodb://pishro_user:pishro-secure-password-123@localhost:27017/pishro"

# باید به shell MongoDB وصل شوید
# برای خروج: exit
```

### 3. Generate کردن Prisma Client

```bash
# رفتن به پوشه پروژه
cd /opt/pishro  # یا مسیر پروژه شما

# Generate کردن Prisma Client
npx prisma generate
```

این دستور Prisma Client را بر اساس `schema.prisma` می‌سازد.

### 4. Push کردن Schema به MongoDB

برای ساختن Collections و Indexes در MongoDB:

```bash
# Push کردن schema به MongoDB
npx prisma db push
```

این دستور:
- تمام Collections را در MongoDB می‌سازد
- Indexes را تنظیم می‌کند
- Schema را Sync می‌کند

**خروجی موفقیت‌آمیز:**
```
Your database is now in sync with your Prisma schema. Done in XXms

✔ Generated Prisma Client
```

### 5. بررسی Collections ساخته شده

```bash
# اتصال به MongoDB
mongosh "mongodb://pishro_user:your-password@localhost:27017/pishro"

# نمایش collections
show collections

# خروج
exit
```

باید collections زیر را ببینید:
- User
- TempUser
- Otp
- Course
- Lesson
- Video
- Comment
- Order
- و...

### 6. (اختیاری) Seed کردن دیتای اولیه

اگر اسکریپت seed دارید، می‌توانید دیتای اولیه را وارد کنید:

```bash
# اگر اسکریپت seed در package.json تعریف شده
npm run seed

# یا اگر فایل seed.ts دارید
npx tsx prisma/seed.ts
```

### 7. تست عملکرد Prisma

یک تست ساده برای اطمینان از عملکرد Prisma:

```bash
# ساخت یک فایل تست
cat > test-prisma.ts << 'EOF'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔍 Testing Prisma connection...")

  // تست شمارش کاربران
  const userCount = await prisma.user.count()
  console.log(`✅ Users count: ${userCount}`)

  // تست شمارش دوره‌ها
  const courseCount = await prisma.course.count()
  console.log(`✅ Courses count: ${courseCount}`)

  console.log("✅ Prisma is working correctly!")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
EOF

# اجرای تست
npx tsx test-prisma.ts

# پاک کردن فایل تست
rm test-prisma.ts
```

---

## 🔧 عیب‌یابی Prisma

### خطا: "Can't reach database server"

**راه‌حل:**
```bash
# 1. چک کردن که MongoDB در حال اجرا است
sudo systemctl status mongod

# 2. تست اتصال با mongosh
mongosh "mongodb://localhost:27017"

# 3. بررسی connection string در .env
cat .env | grep DATABASE_URL

# 4. بررسی firewall
sudo ufw status
```

### خطا: "Authentication failed"

**راه‌حل:**
```bash
# 1. چک کردن username و password در .env
cat .env | grep DATABASE_URL

# 2. تست اتصال دستی
mongosh "mongodb://username:password@localhost:27017/pishro"

# 3. اگر کار نکرد، کاربر را مجدد بسازید
mongosh -u admin -p --authenticationDatabase admin
use pishro
db.dropUser("pishro_user")
db.createUser({
  user: "pishro_user",
  pwd: "new-password",
  roles: [
    { role: "readWrite", db: "pishro" },
    { role: "dbAdmin", db: "pishro" }
  ]
})
exit

# 4. بروزرسانی .env با password جدید
nano .env
```

### خطا: "Prisma schema validation failed"

**راه‌حل:**
```bash
# بررسی صحت schema
npx prisma validate

# فرمت کردن schema
npx prisma format
```

### خطا: "Failed to push schema"

**راه‌حل:**
```bash
# پاک کردن cache Prisma
rm -rf node_modules/.prisma

# Generate مجدد
npx prisma generate

# Push مجدد
npx prisma db push
```

---

## 🔄 دستورات مفید Prisma

### مشاهده وضعیت Schema
```bash
npx prisma validate
```

### فرمت کردن Schema
```bash
npx prisma format
```

### مشاهده Schema در مرورگر (Prisma Studio)
```bash
npx prisma studio
```

این دستور یک رابط کاربری وب در `http://localhost:5555` باز می‌کند که می‌توانید:
- Collections را مشاهده کنید
- دیتا را ویرایش کنید
- رکوردهای جدید اضافه کنید

**نکته:** برای استفاده در production، از `--port` و `--browser none` استفاده کنید:
```bash
npx prisma studio --port 5555 --browser none
```

### Pull کردن Schema از Database
```bash
# اگر تغییراتی مستقیم در MongoDB انجام دادید
npx prisma db pull
```

### Reset کردن Database (⚠️ خطرناک - تمام دیتا پاک می‌شود)
```bash
# تنها برای development
npx prisma db push --force-reset
```

---

## 🔒 چک‌لیست امنیتی

- [ ] Authentication فعال شده است
- [ ] کاربر admin با رمز قوی ساخته شده
- [ ] کاربرهای جداگانه برای هر database ساخته شده
- [ ] bindIp محدود به IP‌های مورد نیاز است
- [ ] Firewall تنظیم شده است
- [ ] Backup خودکار فعال است
- [ ] Log rotation فعال است
- [ ] رمزهای عبور در `.env` ذخیره شده و از git ignore شده‌اند

---

## 📚 منابع بیشتر

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)

---

**موفق باشید! 🚀**
