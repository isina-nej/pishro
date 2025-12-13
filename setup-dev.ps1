# پیشرو Development Setup Script (Windows)
# این اسکریپت محیط development را برای پروژه Pishro آماده می‌کند

Write-Host "🚀 Pishro Development Setup" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# بررسی NodeJS
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js نصب نشده است" -ForegroundColor Red
    exit 1
}

# بررسی npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm نصب نشده است" -ForegroundColor Red
    exit 1
}

# نصب dependencies
Write-Host ""
Write-Host "📦 نصب dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# بررسی MongoDB
Write-Host ""
Write-Host "🗄️  بررسی MongoDB..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version
    Write-Host "✅ MongoDB پیدا شد: $mongoVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MongoDB نصب نشده است" -ForegroundColor Yellow
    Write-Host "   برای نصب MongoDB Community Edition به link زیر مراجعه کنید:" -ForegroundColor Yellow
    Write-Host "   https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/" -ForegroundColor Yellow
}

# ایجاد دایرکتوری‌های ضروری
Write-Host ""
Write-Host "📁 ایجاد دایرکتوری‌های ضروری..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path public\uploads | Out-Null
New-Item -ItemType Directory -Force -Path .\.next | Out-Null

Write-Host ""
Write-Host "✅ Setup مکمل شد!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 مراحل بعدی:" -ForegroundColor Cyan
Write-Host ""
Write-Host "اگر MongoDB نصب شده است:" -ForegroundColor White
Write-Host "  1. mongod --dbpath ./data/db" -ForegroundColor Gray
Write-Host "  2. npm run seed" -ForegroundColor Gray
Write-Host "  3. npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "اگر MongoDB نصب نشده است:" -ForegroundColor White
Write-Host "  1. npm run dev (صفحات static کار می‌کنند)" -ForegroundColor Gray
Write-Host ""
