import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

// Load .env manually (avoids requiring dotenv package)
try {
  const env = readFileSync('./.env', 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx);
    let val = line.slice(idx + 1);
    val = val.replace(/^"(.*)"$/, '$1');
    process.env[key] = val;
  });
} catch (e) {
  // ignore if .env missing
}

const prisma = new PrismaClient();

async function main() {
  const homeLanding = await prisma.homeLanding.count();
  const homeSlide = await prisma.homeSlide.count();
  const homeMiniSlider = await prisma.homeMiniSlider.count();
  const image = await prisma.image.count();
  const siteSettings = await prisma.siteSettings.count();

  console.log('HomeLanding:', homeLanding);
  console.log('HomeSlide:', homeSlide);
  console.log('HomeMiniSlider:', homeMiniSlider);
  console.log('Image:', image);
  console.log('SiteSettings:', siteSettings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
