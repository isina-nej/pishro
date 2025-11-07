import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const libraryBooks = [
  {
    id: "crypto-mindset",
    title: "ذهن میلیونر کریپتو",
    author: "آرمان صفوی",
    year: 2025,
    rating: 9.2,
    votes: 2780,
    popularity: 11230,
    category: "ارز دیجیتال",
    formats: ["الکترونیکی", "صوتی"],
    status: ["جدید"],
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=720&q=80",
    description:
      "نحوه‌ی تفکر و تصمیم‌گیری معامله‌گران بزرگ بازار رمزارز و روش ساخت ذهن مقاوم در برابر نوسانات شدید.",
    tags: ["کریپتو", "احساسات بازار", "بیت‌کوین"],
    readingTime: "9 ساعت",
    isFeatured: true,
  },
  {
    id: "smart-investor-iran",
    title: "سرمایه‌گذار هوشمند ایرانی",
    author: "فرهاد رضایی",
    year: 2024,
    rating: 9.0,
    votes: 3150,
    popularity: 10120,
    category: "سرمایه‌گذاری",
    formats: ["جلد نرم", "الکترونیکی"],
    status: ["پرفروش"],
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=720&q=80",
    description:
      "اقتباسی از تفکرات بنجامین گراهام با مثال‌های واقعی از بورس و بازار ایران؛ روشی علمی برای کاهش ریسک و افزایش سود.",
    tags: ["بورس", "تحلیل بنیادی", "مدیریت ریسک"],
    readingTime: "11 ساعت",
    isFeatured: true,
  },
  {
    id: "trading-psychology",
    title: "روانشناسی معامله‌گری",
    author: "سحر فاضلی",
    year: 2023,
    rating: 8.8,
    votes: 1840,
    popularity: 8720,
    category: "مدیریت مالی",
    formats: ["صوتی", "الکترونیکی"],
    status: ["ویژه"],
    cover:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=720&q=80",
    description:
      "تحلیل رفتار ذهنی تریدرها در شرایط استرس بازار و روش‌های کنترل احساسات هنگام خرید و فروش.",
    tags: ["احساسات", "معامله‌گری", "روانشناسی بازار"],
    readingTime: "6 ساعت",
  },
  {
    id: "bitcoin-history",
    title: "داستان بیت‌کوین",
    author: "پرهام نادری",
    year: 2022,
    rating: 8.7,
    votes: 1450,
    popularity: 7680,
    category: "ارز دیجیتال",
    formats: ["جلد سخت", "صوتی"],
    status: ["ویژه"],
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
    description:
      "روایت جذاب پیدایش بیت‌کوین، خالق ناشناس آن و تحول اقتصاد جهانی با ظهور پول غیرمتمرکز.",
    tags: ["بیت‌کوین", "فناوری بلاکچین", "تاریخ پول"],
    readingTime: "10 ساعت",
  },
  {
    id: "financial-freedom",
    title: "آزادی مالی در ایران",
    author: "نیلوفر احمدی",
    year: 2025,
    rating: 9.4,
    votes: 2980,
    popularity: 11900,
    category: "کسب و کار",
    formats: ["الکترونیکی", "جلد نرم"],
    status: ["جدید"],
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=720&q=80",
    description:
      "گام‌به‌گام تا رسیدن به استقلال مالی در ایران با تمرکز بر درآمد غیرفعال و سرمایه‌گذاری‌های هوشمند.",
    tags: ["آزادی مالی", "درآمد غیرفعال", "پولسازی"],
    readingTime: "8 ساعت",
    isFeatured: true,
  },
  {
    id: "market-cycles",
    title: "چرخه‌های بازار",
    author: "دکتر کوروش صادقی",
    year: 2024,
    rating: 8.9,
    votes: 1920,
    popularity: 9020,
    category: "اقتصاد",
    formats: ["جلد سخت"],
    status: ["پرفروش"],
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=720&q=80",
    description:
      "تحلیل جامع رفتار بازار در دوره‌های رونق و رکود با نگاهی به بورس، طلا، ارز و کریپتو.",
    tags: ["چرخه اقتصادی", "تحلیل بازار", "پیش‌بینی روند"],
    readingTime: "12 ساعت",
  },
  {
    id: "technical-analysis-pro",
    title: "تحلیل تکنیکال پیشرفته",
    author: "محمدحسین مرادی",
    year: 2023,
    rating: 9.1,
    votes: 2230,
    popularity: 9820,
    category: "تحلیل تکنیکال",
    formats: ["الکترونیکی", "جلد نرم"],
    status: ["ویژه"],
    cover:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=720&q=80",
    description:
      "آموزش عمیق پرایس‌اکشن، الگوهای کندلی و واگرایی‌ها برای حرفه‌ای‌ها.",
    tags: ["پرایس اکشن", "کندل‌استیک", "نمودار"],
    readingTime: "14 ساعت",
    isFeatured: true,
  },
  {
    id: "gold-vs-bitcoin",
    title: "طلا یا بیت‌کوین؟",
    author: "علیرضا نیک‌نژاد",
    year: 2022,
    rating: 8.5,
    votes: 1300,
    popularity: 7450,
    category: "اقتصاد",
    formats: ["جلد نرم", "صوتی"],
    status: ["ویژه"],
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
    description: "مقایسه تحلیلی بین طلا و بیت‌کوین به عنوان ذخیره ارزش قرن ۲۱.",
    tags: ["طلا", "بیت‌کوین", "اقتصاد جهانی"],
    readingTime: "7 ساعت",
  },
  {
    id: "startup-capital",
    title: "سرمایه‌گذاری جسورانه",
    author: "شقایق کاظمی",
    year: 2021,
    rating: 8.3,
    votes: 1020,
    popularity: 6320,
    category: "کسب و کار",
    formats: ["الکترونیکی", "جلد سخت"],
    status: ["پرفروش"],
    cover:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=720&q=80",
    description:
      "چگونه سرمایه‌گذاران خطرپذیر استارتاپ‌های آینده‌ساز را انتخاب می‌کنند و سودهای چندبرابری می‌سازند.",
    tags: ["VC", "استارتاپ", "توسعه کسب‌وکار"],
    readingTime: "9 ساعت",
  },
];

