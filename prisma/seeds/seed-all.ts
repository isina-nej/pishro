/**
 * Main Seed Runner
 * Executes all seed scripts in the correct order
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { seedAdminUsers } from './seed-admin';
import { seedCategories } from './seed-categories';
import { seedTags } from './seed-tags';
import { seedUsers } from './seed-users';
import { seedCourses } from './seed-courses';
import { seedComments } from './seed-comments';
import { seedQuizzes } from './seed-quizzes';
import { seedEnrollments } from './seed-enrollments';
import { seedOrders } from './seed-orders';
import { seedNews } from './seed-news';
import { seedBooks } from './seed-books';
import { seedFAQs } from './seed-faqs';
import { seedPageContent } from './seed-pagecontent';
import { seedNewsletter } from './seed-newsletter';
import { seedLandingPages } from './landing-seed';

const prisma = new PrismaClient();

interface SeedResult {
  created: number;
  updated: number;
  total: number;
}

interface SeedSummary {
  [key: string]: SeedResult;
}

/**
 * Main function to run all seeds in correct order
 */
async function seedAll() {
  console.log('🌱🌱🌱 Starting complete database seeding... 🌱🌱🌱\n');

  const startTime = Date.now();
  const summary: SeedSummary = {};

  try {
    // Check if running in development mode
    if (process.env.NODE_ENV === 'production') {
      console.error('⛔ Cannot run seeds in production environment!');
      console.error('   Set NODE_ENV=development to run seeds.');
      process.exit(1);
    }

    // 🧹 Clean up old data first to avoid unique constraint violations
    console.log('🧹 Cleaning up old data...\n');
    try {
      await prisma.newsletterSubscriber.deleteMany({});
      await prisma.pageContent.deleteMany({});
      await prisma.faq.deleteMany({});
      await prisma.homeLanding.deleteMany({});
      await prisma.digitalBook.deleteMany({});
      await prisma.transaction.deleteMany({});
      await prisma.orderItem.deleteMany({});
      await prisma.order.deleteMany({});
      await prisma.enrollment.deleteMany({});
      await prisma.quizQuestion.deleteMany({});
      await prisma.quiz.deleteMany({});
      await prisma.comment.deleteMany({});
      await prisma.courseTags.deleteMany({});
      await prisma.course.deleteMany({});
      await prisma.newsArticle.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.tag.deleteMany({});
      await prisma.category.deleteMany({});
      console.log('✅ Old data cleaned up!\n');
    } catch (error) {
      console.warn('⚠️  Cleanup warning:', (error as Error).message);
      console.log('Continuing with seed...\n');
    }

    console.log('📋 Execution Order:');
    console.log('   1. Admin Users (base)');
    console.log('   2. Categories (base)');
    console.log('   3. Tags (base)');
    console.log('   4. Users (base)');
    console.log('   5. Courses (depends on: Categories, Tags)');
    console.log('   6. Comments (depends on: Users, Courses, Categories)');
    console.log('   7. Quizzes & Questions (depends on: Courses)');
    console.log('   8. Enrollments (depends on: Users, Courses)');
    console.log('   9. Orders & Transactions (depends on: Users, Courses)');
    console.log('   10. News Articles (depends on: Categories, Tags)');
    console.log('   11. Digital Books (depends on: Tags)');
    console.log('   12. FAQs (depends on: Categories)');
    console.log('   13. Page Content (depends on: Categories)');
    console.log('   14. Landing Pages (independent)');
    console.log('   15. Newsletter Subscribers (independent)\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Seed Admin Users
    console.log('👑 [1/15] Admin Users');
    summary.adminUsers = await seedAdminUsers();
    console.log('');

    // 2. Seed Categories
    console.log('📁 [2/15] Categories');
    summary.categories = await seedCategories();
    console.log('');

    // 3. Seed Tags
    console.log('🏷️  [3/15] Tags');
    summary.tags = await seedTags();
    console.log('');

    // 4. Seed Users
    console.log('👥 [4/15] Users');
    summary.users = await seedUsers();
    console.log('');

    // 5. Seed Courses
    console.log('📚 [5/15] Courses');
    summary.courses = await seedCourses();
    console.log('');

    // 6. Seed Comments
    console.log('💬 [6/15] Comments');
    summary.comments = await seedComments();
    console.log('');

    // 7. Seed Quizzes and Questions
    console.log('❓ [7/15] Quizzes & Questions');
    summary.quizzes = await seedQuizzes();
    console.log('');

    // 8. Seed Enrollments
    console.log('✍️  [8/15] Enrollments');
    summary.enrollments = await seedEnrollments();
    console.log('');

    // 9. Seed Orders and Transactions
    console.log('🛒 [9/15] Orders & Transactions');
    summary.orders = await seedOrders();
    console.log('');

    // 9. Seed News Articles
    console.log('📰 [10/15] News Articles');
    summary.news = await seedNews();
    console.log('');

    // 10. Seed Digital Books
    console.log('📖 [11/15] Digital Books');
    summary.books = await seedBooks();
    console.log('');

    // 11. Seed FAQs
    console.log('❔ [12/15] FAQs');
    summary.faqs = await seedFAQs();
    console.log('');

    // 12. Seed Page Content
    console.log('📄 [13/15] Page Content');
    summary.pageContent = await seedPageContent();
    console.log('');

    // 13. Seed Landing Pages
    console.log('🏠 [14/15] Landing Pages');
    summary.landing = await seedLandingPages();
    console.log('');

    // 14. Seed Newsletter Subscribers
    console.log('📧 [15/15] Newsletter Subscribers');
    summary.newsletter = await seedNewsletter();
    console.log('');

    // Calculate totals
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ ✅ ✅  SEEDING COMPLETED SUCCESSFULLY! ✅ ✅ ✅\n');

    console.log('📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let totalCreated = 0;
    let totalUpdated = 0;
    let grandTotal = 0;

    Object.entries(summary).forEach(([model, result]) => {
      totalCreated += result.created;
      totalUpdated += result.updated;
      grandTotal += result.total;
      console.log(`   ${model.padEnd(20)} → Created: ${result.created.toString().padStart(4)}, Updated: ${result.updated.toString().padStart(4)}, Total: ${result.total}`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ${'TOTAL'.padEnd(20)} → Created: ${totalCreated.toString().padStart(4)}, Updated: ${totalUpdated.toString().padStart(4)}, Total: ${grandTotal}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log(`📅 Completed at: ${new Date().toLocaleString('fa-IR')}\n`);

    console.log('🎉 Your database has been populated with realistic Persian data!');
    console.log('🔐 Admin Login: Phone: 09123456789, Password: Admin@123');
    console.log('🔐 User Login: Any user phone, Password: User@123\n');

    return summary;
  } catch (error) {
    console.error('\n❌ ❌ ❌  SEEDING FAILED! ❌ ❌ ❌\n');
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedAll()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedAll;
