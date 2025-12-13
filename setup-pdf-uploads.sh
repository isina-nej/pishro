#!/bin/bash

# تنظیم فولدر آپلود PDF برای CMS پیشرو-ادمین

# مسیرهای مورد نیاز
ADMIN_BASE="/opt/pishro-admin"
PDF_UPLOAD_DIR="$ADMIN_BASE/public/uploads/pdfs"
TEMP_DIR="$ADMIN_BASE/public/uploads/temp"

echo "🔧 شروع تنظیم فولدر آپلود PDF..."

# ایجاد دایرکتوری‌ها
echo "📁 ایجاد دایرکتوری‌ها..."
mkdir -p "$PDF_UPLOAD_DIR"
mkdir -p "$TEMP_DIR"

# تنظیم مجوزها
echo "🔐 تنظیم مجوزها..."
chmod 755 "$ADMIN_BASE/public"
chmod 755 "$ADMIN_BASE/public/uploads"
chmod 755 "$PDF_UPLOAD_DIR"
chmod 755 "$TEMP_DIR"

# اگر nginx یا docker استفاده می‌کند، ownership رو تنظیم کن
if id "www-data" >/dev/null 2>&1; then
    echo "👤 تغییر مالک فولدر برای www-data..."
    chown -R www-data:www-data "$ADMIN_BASE/public/uploads"
fi

# اگر docker با user استفاده می‌کند
if id "node" >/dev/null 2>&1; then
    echo "👤 تغییر مالک فولدر برای node user..."
    chown -R node:node "$ADMIN_BASE/public/uploads"
fi

# تخلیه فایل‌های قدیمی‌تر از 7 روز
echo "🗑️  حذف PDF‌های قدیم‌تر از 7 روز..."
find "$TEMP_DIR" -type f -mtime +7 -delete 2>/dev/null || true

# نمایش آماری
echo ""
echo "✅ تنظیم تکمیل شد!"
echo "📍 مسیر آپلود PDF: $PDF_UPLOAD_DIR"
echo "📊 وضعیت دایرکتوری‌ها:"
ls -lah "$ADMIN_BASE/public/uploads/" 2>/dev/null || echo "⚠️  دایرکتوری یافت نشد"
echo ""
echo "🧪 تست نوشتن فایل..."
if touch "$TEMP_DIR/test.txt" 2>/dev/null && rm "$TEMP_DIR/test.txt"; then
    echo "✅ مجوز نوشتن در دایرکتوری تأیید شد"
else
    echo "❌ خطا در نوشتن در دایرکتوری"
fi
