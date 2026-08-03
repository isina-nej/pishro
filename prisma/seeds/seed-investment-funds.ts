/**
 * Seed Investment Funds
 * Creates the admin-editable fund products backing the public investment calculator
 */

import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const FUNDS = [
  {
    key: "fixed-income-monthly",
    name: "صندوق درآمد ثابت ماهیانه",
    description: "تضمین اصل سرمایه و سود بازدهی ثابت ماهیانه",
    monthlyRate: 0.08,
    minDuration: 1,
    maxDuration: 12,
    durationStep: 1,
    minAmount: BigInt(1_000_000),
    maxAmount: BigInt(5_000_000_000),
    amountStep: BigInt(1_000_000),
    order: 1,
    active: true,
  },
  {
    key: "hold",
    name: "صندوق هولد",
    // NOTE: placeholder rate — must be reviewed/corrected via the admin panel
    description: "نرخ تخمینی — حتماً پیش از انتشار نهایی از پنل ادمین بررسی و اصلاح شود",
    monthlyRate: 0.10,
    minDuration: 3,
    maxDuration: 12,
    durationStep: 3,
    minAmount: BigInt(1_000_000),
    maxAmount: BigInt(5_000_000_000),
    amountStep: BigInt(1_000_000),
    order: 2,
    active: true,
  },
];

export async function seedInvestmentFunds() {
  console.log("🌱 Starting to seed investment funds...");

  try {
    let created = 0;
    let updated = 0;

    for (const fund of FUNDS) {
      const existing = await prisma.investmentFund.findUnique({ where: { key: fund.key } });
      await prisma.investmentFund.upsert({
        where: { key: fund.key },
        update: {
          name: fund.name,
          description: fund.description,
          monthlyRate: fund.monthlyRate,
          minDuration: fund.minDuration,
          maxDuration: fund.maxDuration,
          durationStep: fund.durationStep,
          minAmount: fund.minAmount,
          maxAmount: fund.maxAmount,
          amountStep: fund.amountStep,
          order: fund.order,
          active: fund.active,
        },
        create: fund,
      });
      if (existing) updated++;
      else created++;
    }

    console.log(`\n✅ Investment funds seeded successfully!`);
    console.log(`   📝 Created: ${created}, Updated: ${updated}`);

    return { created, updated, total: created + updated };
  } catch (error) {
    console.error("❌ Error seeding investment funds:", error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedInvestmentFunds()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