// اخبار فیک
const newsArticles = [
  {
    title: "بازار رمزارزها دوباره داغ شد!",
    slug: "crypto-market-rising",
    excerpt:
      "پس از یک دوره رکود نسبی، بازار رمزارزها بار دیگر با افزایش حجم معاملات و رشد قیمت‌ها روبه‌رو شده است.",
    content:
      "تحلیل‌گران معتقدند افزایش اعتماد عمومی و ورود سرمایه‌گذاران نهادی به بازار، عامل اصلی رشد اخیر رمزارزها است.",
    coverImage:
      "https://images.unsplash.com/photo-1620228885840-2a8fcd53a1b3?auto=format&fit=crop&w=800&q=80",
    author: "تحریریه پیشرو",
    category: "ارز دیجیتال",
    tags: ["کریپتو", "بیت‌کوین", "اتریوم"],
    published: true,
    publishedAt: new Date(),
    views: 820,
  },
  {
    title: "تحلیل جدید از آینده نرخ بهره در ایران",
    slug: "iran-interest-rate-forecast",
    excerpt:
      "کارشناسان اقتصادی در تازه‌ترین گزارش خود پیش‌بینی کرده‌اند نرخ بهره در سال آینده کاهش خواهد یافت.",
    content:
      "این گزارش نشان می‌دهد سیاست‌های جدید بانک مرکزی در راستای کنترل تورم و حمایت از تولید می‌تواند نرخ بهره را کاهش دهد.",
    coverImage:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=800&q=80",
    author: "ندا خسروی",
    category: "اقتصاد",
    tags: ["اقتصاد", "نرخ بهره", "تورم"],
    published: true,
    publishedAt: new Date(),
    views: 560,
  },
  {
    title: "سرمایه‌گذاری در استارتاپ‌های ایرانی رکورد زد",
    slug: "iranian-startups-investment",
    excerpt:
      "در سال جاری، سرمایه‌گذاری در استارتاپ‌های فناوری‌محور رشد چشمگیری داشته است.",
    content:
      "سرمایه‌گذاران داخلی و خارجی علاقه‌مند به بازار فناوری ایران، بیش از ۵۰۰ میلیارد تومان سرمایه تزریق کرده‌اند.",
    coverImage:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    author: "مجله کسب‌وکار پیشرو",
    category: "کسب و کار",
    tags: ["استارتاپ", "سرمایه‌گذاری", "نوآوری"],
    published: true,
    publishedAt: new Date(),
    views: 730,
  },
];

