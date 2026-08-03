/**
 * Seed Tags
 * Creates tag records for categorization
 */

import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Define tags
const TAGS_DATA = [
  {
    slug: "stock",
    title: "بورس",
    description: "بازار سهام و اوراق بهادار",
    color: "#3B82F6",
    seoTitle: "آموزش بورس و بازار سهام | دوره‌های تخصصی پیشرو",
    seoDescription:
      "آموزش جامع بورس، تحلیل تکنیکال و بنیادی بازار سهام. با متخصصان بورس یک سرمایه‌گذار موفق شوید.",
  },
  {
    slug: "shares",
    title: "سهام",
    description: "سرمایه‌ گذاری در سهام شرکت‌ها",
    color: "#10B981",
    seoTitle: "آموزش خرید و فروش سهام | راهنمای کامل سرمایه‌ گذاری در سهام",
    seoDescription:
      "یاد بگیرید چگونه سهام مناسب انتخاب کنید و در بازار سهام سود کسب نمایید.",
  },
  {
    slug: "bitcoin",
    title: "بیت‌کوین",
    description: "اولین و بزرگترین ارز دیجیتال",
    color: "#F59E0B",
    seoTitle: "آموزش بیتکوین | خرید و فروش Bitcoin",
    seoDescription:
      "همه چیز درباره بیتکوین، از خرید و فروش تا نگهداری امن و سرمایه‌ گذاری.",
  },
  {
    slug: "ethereum",
    title: "اتریوم",
    description: "پلتفرم قراردادهای هوشمند",
    color: "#8B5CF6",
    seoTitle: "آموزش اتریوم و قراردادهای هوشمند | Ethereum",
    seoDescription:
      "آموزش اتریوم، قراردادهای هوشمند و پلتفرم‌های DeFi مبتنی بر ETH.",
  },
  {
    slug: "technical-analysis",
    title: "تحلیل تکنیکال",
    description: "تحلیل نمودارها و الگوها",
    color: "#EF4444",
    seoTitle: "آموزش تحلیل تکنیکال | نمودارها و اندیکاتورها",
    seoDescription:
      "آموزش کامل تحلیل تکنیکال از صفر، شناسایی الگوها، اندیکاتورها و نقاط ورود و خروج.",
  },
  {
    slug: "fundamental-analysis",
    title: "تحلیل بنیادی",
    description: "ارزیابی ارزش ذاتی",
    color: "#06B6D4",
    seoTitle: "آموزش تحلیل بنیادی | ارزیابی شرکت‌ها",
    seoDescription:
      "روش‌های تحلیل بنیادی برای ارزیابی ارزش واقعی سهام و شرکت‌ها.",
  },
  {
    slug: "swing-trading",
    title: "نوسان‌گیری",
    description: "معامله در نوسانات قیمت",
    color: "#EC4899",
    seoTitle: "آموزش نوسان‌گیری | استراتژی Swing Trading",
    seoDescription:
      "تکنیک‌های حرفه‌ای نوسان‌گیری برای کسب سود از نوسانات کوتاه‌مدت بازار.",
  },
  {
    slug: "investment",
    title: "سرمایه‌ گذاری",
    description: "رشد بلندمدت سرمایه",
    color: "#84CC16",
    seoTitle: "آموزش سرمایه‌ گذاری | رشد و مدیریت سرمایه",
    seoDescription:
      "اصول سرمایه‌ گذاری موفق، مدیریت سبد و استراتژی‌های بلندمدت.",
  },
  {
    slug: "trading",
    title: "معامله‌گری",
    description: "خرید و فروش دارایی‌ها",
    color: "#F59E0B",
    seoTitle: "آموزش معامله‌گری | تریدینگ حرفه‌ای",
    seoDescription:
      "آموزش معامله‌گری از مبتدی تا حرفه‌ای، استراتژی‌ها و تکنیک‌های کاربردی.",
  },
  {
    slug: "forex",
    title: "فارکس",
    description: "بازار ارزهای خارجی",
    color: "#14B8A6",
    seoTitle: "آموزش فارکس | بازار ارزهای خارجی",
    seoDescription:
      "آموزش معامله در بازار فارکس، جفت ارزها و تحلیل بازار جهانی.",
  },
  {
    slug: "crypto",
    title: "کریپتو",
    description: "ارزهای دیجیتال",
    color: "#F59E0B",
    seoTitle: "آموزش ارز دیجیتال | کریپتوکارنسی",
    seoDescription: "آموزش جامع ارزهای دیجیتال، از بیتکوین تا آلت‌کوین‌ها.",
  },
  {
    slug: "blockchain",
    title: "بلاکچین",
    description: "فناوری دفتر کل توزیع‌شده",
    color: "#6366F1",
    seoTitle: "آموزش بلاکچین | فناوری زنجیره بلوکی",
    seoDescription:
      "آشنایی با فناوری بلاکچین، کاربردها و آینده این تکنولوژی انقلابی.",
  },
  {
    slug: "risk-management",
    title: "مدیریت ریسک",
    description: "کنترل ضررها و حفاظت از سرمایه",
    color: "#EF4444",
    seoTitle: "آموزش مدیریت ریسک | حفاظت از سرمایه",
    seoDescription: "تکنیک‌های حرفه‌ای مدیریت ریسک و حفظ سرمایه در معاملات.",
  },
  {
    slug: "market-psychology",
    title: "روانشناسی بازار",
    description: "رفتار و احساسات معامله‌گران",
    color: "#8B5CF6",
    seoTitle: "آموزش روانشناسی بازار | کنترل احساسات در ترید",
    seoDescription:
      "روانشناسی معامله‌گری و نحوه کنترل احساسات برای تصمیم‌گیری بهتر.",
  },
  {
    slug: "indicators",
    title: "اندیکاتور",
    description: "ابزارهای تحلیل تکنیکال",
    color: "#3B82F6",
    seoTitle: "آموزش اندیکاتورها | ابزارهای تحلیل تکنیکال",
    seoDescription:
      "معرفی و آموزش بهترین اندیکاتورهای تحلیل تکنیکال مثل RSI، MACD و...",
  },
  {
    slug: "candlestick",
    title: "کندل استیک",
    description: "الگوهای شمعی ژاپنی",
    color: "#10B981",
    seoTitle: "آموزش الگوهای کندل استیک | کندل‌های شمعی ژاپنی",
    seoDescription: "آموزش کامل الگوهای کندل استیک و تحلیل نمودار شمعی.",
  },
  {
    slug: "price-patterns",
    title: "الگوهای قیمت",
    description: "الگوهای کلاسیک نمودار",
    color: "#F59E0B",
    seoTitle: "آموزش الگوهای قیمتی | پرایس اکشن",
    seoDescription: "شناسایی و تحلیل الگوهای کلاسیک قیمت در نمودارها.",
  },
  {
    slug: "volume",
    title: "حجم معاملات",
    description: "تحلیل حجم خرید و فروش",
    color: "#06B6D4",
    seoTitle: "آموزش تحلیل حجم معاملات | Volume Analysis",
    seoDescription: "نحوه تحلیل حجم معاملات برای پیش‌بینی حرکت قیمت.",
  },
  {
    slug: "trading-strategy",
    title: "استراتژی معاملاتی",
    description: "سیستم‌های معاملاتی",
    color: "#8B5CF6",
    seoTitle: "آموزش استراتژی معاملاتی | سیستم‌های ترید",
    seoDescription: "بهترین استراتژی‌های معاملاتی و نحوه ایجاد سیستم معاملاتی.",
  },
  {
    slug: "beginner",
    title: "آموزش مبتدیان",
    description: "شروع از صفر",
    color: "#10B981",
    seoTitle: "آموزش مبتدیان | شروع از صفر",
    seoDescription: "دوره‌های آموزشی ویژه مبتدیان برای شروع مسیر یادگیری.",
  },
  {
    slug: "advanced",
    title: "پیشرفته",
    description: "آموزش‌های تخصصی",
    color: "#EF4444",
    seoTitle: "دوره‌های پیشرفته | آموزش تخصصی",
    seoDescription: "آموزش‌های پیشرفته و حرفه‌ای برای معامله‌گران با تجربه.",
  },
  {
    slug: "day-trading",
    title: "معاملات روزانه",
    description: "خرید و فروش در یک روز",
    color: "#F59E0B",
    seoTitle: "آموزش دی تریدینگ | معاملات روزانه",
    seoDescription: "تکنیک‌های معاملات روزانه برای کسب سود در همان روز.",
  },
  {
    slug: "long-term",
    title: "بلندمدت",
    description: "سرمایه‌ گذاری طولانی",
    color: "#84CC16",
    seoTitle: "سرمایه‌ گذاری بلندمدت | استراتژی Long-term",
    seoDescription:
      "استراتژی‌های سرمایه‌ گذاری بلندمدت برای رشد پایدار سرمایه.",
  },
  {
    slug: "short-term",
    title: "کوتاه‌مدت",
    description: "معاملات سریع",
    color: "#EF4444",
    seoTitle: "معاملات کوتاه‌مدت | استراتژی Short-term",
    seoDescription: "تکنیک‌های معاملات کوتاه‌مدت برای سود سریع از بازار.",
  },
  {
    slug: "scalping",
    title: "اسکالپ",
    description: "معاملات خیلی کوتاه‌مدت",
    color: "#F59E0B",
    seoTitle: "آموزش اسکالپینگ | Scalping Trading",
    seoDescription:
      "استراتژی اسکالپینگ برای معاملات فوق سریع و کسب سود کوچک اما مکرر.",
  },
  {
    slug: "portfolio",
    title: "سبد سرمایه",
    description: "مدیریت دارایی‌ها",
    color: "#8B5CF6",
    seoTitle: "مدیریت سبد سرمایه | Portfolio Management",
    seoDescription: "نحوه ساخت و مدیریت سبد سرمایه‌ گذاری متنوع و سودآور.",
  },
  {
    slug: "diversification",
    title: "تنوع‌بخشی",
    description: "پخش ریسک در دارایی‌ها",
    color: "#10B981",
    seoTitle: "آموزش تنوع‌بخشی | کاهش ریسک سرمایه‌ گذاری",
    seoDescription: "استراتژی‌های تنوع‌بخشی برای کاهش ریسک و افزایش بازدهی.",
  },
  {
    slug: "defi",
    title: "دیفای",
    description: "امور مالی غیرمتمرکز",
    color: "#6366F1",
    seoTitle: "آموزش دیفای | امور مالی غیرمتمرکز DeFi",
    seoDescription: "آشنایی با دنیای DeFi، پلتفرم‌ها و فرصت‌های سرمایه‌ گذاری.",
  },
  {
    slug: "nft",
    title: "ان‌اف‌تی",
    description: "توکن‌های غیرمثلی",
    color: "#EC4899",
    seoTitle: "آموزش NFT | توکن‌های غیرقابل تعویض",
    seoDescription:
      "همه چیز درباره NFT، از خرید و فروش تا ساخت و سرمایه‌ گذاری.",
  },
  {
    slug: "mining",
    title: "استخراج",
    description: "استخراج ارز دیجیتال",
    color: "#F59E0B",
    seoTitle: "آموزش ماینینگ | استخراج ارز دیجیتال",
    seoDescription: "روش‌های استخراج ارزهای دیجیتال و کسب درآمد از ماینینگ.",
  },
];

/**
 * Seed tags into the database
 */
export async function seedTags() {
  console.log("🌱 Starting to seed tags...");

  try {
    let created = 0;
    let updated = 0;

    for (const tagData of TAGS_DATA) {
      const result = await prisma.tag.upsert({
        where: { slug: tagData.slug },
        update: {
          ...tagData,
          published: true,
        },
        create: {
          ...tagData,
          published: true,
          usageCount: 0,
          clicks: 0,
        },
      });

      if ((result.createdAt?.getTime?.()) === (result.updatedAt?.getTime?.()) ) {
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
    console.error("❌ Error seeding tags:", error);
    throw error;
  }
}

// Run directly if called as main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedTags()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
