#!/usr/bin/env bash
# بازیابی اضطراری سایت روی /opt/pishro — یک‌جا، بدون تداخل بیلد و PM2
set -euo pipefail

cd /opt/pishro

echo "==> stop app"
pm2 stop pishro-app || true
# هر next باقی‌مانده را بکش تا .next قفل نباشد
pkill -f "next start" 2>/dev/null || true
pkill -f "node.*pishro" 2>/dev/null || true
sleep 1

echo "==> pull main"
git fetch --prune origin main
git pull --ff-only origin main

echo "==> wipe broken build"
rm -rf .next
# اگر پوشه گیر کرد:
if [ -d .next ]; then
  find .next -mindepth 1 -delete || true
  rm -rf .next || true
fi

echo "==> deps (if needed)"
if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  npm ci
fi

echo "==> clean build"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"
npm run build

if [ ! -f .next/BUILD_ID ]; then
  echo "FAILED: .next/BUILD_ID missing — build did not finish"
  exit 1
fi

if ! ls .next/static/chunks/webpack-*.js >/dev/null 2>&1; then
  echo "FAILED: webpack chunk missing"
  exit 1
fi

echo "==> start app"
pm2 start pishro-app --update-env || pm2 restart pishro-app --update-env
pm2 save

echo "==> health"
sleep 2
pm2 show pishro-app | head -40
echo "BUILD_ID=$(cat .next/BUILD_ID)"
ls .next/static/chunks/webpack-*.js
curl -sS -o /dev/null -w "local_home:%{http_code}\n" http://127.0.0.1:3000/ || true
curl -sS -o /dev/null -w "public_home:%{http_code}\n" https://pishrosarmaye.com/ || true

echo "==> done"