async function main() {
  console.log("⏳ Seeding database...");

  // پاک‌سازی قبلی
  await prisma.newsComment.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.digitalBook.deleteMany();

  // درج کتاب‌ها
  for (const book of libraryBooks) {
    await prisma.digitalBook.create({
      data: {
        title: book.title,
        slug: book.id,
        author: book.author,
        description: book.description,
        cover: book.cover,
        publisher: "انتشارات پیشرو",
        year: book.year,
        pages: Math.floor(Math.random() * 300) + 100,
        category: book.category,
        rating: book.rating,
        votes: book.votes,
        views: book.popularity,
        downloads: Math.floor(book.popularity / 10),
        formats: book.formats,
        status: book.status,
        tags: book.tags,
        readingTime: book.readingTime,
        isFeatured: book.isFeatured || false,
        price: Math.floor(Math.random() * 300000) + 100000,
        fileUrl: "https://example.com/book-file.pdf",
        audioUrl: book.formats.includes("صوتی")
          ? "https://example.com/audio.mp3"
          : null,
      },
    });
  }

  console.log(`📚 Inserted ${libraryBooks.length} books`);

  // درج اخبار
  for (const article of newsArticles) {
    const created = await prisma.newsArticle.create({
      data: article,
    });

    // هر خبر 2 کامنت تصادفی بگیرد
    const fakeComments = [
      {
        content: "خیلی مقاله خوبی بود، دیدگاه جدیدی بهم داد.",
        userId: null,
        articleId: created.id,
      },
      {
        content: "به نظرم می‌شد تحلیل عمیق‌تری هم ارائه بشه.",
        userId: null,
        articleId: created.id,
      },
    ];

    for (const c of fakeComments) {
      await prisma.newsComment.create({
        data: c,
      });
    }
  }

  console.log(`📰 Inserted ${newsArticles.length} articles with comments`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// _id
// 690a81f08db113e30d4f3a64
// subject
// "بورس"
// price
// 2800000
// img
// "/images/courses/placeholder.png"
// rating
// 4.5
// description
// "یاد بگیرید چگونه با تحلیل تکنیکال و مدیریت سرمایه در بازار بورس به شکل…"
// discountPercent
// 15
// time
// "14:20"
// students
// 1380
// videosCount
// 22
// createdAt
// 2025-11-04T22:45:04.612+00:00
// _id
// 690a81f08db113e30d4f3a65
// subject
// "ارزهای دیجیتال"
// price
// 3900000
// img
// "/images/courses/placeholder.png"
// rating
// 4
// description
// "آموزش جامع رمزارزها؛ از شناخت بلاکچین تا ترید حرفه‌ای در صرافی‌های بین…"
// discountPercent
// 18
// time
// "20:10"
// students
// 2570
// videosCount
// 30
// createdAt
// 2025-11-04T22:45:04.612+00:00
// _id
// 690a81f08db113e30d4f3a66
// subject
// "بورس"
// price
// 2200000
// img
// "/images/courses/placeholder.png"
// rating
// 5
// description
// "تحلیل بنیادی و تابلوخوانی بورس ایران با مثال‌های واقعی و تمرین عملی در…"
// discountPercent
// 10
// time
// "10:45"
// students
// 890
// videosCount
// 16
// createdAt
// 2025-11-04T22:45:04.612+00:00
// _id
// 690a81f08db113e30d4f3a67
// subject
// "NFT"
// price
// 1700000
// img
// "/images/courses/placeholder.png"
// rating
// 4.5
// description
// "با مفاهیم NFT، نحوه ساخت و فروش آن‌ها در پلتفرم‌هایی مثل OpenSea و Rar…"
// discountPercent
// 25
// time
// "8:10"
// students
// 720
// videosCount
// 12
// createdAt
// 2025-11-04T22:45:04.612+00:00
// _id
// 690a81f08db113e30d4f3a68
// subject
// "متاورس"
// price
// 4300000
// img
// "/images/courses/placeholder.png"
// rating
// 4
// description
// "درک عمیق از دنیای متاورس، واقعیت مجازی و فرصت‌های سرمایه‌گذاری در این …"
// discountPercent
// 20
// time
// "16:35"
// students
// 1120
// videosCount
// 21
// createdAt
// 2025-11-04T22:45:04.612+00:00
// _id
// 690a81f08db113e30d4f3a69
// subject
// "ارزهای دیجیتال"
// price
// 3600000
// img
// "/images/courses/placeholder.png"
// rating
// 5
// description
// "استراتژی‌های پیشرفته ترید در بازار کریپتو؛ مناسب تریدرهای میان‌مدت و ح…"
// discountPercent
// 22
// time
// "24:00"
// students
// 3010
// videosCount
// 38
// createdAt
// 2025-11-04T22:45:04.612+00:00
