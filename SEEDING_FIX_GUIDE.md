# 🔧 راهنمای حل مشکلات Seeding در سروری

## 🔴 مشکلات شناخت‌شده:

1. **SQL Syntax Error**: کلمه `Order` محفوظ است
2. **Unique Constraint Violations**: داده‌های تکراری
3. **Seed scripts** غیرقابل اعتماد برای run دوم

---

## ✅ حل‌های اعمال‌شده:

### 1️⃣ Cleanup Database (حذف کامل داده‌ها)

فایل `cleanup-database.sql` را اجرا کنید:

```bash
# روی سرور
mysql -u root -p pishro < cleanup-database.sql
```

یا دستور دستی:

```bash
mysql -u root -p pishro <<EOF
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM \`NewsletterSubscriber\`;
DELETE FROM \`PageContent\`;
DELETE FROM \`FAQ\`;
DELETE FROM \`LandingPageFeature\`;
DELETE FROM \`LandingPage\`;
DELETE FROM \`DigitalBook\`;
DELETE FROM \`Transaction\`;
DELETE FROM \`OrderItem\`;
DELETE FROM \`Order\`;
DELETE FROM \`Enrollment\`;
DELETE FROM \`Question\`;
DELETE FROM \`Quiz\`;
DELETE FROM \`Comment\`;
DELETE FROM \`CourseOnTag\`;
DELETE FROM \`Course\`;
DELETE FROM \`NewsArticle\`;
DELETE FROM \`User\`;
DELETE FROM \`Tag\`;
DELETE FROM \`Category\`;
DELETE FROM \`AdminUser\`;
SET FOREIGN_KEY_CHECKS=1;
EOF
```

### 2️⃣ اصلاحات Seed Scripts

توابع اصلاح‌شده:
- ✅ `seed-all.ts` - اضافه‌شدن cleanup بخش
- ✅ `seed-enrollments.ts` - تغییر از `create` به `upsert`
- ✅ `seed-news.ts` - تغییر از `create` به `upsert`
- ✅ `seed-books.ts` - تغییر از `create` به `upsert`

---

## 🚀 نحوه اجرا روی سرور:

### Step 1: Push تغییرات کد
```bash
git add prisma/seeds/
git commit -m "fix: seed scripts to handle duplicates"
git push
```

### Step 2: Pull روی سروری
```bash
cd /opt/pishro
git pull origin main
```

### Step 3: پاک‌سازی دیتابیس
```bash
# گزینه 1: با فایل SQL
mysql -u root -p pishro < cleanup-database.sql

# یا گزینه 2: دستی
mysql -u root -p pishro < < 'EOF'
... [SQL دستورات بالا] ...
EOF
```

### Step 4: اجرای Seed

```bash
# Development mode
NODE_ENV=development npm run seed

# یا
npm run seed:all
```

---

## 🐛 اگر هنوز مشکل داشت:

### خطای `Order` table:
```sql
-- Order محفوظ است، باید backtick استفاده شود
DELETE FROM `Order`;  -- ✅ درست
DELETE FROM Order;    -- ❌ اشتباه
```

### خطای Unique Constraint:
```
Unique constraint failed on: Enrollment_userId_courseId_key
→ علت: ایجاد duplicate enrollment
→ حل: seed script اکنون `upsert` استفاده می‌کند
```

### خطای Slug Duplicate:
```
Unique constraint failed on: NewsArticle_slug_key
→ علت: slug یکسان در دو نیوز
→ حل: seed script اکنون `upsert` استفاده می‌کند
```

---

## 📋 Checklist مراحل:

- [ ] فایل‌های جدید commit شده
- [ ] روی سرور pull شده
- [ ] Database cleanup انجام‌شده
- [ ] `npm run seed` موفق
- [ ] Admin login: sina@pishro.com / Admin@123
- [ ] داده‌های seed بررسی شده

---

## 💡 نکات مهم:

1. **Development mode**: دنبال کنید که `NODE_ENV=development` تنظیم باشد
2. **Backup**: قبل از cleanup، backup بگیرید (اگر داده مهم دارید)
3. **Permissions**: اطمینان دارید که MySQL user دسترسی DELETE دارد

---

## 📞 اگر مشکل دوباره رخ‌داد:

```bash
# 1. مطمئن شوید تغییرات کد اعمال‌شده
git log --oneline -5

# 2. دیتابیس کاملاً خالی است
mysql -u root -p pishro -e "SELECT COUNT(*) FROM AdminUser;"

# 3. seed log را ببینید
NODE_ENV=development npm run seed 2>&1 | head -100
```

---

**✅ اصلاحات اعمال‌شدند - آماده برای اجرا!**
