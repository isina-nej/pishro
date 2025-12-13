#!/bin/bash

echo "======================================"
echo "🧪 اختبار تمام مشکلات حل شده"
echo "======================================"
echo ""

# Test 1: CORS Headers
echo "1️⃣  تست CORS headers..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
  -H "Origin: https://admin.pishrosarmaye.com" \
  https://pishrosarmaye.com/api/auth/session
echo ""

# Test 2: Permissions Policy
echo "2️⃣  تست Permissions-Policy header..."
curl -s -I https://admin.pishrosarmaye.com | grep -i "permissions-policy"
echo ""

# Test 3: Books Upload URL (درست شده)
echo "3️⃣  تست Books Upload endpoint..."
echo "📍 URL: https://pishrosarmaye.com/api/admin/books/upload"
curl -s -X OPTIONS -I https://pishrosarmaye.com/api/admin/books/upload | grep -E "(HTTP|Access-Control)"
echo ""

# Test 4: Session endpoint
echo "4️⃣  تست Session endpoint..."
echo "📍 URL: https://pishrosarmaye.com/api/auth/session"
curl -s -X OPTIONS -I https://pishrosarmaye.com/api/auth/session | grep -E "(HTTP|Access-Control)"
echo ""

echo "======================================"
echo "✅ تمام تست‌ها کامل شدند"
echo "======================================"
