# راهنمای تنظیمات ذخیره‌سازی فایل در VPS

## مشکل قبلی
قبلاً فایل‌ها در مسیر `public/uploads` ذخیره می‌شدند که در محیط‌های خاص (مثل container یا محیط‌های read-only) این کار امکان‌پذیر نبود.

## راه‌حل جدید
حالا سیستم ذخیره‌سازی فایل‌ها به صورت زیر کار می‌کند:
1. فایل‌ها در یک مسیر قابل نوشتن خارج از کد ذخیره می‌شوند
2. فقط URL فایل در دیتابیس ذخیره می‌شود
3. مسیر ذخیره‌سازی و URL پایه از environment variables خوانده می‌شوند

---

## تنظیمات مورد نیاز در VPS

### 1. ایجاد پوشه ذخیره‌سازی

روی سرور VPS، پوشه‌ای برای ذخیره فایل‌ها ایجاد کنید:

```bash
# ایجاد پوشه اصلی
sudo mkdir -p /var/www/uploads




# دادن دسترسی نوشتن به user اجرای برنامه (معمولاً www-data یا node)
sudo chown -R www-data:www-data /var/www/uploads
# یا اگر با user دیگری اجرا می‌کنید:
# sudo chown -R your-user:your-user /var/www/uploads

# تنظیم مجوزها
sudo chmod -R 755 /var/www/uploads
```

### 2. تنظیم Nginx برای سرو فایل‌ها

فایل تنظیمات Nginx خود را ویرایش کنید (معمولاً در `/etc/nginx/sites-available/`):

```nginx
server {
    listen 80;
    server_name www.pishrosarmaye.com;

    # سرو فایل‌های استاتیک از پوشه uploads
    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";

        # CORS headers (در صورت نیاز)
        add_header Access-Control-Allow-Origin "*";
    }

    # سایر تنظیمات...
    location / {
        proxy_pass http://localhost:3000;
        # سایر proxy headers...
    }
}
```

سپس Nginx را restart کنید:

```bash
sudo nginx -t  # تست تنظیمات
sudo systemctl restart nginx
```

### 3. تنظیم Environment Variables

فایل `.env` خود را ویرایش کنید و این متغیرها را اضافه کنید:

```env
# مسیر فیزیکی ذخیره‌سازی فایل‌ها در سرور
UPLOAD_STORAGE_PATH="/var/www/uploads"

# URL پایه برای دسترسی به فایل‌ها
UPLOAD_BASE_URL="https://www.pishrosarmaye.com/uploads"
```

### 4. راه‌اندازی مجدد برنامه

پس از تنظیمات، برنامه Next.js را restart کنید:

```bash
# با PM2
pm2 restart app-name

# یا با systemd
sudo systemctl restart your-app-name
```

---

## تست

برای تست اینکه همه چیز درست کار می‌کند:

1. یک تصویر از پنل ادمین آپلود کنید
2. بررسی کنید که فایل در `/var/www/uploads/images/...` ذخیره شده است
3. URL تصویر را در مرورگر باز کنید و بررسی کنید که قابل دسترسی است

---

## نکات مهم

### حجم دیسک
مطمئن شوید که فضای کافی در VPS دارید:

```bash
df -h /var/www/uploads
```

### Backup
برای backup از فایل‌های آپلود شده، می‌توانید از `rsync` یا `tar` استفاده کنید:

```bash
# backup با tar
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/uploads

# backup با rsync به سرور دیگر
rsync -avz /var/www/uploads user@backup-server:/backups/
```

### امنیت
- مطمئن شوید که فایل‌های اجرایی در پوشه uploads ذخیره نمی‌شوند
- از Nginx برای محدود کردن نوع فایل‌های قابل دانلود استفاده کنید
- فایل‌های حساس (مثل .env) را هرگز در uploads قرار ندهید

---

## عیب‌یابی

### خطای Permission Denied
اگر خطای دسترسی می‌گیرید:

```bash
# بررسی مالک فایل
ls -la /var/www/uploads

# تغییر مالک به user صحیح
sudo chown -R www-data:www-data /var/www/uploads
```

### فایل‌ها در Nginx نمایش داده نمی‌شوند
بررسی کنید که:
- مسیر `alias` در Nginx درست باشد
- Nginx restart شده باشد
- SELinux یا AppArmor مانع دسترسی نشود

```bash
# غیرفعال کردن موقت SELinux برای تست
sudo setenforce 0
```

### فضای دیسک پر شده
برای پاک کردن فایل‌های قدیمی:

```bash
# حذف فایل‌های قدیمی‌تر از 90 روز
find /var/www/uploads -type f -mtime +90 -delete
```
