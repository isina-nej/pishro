#!/usr/bin/env bash
#
# دیپلوی pull-based برای /opt/pishro
#
# چرا این‌طور و نه GitHub Actions:
#   رانرهای گیت‌هاب نمی‌توانند به پورت ۲۲ این سرور وصل شوند (مسدودسازی بالادست،
#   نه فایروال خود سرور). و چون مخزن عمومی است، self-hosted runner یعنی هر
#   fork می‌تواند با یک PR کد دلخواه روی این ماشین اجرا کند.
#
#   این اسکریپت برعکس عمل می‌کند: سرور خودش می‌پرسد. فقط چیزی را دیپلوی می‌کند
#   که از قبل روی origin/main نشسته — و روی main فقط نگهدارنده‌ها push می‌کنند.
#   پس عمومی بودن مخزن سطح حمله‌ای اضافه نمی‌کند.
#
# نسخه مرجع اینجا نگهداری می‌شود، ولی نسخه‌ای که cron اجرا می‌کند باید در
# /usr/local/bin/pishro-deploy باشد — بیرون از working tree گیت. وگرنه
# `git pull` وسط اجرا فایل در حال اجرا را بازنویسی می‌کند و bash قاطی می‌کند.
#
# نصب/به‌روزرسانی نسخه در حال اجرا:
#   install -m 755 /opt/pishro/scripts/deploy-from-main.sh /usr/local/bin/pishro-deploy

set -euo pipefail

REPO_DIR=${PISHRO_REPO_DIR:-/opt/pishro}
BRANCH=${PISHRO_BRANCH:-main}
PM2_APP=${PISHRO_PM2_APP:-pishro-app}
LOG_FILE=${PISHRO_LOG:-/var/log/pishro-deploy.log}
LOCK_FILE=${PISHRO_LOCK:-/var/lock/pishro-deploy.lock}

# build چند دقیقه طول می‌کشد و بازه cron کوتاه‌تر از آن است. بدون قفل، دو اجرا
# روی هم می‌افتند و .next را نصفه‌کاره می‌کنند.
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  exit 0
fi

exec >>"$LOG_FILE" 2>&1

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

cd "$REPO_DIR"

# resolv.conf روی این سرور مستقیم به شکن اشاره می‌کند و کش محلی وجود ندارد، پس
# هر lookup روی شبکه می‌رود. یک قطعی لحظه‌ای، fetch را با
# "Could not resolve host: github.com" می‌اندازد. چند بار تلاش می‌کنیم تا یک
# تپق شبکه دیپلوی را تا چرخه بعدی cron عقب نیندازد.
fetched=0
fetch_err=""
for attempt in 1 2 3; do
  if fetch_err=$(git fetch --prune --quiet origin "$BRANCH" 2>&1); then
    fetched=1
    break
  fi
  if [ "$attempt" -lt 3 ]; then
    sleep $((attempt * 5))
  fi
done

if [ "$fetched" -eq 0 ]; then
  # cron پنج دقیقه دیگر دوباره تلاش می‌کند، پس این کشنده نیست — فقط ثبتش می‌کنیم.
  log "fetch نشد بعد از ۳ تلاش: ${fetch_err//$'\n'/ }"
  exit 1
fi

local_sha=$(git rev-parse HEAD)
remote_sha=$(git rev-parse "origin/$BRANCH")

if [ "$local_sha" = "$remote_sha" ]; then
  exit 0
fi

log "=== new commit on $BRANCH: ${local_sha:0:7} -> ${remote_sha:0:7} ==="

# --ff-only و نه reset --hard: اگر کسی روی سرور چیزی دستکاری کرده، بلند شکست
# بخورد به‌جای اینکه بی‌صدا دور ریخته شود.
if ! git pull --ff-only origin "$BRANCH"; then
  log "FAILED: git pull. کار نیمه‌تمام روی سرور هست یا تاریخچه بازنویسی شده."
  log "        اپ در حال اجرا دست‌نخورده ماند."
  exit 1
fi

changed=$(git diff --name-only "$local_sha" "$remote_sha")

# npm ci حدود دو تا چهار دقیقه است؛ فقط وقتی وابستگی‌ها عوض شده‌اند لازم است.
if grep -qE '^(package-lock\.json|package\.json)$' <<<"$changed"; then
  log "وابستگی‌ها تغییر کرده — npm ci"
  npm ci
elif grep -qE '^prisma/schema\.prisma$' <<<"$changed"; then
  # postinstall معمولاً این را می‌زند، ولی وقتی npm ci اجرا نشود کسی نمی‌زند.
  log "اسکیمای Prisma تغییر کرده — prisma generate"
  npx prisma generate
fi

# next build پوشهٔ .next را وسط کار عوض می‌کند. اگر pm2 همزمان از همان
# پوشه سرو کند، HTML و چانک‌ها از دو بیلد قاطی می‌شوند و کل سایت
# Application error می‌دهد. قبل از build باید اپ را متوقف کرد.
log "stop $PM2_APP before build (avoid corrupt .next while serving)"
pm2 stop "$PM2_APP" || true

log "build"
if ! NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}" npm run build; then
  log "FAILED: build. تلاش برای بالا آوردن مجدد اپ با .next فعلی."
  pm2 start "$PM2_APP" --update-env || pm2 restart "$PM2_APP" --update-env || true
  exit 1
fi

log "start $PM2_APP"
pm2 start "$PM2_APP" --update-env || pm2 restart "$PM2_APP" --update-env
pm2 save

log "=== دیپلوی ${remote_sha:0:7} تمام شد ==="
