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
        heroTitle: "دنیای ایردراپ را کشف کنید",
        heroSubtitle: "توکن‌های رایگان از بهترین پروژه‌های بلاکچین",
        heroDescription:
          "با آموزش‌های جامع ما، یاد بگیرید چگونه از فرصت‌های ایردراپ استفاده کنید و توکن‌های ارزشمند دریافت نمایید. از صفر تا حرفه‌ای.",
        heroImage: "/images/heroes/airdrop-hero.jpg",
        heroCta1Text: "شروع یادگیری",
        heroCta1Link: "/courses?category=airdrop",
        heroCta2Text: "مشاهده دوره‌ها",
        heroCta2Link: "/courses",
        aboutTitle1: "چرا آموزش ایردراپ؟",
        aboutTitle2: "فرصت‌های بی‌نظیر در انتظار شماست",
        aboutDescription:
          "ایردراپ یکی از بهترین راه‌های کسب توکن‌های رایگان است. با یادگیری صحیح، می‌توانید از پروژه‌های معتبر بلاکچین توکن دریافت کنید و در آینده از رشد آن‌ها بهره‌مند شوید.",
        aboutImage: "/images/about/airdrop-about.jpg",
        aboutCta1Text: "دوره‌های رایگان",
        aboutCta1Link: "/courses?category=airdrop&price=free",
        aboutCta2Text: "مشاوره تخصصی",
        aboutCta2Link: "/contact",
        statsBoxes: JSON.stringify([
          { text: "ایردراپ‌های موفق", number: "500+", icon: "🎁" },
          { text: "توکن توزیع شده", number: "$2M+", icon: "💰" },
          { text: "کاربران فعال", number: "10K+", icon: "👥" },
          { text: "نرخ موفقیت", number: "95%", icon: "📈" },
        ]),
        enableUserLevelSection: true,
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
        heroTitle: "وارد دنیای NFT شوید",
        heroSubtitle: "آینده هنر و دارایی‌های دیجیتال",
        heroDescription:
          "توکن‌های غیرقابل تعویض را بشناسید. از ساخت و خرید تا فروش و سرمایه‌گذاری در NFT. با آموزش‌های تخصصی ما، یک NFT Creator حرفه‌ای شوید.",
        heroImage: "/images/heroes/nft-hero.jpg",
        heroCta1Text: "یادگیری NFT",
        heroCta1Link: "/courses?category=nft",
        heroCta2Text: "راهنمای کامل",
        heroCta2Link: "/guides/nft",
        aboutTitle1: "NFT چیست؟",
        aboutTitle2: "هنر دیجیتال و مالکیت واقعی",
        aboutDescription:
          "NFT یا توکن غیرقابل تعویض، یک دارایی دیجیتال منحصربه‌فرد است که بر روی بلاکچین ثبت می‌شود. از هنر دیجیتال گرفته تا موسیقی، ویدیو و حتی املاک مجازی، همه چیز می‌تواند به صورت NFT باشد.",
        aboutImage: "/images/about/nft-about.jpg",
        aboutCta1Text: "دوره‌های NFT",
        aboutCta1Link: "/courses?category=nft",
        aboutCta2Text: "بازارهای NFT",
        aboutCta2Link: "/nft-marketplaces",
        statsBoxes: JSON.stringify([
          { text: "NFT ساخته شده", number: "5K+", icon: "🎨" },
          { text: "حجم معاملات", number: "$10M+", icon: "💎" },
          { text: "هنرمندان فعال", number: "2K+", icon: "👨‍🎨" },
          { text: "مارکت پلیس", number: "50+", icon: "🏪" },
        ]),
        enableUserLevelSection: true,
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
        heroTitle: "سرمایه‌گذاری هوشمند در ارز دیجیتال",
        heroSubtitle: "از بیتکوین تا آلت‌کوین‌های نوظهور",
        heroDescription:
          "دنیای ارزهای دیجیتال را از پایه بیاموزید. از خرید و فروش بیتکوین گرفته تا تحلیل بازار، والت‌ها و امنیت. با اساتید مجرب، یک تریدر موفق شوید.",
        heroImage: "/images/heroes/crypto-hero.jpg",
        heroCta1Text: "شروع آموزش",
        heroCta1Link: "/courses?category=cryptocurrency",
        heroCta2Text: "بازارها",
        heroCta2Link: "/markets",
        aboutTitle1: "چرا ارز دیجیتال؟",
        aboutTitle2: "آینده پول در دستان شماست",
        aboutDescription:
          "ارزهای دیجیتال در حال تغییر سیستم مالی جهان هستند. با یادگیری اصولی می‌توانید از این فرصت طلایی بهره‌مند شوید. بیتکوین، اتریوم و هزاران آلت‌کوین در انتظار شما هستند.",
        aboutImage: "/images/about/crypto-about.jpg",
        aboutCta1Text: "دوره مبتدیان",
        aboutCta1Link: "/courses?category=cryptocurrency&level=beginner",
        aboutCta2Text: "تحلیل بازار",
        aboutCta2Link: "/analysis",
        statsBoxes: JSON.stringify([
          { text: "حجم بازار", number: "$2.5T", icon: "💹" },
          { text: "کاربران فعال", number: "50K+", icon: "👥" },
          { text: "دوره‌های آموزشی", number: "100+", icon: "📚" },
          { text: "نرخ رشد", number: "+250%", icon: "🚀" },
        ]),
        enableUserLevelSection: true,
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
        heroTitle: "بورس را حرفه‌ای یاد بگیرید",
        heroSubtitle: "از صفر تا معامله‌گر موفق در بورس ایران",
        heroDescription:
          "با آموزش‌های کاربردی و پروژه‌محور ما، اصول سرمایه‌گذاری در بورس را بیاموزید. تحلیل تکنیکال، بنیادی، مدیریت ریسک و استراتژی‌های سودآور را تجربه کنید.",
        heroImage: "/images/heroes/stock-hero.jpg",
        heroCta1Text: "شروع دوره",
        heroCta1Link: "/courses?category=stock-market",
        heroCta2Text: "دوره‌های پیشرفته",
        heroCta2Link: "/courses?category=stock-market&level=advanced",
        aboutTitle1: "بورس برای همه",
        aboutTitle2: "سرمایه‌گذاری هوشمند و سودآور",
        aboutDescription:
          "بورس یکی از بهترین بازارهای سرمایه‌گذاری در ایران است. با یادگیری اصولی و استفاده از ابزارهای حرفه‌ای، می‌توانید درآمد پایدار کسب کنید و آینده مالی خود را تضمین نمایید.",
        aboutImage: "/images/about/stock-about.jpg",
        aboutCta1Text: "راهنمای شروع",
        aboutCta1Link: "/guides/stock-market-start",
        aboutCta2Text: "ابزارهای تحلیل",
        aboutCta2Link: "/tools",
        statsBoxes: JSON.stringify([
          { text: "سرمایه‌گذاران موفق", number: "15K+", icon: "📊" },
          { text: "سود کل دانشجویان", number: "+450%", icon: "💰" },
          { text: "ساعات آموزش", number: "500+", icon: "⏱️" },
          { text: "رضایت کاربران", number: "98%", icon: "⭐" },
        ]),
        enableUserLevelSection: true,
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
        heroTitle: "آینده در متاورس است",
        heroSubtitle: "وارد دنیای دیجیتال بی‌پایان شوید",
        heroDescription:
          "متاورس، دنیای جدیدی از فرصت‌های بی‌نظیر است. از املاک دیجیتال و بازی‌های Play-to-Earn گرفته تا رویدادهای مجازی و کسب‌وکار. آینده اینجاست!",
        heroImage: "/images/heroes/metaverse-hero.jpg",
        heroCta1Text: "کاوش متاورس",
        heroCta1Link: "/courses?category=metaverse",
        heroCta2Text: "راهنمای کامل",
        heroCta2Link: "/guides/metaverse",
        aboutTitle1: "متاورس چیست؟",
        aboutTitle2: "دنیای دیجیتال بدون مرز",
        aboutDescription:
          "متاورس یک دنیای مجازی سه‌بعدی است که در آن می‌توانید زندگی کنید، کار کنید، بازی کنید و کسب درآمد نمایید. از خرید زمین و ساختمان‌سازی تا شرکت در کنسرت‌ها و رویدادهای جهانی.",
        aboutImage: "/images/about/metaverse-about.jpg",
        aboutCta1Text: "شروع سفر",
        aboutCta1Link: "/courses?category=metaverse&level=beginner",
        aboutCta2Text: "پروژه‌های متاورس",
        aboutCta2Link: "/metaverse-projects",
        statsBoxes: JSON.stringify([
          { text: "کاربران متاورس", number: "8K+", icon: "🌐" },
          { text: "املاک فروخته شده", number: "$5M+", icon: "🏘️" },
          { text: "بازی‌های P2E", number: "200+", icon: "🎮" },
          { text: "رشد سالانه", number: "+180%", icon: "📈" },
        ]),
        enableUserLevelSection: true,
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
