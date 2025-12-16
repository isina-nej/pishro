# 🔒 راهنمای کامل نصب SSL رایگان (Let's Encrypt)

> راه‌اندازی HTTPS برای سایتت با گواهی رایگان Let's Encrypt

---

## 📋 فهرست

1. [SSL چیه و چرا لازمه؟](#1-ssl-چیه-و-چرا-لازمه)
2. [پیش‌نیازها](#2-پیشنیازها)
3. [نصب Nginx](#3-نصب-nginx)
4. [تنظیم DNS](#4-تنظیم-dns)
5. [نصب Certbot](#5-نصب-certbot)
6. [دریافت گواهی SSL](#6-دریافت-گواهی-ssl)
7. [تنظیم Nginx برای HTTPS](#7-تنظیم-nginx-برای-https)
8. [تمدید خودکار گواهی](#8-تمدید-خودکار-گواهی)
9. [تست و بررسی](#9-تست-و-بررسی)
10. [عیب‌یابی](#10-عیبیابی)

---

## 1. SSL چیه و چرا لازمه؟

### SSL چیه؟

SSL (Secure Sockets Layer) یک پروتکل امنیتی برای رمزنگاری اطلاعات بین مرورگر و سرور است.

### چرا لازمه؟

- 🔒 **امنیت**: اطلاعات کاربران رمزنگاری میشه
- ✅ **اعتماد**: مرورگرها علامت قفل سبز نشون میدن
- 📈 **SEO**: گوگل سایت‌های HTTPS رو بالاتر رتبه‌بندی می‌کنه
- ⚡ **عملکرد**: HTTP/2 فقط با HTTPS کار می‌کنه
- 🔐 **الزامی**: برای پرداخت آنلاین و دیتای حساس ضروریه

### Let's Encrypt چیه؟

یک سرویس رایگان که گواهی SSL صادر می‌کنه. کاملا رایگان و قابل اعتماد!

---

## 2. پیش‌نیازها

### ✅ چیزایی که باید داشته باشی:

- [ ] یک دامنه (domain) ثبت شده
- [ ] دامنه به IP سرورت وصل شده (DNS تنظیم شده)
- [ ] سرور Ubuntu 20.04+
- [ ] دسترسی SSH به سرور
- [ ] پورت 80 و 443 باز باشه

---

## 3. نصب Nginx

Nginx یک وب سرور است که درخواست‌ها رو به Next.js هدایت می‌کنه.

### نصب Nginx:

```bash
# بروزرسانی لیست بسته‌ها
sudo apt-get update

# نصب Nginx
sudo apt-get install -y nginx

# شروع Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# چک کردن وضعیت
sudo systemctl status nginx
```

### تست Nginx:

باز کن در مرورگر:

```
http://آدرس_IP_سرورت
```

باید صفحه پیش‌فرض Nginx رو ببینی.

---

## 4. تنظیم DNS

قبل از دریافت SSL، باید دامنه به IP سرورت وصل بشه.

### مراحل:

1. **برو به پنل ثبت دامنه** (مثلا: نیک نیم، نت افزار، ...)

2. **به قسمت DNS Management برو**

3. **یک رکورد A اضافه کن:**

   ```
   Type: A
   Name: @ (یا خالی بذار)
   Value: IP_سرورت
   TTL: 3600 (یا Auto)
   ```

4. **برای www هم یک رکورد اضافه کن:**
   ```
   Type: A
   Name: www
   Value: IP_سرورت
   TTL: 3600
   ```

### تست تنظیمات DNS:

```bash
# چک کردن دامنه اصلی
nslookup pishrosarmaye.com

# چک کردن www
nslookup www.pishrosarmaye.com

# یا با dig
dig pishrosarmaye.com
```

⏱️ **توجه:** تغییرات DNS ممکنه تا 24-48 ساعت طول بکشه (معمولا 1-2 ساعت کافیه).

---

## 5. نصب Certbot

Certbot ابزاری برای دریافت و مدیریت گواهی SSL از Let's Encrypt است.

### نصب:

```bash
# نصب Certbot و پلاگین Nginx
sudo apt-get install -y certbot python3-certbot-nginx
```

### چک کردن نصب:

```bash
certbot --version
```

باید شبیه این باشه:

```
certbot 1.x.x
```

---

## 6. دریافت گواهی SSL

### مرحله 1: تنظیم اولیه Nginx

ابتدا باید یک فایل پیکربندی برای سایتت بسازی:

```bash
sudo nano /etc/nginx/sites-available/pishro
```

محتوای فایل:

```nginx
server {
    listen 80;
    server_name pishrosarmaye.com www.pishrosarmaye.com;

    location / {
        proxy_pass http://localhost:3000;
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

**نکته:** `pishrosarmaye.com` رو با دامنه واقعیت جایگذین کن!

### ذخیره فایل:

- `Ctrl + O` → `Enter` → `Ctrl + X`

### فعال کردن سایت:

```bash
# ایجاد symlink
sudo ln -s /etc/nginx/sites-available/pishro /etc/nginx/sites-enabled/

# حذف سایت پیش‌فرض
sudo rm /etc/nginx/sites-enabled/default

# تست پیکربندی
sudo nginx -t

# اگه OK بود، restart کن
sudo systemctl restart nginx
```

### مرحله 2: دریافت گواهی SSL

```bash
sudo certbot --nginx -d pishrosarmaye.com -d www.pishrosarmaye.com -d pishro.isina-nej.com 
```

**جایگذاری:**

- `pishrosarmaye.com` با دامنه واقعیت

### سوالات Certbot:

1. **ایمیل:**

   ```
   Enter email address: your-email@example.com
   ```

2. **شرایط استفاده:**

   ```
   Please read the Terms of Service...
   (A)gree/(C)ancel: A
   ```

3. **اشتراک خبرنامه:**

   ```
   Would you be willing to share your email...
   (Y)es/(N)o: N  (یا Y، هرکدوم که می‌خوای)
   ```

4. **Redirect به HTTPS:**

   ```
   Please choose whether or not to redirect HTTP to HTTPS:
   1: No redirect
   2: Redirect (توصیه می‌شود)

   Select the appropriate number [1-2] then [enter]: 2
   ```

### ✅ موفقیت!

باید پیامی شبیه این ببینی:

```
Congratulations! Your certificate and chain have been saved at:
/etc/letsencrypt/live/pishrosarmaye.com/fullchain.pem

Your key file has been saved at:
/etc/letsencrypt/live/pishrosarmaye.com/privkey.pem

Your cert will expire on 2025-XX-XX.
```

---

## 7. تنظیم Nginx برای HTTPS

Certbot به صورت خودکار Nginx رو تنظیم می‌کنه، ولی بذار چک کنیم:

### مشاهده فایل پیکربندی:

```bash
cat /etc/nginx/sites-available/pishro
```

باید شبیه این باشه:

```nginx
server {
    server_name pishrosarmaye.com www.pishrosarmaye.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/pishrosarmaye.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/pishrosarmaye.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.pishrosarmaye.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = pishrosarmaye.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name pishrosarmaye.com www.pishrosarmaye.com;
    return 404; # managed by Certbot
}
```

### Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## 8. تمدید خودکار گواهی

گواهی Let's Encrypt هر 90 روز منقضی میشه، ولی Certbot به صورت خودکار تمدیدش می‌کنه.

### تست تمدید خودکار:

```bash
sudo certbot renew --dry-run
```

اگه بدون خطا اجرا شد، یعنی تمدید خودکار به درستی کار می‌کنه!

### چک کردن Cron Job:

```bash
# مشاهده timer systemd
sudo systemctl list-timers | grep certbot

# یا چک کردن cron
sudo cat /etc/cron.d/certbot
```

---

## 9. تست و بررسی

### 1. باز کردن سایت با HTTPS:

```
https://pishrosarmaye.com
```

باید:

- ✅ قفل سبز در مرورگر ببینی
- ✅ سایت بدون هیچ خطایی باز بشه
- ✅ اگه HTTP وارد کنی، به HTTPS redirect بشه

### 2. تست SSL با ابزارهای آنلاین:

برو به: https://www.ssllabs.com/ssltest/

آدرس سایتت رو وارد کن و `Submit` بزن.

باید رتبه **A** یا **A+** بگیری!

### 3. چک کردن گواهی در مرورگر:

- روی قفل سبز کلیک کن
- `Certificate` یا `گواهی` رو انتخاب کن
- باید ببینی:
  - Issued by: Let's Encrypt
  - Valid until: تاریخ 90 روز بعد

---

## 10. عیب‌یابی

### مشکل 1: خطا "Connection refused"

**علت:** Nginx یا Next.js در حال اجرا نیست.

**راه‌حل:**

```bash
# چک Nginx
sudo systemctl status nginx
sudo systemctl restart nginx

# چک Next.js
pm2 status
pm2 restart pishro-app
```

---

### مشکل 2: خطا "DNS problem: NXDOMAIN"

**علت:** DNS تنظیم نشده یا هنوز propagate نشده.

**راه‌حل:**

```bash
# تست DNS
nslookup pishrosarmaye.com
dig pishrosarmaye.com

# صبر کن تا DNS propagate بشه (1-48 ساعت)
```

---

### مشکل 3: خطا "Too many certificates"

**علت:** خیلی زیاد درخواست SSL دادی (محدودیت: 50 گواهی در هفته).

**راه‌حل:**

- صبر کن تا هفته بعد
- یا از staging environment استفاده کن:

```bash
sudo certbot --nginx --staging -d pishrosarmaye.com
```

---

### مشکل 4: "ERR_SSL_PROTOCOL_ERROR"

**علت:** پورت 443 بسته است.

**راه‌حل:**

```bash
# باز کردن پورت 443
sudo ufw allow 443/tcp
sudo ufw reload

# چک کردن
sudo ufw status
```

---

### مشکل 5: تمدید خودکار کار نمی‌کنه

**راه‌حل:**

```bash
# تست تمدید
sudo certbot renew --dry-run

# اگه خطا داد، لاگ‌ها رو ببین
sudo cat /var/log/letsencrypt/letsencrypt.log

# تمدید دستی
sudo certbot renew
```

---

## 🔒 نکات امنیتی

### 1. فعال کردن HSTS:

به فایل Nginx اضافه کن:

```bash
sudo nano /etc/nginx/sites-available/pishro
```

در بخش `server` که `listen 443` داره، اضافه کن:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 2. غیرفعال کردن TLS قدیمی:

در همون فایل:

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
```

### 3. Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## 📊 دستورات مفید

### مشاهده تمام گواهی‌ها:

```bash
sudo certbot certificates
```

### حذف یک گواهی:

```bash
sudo certbot delete --cert-name pishrosarmaye.com
```

### تمدید دستی:

```bash
sudo certbot renew
```

### تست تمدید:

```bash
sudo certbot renew --dry-run
```

### مشاهده لاگ‌ها:

```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## ✅ چک‌لیست نهایی

- [ ] Nginx نصب شده
- [ ] DNS تنظیم شده (A record)
- [ ] پورت 80 و 443 باز است
- [ ] Certbot نصب شده
- [ ] گواهی SSL دریافت شده
- [ ] سایت با HTTPS باز میشه
- [ ] قفل سبز در مرورگر نمایش داده میشه
- [ ] HTTP به HTTPS redirect میشه
- [ ] تست SSL Labs رتبه A گرفته
- [ ] تمدید خودکار تست شده

---

## 🎯 خلاصه دستورات (کپی و پیست)

```bash
# 1. نصب Nginx
sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 2. نصب Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 3. ساخت فایل پیکربندی Nginx
sudo nano /etc/nginx/sites-available/pishro
# محتوای فایل رو از بالا کپی کن

# 4. فعال کردن سایت
sudo ln -s /etc/nginx/sites-available/pishro /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 5. دریافت SSL
sudo certbot --nginx -d pishrosarmaye.com -d www.pishrosarmaye.com

# 6. تست تمدید
sudo certbot renew --dry-run

# 7. باز کردن سایت
# https://pishrosarmaye.com
```

---

## 📚 منابع بیشتر

- **Let's Encrypt:** https://letsencrypt.org/
- **Certbot:** https://certbot.eff.org/
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **راهنمای مبتدیان:** `deploy/BEGINNER_GUIDE.md`
- **راهنمای کامل:** `deploy/DEPLOYMENT_GUIDE.md`

---

**موفق باشی! 🔒🚀**
