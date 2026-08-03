/**
 * Base site seed runner
 * Seeds only essential site foundation data — no demo/fake content.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { seedAdminUsers } from "./seed-admin";
import { seedCategories } from "./seed-categories";
import { seedTags } from "./seed-tags";
import { seedLandingPages } from "./landing-seed";
import { seedInvestmentFunds } from "./seed-investment-funds";

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
 * Remove demo / test / transactional content while keeping base taxonomy
 * (Category, Tag) and CMS foundation that will be re-seeded below.
 */
async function purgeFakeAndTransactionalData() {
  console.log("🧹 Removing fake / demo / transactional data...\n");

  // CRM / runtime links that can block user/order deletes
  await prisma.activity.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.userTagAssignment.deleteMany({});

  await prisma.quizAttempt.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.newsComment.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.pageContent.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.userInvestmentPortfolio.deleteMany({});
  await prisma.image.deleteMany({});

  await prisma.transaction.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.comment.deleteMany({});

  await prisma.lesson.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.courseTags.deleteMany({});
  await prisma.newsArticleTags.deleteMany({});
  await prisma.digitalBookTags.deleteMany({});
  await prisma.categoryTags.deleteMany({});

  await prisma.course.deleteMany({});
  await prisma.newsArticle.deleteMany({});
  await prisma.digitalBook.deleteMany({});
  await prisma.user.deleteMany({});

  // Extra admin accounts from legacy seeds — keep only what seed-admin recreates
  await prisma.adminUser.deleteMany({
    where: { email: { not: "sina@pishro.com" } },
  });

  console.log("✅ Fake / demo data removed.\n");
}

async function seedAll() {
  console.log("🌱 Starting base site seeding...\n");

  const startTime = Date.now();
  const summary: SeedSummary = {};

  try {
    if (process.env.NODE_ENV === "production") {
      console.error("⛔ Cannot run seeds in production environment!");
      console.error("   Set NODE_ENV=development to run seeds.");
      process.exit(1);
    }

    await purgeFakeAndTransactionalData();

    console.log("📋 Base seed order:");
    console.log("   1. Admin Users");
    console.log("   2. Categories");
    console.log("   3. Tags");
    console.log("   4. Landing Pages (home / about / consulting / plans)");
    console.log("   5. Investment Funds\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("👑 [1/5] Admin Users");
    summary.adminUsers = await seedAdminUsers();
    console.log("");

    console.log("📁 [2/5] Categories");
    summary.categories = await seedCategories();
    console.log("");

    console.log("🏷️  [3/5] Tags");
    summary.tags = await seedTags();
    console.log("");

    console.log("🏠 [4/5] Landing Pages");
    summary.landing = await seedLandingPages();
    console.log("");

    console.log("💰 [5/5] Investment Funds");
    summary.investmentFunds = await seedInvestmentFunds();
    console.log("");

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("✅ Base seeding completed.\n");
    console.log("📊 Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    let totalCreated = 0;
    let totalUpdated = 0;
    let grandTotal = 0;

    Object.entries(summary).forEach(([model, result]) => {
      totalCreated += result.created;
      totalUpdated += result.updated;
      grandTotal += result.total;
      console.log(
        `   ${model.padEnd(20)} → Created: ${result.created.toString().padStart(4)}, Updated: ${result.updated.toString().padStart(4)}, Total: ${result.total}`
      );
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      `   ${"TOTAL".padEnd(20)} → Created: ${totalCreated.toString().padStart(4)}, Updated: ${totalUpdated.toString().padStart(4)}, Total: ${grandTotal}`
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log("🔐 Admin Login: Phone: 09123456789, Password: Admin@123\n");

    return summary;
  } catch (error) {
    console.error("\n❌ Seeding failed.\n");
    console.error("Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

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
