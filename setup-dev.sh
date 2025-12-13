#!/bin/bash

# پیشرو Development Setup Script
# این اسکریپت محیط development را برای پروژه Pishro آماده می‌کند

echo "🚀 Pishro Development Setup"
echo "============================"
echo ""

# بررسی NodeJS
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نشده است"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# بررسی npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm نصب نشده است"
    exit 1
fi
echo "✅ npm: $(npm --version)"

# نصب dependencies
echo ""
echo "📦 نصب dependencies..."
npm install --legacy-peer-deps

# بررسی MongoDB
echo ""
echo "🗄️  بررسی MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB پیدا شد: $(mongod --version | head -1)"
else
    echo "⚠️  MongoDB نصب نشده است"
    echo "   برای نصب MongoDB Community Edition به link زیر مراجعه کنید:"
    echo "   https://docs.mongodb.com/manual/installation/"
fi

# ایجاد دایرکتوری uploads
echo ""
echo "📁 ایجاد دایرکتوری‌های ضروری..."
mkdir -p public/uploads
mkdir -p .next

echo ""
echo "✅ Setup مکمل شد!"
echo ""
echo "🎯 مراحل بعدی:"
echo ""
echo "اگر MongoDB نصب شده است:"
echo "  1. mongod --dbpath ./data/db"
echo "  2. npm run seed"
echo "  3. npm run dev"
echo ""
echo "اگر MongoDB نصب نشده است:"
echo "  1. npm run dev (صفحات static کار می‌کنند)"
echo ""
