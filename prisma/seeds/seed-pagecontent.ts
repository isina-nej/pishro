/**
 * Seed Page Content
 * Creates page content records for categories
 */

import { PrismaClient, PageContentType, Language } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

export async function seedPageContent() {
  console.log('🌱 Starting to seed page content...');

  try {
    const categories = await prisma.category.findMany();

    if (categories.length === 0) {
      console.log('⚠️  Please seed categories first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;

    for (const category of categories) {
      // Create different types of content for each category
      const contentTypes: PageContentType[] = [
        PageContentType.HERO,
        PageContentType.FEATURES,
        PageContentType.TESTIMONIAL,
        PageContentType.STATS
      ];

      for (const type of contentTypes) {
        let content: any = {};

        switch (type) {
          case PageContentType.HERO:
            content = {
              headline: `به دنیای ${category.title} خوش آمدید`,
              subheadline: generator.generateParagraph(),
              ctaText: 'شروع یادگیری',
              ctaLink: `/courses?category=${category.slug}`,
              backgroundImage: `https://picsum.photos/seed/hero-${category.slug}/1920/1080`
            };
            break;

          case PageContentType.FEATURES:
            content = {
              features: [
                { title: 'آموزش جامع', description: generator.generateParagraph(), icon: '📚' },
                { title: 'اساتید مجرب', description: generator.generateParagraph(), icon: '👨‍🏫' },
                { title: 'گواهینامه معتبر', description: generator.generateParagraph(), icon: '🏆' },
                { title: 'پشتیبانی 24/7', description: generator.generateParagraph(), icon: '💬' }
              ]
            };
            break;

          case PageContentType.TESTIMONIAL:
            content = {
              testimonials: [
                {
                  name: generator.generateFullName().firstName + ' ' + generator.generateFullName().lastName,
                  role: 'دانشجو',
                  text: generator.generateCommentText(),
                  avatar: generator.generateAvatarUrl(created)
                }
              ]
            };
            break;

          case PageContentType.STATS:
            content = {
              stats: [
                { label: 'دانشجو', value: generator.randomInt(1000, 20000), icon: '👥' },
                { label: 'دوره', value: generator.randomInt(10, 100), icon: '📚' },
                { label: 'ساعت آموزش', value: generator.randomInt(100, 1000), icon: '⏱️' },
                { label: 'رضایت', value: generator.randomInt(90, 99) + '%', icon: '⭐' }
              ]
            };
            break;
        }

        await prisma.pageContent.create({
          data: {
            categoryId: category.id,
            type,
            section: type,
            title: `${type} Section`,
            subtitle: generator.generateParagraph(),
            content: JSON.stringify(content),
            language: Language.FA,
            order: contentTypes.indexOf(type),
            published: true
          }
        });

        created++;
      }

      console.log(`  ✓ Created content for category: ${category.title}`);
    }

    console.log(`\n✅ Page content seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error('❌ Error seeding page content:', error);
    throw error;
  }
}

if (require.main === module) {
  seedPageContent()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
