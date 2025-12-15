#!/bin/bash
##############################################
# Pishro Video Processing Server Setup
# Ubuntu 20.04+ Setup Script
# نصب خودکار FFmpeg و dependencies
##############################################

set -e  # خروج در صورت بروز خطا

echo "======================================"
echo "🚀 Pishro Server Setup Script"
echo "======================================"
echo ""

# رنگ‌ها برای output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تابع برای چاپ پیام‌های رنگی
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# بررسی root access
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root (use sudo)"
    exit 1
fi

print_info "Starting installation..."
echo ""

#############################################
# 1. بروزرسانی سیستم
#############################################
echo "📦 Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq
print_success "System updated"
echo ""

#############################################
# 2. نصب FFmpeg
#############################################
echo "🎬 Installing FFmpeg..."
apt-get install -y ffmpeg
print_success "FFmpeg installed"
echo ""

# بررسی نصب FFmpeg
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    print_success "FFmpeg version: $FFMPEG_VERSION"
else
    print_error "FFmpeg installation failed"
    exit 1
fi

if command -v ffprobe &> /dev/null; then
    print_success "FFprobe is available"
else
    print_error "FFprobe installation failed"
    exit 1
fi
echo ""

#############################################
# 3. نصب Node.js 20 LTS
#############################################
echo "📦 Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
print_success "Node.js installed"

# بررسی نصب Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
else
    print_error "Node.js installation failed"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
else
    print_error "npm installation failed"
    exit 1
fi
echo ""

#############################################
# 4. نصب MongoDB 4.4 (Manual Binary)
# این روش برای سرورهای بدون AVX و دارای تحریم مخازن استفاده می‌شود
#############################################
echo "🍃 Installing MongoDB 4.4 (Manual Binary)..."

# نصب پیش‌نیاز قدیمی libssl1.1
echo "   Installing libssl1.1 dependency..."
cd /tmp
wget -q http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb || apt-get install -f -y

# دانلود و نصب باینری اصلی
echo "   Downloading MongoDB binaries..."
wget -q https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.29.tgz
tar -zxvf mongodb-linux-x86_64-ubuntu2004-4.4.29.tgz > /dev/null
cp -r mongodb-linux-x86_64-ubuntu2004-4.4.29/bin/* /usr/local/bin/

# ساخت دایرکتوری‌های دیتا
mkdir -p /var/lib/mongo
mkdir -p /var/log/mongo
chmod 777 /var/lib/mongo
chmod 777 /var/log/mongo

# ساخت سرویس
echo "   Creating systemd service..."
cat > /etc/systemd/system/mongod.service <<EOF
[Unit]
Description=MongoDB Database Server
Documentation=https://docs.mongodb.org/manual
After=network.target

[Service]
User=root
ExecStart=/usr/local/bin/mongod --dbpath /var/lib/mongo --logpath /var/log/mongo/mongod.log --fork --bind_ip_all
PIDFile=/var/lib/mongo/mongod.lock
LimitNOFILE=64000
TimeoutStopSec=600
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# راه‌اندازی
systemctl daemon-reload
systemctl start mongod
systemctl enable mongod

if pgrep -x "mongod" > /dev/null; then
    print_success "MongoDB installed and running"
else
    print_error "MongoDB failed to start"
fi
echo ""

#############################################
# 4.5. نصب PM2 و Nginx
#############################################
echo "🚀 Installing Process Manager (PM2) & Web Server (Nginx)..."
npm install -g pm2
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
print_success "PM2 & Nginx installed"
echo ""

#############################################
# 5. ایجاد دایرکتوری‌های مورد نیاز
#############################################
echo "📁 Creating directories..."
mkdir -p /tmp/video-processing
chmod 777 /tmp/video-processing
print_success "Temp directory created: /tmp/video-processing"
echo ""

#############################################
# 6. نصب ابزارهای کمکی
#############################################
echo "🔧 Installing additional tools..."
apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    build-essential
print_success "Additional tools installed"
echo ""

#############################################
# خلاصه
#############################################
echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "Installed packages:"
echo "  - FFmpeg: $(ffmpeg -version | head -n1 | cut -d' ' -f3)"
echo "  - FFprobe: Available"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - PM2: $(pm2 -v)"
if command -v mongod &> /dev/null; then
    echo "  - MongoDB: $(mongod --version | head -n1 | cut -d' ' -f3)"
else
    echo "  - MongoDB: Not found (Check service status)"
fi
echo ""
echo "Next steps:"
echo "  1. Clone your project repository"
echo "  2. Create .env file with required variables"
echo "  3. Run: npm install"
echo "  4. Test: npm run build"
echo "  5. Start worker: node scripts/video-processor-worker.js"
echo ""
echo "For more details, see: deploy/DEPLOYMENT_GUIDE.md"
echo ""
