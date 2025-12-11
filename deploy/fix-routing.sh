#!/bin/bash

# Fix routing issue: swap apps back to correct ports
# This script assumes apps are deployed to WRONG directories or ecosystem config is wrong

set -e

echo "🔧 Starting routing fix..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Stop all PM2 apps${NC}"
pm2 stop all || true
sleep 2

echo -e "${YELLOW}Step 2: Delete old PM2 apps${NC}"
pm2 delete all || true
sleep 2

echo -e "${YELLOW}Step 3: Copy ecosystem configs to server directories${NC}"

# Create ecosystem config for pishro (main site on port 3000)
cat > /opt/pishro/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: 'pishro',
      script: 'npm',
      args: 'run start',
      cwd: '/opt/pishro',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'mongodb://localhost:27017/pishro',
        NEXT_PUBLIC_API_URL: 'https://pishrosarmaye.com/api',
        NEXT_PUBLIC_BASE_URL: 'https://pishrosarmaye.com',
      },
    },
  ],
};
EOF

# Create ecosystem config for pishro-admin (CMS on port 3001)
cat > /opt/pishro-admin/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: 'pishro-admin',
      script: 'npm',
      args: 'run start',
      cwd: '/opt/pishro-admin',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_URL: 'mongodb://localhost:27017/pishro',
        NEXT_PUBLIC_API_URL: 'https://pishrosarmaye.com/api',
        NEXT_PUBLIC_BASE_URL: 'https://admin.pishrosarmaye.com',
        NEXTAUTH_URL: 'https://admin.pishrosarmaye.com',
      },
    },
  ],
};
EOF

echo -e "${GREEN}✓ Ecosystem configs created${NC}"

echo -e "${YELLOW}Step 4: Update Nginx config${NC}"
cp /etc/nginx/sites-available/pishro /etc/nginx/sites-available/pishro.backup
echo -e "${GREEN}✓ Backed up current Nginx config${NC}"

# Verify Nginx config
echo -e "${YELLOW}Step 5: Verify Nginx config${NC}"
nginx -t || {
  echo -e "${RED}✗ Nginx config is invalid${NC}"
  cp /etc/nginx/sites-available/pishro.backup /etc/nginx/sites-available/pishro
  nginx -t
  exit 1
}
echo -e "${GREEN}✓ Nginx config valid${NC}"

echo -e "${YELLOW}Step 6: Reload Nginx${NC}"
systemctl reload nginx
sleep 2
echo -e "${GREEN}✓ Nginx reloaded${NC}"

echo -e "${YELLOW}Step 7: Start apps with ecosystem configs${NC}"
cd /opt/pishro && pm2 start ecosystem.config.js
sleep 3

cd /opt/pishro-admin && pm2 start ecosystem.config.js
sleep 3

echo -e "${YELLOW}Step 8: Save PM2 config${NC}"
pm2 save

echo -e "${YELLOW}Step 9: Verify apps are running${NC}"
pm2 status

echo -e "${YELLOW}Step 10: Test connectivity${NC}"
echo "Testing port 3000 (main site)..."
curl -s -I http://127.0.0.1:3000/ | head -5 || echo "❌ Port 3000 not responding"

echo ""
echo "Testing port 3001 (admin panel)..."
curl -s -I http://127.0.0.1:3001/ | head -5 || echo "❌ Port 3001 not responding"

echo ""
echo -e "${GREEN}✅ Fix complete!${NC}"
echo ""
echo "Verify routing at:"
echo "- Main site: https://pishrosarmaye.com"
echo "- Admin panel: https://admin.pishrosarmaye.com"
