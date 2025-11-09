/**
 * Seed News Articles
 * Creates news article records with Persian content
 */

import { PrismaClient } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const NEWS_COUNT = 30;

export async function seedNews() {
  console.log('🌱 Starting to seed news articles...');

  try {
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();

    if (categories.length === 0 || tags.length === 0) {
      console.log('⚠️  Please seed categories and tags first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;

    for (let i = 0; i < NEWS_COUNT; i++) {
      const title = generator.generateNewsTitle();
      const slug = generator.generateSlug(title, i);
      const category = generator.choice(categories);
      const numTags = generator.randomInt(2, 6);
      const articleTags = tags.slice(i % tags.length, (i % tags.length) + numTags);
      const { firstName, lastName } = generator.generateFullName();

      const article = await prisma.newsArticle.create({
        data: {
          title,
          slug,
          excerpt: generator.generateParagraph(),
          content: generator.generateParagraphs(5),
          coverImage: `https://picsum.photos/seed/news-${i}/1200/630`,
          author: `${firstName} ${lastName}`,
          category: category.title,
          tags: articleTags.map(t => t.title),
          published: generator.choice([true, true, true, false]),
          publishedAt: generator.choice([true, true, false]) ? generator.generatePastDate(180) : null,
          views: generator.randomInt(0, 10000),
          categoryId: category.id,
          tagIds: articleTags.map(t => t.id),
          featured: generator.randomInt(0, 10) > 7,
          readingTime: generator.choice([3, 5, 7, 10, 15]),
          likes: generator.randomInt(0, 500)
        }
      });

      created++;

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1}/${NEWS_COUNT} news articles...`);
      }
    }

    console.log(`\n✅ News articles seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error('❌ Error seeding news:', error);
    throw error;
  }
}

if (require.main === module) {
  seedNews()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
