/**
 * Main Seed Runner
 * Executes all seed scripts in the correct order
 */

import { PrismaClient } from '@prisma/client';
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

    console.log('📋 Execution Order:');
    console.log('   1. Categories (base)');
    console.log('   2. Tags (base)');
    console.log('   3. Users (base)');
    console.log('   4. Courses (depends on: Categories, Tags)');
    console.log('   5. Comments (depends on: Users, Courses, Categories)');
    console.log('   6. Quizzes & Questions (depends on: Courses)');
    console.log('   7. Enrollments (depends on: Users, Courses)');
    console.log('   8. Orders & Transactions (depends on: Users, Courses)');
    console.log('   9. News Articles (depends on: Categories, Tags)');
    console.log('   10. Digital Books (depends on: Tags)');
    console.log('   11. FAQs (depends on: Categories)');
    console.log('   12. Page Content (depends on: Categories)');
    console.log('   13. Newsletter Subscribers (independent)\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Seed Categories
    console.log('📁 [1/13] Categories');
    summary.categories = await seedCategories();
    console.log('');

    // 2. Seed Tags
    console.log('🏷️  [2/13] Tags');
    summary.tags = await seedTags();
    console.log('');

    // 3. Seed Users
    console.log('👥 [3/13] Users');
    summary.users = await seedUsers();
    console.log('');

    // 4. Seed Courses
    console.log('📚 [4/13] Courses');
    summary.courses = await seedCourses();
    console.log('');

    // 5. Seed Comments
    console.log('💬 [5/13] Comments');
    summary.comments = await seedComments();
    console.log('');

    // 6. Seed Quizzes and Questions
    console.log('❓ [6/13] Quizzes & Questions');
    summary.quizzes = await seedQuizzes();
    console.log('');

    // 7. Seed Enrollments
    console.log('✍️  [7/13] Enrollments');
    summary.enrollments = await seedEnrollments();
    console.log('');

    // 8. Seed Orders and Transactions
    console.log('🛒 [8/13] Orders & Transactions');
    summary.orders = await seedOrders();
    console.log('');

    // 9. Seed News Articles
    console.log('📰 [9/13] News Articles');
    summary.news = await seedNews();
    console.log('');

    // 10. Seed Digital Books
    console.log('📖 [10/13] Digital Books');
    summary.books = await seedBooks();
    console.log('');

    // 11. Seed FAQs
    console.log('❔ [11/13] FAQs');
    summary.faqs = await seedFAQs();
    console.log('');

    // 12. Seed Page Content
    console.log('📄 [12/13] Page Content');
    summary.pageContent = await seedPageContent();
    console.log('');

    // 13. Seed Newsletter Subscribers
    console.log('📧 [13/13] Newsletter Subscribers');
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
if (require.main === module) {
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
