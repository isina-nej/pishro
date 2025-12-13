# 🔧 Pishro Troubleshooting Guide

## سریع‌ترین راه‌حل‌ها

### مشکل 1: "Cannot find module 'mongodb'" یا Database errors
**علت:** MongoDB نصب نشده است

**راه‌حل:**

#### گزینه A: نصب MongoDB Local (Windows)
1. دانلود از: https://www.mongodb.com/try/download/community
2. اجرای Installer
3. کمند زیر را در PowerShell اجرا کنید:
```powershell
mongod --dbpath "C:\data\db"
```

#### گزینه B: استفاده از Docker (اگر Docker دارید)
```powershell
docker run -d -p 27017:27017 --name pishro-mongo mongo:latest
```

#### گزینه C: اتصال به Database Remote (اگر دسترسی دارید)
تغییر `.env`:
```env
DATABASE_URL="mongodb://username:password@server:27017/pishro"
```

---

### مشکل 2: "Cannot GET /" یا صفحه خالی است
**علت:** Database خالی است یا connection timeout

**راه‌حل:**
```powershell
# اگر MongoDB اجرا شد
npm run seed

# یا برای comprehensive seed
npm run seed:reset
```

---

### مشکل 3: تصاویر لود نمی‌شوند
**علت:** بیشتر تصاویر از Database می‌آیند

**راه‌حل:**
- تصاویر static در `/public/images/` کار می‌کنند
- برای سایر تصاویر نیاز به Database است

---

### مشکل 4: "Error: ENOENT: no such file or directory"
**علت:** دایرکتوری uploads موجود نیست

**راه‌حل:**
```powershell
mkdir public\uploads
mkdir data\db
```

---

### مشکل 5: خطاهای TypeScript/ESLint
**راه‌حل:**
```powershell
npm run lint  # برای دیدن errors
```

---

## Debugging Console Errors

### 1. F12 را فشار دهید (Developer Tools)
### 2. رفتن به Console tab
### 3. جستجوی کنید:
```
❌ Failed to fetch home landing data  → Database issue
❌ Failed to fetch courses           → Database issue
⚠️  Image failed to load            → Image path issue
```

---

## Ports و URLs

```
Main App:   http://localhost:3000
Admin App:  http://localhost:3001  (اگر اجرا شود)
MongoDB:    localhost:27017
```

---

## Quick Status Check

```powershell
# بررسی نصب Node
node --version

# بررسی npm
npm --version

# بررسی MongoDB
mongod --version

# بررسی Port 3000
netstat -ano | findstr :3000
```

---

## اگر همه‌چیز خراب است 😱

```powershell
# 1. تمام processes را متوقف کنید (Ctrl+C)

# 2. Clean install
rm -r node_modules package-lock.json
npm install --legacy-peer-deps

# 3. دوباره شروع
npm run dev
```

---

## نمونه‌های Console خوب vs بد

### ✅ خوب (متوقع است):
```
✓ Next.js Ready in 1.5s
✓ Compiled successfully
⚠️ Error fetching home landing data: ...
```

### ❌ بد (مشکل‌ساز):
```
❌ TypeError: Cannot read property...
❌ SyntaxError: Unexpected token
❌ Module not found: ...
```

---

## لینک‌های مفید

- Node.js: https://nodejs.org/
- MongoDB: https://docs.mongodb.com/
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs/

---

**آخرین بروزرسانی:** December 13, 2025
