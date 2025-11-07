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

  // ==============================================
  // 🧹 پاک‌سازی قبلی
  // ==============================================
  console.log("🧹 Cleaning old data...");
  await prisma.comment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.course.deleteMany();
  await prisma.newsComment.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.digitalBook.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

  // ==============================================
  // 🏷️ درج Tags (تگ‌ها)
  // ==============================================
  console.log("🏷️  Creating tags...");
  const createdTags = [];
  for (const tag of tags) {
    const created = await prisma.tag.create({
      data: tag,
    });
    createdTags.push(created);
  }
  console.log(`✅ Inserted ${createdTags.length} tags`);

  // ==============================================
  // 🎯 درج Categories (دسته‌بندی‌ها)
  // ==============================================
  console.log("🎯 Creating categories...");
  const createdCategories = {};
  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        ...category,
        tagIds: createdTags.slice(0, 3).map((t) => t.id), // هر دسته 3 تگ اول
      },
    });
    createdCategories[category.slug] = created;
  }
  console.log(`✅ Inserted ${Object.keys(createdCategories).length} categories`);

  // ==============================================
  // 📚 درج Courses (دوره‌ها)
  // ==============================================
  console.log("📚 Creating courses...");
  const createdCourses = [];
  for (const course of courses) {
    // پیدا کردن category مناسب
    let categoryId = null;
    if (course.subject === "بورس") {
      categoryId = createdCategories["stock-market"].id;
    } else if (course.subject === "ارزهای دیجیتال") {
      categoryId = createdCategories["cryptocurrency"].id;
    } else if (course.subject === "NFT") {
      categoryId = createdCategories["nft"].id;
    } else if (course.subject === "متاورس") {
      categoryId = createdCategories["metaverse"].id;
    }

    const created = await prisma.course.create({
      data: {
        ...course,
        categoryId,
        tagIds: createdTags.slice(0, 5).map((t) => t.id), // هر دوره 5 تگ اول
      },
    });
    createdCourses.push(created);
  }
  console.log(`✅ Inserted ${createdCourses.length} courses`);

  // ==============================================
  // 💬 درج Comments (نظرات)
  // ==============================================
  console.log("💬 Creating comments...");
  let commentCount = 0;
  for (const comment of comments) {
    // نظرات را به دسته‌بندی‌ها متصل می‌کنیم
    for (const categorySlug of Object.keys(createdCategories)) {
      await prisma.comment.create({
        data: {
          ...comment,
          categoryId: createdCategories[categorySlug].id,
        },
      });
      commentCount++;
    }
  }
  console.log(`✅ Inserted ${commentCount} comments`);

  // ==============================================
  // 📚 درج کتاب‌ها
  // ==============================================
  console.log("📖 Creating digital books...");
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
        tagIds: createdTags.slice(0, 3).map((t) => t.id),
      },
    });
  }
  console.log(`✅ Inserted ${libraryBooks.length} books`);

  // ==============================================
  // 📰 درج اخبار
  // ==============================================
  console.log("📰 Creating news articles...");
  for (const article of newsArticles) {
    const created = await prisma.newsArticle.create({
      data: {
        ...article,
        categoryId: createdCategories["cryptocurrency"].id,
        tagIds: createdTags.slice(0, 3).map((t) => t.id),
      },
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
  console.log(`✅ Inserted ${newsArticles.length} articles with comments`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ==============================================
// 🎯 داده‌های Categories (دسته‌بندی‌ها)
// ==============================================
const categories = [
  {
    slug: "cryptocurrency",
    title: "ارزهای دیجیتال",
    description:
      "در دنیای کریپتو، ما به دنبال آموزش مفاهیم واقعی سرمایه‌گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
    icon: "🪙",
    coverImage: "/images/utiles/student.svg",
    color: "#3B82F6",
    metaTitle: "آموزش ارزهای دیجیتال - پیشرو",
    metaDescription:
      "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار کریپتو بساز.",
    metaKeywords: [
      "کریپتو",
      "ارز دیجیتال",
      "بیت‌کوین",
      "اتریوم",
      "تحلیل تکنیکال",
    ],
    published: true,
    featured: true,
    order: 1,
  },
  {
    slug: "airdrop",
    title: "ایردراپ",
    description:
      "در دنیای ایردراپ، ما به دنبال آموزش مفاهیم واقعی سرمایه‌گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
    icon: "🎁",
    coverImage: "/images/utiles/student.svg",
    color: "#10B981",
    metaTitle: "آموزش ایردراپ - پیشرو",
    metaDescription:
      "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار ایردراپ بساز.",
    metaKeywords: ["ایردراپ", "رمزارز", "کریپتو", "توکن رایگان"],
    published: true,
    featured: true,
    order: 2,
  },
  {
    slug: "metaverse",
    title: "متاورس",
    description:
      "در دنیای متاورس، ما به دنبال آموزش مفاهیم واقعی سرمایه‌گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
    icon: "🌐",
    coverImage: "/images/utiles/student.svg",
    color: "#8B5CF6",
    metaTitle: "آموزش متاورس - پیشرو",
    metaDescription:
      "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار متاورس بساز.",
    metaKeywords: ["متاورس", "واقعیت مجازی", "VR", "سرمایه‌گذاری متاورس"],
    published: true,
    featured: true,
    order: 3,
  },
  {
    slug: "nft",
    title: "NFT",
    description:
      "در دنیای NFT، ما به دنبال آموزش مفاهیم واقعی سرمایه‌گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
    icon: "🎨",
    coverImage: "/images/utiles/student.svg",
    color: "#F59E0B",
    metaTitle: "آموزش NFT - پیشرو",
    metaDescription:
      "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار NFT بساز.",
    metaKeywords: ["NFT", "توکن غیرقابل تعویض", "هنر دیجیتال", "کلکسیون"],
    published: true,
    featured: true,
    order: 4,
  },
  {
    slug: "stock-market",
    title: "بورس",
    description:
      "در دنیای بورس، ما به دنبال آموزش مفاهیم واقعی سرمایه‌گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
    icon: "📈",
    coverImage: "/images/utiles/student.svg",
    color: "#EF4444",
    metaTitle: "آموزش بورس - پیشرو",
    metaDescription:
      "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار بورس بساز.",
    metaKeywords: [
      "بورس",
      "بورس تهران",
      "سهام",
      "سرمایه‌گذاری",
      "تحلیل بنیادی",
    ],
    published: true,
    featured: true,
    order: 5,
  },
];

// ==============================================
// 🏷️ داده‌های Tags (تگ‌ها)
// ==============================================
const tags = [
  {
    slug: "technical-analysis",
    title: "تحلیل تکنیکال",
    description: "آموزش کامل تحلیل تکنیکال بازار",
    color: "#3B82F6",
    icon: "📊",
    published: true,
  },
  {
    slug: "fundamental-analysis",
    title: "تحلیل بنیادی",
    description: "آموزش تحلیل فاندامنتال",
    color: "#10B981",
    icon: "📈",
    published: true,
  },
  {
    slug: "tehran-stock-exchange",
    title: "بورس تهران",
    description: "سرمایه‌گذاری در بورس تهران",
    color: "#EF4444",
    icon: "🏛️",
    published: true,
  },
  {
    slug: "cryptocurrency",
    title: "ارز دیجیتال",
    description: "آموزش رمزارزها و ترید",
    color: "#F59E0B",
    icon: "🪙",
    published: true,
  },
  {
    slug: "forex",
    title: "فارکس",
    description: "معاملات در بازار فارکس",
    color: "#8B5CF6",
    icon: "💱",
    published: true,
  },
  {
    slug: "long-term-stocks",
    title: "سهام بلندمدت",
    description: "سرمایه‌گذاری بلندمدت در سهام",
    color: "#06B6D4",
    icon: "📅",
    published: true,
  },
  {
    slug: "investment-funds",
    title: "صندوق‌های سرمایه‌گذاری",
    description: "سرمایه‌گذاری در صندوق‌ها",
    color: "#EC4899",
    icon: "💼",
    published: true,
  },
  {
    slug: "bonds",
    title: "اوراق قرضه",
    description: "سرمایه‌گذاری در اوراق قرضه",
    color: "#84CC16",
    icon: "📜",
    published: true,
  },
  {
    slug: "risk-management",
    title: "مدیریت ریسک",
    description: "روش‌های مدیریت ریسک در سرمایه‌گذاری",
    color: "#F97316",
    icon: "🛡️",
    published: true,
  },
  {
    slug: "portfolio-diversification",
    title: "تنوع سبد سرمایه‌گذاری",
    description: "ایجاد سبد متنوع سرمایه‌گذاری",
    color: "#14B8A6",
    icon: "🎯",
    published: true,
  },
];

// ==============================================
// 📚 داده‌های Courses (دوره‌ها)
// ==============================================
const courses = [
  {
    subject: "بورس",
    price: 2800000,
    img: "/images/courses/placeholder.png",
    rating: 4.5,
    description:
      "یاد بگیرید چگونه با تحلیل تکنیکال و مدیریت سرمایه در بازار بورس به شکل حرفه‌ای معامله کنید.",
    discountPercent: 15,
    time: "14:20",
    students: 1380,
    videosCount: 22,
    slug: "stock-market-technical-analysis",
    level: "INTERMEDIATE",
    language: "FA",
    prerequisites: ["آشنایی با مفاهیم پایه بورس"],
    learningGoals: [
      "تسلط بر تحلیل تکنیکال",
      "مدیریت سرمایه و ریسک",
      "استراتژی‌های معاملاتی",
    ],
    instructor: "دکتر پیشرو",
    status: "ACTIVE",
    published: true,
    featured: true,
    views: 2450,
  },
  {
    subject: "ارزهای دیجیتال",
    price: 3900000,
    img: "/images/courses/placeholder.png",
    rating: 4,
    description:
      "آموزش جامع رمزارزها؛ از شناخت بلاکچین تا ترید حرفه‌ای در صرافی‌های بین‌المللی.",
    discountPercent: 18,
    time: "20:10",
    students: 2570,
    videosCount: 30,
    slug: "cryptocurrency-complete-guide",
    level: "BEGINNER",
    language: "FA",
    prerequisites: [],
    learningGoals: [
      "درک عمیق بلاکچین و کریپتو",
      "ترید در صرافی‌ها",
      "تحلیل بازار رمزارزها",
    ],
    instructor: "دکتر پیشرو",
    status: "ACTIVE",
    published: true,
    featured: true,
    views: 3120,
  },
  {
    subject: "بورس",
    price: 2200000,
    img: "/images/courses/placeholder.png",
    rating: 5,
    description:
      "تحلیل بنیادی و تابلوخوانی بورس ایران با مثال‌های واقعی و تمرین عملی در بازار.",
    discountPercent: 10,
    time: "10:45",
    students: 890,
    videosCount: 16,
    slug: "stock-fundamental-analysis",
    level: "ADVANCED",
    language: "FA",
    prerequisites: [
      "آشنایی با بورس تهران",
      "دانش مالی و حسابداری پایه",
    ],
    learningGoals: [
      "تحلیل بنیادی شرکت‌ها",
      "تابلوخوانی حرفه‌ای",
      "انتخاب سهام برتر",
    ],
    instructor: "دکتر پیشرو",
    status: "ACTIVE",
    published: true,
    featured: false,
    views: 1250,
  },
  {
    subject: "NFT",
    price: 1700000,
    img: "/images/courses/placeholder.png",
    rating: 4.5,
    description:
      "با مفاهیم NFT، نحوه ساخت و فروش آن‌ها در پلتفرم‌هایی مثل OpenSea و Rarible آشنا شوید.",
    discountPercent: 25,
    time: "8:10",
    students: 720,
    videosCount: 12,
    slug: "nft-creation-selling",
    level: "BEGINNER",
    language: "FA",
    prerequisites: ["آشنایی کلی با کریپتو"],
    learningGoals: [
      "ساخت NFT",
      "فروش در مارکت‌پلیس‌ها",
      "استراتژی‌های قیمت‌گذاری",
    ],
    instructor: "دکتر پیشرو",
    status: "ACTIVE",
    published: true,
    featured: false,
    views: 980,
  },
  {
    subject: "متاورس",
    price: 4300000,
    img: "/images/courses/placeholder.png",
    rating: 4,
    description:
      "درک عمیق از دنیای متاورس، واقعیت مجازی و فرصت‌های سرمایه‌گذاری در این حوزه نوظهور.",
    discountPercent: 20,
    time: "16:35",
    students: 1120,
    videosCount: 21,
    slug: "metaverse-investment",
    level: "INTERMEDIATE",
    language: "FA",
    prerequisites: ["آشنایی با بلاکچین و NFT"],
    learningGoals: [
      "شناخت متاورس و VR",
      "فرصت‌های سرمایه‌گذاری",
      "پروژه‌های برتر متاورس",
    ],
    instructor: "دکتر پیشرو",
    status: "ACTIVE",
    published: true,
    featured: true,
    views: 1560,
  },
  {
    subject: "ارزهای دیجیتال",
    price: 3600000,
    img: "/images/courses/placeholder.png",
    rating: 5,
    description:
      "استراتژی‌های پیشرفته ترید در بازار کریپتو؛ مناسب تریدرهای میان‌مدت و حرفه‌ای.",
    discountPercent: 22,
    time: "24:00",
    students: 3010,
    videosCount: 38,
    slug: "advanced-crypto-trading",
    level: "ADVANCED",
    language: "FA",
    prerequisites: [
      "تجربه ترید در کریپتو",
      "آشنایی با تحلیل تکنیکال",
    ],
    learningGoals: [
      "استراتژی‌های پیشرفته",
      "مدیریت سبد ارز دیجیتال",
      "معاملات فیوچرز و مارجین",
    ],
    instructor: "دکتر پیشرو",
    status: "ACTIVE",
    published: true,
    featured: true,
    views: 4200,
  },
];

// ==============================================
// 💬 داده‌های Comments (نظرات دانشجویان)
// ==============================================
const comments = [
  {
    userName: "آزاده بهرامی",
    userAvatar: "/images/home/real-comments/1.jpg",
    userRole: "STUDENT",
    text: "خیلی خوشحالم ازینکه حدود ۲ سال پیش با این مجموعه خصوصا خانم دکتر عزیز آشنا شدم. کلاس‌های ایشون بسیار پربار و عالی بود. همچنین پشتیبانی ایشون بعد از اتمام کلاس بسیار انگیزه و اعتمادبه‌نفس به دوره‌آموزان میده. تا همیشه مدیون ایشون هستم.",
    rating: 5,
    published: true,
    verified: true,
    featured: true,
    views: 520,
  },
  {
    userName: "محمدجواد نوری",
    userAvatar: "/images/home/real-comments/2.jpg",
    userRole: "PROFESSIONAL_TRADER",
    text: "دوره عالی و کاملی بود. از مفاهیم پایه تا پیشرفته همه چیز به صورت کاملا عملی و کاربردی آموزش داده شد. الان توی بازار فعالیت دارم و از دانشی که کسب کردم استفاده می‌کنم.",
    rating: 5,
    published: true,
    verified: true,
    featured: true,
    views: 380,
  },
  {
    userName: "امیرحسین محمدزاده",
    userAvatar: "/images/home/real-comments/3.jpg",
    userRole: "STUDENT",
    text: "من قبل از شرکت در این دوره هیچ اطلاعاتی از بازار نداشتم. الان با اطمینان می‌تونم تحلیل کنم و معامله انجام بدم. واقعا ممنونم از تیم پیشرو.",
    rating: 5,
    published: true,
    verified: true,
    featured: true,
    views: 295,
  },
  {
    userName: "امیرحسین نامدار",
    userAvatar: "/images/home/real-comments/4.jpg",
    userRole: "STUDENT",
    text: "این دوره ترید واقعاً فوق‌العاده بود! از صفر شروع کردم و حالا با اطمینان ترید می‌کنم. تحلیل تکنیکال، مدیریت ریسک و روانشناسی معامله رو عالی یاد گرفتم. تو دو هفته حساب دموم به ۳۰٪ سود رسید! آموزش‌ها جذاب، مدرس‌ها حرفه‌ای و پشتیبانی عالی بود.",
    rating: 5,
    published: true,
    verified: true,
    featured: false,
    views: 180,
  },
];
