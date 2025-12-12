#!/bin/bash

# Connect to server and add categories
ssh root@178.239.147.136 'bash -s' << 'SCRIPT_EOF'
cd /opt/pishro

# Create JavaScript file inline
cat > /tmp/add-categories.js << 'JS_EOF'
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = '/opt/pishro/.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)="?([^"]*)"?$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT FOUND');

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { title: 'کریپتوکارنسی', slug: 'cryptocurrency', description: 'کریپتوکارنسی و بلاک چین', coverImage: '/images/cryptocurrency.jpg', published: true },
    { title: 'مشاوره کسب و کار', slug: 'business-consulting', description: 'مشاوره کسب و کار', coverImage: '/images/business-consulting/landing.jpg', published: true },
    { title: 'درباره ما', slug: 'about-us', description: 'درباره پیشرو', coverImage: '/images/about-us.jpg', published: true },
    { title: 'سفارش های سرمایه گذاری', slug: 'investment-plans', description: 'سفارش های سرمایه گذاری', coverImage: '/images/investment-plans/landing.jpg', published: true }
  ];

  for (const cat of categories) {
    try {
      const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (!existing) {
        await prisma.category.create({ data: cat });
        console.log('[✓] Created: ' + cat.slug);
      } else {
        await prisma.category.update({ where: { slug: cat.slug }, data: { published: true } });
        console.log('[✓] Updated: ' + cat.slug);
      }
    } catch (err) {
      console.error('[✗] ' + cat.slug + ': ' + err.message);
    }
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
JS_EOF

node /tmp/add-categories.js
SCRIPT_EOF
