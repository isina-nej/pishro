/**
 * Seed Tags
 * Creates tag records for categorization
 */

import { PrismaClient } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

// Define tags
const TAGS_DATA = [
  { slug: 'stock', title: 'بورس', description: 'بازار سهام و اوراق بهادار', color: '#3B82F6' },
  { slug: 'shares', title: 'سهام', description: 'سرمایه‌گذاری در سهام شرکت‌ها', color: '#10B981' },
  { slug: 'bitcoin', title: 'بیت‌کوین', description: 'اولین و بزرگترین ارز دیجیتال', color: '#F59E0B' },
  { slug: 'ethereum', title: 'اتریوم', description: 'پلتفرم قراردادهای هوشمند', color: '#8B5CF6' },
  { slug: 'technical-analysis', title: 'تحلیل تکنیکال', description: 'تحلیل نمودارها و الگوها', color: '#EF4444' },
  { slug: 'fundamental-analysis', title: 'تحلیل بنیادی', description: 'ارزیابی ارزش ذاتی', color: '#06B6D4' },
  { slug: 'swing-trading', title: 'نوسان‌گیری', description: 'معامله در نوسانات قیمت', color: '#EC4899' },
  { slug: 'investment', title: 'سرمایه‌گذاری', description: 'رشد بلندمدت سرمایه', color: '#84CC16' },
  { slug: 'trading', title: 'معامله‌گری', description: 'خرید و فروش دارایی‌ها', color: '#F59E0B' },
  { slug: 'forex', title: 'فارکس', description: 'بازار ارزهای خارجی', color: '#14B8A6' },
  { slug: 'crypto', title: 'کریپتو', description: 'ارزهای دیجیتال', color: '#F59E0B' },
  { slug: 'blockchain', title: 'بلاکچین', description: 'فناوری دفتر کل توزیع‌شده', color: '#6366F1' },
  { slug: 'risk-management', title: 'مدیریت ریسک', description: 'کنترل ضررها و حفاظت از سرمایه', color: '#EF4444' },
  { slug: 'market-psychology', title: 'روانشناسی بازار', description: 'رفتار و احساسات معامله‌گران', color: '#8B5CF6' },
  { slug: 'indicators', title: 'اندیکاتور', description: 'ابزارهای تحلیل تکنیکال', color: '#3B82F6' },
  { slug: 'candlestick', title: 'کندل استیک', description: 'الگوهای شمعی ژاپنی', color: '#10B981' },
  { slug: 'price-patterns', title: 'الگوهای قیمت', description: 'الگوهای کلاسیک نمودار', color: '#F59E0B' },
  { slug: 'volume', title: 'حجم معاملات', description: 'تحلیل حجم خرید و فروش', color: '#06B6D4' },
  { slug: 'trading-strategy', title: 'استراتژی معاملاتی', description: 'سیستم‌های معاملاتی', color: '#8B5CF6' },
  { slug: 'beginner', title: 'آموزش مبتدیان', description: 'شروع از صفر', color: '#10B981' },
  { slug: 'advanced', title: 'پیشرفته', description: 'آموزش‌های تخصصی', color: '#EF4444' },
  { slug: 'day-trading', title: 'معاملات روزانه', description: 'خرید و فروش در یک روز', color: '#F59E0B' },
  { slug: 'long-term', title: 'بلندمدت', description: 'سرمایه‌گذاری طولانی', color: '#84CC16' },
  { slug: 'short-term', title: 'کوتاه‌مدت', description: 'معاملات سریع', color: '#EF4444' },
  { slug: 'scalping', title: 'اسکالپ', description: 'معاملات خیلی کوتاه‌مدت', color: '#F59E0B' },
  { slug: 'portfolio', title: 'سبد سرمایه', description: 'مدیریت دارایی‌ها', color: '#8B5CF6' },
  { slug: 'diversification', title: 'تنوع‌بخشی', description: 'پخش ریسک در دارایی‌ها', color: '#10B981' },
  { slug: 'defi', title: 'دیفای', description: 'امور مالی غیرمتمرکز', color: '#6366F1' },
  { slug: 'nft', title: 'ان‌اف‌تی', description: 'توکن‌های غیرمثلی', color: '#EC4899' },
  { slug: 'mining', title: 'استخراج', description: 'استخراج ارز دیجیتال', color: '#F59E0B' }
];

/**
 * Seed tags into the database
 */
export async function seedTags() {
  console.log('🌱 Starting to seed tags...');

  try {
    let created = 0;
    let updated = 0;

    for (const tagData of TAGS_DATA) {
      const result = await prisma.tag.upsert({
        where: { slug: tagData.slug },
        update: {
          ...tagData,
          published: true
        },
        create: {
          ...tagData,
          published: true,
          usageCount: 0,
          clicks: 0
        }
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }

      console.log(`  ✓ Tag: ${tagData.title} (${tagData.slug})`);
    }

    console.log(`\n✅ Tags seeded successfully!`);
    console.log(`   📝 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📊 Total: ${TAGS_DATA.length}`);

    return { created, updated, total: TAGS_DATA.length };
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
    throw error;
  }
}

// Run directly if called as main module
if (require.main === module) {
  seedTags()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
