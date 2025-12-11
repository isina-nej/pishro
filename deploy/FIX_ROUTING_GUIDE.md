# تشخیص و رفع مشکل Routing

## 🔴 مشکل جاری
- `pishrosarmaye.com` → پنل ادمین را نمایش می‌دهد (باید سایت اصلی باشد)
- `admin.pishrosarmaye.com` → خطای 502 Bad Gateway (باید پنل باشد)
- پورت 3000 پنل را نمایش می‌دهد
- پورت 3001 پاسخ نمی‌دهد

## 🔍 ریشه مشکل
اپلیکیشن‌ها احتمالاً در پورت‌های اشتباه یا دایرکتوری‌های غلط راه‌اندازی شده‌اند:
- `/opt/pishro` باید سایت اصلی (port 3000) را اجرا کند
- `/opt/pishro-admin` باید پنل (port 3001) را اجرا کند

اما درحال حاضر:
- پورت 3000 پنل را نمایش می‌دهد (اپلیکیشن اشتباه)
- پورت 3001 پاسخ نمی‌دهد (اپلیکیشن شروع نشده)

## ✅ راه حل

### روش ۱: اجرای Script خودکار (توصیه‌شده)

```bash
ssh root@178.239.147.136
cd /opt/pishro
bash deploy/fix-routing.sh
```

این script به صورت خودکار:
1. تمام اپ‌های PM2 را متوقف می‌کند
2. فایل‌های `ecosystem.config.js` درست را ایجاد می‌کند
3. Nginx را آپدیت می‌کند
4. اپلیکیشن‌ها را در پورت‌های صحیح راه‌اندازی می‌کند
5. اتصال‌ها را تست می‌کند

### روش ۲: راه حل دستی

اگر script کار نکرد، مراحل زیر را دنبال کنید:

```bash
# 1. متوقف کردن
pm2 stop all
pm2 delete all

# 2. ایجاد ecosystem config برای pishro
cat > /opt/pishro/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: 'pishro',
    script: 'npm',
    args: 'run start',
    cwd: '/opt/pishro',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'mongodb://localhost:27017/pishro',
    },
  }],
};
EOF

# 3. ایجاد ecosystem config برای pishro-admin
cat > /opt/pishro-admin/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: 'pishro-admin',
    script: 'npm',
    args: 'run start',
    cwd: '/opt/pishro-admin',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'mongodb://localhost:27017/pishro',
    },
  }],
};
EOF

# 4. شروع
cd /opt/pishro && pm2 start ecosystem.config.js
cd /opt/pishro-admin && pm2 start ecosystem.config.js
pm2 save

# 5. تست
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3001/
```

## 🧪 تست

بعد از اجرای fix:

```bash
# بررسی PM2
pm2 status

# تست پورت‌ها
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3001/

# بررسی log‌ها
pm2 logs pishro --lines 50
pm2 logs pishro-admin --lines 50
```

## 📋 نکات مهم

1. **Nginx**: کنفیگ Nginx درست است و upstream ها صحیح اشاره می‌کنند
2. **Database**: هر دو اپ از یک Database استفاده می‌کنند (`pishro`)
3. **Static Files**: 
   - پورت 3000 از `/opt/pishro/public/` استفاده می‌کند
   - پورت 3001 از `/opt/pishro-admin/public/` استفاده می‌کند

## ❌ اگر باز هم کار نکرد

اگر پورت‌ها هنوز پاسخ نمی‌دهند:

```bash
# بررسی دقیق log ها
pm2 logs pishro --lines 100 --nostream
pm2 logs pishro-admin --lines 100 --nostream

# بررسی فرآیندهای Node
ps aux | grep node

# بررسی port listening
netstat -tuln | grep 300

# بررسی MongoDB
curl -I http://127.0.0.1:27017/ 2>&1 | head -5
```

## 📞 اگر لازم بود ری‌بیلد کنیم

اگر اپلیکیشن‌ها هنوز شروع نشدند:

```bash
# Rebuild pishro
cd /opt/pishro
npm run build

# Rebuild pishro-admin
cd /opt/pishro-admin
npm run build

# سپس restart
pm2 restart all
```
