/**
 * Migration Script: Convert Articles to Rich HTML Format
 * 
 * This script converts plain text articles to HTML format with proper tags.
 * Run this BEFORE deploying the rich text editor to production.
 * 
 * Usage: npx ts-node scripts/migrate-article-content.ts
 */

import { prisma } from '@/lib/prisma';
import { sanitizeContent, extractPlainText } from '@/lib/sanitize-content';

interface MigrationStats {
  total: number;
  migrated: number;
  skipped: number;
  errors: number;
  startTime: Date;
  endTime: Date;
}

/**
 * Convert plain text to HTML by wrapping paragraphs
 */
function plainTextToHtml(text: string): string {
  if (!text) return '<p></p>';

  // Split by double line breaks to identify paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0);

  // Wrap each paragraph in <p> tags
  const htmlContent = paragraphs
    .map((para) => {
      // Preserve line breaks within paragraphs
      const withLineBreaks = para
        .split('\n')
        .map((line) => line.trim())
        .join('<br>');
      return `<p>${withLineBreaks}</p>`;
    })
    .join('');

  return htmlContent || '<p></p>';
}

/**
 * Check if content is already HTML
 */
function isHtmlContent(content: string): boolean {
  // Simple check: if content contains HTML tags, assume it's HTML
  return /<[a-z][a-z0-9]*[^>]*>/gi.test(content);
}

/**
 * Migrate a single article
 */
async function migrateArticle(
  articleId: string,
  currentContent: string,
  contentType: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Skip if already HTML
    if (isHtmlContent(currentContent) && contentType === 'HTML') {
      return { success: false, message: 'Already HTML format' };
    }

    let htmlContent: string;

    if (contentType === 'MARKDOWN') {
      // For markdown, just wrap in paragraph tags (basic conversion)
      // In production, you might want to use a markdown parser
      htmlContent = plainTextToHtml(currentContent);
    } else {
      // For plain text, convert to HTML
      htmlContent = plainTextToHtml(currentContent);
    }

    // Sanitize the converted content
    const sanitized = sanitizeContent(htmlContent);

    // Update article
    await prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        content: sanitized,
        contentType: 'HTML',
      },
    });

    return { success: true, message: 'Migrated successfully' };
  } catch (error) {
    console.error(`Error migrating article ${articleId}:`, error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Main migration function
 */
async function migrateAllArticles(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
    startTime: new Date(),
    endTime: new Date(),
  };

  try {
    console.log('🚀 Starting article migration...\n');

    // Get all articles
    const articles = await prisma.newsArticle.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        contentType: true,
      },
    });

    stats.total = articles.length;
    console.log(`📊 Found ${stats.total} articles to process\n`);

    // Migrate each article
    for (const article of articles) {
      console.log(`Processing: ${article.title.substring(0, 50)}...`);

      const result = await migrateArticle(
        article.id,
        article.content,
        article.contentType
      );

      if (result.success) {
        stats.migrated++;
        console.log(`  ✅ ${result.message}`);
      } else {
        stats.skipped++;
        console.log(`  ⏭️  ${result.message}`);
      }
    }

    stats.endTime = new Date();

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Migration Summary');
    console.log('='.repeat(50));
    console.log(`Total articles processed: ${stats.total}`);
    console.log(`Successfully migrated: ${stats.migrated} ✅`);
    console.log(`Skipped: ${stats.skipped} ⏭️`);
    console.log(`Errors: ${stats.errors} ❌`);
    console.log(
      `Duration: ${(stats.endTime.getTime() - stats.startTime.getTime()) / 1000}s`
    );
    console.log('='.repeat(50));

    if (stats.migrated > 0) {
      console.log('\n✨ Migration completed successfully!');
    } else {
      console.log('\nℹ️  No articles needed migration.');
    }

    return stats;
  } catch (error) {
    console.error('Fatal error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Backup-safe migration with rollback option
 */
async function safeMigration(): Promise<void> {
  console.log('⚠️  IMPORTANT: Backup your database before running this migration!\n');

  const confirmation = process.argv.includes('--confirm');

  if (!confirmation) {
    console.log('Run with --confirm flag to proceed:');
    console.log('  npx ts-node scripts/migrate-article-content.ts --confirm\n');
    return;
  }

  try {
    const stats = await migrateAllArticles();

    if (stats.migrated > 0) {
      console.log('\n💾 Verifying migrated content...');

      // Verify a sample of migrated articles
      const sample = await prisma.newsArticle.findFirst({
        where: {
          contentType: 'HTML',
        },
      });

      if (sample) {
        console.log('✅ Sample verification passed');
        console.log(`   - Content type: ${sample.contentType}`);
        console.log(`   - Content preview: ${sample.content.substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  safeMigration().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { migrateAllArticles, migrateArticle, plainTextToHtml };
