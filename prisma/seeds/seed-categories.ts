/**
 * Seed Categories
 * Creates category records with Persian content
 */

import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

/**
 * Seed categories into the database
 */
export async function seedCategories() {
  console.log("🌱 Starting to seed categories...");

  try {
    let created = 0;
    let updated = 0;

    // Airdrop category
    const airdrop = await prisma.category.upsert({
      where: { slug: "airdrop" },
      update: {},
      create: {
        slug: "airdrop",
        title: "آموزش ایردراپ",
        description:
          "دوره‌های جامع آموزش ایردراپ از مبتدی تا پیشرفته. یاد بگیرید چگونه از فرصت‌های ایردراپ بهره‌برداری کنید و توکن‌های رایگان دریافت کنید.",
        icon: "/icons/airdrop.svg",
        coverImage: "/images/categories/airdrop-cover.jpg",
        color: "#3B82F6",
        metaTitle: "دوره‌های آموزش ایردراپ | پیشرو",
        metaDescription:
          "آموزش کامل ایردراپ از صفر تا صد. دریافت رایگان توکن‌های کریپتو از پروژه‌های معتبر بلاکچین.",
        metaKeywords: [
          "ایردراپ",
          " airdrop",
          " توکن رایگان",
          " کریپتو رایگان",
          " آموزش ایردراپ",
        ],
        published: true,
        featured: true,
        order: 1,
      },
    });

    if (airdrop.createdAt.getTime() === airdrop.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
    console.log("  ✓ Airdrop category created");

    // NFT category
    const nft = await prisma.category.upsert({
      where: { slug: "nft" },
      update: {},
      create: {
        slug: "nft",
        title: "آموزش NFT",
        description:
          "همه چیز درباره توکن‌های غیرقابل تعویض (NFT). از خرید و فروش تا ساخت و عرضه NFT.",
        icon: "/icons/nft.svg",
        coverImage: "/images/categories/nft-cover.jpg",
        color: "#8B5CF6",
        metaTitle: "دوره‌های آموزش NFT | پیشرو",
        metaDescription:
          "آموزش جامع NFT از مبتدی تا حرفه‌ای. ساخت، خرید و فروش توکن‌های غیرقابل تعویض.",
        metaKeywords: [
          "NFT",
          " توکن غیرقابل تعویض",
          " آموزش NFT",
          " OpenSea",
          " راینوس",
        ],
        published: true,
        featured: true,
        order: 2,
      },
    });

    if (nft.createdAt.getTime() === nft.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
    console.log("  ✓ NFT category created");

    // Cryptocurrency category
    const cryptocurrency = await prisma.category.upsert({
      where: { slug: "cryptocurrency" },
      update: {},
      create: {
        slug: "cryptocurrency",
        title: "آموزش ارز دیجیتال",
        description:
          "دوره‌های آموزشی ارز دیجیتال، بیتکوین، اتریوم و آلت کوین‌ها. معامله، سرمایه‌گذاری و تحلیل تکنیکال.",
        icon: "/icons/crypto.svg",
        coverImage: "/images/categories/crypto-cover.jpg",
        color: "#F59E0B",
        metaTitle: "دوره‌های آموزش ارز دیجیتال | پیشرو",
        metaDescription:
          "آموزش کامل ارز دیجیتال، بیتکوین، معامله و سرمایه‌گذاری در بازار کریپتو.",
        metaKeywords: [
          "ارز دیجیتال",
          " بیتکوین",
          " اتریوم",
          " معامله ارز دیجیتال",
          " سرمایه‌گذاری کریپتو",
        ],
        published: true,
        featured: true,
        order: 3,
      },
    });

    if (cryptocurrency.createdAt.getTime() === cryptocurrency.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
    console.log("  ✓ Cryptocurrency category created");

    // Stock Market category
    const stockMarket = await prisma.category.upsert({
      where: { slug: "stock-market" },
      update: {},
      create: {
        slug: "stock-market",
        title: "آموزش بورس",
        description:
          "آموزش کامل بورس ایران از صفر تا صد. تحلیل تکنیکال، بنیادی و استراتژی‌های معاملاتی.",
        icon: "/icons/stock.svg",
        coverImage: "/images/categories/stock-cover.jpg",
        color: "#10B981",
        metaTitle: "دوره‌های آموزش بورس | پیشرو",
        metaDescription:
          "آموزش جامع بورس ایران، تحلیل تکنیکال و بنیادی، استراتژی‌های سرمایه‌گذاری موفق.",
        metaKeywords: [
          "آموزش بورس",
          " بورس ایران",
          " تحلیل تکنیکال",
          " سرمایه‌گذاری در بورس",
        ],
        published: true,
        featured: true,
        order: 4,
      },
    });

    if (stockMarket.createdAt.getTime() === stockMarket.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
    console.log("  ✓ Stock Market category created");

    // Metaverse category
    const metaverse = await prisma.category.upsert({
      where: { slug: "metaverse" },
      update: {},
      create: {
        slug: "metaverse",
        title: "آموزش متاورس",
        description:
          "دنیای متاورس و واقعیت مجازی. از املاک دیجیتال تا بازی‌های Play-to-Earn.",
        icon: "/icons/metaverse.svg",
        coverImage: "/images/categories/metaverse-cover.jpg",
        color: "#EC4899",
        metaTitle: "دوره‌های آموزش متاورس | پیشرو",
        metaDescription:
          "آموزش متاورس، املاک دیجیتال، بازی‌های Play-to-Earn و فرصت‌های سرمایه‌گذاری.",
        metaKeywords: [
          "متاورس",
          " metaverse",
          " املاک دیجیتال",
          " Play-to-Earn",
          " واقعیت مجازی",
        ],
        published: true,
        featured: true,
        order: 5,
      },
    });

    if (metaverse.createdAt.getTime() === metaverse.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
    console.log("  ✓ Metaverse category created");

    console.log(`\n✅ Categories seeded successfully!`);
    console.log(`   📝 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📊 Total: ${created + updated}`);

    return { created, updated, total: created + updated };
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
}

// Run directly if called as main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedCategories()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
