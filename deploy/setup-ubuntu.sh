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
# 4. نصب Docker (اختیاری)
#############################################
read -p "Do you want to install Docker? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐳 Installing Docker..."

    # حذف نسخه‌های قدیمی
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    # نصب dependencies
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # اضافه کردن Docker GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # اضافه کردن Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # نصب Docker
    apt-get update -qq
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # فعال‌سازی Docker service
    systemctl enable docker
    systemctl start docker

    print_success "Docker installed"

    # بررسی نصب
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_success "Docker version: $DOCKER_VERSION"
    fi
    echo ""
fi

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
if command -v docker &> /dev/null; then
    echo "  - Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
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
