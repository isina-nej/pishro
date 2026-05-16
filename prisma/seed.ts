import {
  PrismaClient,
  Prisma,
  CourseLevel,
  Language,
  CourseStatus,
  UserRoleType,
} from "@prisma/client";
import { seedNews } from "./seeds/seed-news.js";

const prisma = new PrismaClient();

// Type for library book data structure
interface LibraryBookData {
  id: string;
  title: string;
  author: string;
  year: number;
  rating: number;
  votes: number;
  popularity: number;
  category: string;
  formats: string[];
  status: string[];
  cover: string;
  description: string;
  tags: string[];
  readingTime: string;
  isFeatured?: boolean;
}

const libraryBooks: LibraryBookData[] = [
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
    category: "سرمایه‌ گذاری",
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
      "گام‌به‌گام تا رسیدن به استقلال مالی در ایران با تمرکز بر درآمد غیرفعال و سرمایه‌ گذاری‌های هوشمند.",
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
    title: "سرمایه‌ گذاری جسورانه",
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

// Type for news article data
interface NewsArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: Date;
  views: number;
}

const newsArticles: NewsArticleData[] = [
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
    title: "سرمایه‌ گذاری در استارتاپ‌های ایرانی رکورد زد",
    slug: "iranian-startups-investment",
    excerpt:
      "در سال جاری، سرمایه‌ گذاری در استارتاپ‌های فناوری‌محور رشد چشمگیری داشته است.",
    content:
      "سرمایه‌گذاران داخلی و خارجی علاقه‌مند به بازار فناوری ایران، بیش از ۵۰۰ میلیارد تومان سرمایه تزریق کرده‌اند.",
    coverImage:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    author: "مجله کسب‌وکار پیشرو",
    category: "کسب و کار",
    tags: ["استارتاپ", "سرمایه‌ گذاری", "نوآوری"],
    published: true,
    publishedAt: new Date(),
    views: 730,
  },
];

async function main(): Promise<void> {
  console.log("⏳ Seeding database...");

  // ==============================================
  // 🧹 Cleanup old data
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

  // Landing pages cleanup
  await prisma.mobileScrollerStep.deleteMany();
  await prisma.homeLanding.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.resumeItem.deleteMany();
  await prisma.aboutPage.deleteMany();
  await prisma.businessConsulting.deleteMany();
  await prisma.investmentTag.deleteMany();
  await prisma.investmentPlan.deleteMany();
  await prisma.investmentPlans.deleteMany();
  await prisma.homeSlide.deleteMany();
  await prisma.homeMiniSlider.deleteMany();

  // ==============================================
  // 🏷️ Insert Tags
  // ==============================================
  console.log("🏷️  Creating tags...");
  const createdTags: any[] = [];
  for (const tag of tags) {
    const created = await prisma.tag.create({
      data: tag,
    });
    createdTags.push(created);
  }
  console.log(`✅ Inserted ${createdTags.length} tags`);

  // ==============================================
  // 🎯 Insert Categories
  // ==============================================
  console.log("🎯 Creating categories...");
  const createdCategories: Record<string, { id: string }> = {};
  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        ...category,
      },
    });
    createdCategories[category.slug] = created;
  }
  console.log(
    `✅ Inserted ${Object.keys(createdCategories).length} categories`
  );

  // ==============================================
  // 📚 Insert Courses
  // ==============================================
  console.log("📚 Creating courses...");
  const createdCourses: any[] = [];
  for (const course of courses) {
    // Find appropriate category
    let categoryId: string | null = null;
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
      },
    });
    createdCourses.push(created);
  }
  console.log(`✅ Inserted ${createdCourses.length} courses`);

  // ==============================================
  // 💬 Insert Comments
  // ==============================================
  console.log("💬 Creating comments...");
  let commentCount = 0;
  for (const comment of comments) {
    // Attach comments to categories
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
  // 📚 Insert Books
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
      },
    });
  }
  console.log(`✅ Inserted ${libraryBooks.length} books`);

  // ==============================================
  // 📰 Insert News Articles
  // ==============================================
  console.log("📰 Creating news articles...");
  const newsResult = await seedNews();
  console.log(`✅ Inserted ${newsResult.created} articles`);


  // ==============================================
  // 🏠 Insert Home Landing Data
  // ==============================================
  console.log("🏠 Creating Home Landing data...");
  await prisma.homeLanding.create({
    data: {
      mainHeroTitle: "پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران",
      mainHeroSubtitle: null,
      mainHeroCta1Text: "شروع مسیر موفقیت",
      mainHeroCta1Link: "/business-consulting",
      heroTitle: "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
      heroSubtitle: "آموزش، مشاوره و همراهی در مسیر موفقیت مالی",
      heroDescription: null,
      heroVideoUrl: "/videos/aboutUs.webm",
      heroCta1Text: null,
      heroCta1Link: null,
      overlayTexts: [
        "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
        "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
        "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.",
        "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
      ],
      statsData: JSON.parse(
        JSON.stringify([
          { label: "دانشجو", value: 300, suffix: "+" },
          { label: "کارمند", value: 30, suffix: "+" },
          { label: "پروژه", value: 100, suffix: "+" },
        ])
      ),
      whyUsItems: JSON.parse(
        JSON.stringify([
          {
            label: "آموزش حرفه‌ای",
            title: "پیشرو در آموزش‌های حرفه‌ای و به‌روز سرمایه‌ گذاری",
            text: "دوره‌های آموزشی ما کامل‌ترین محتوای کریپتو، بورس، NFT، متاورس و ایردراپ رو پوشش می‌ده. آموزش‌ها از مبتدی تا پیشرفته طراحی شدن، پس همه می‌تونن شروع کنن و رشد کنن. با مثال‌های عملی و محتوای کاربردی، یادگیری تبدیل به تجربه‌ای لذت‌بخش و مفید میشه. پیشرو همیشه با جدیدترین ترندها و روش‌های سرمایه‌ گذاری همراهتونه.",
            btnLabel: "اطلاعات بیشتر",
            btnHref: "/about-us",
            animationPath: "/animations/investment-education.json",
            imagePath: "/images/landing/img-1.jpg",
          },
          {
            label: "سبدهای شخصی‌سازی‌شده",
            title: "پیشرو در ارائه سبدهای سرمایه‌ گذاری شخصی‌سازی‌شده",
            text: "هر کسی با هر سطح سرمایه و ریسک‌پذیری می‌تونه بهترین پیشنهاد سرمایه‌ گذاری رو پیدا کنه. ما با تحلیل‌های تخصصی بازار، سبدهایی متناسب با شرایطت طراحی می‌کنیم. تنوع در سبدها باعث میشه بتونی هم سود بیشتری داشته باشی، هم ریسک کمتری تجربه کنی. سرمایه‌ گذاری با پیشرو یعنی تصمیم‌گیری آگاهانه و مدیریت هوشمندانه پولت.",
            btnLabel: "اطلاعات بیشتر",
            btnHref: "/investment-plans",
            animationPath:
              "/animations/man-taking-payout-of-cryptocurrency.json",
            imagePath: "/images/landing/img-2.jpg",
          },
          {
            label: "پشتیبانی و رشد",
            title: "پیشرو، همراهی مطمئن برای رشد و موفقیت",
            text: "از اولین قدم‌های یادگیری تا انتخاب بهترین سرمایه‌ گذاری، پیشرو همیشه کنارتونه. تیم پشتیبانی و مشاوره ما آماده‌ست تا هر سوالی که داری رو جواب بده. عضویت در پیشرو یعنی دسترسی به جامعه‌ای فعال و متخصص که توش همیشه یاد می‌گیری. با انتخاب پیشرو، امنیت، شفافیت و آینده‌ای بهتر رو برای خودت می‌سازی.",
            btnLabel: "اطلاعات بیشتر",
            btnHref: "/business-consulting",
            animationPath: "/animations/transaction-in-cryptocurrency.json",
            imagePath: "/images/landing/img-3.jpg",
          },
        ])
      ),
      newsClubTitle: "باشگاه خبری پیشرو",
      newsClubDescription:
        "با عضویت در باشگاه خبری پیشرو، از آخرین اخبار و تحلیل‌های بازار باخبر شوید",
      metaTitle: "آکادمی مالی پیشرو سرمایه - آموزش و مشاوره سرمایه‌ گذاری",
      metaDescription:
        "پیشرو بزرگترین مؤسسه آموزش و مشاوره سرمایه‌ گذاری در ایران. آموزش بورس، کریپتو، متاورس، NFT و ایردراپ",
      metaKeywords: [
        "پیشرو",
        "سرمایه‌ گذاری",
        "بورس",
        "کریپتو",
        "آموزش",
        "مشاوره",
      ],
      published: true,
      order: 0,
    },
  });
  console.log("✅ Home Landing created");

  // ==============================================
  // 📱 Insert Mobile Scroller Steps
  // ==============================================
  console.log("📱 Creating Mobile Scroller Steps...");
  const mobileSteps = [
    {
      stepNumber: 1,
      title: "شروع سرمایه‌ گذاری هوشمند",
      description:
        "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",
      imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
      coverImageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-blue-400/30 via-indigo-400/20 to-transparent",
      order: 1,
      published: true,
    },
    {
      stepNumber: 2,
      title: "فرصت‌های نوین",
      description:
        "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.",
      imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
      coverImageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-blue-400/30 via-mySecondary-400/20 to-transparent",
      order: 2,
      published: true,
    },
    {
      stepNumber: 3,
      title: "مدیریت سبد سرمایه",
      description:
        "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
      imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
      coverImageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-amber-400/30 via-orange-400/20 to-transparent",
      order: 3,
      published: true,
    },
  ];

  for (const step of mobileSteps) {
    await prisma.mobileScrollerStep.create({ data: step });
  }
  console.log(`✅ Inserted ${mobileSteps.length} mobile scroller steps`);

  // ==============================================
  // 📄 Insert About Page Data
  // ==============================================
  console.log("📄 Creating About Page data...");
  const aboutPage = await prisma.aboutPage.create({
    data: {
      heroTitle: "آکادمی مالی پیشرو سرمایه",
      heroSubtitle:
        "با تجربه‌ای بیش از ۵ سال در زمینه آموزش و مشاوره بازارهای مالی",
      heroDescription: "همراه شما در مسیر موفقیت و ثروت‌آفرینی هستیم",
      heroBadgeText: "پیشرو در آموزش و سرمایه‌ گذاری",
      heroStats: JSON.parse(
        JSON.stringify([
          { label: "دانشجوی موفق", value: 3000, icon: "LuUsers" },
          { label: "دوره تخصصی", value: 100, icon: "LuAward" },
          { label: "رضایت کاربران", value: 95, icon: "LuTarget" },
        ])
      ),
      resumeTitle: "درباره پیشرو",
      resumeSubtitle: "مسیر ما در خدمت به شما",
      teamTitle: "تیم ما",
      teamSubtitle: "بانیان و مدیران آکادمی مالی پیشرو",
      certificatesTitle: "افتخارات و تقدیرنامه‌ها",
      certificatesSubtitle: "دستاوردهای ما در مسیر خدمت‌رسانی",
      newsTitle: "اخبار پیشرو",
      newsSubtitle: "آخرین اخبار و رویدادهای آکادمی",
      ctaTitle: "آماده شروع هستید؟",
      ctaDescription: "همین امروز به جمع هزاران دانشجوی موفق پیشرو بپیوندید",
      ctaButtonText: "شروع کنید",
      ctaButtonLink: "/courses",
      metaTitle: "درباره ما - آکادمی مالی پیشرو سرمایه",
      metaDescription:
        "آشنایی با تیم، تاریخچه و ماموریت آکادمی مالی پیشرو سرمایه",
      metaKeywords: ["درباره پیشرو", "تیم پیشرو", "آکادمی مالی"],
      published: true,
    },
  });

  // Resume Items
  const resumeItems = [
    {
      icon: "LuClock",
      title: "تاریخچه",
      description:
        "آکادمی مالی پیشرو سرمایه از سال ۱۴۰۰ فعالیت خود را آغاز کرد و با هدف ارتقاء سواد مالی جامعه، مسیر خود را ادامه می‌دهد.",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50",
      order: 1,
    },
    {
      icon: "LuTarget",
      title: "ماموریت",
      description:
        "ارائه آموزش‌های تخصصی و مشاوره‌های حرفه‌ای در حوزه بازارهای مالی با تأکید بر کیفیت و کاربردی بودن محتوا.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      order: 2,
    },
    {
      icon: "LuEye",
      title: "چشم‌انداز",
      description:
        "تبدیل شدن به بزرگترین و معتبرترین مرجع آموزشی و مشاوره‌ای بازارهای مالی در ایران و منطقه.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      order: 3,
    },
    {
      icon: "LuHeart",
      title: "ارزش‌ها",
      description:
        "صداقت، شفافیت، تعهد به کیفیت، نوآوری مستمر و توجه به نیازهای دانشجویان از اصول بنیادین ماست.",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      order: 4,
    },
  ];

  for (const item of resumeItems) {
    await prisma.resumeItem.create({
      data: { ...item, aboutPageId: aboutPage.id },
    });
  }

  // Team Members
  const teamMembers = [
    {
      name: "طاهره جهانی",
      role: "دکترای اقتصاد (گرایش اقتصاد سنجی)",
      image: "/images/about/about.jpg",
      education: "دکترای اقتصاد - دانشگاه تهران",
      description:
        "کارشناس تخصصی و فعال (تحلیلگر و معامله گر) بازارهای مالی، عضو هیات علمی دانشگاه، مدیرعامل آکادمی مالی پیشرو سرمایه. هدف از راه اندازی این سایت ارائه محتوای مفید، متنوع و جامع به فعالان بازارهای مالی است.",
      specialties: ["تحلیل بازار", "معامله‌گری", "آموزش اقتصاد"],
      linkedinUrl: null,
      emailUrl: null,
      twitterUrl: null,
      order: 1,
    },
    {
      name: "سید عنایت الله مومنی",
      role: "دکترای مدیریت آموزشی",
      image: "/images/about/about3.jpg",
      education: "دکترای مدیریت آموزشی",
      description:
        "۳۰ سال تجربه تخصصی بانکداری، مدرس دانشگاه، کارمند نمونه ملی در سال ۱۳۸۳، رتبه ۱ توانمندی مالی و مدیریتی از سال ۹۲ تا ۹۸، دارای ترجمه و تالیف ۴ کتاب، داوری مقالات داخلی و مدرس علوم بانکی کل شعب استان دارای فیلد تخصصی شبکه سازی، مهارت‌های ارتباطی، فروش و بازاریابی و مشاوره کسب وکار.",
      specialties: ["مدیریت", "بانکداری", "مشاوره کسب و کار"],
      linkedinUrl: null,
      emailUrl: null,
      twitterUrl: null,
      order: 2,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.create({
      data: { ...member, aboutPageId: aboutPage.id },
    });
  }

  // Certificates
  const certificates = [
    {
      title: "تقدیرنامه برگزاری دوره‌های آموزشی",
      description: "از سازمان نظام صنفی رایانه‌ای",
      image: "/images/certificates/cert-1.jpg",
      order: 1,
    },
    {
      title: "گواهی عضویت در انجمن اقتصاد ایران",
      description: "عضویت فعال در انجمن اقتصاد ایران",
      image: "/images/certificates/cert-2.jpg",
      order: 2,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({
      data: { ...cert, aboutPageId: aboutPage.id },
    });
  }

  console.log("✅ About Page created with items");

  // ==============================================
  // 💼 Insert Investment Consulting Data
  // ==============================================
  console.log("💼 Creating Investment Consulting data...");
  await prisma.businessConsulting.create({
    data: {
      title: "مشاوره کسب وکار پیشرو",
      description:
        "در بخش مشاوره کسب‌وکار، همراه شماییم تا در هر حرفه‌ای که دارید، مسیر رشد و توسعه را هموار کنیم. چه در فکر راه‌اندازی یک کسب‌وکار جدید باشید و چه بخواهید بیزنس فعلی‌تان را به مرحله‌ای بالاتر ببرید، کنار شما هستیم. با بررسی دقیق شرایط شخصی و بازار، راهکارهایی عملی برای سرمایه‌ گذاری درست منابع مالی در دسترس و حتی بودجه‌های جانبی ارائه می‌دهیم. مشاوره‌های ما بر پایه تجربه، تحلیل داده‌محور و شناخت واقعی از فضای کسب‌وکار امروز شکل گرفته‌اند. آینده‌ شغلی‌تان را هوشمندانه طراحی کنید.",
      image: "/images/business-consulting/landing.jpg",
      phoneNumber: "0912-123-4567",
      telegramId: "@InvestmentSupport",
      telegramLink: "https://t.me/amirhossein_v2",
      coursesLink: "https://t.me/MyCoursesChannel",
      inPersonTitle: "مشاوره حضوری",
      inPersonDescription: "برای رزرو مشاوره حضوری با ما تماس بگیرید",
      onlineTitle: "مشاوره آنلاین",
      onlineDescription: "برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید",
      coursesTitle: "دوره‌های آموزشی",
      coursesDescription: "برای مشاهده دوره‌های ما در تلگرام کلیک کنید",
      metaTitle: "مشاوره کسب و کار - پیشرو",
      metaDescription: "مشاوره تخصصی کسب و کار و سرمایه‌ گذاری با تیم پیشرو",
      metaKeywords: ["مشاوره", "کسب و کار", "سرمایه‌ گذاری"],
      published: true,
    },
  });
  console.log("✅ Investment Consulting created");

  // ==============================================
  // 📊 Insert Investment Plans Data
  // ==============================================
  console.log("📊 Creating Investment Plans data...");
  const investmentPlans = await prisma.investmentPlans.create({
    data: {
      title: "سبد های سرمایه گذاری پیشرو",
      description:
        "هر سبد سرمایه‌ گذاری با تکیه بر تحلیل‌های کمّی، رویکرد مدیریت ریسک و ارزیابی جامع بازارها تدوین می‌شود. با بهره‌گیری هم‌زمان از ظرفیت‌های بازار سرمایه و دارایی‌های دیجیتال، بهینه‌سازی بازده در چارچوب اصول مالی دنبال می‌گردد. هدف ما، ایجاد مسیرهای باثبات برای رشد سرمایه و حفظ ارزش دارایی در بلندمدت است.",
      image: "/images/investment-plans/landing.jpg",
      plansIntroCards: JSON.parse(
        JSON.stringify([
          {
            title: "مدیریت سرمایه",
            description:
              "تقسیم سرمایه، ریسک به ریوارد، و جلوگیری از ضررهای بزرگ",
          },
          {
            title: "تحلیل بنیادی",
            description: "بررسی صورت‌های مالی شرکت‌ها و تحلیل ارزش ذاتی سهام",
          },
          {
            title: "استراتژی ورود و خروج",
            description: "تعیین نقاط مناسب برای خرید و فروش با ابزارهای ترکیبی",
          },
          {
            title: "تحلیل تکنیکال حرفه‌ای",
            description:
              "یادگیری الگوها، کندل‌ها، و سطوح مهم در بازار بورس با مثال‌های عملی",
          },
          {
            title: "روانشناسی معامله‌گری",
            description: "شناخت رفتار بازار، کنترل احساسات و تصمیم‌گیری هوشمند",
          },
        ])
      ),
      minAmount: 10,
      maxAmount: 10000,
      amountStep: 10,
      metaTitle: "سبدهای سرمایه‌ گذاری - پیشرو",
      metaDescription:
        "سبدهای سرمایه‌ گذاری شخصی‌سازی شده برای بورس و ارز دیجیتال",
      metaKeywords: ["سبد سرمایه‌ گذاری", "پورتفولیو", "تنوع سرمایه"],
      published: true,
    },
  });

  // Investment Plans
  const plans = [
    {
      label: "ارز دیجیتال",
      icon: "Bitcoin",
      description: "سبد اختصاصی ارزهای دیجیتال",
      order: 1,
    },
    {
      label: "بورس",
      icon: "LineChart",
      description: "سبد سهام بورس تهران",
      order: 2,
    },
    {
      label: "ترکیبی",
      icon: "PieChart",
      description: "ترکیب بورس و کریپتو",
      order: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.investmentPlan.create({
      data: { ...plan, investmentPlansId: investmentPlans.id },
    });
  }

  // Investment Tags
  const investmentTags = [
    "تحلیل تکنیکال",
    "تحلیل بنیادی",
    "بورس تهران",
    "ارز دیجیتال",
    "فارکس",
    "سهام بلندمدت",
    "صندوق‌های سرمایه‌ گذاری",
    "اوراق قرضه",
    "مدیریت ریسک",
    "تنوع سبد سرمایه‌ گذاری",
  ];

  let tagOrder = 1;
  for (const tag of investmentTags) {
    await prisma.investmentTag.create({
      data: {
        title: tag,
        color: null,
        icon: null,
        order: tagOrder++,
        published: true,
        investmentPlansId: investmentPlans.id,
      },
    });
  }

  console.log("✅ Investment Plans created with plans and tags");

  // ==============================================
  // 🖼️ Insert Home Slides (ImageZoomSliderSection)
  // ==============================================
  console.log("🖼️ Creating Home Slides...");
  const homeSlides = [
    {
      title: "تحلیل تکنیکال حرفه‌ای",
      description:
        "یادگیری اصول و تکنیک‌های پیشرفته تحلیل تکنیکال برای معامله‌گری موفق در بازارهای مالی",
      imageUrl: "/images/home/landing-slider/p01.webp",
      order: 1,
      published: true,
    },
    {
      title: "مدیریت ریسک و سرمایه",
      description:
        "آموزش اصولی مدیریت سرمایه و کنترل ریسک برای حفظ و رشد پایدار پورتفولیو سرمایه‌ گذاری",
      imageUrl: "/images/home/landing-slider/p02.webp",
      order: 2,
      published: true,
    },
    {
      title: "استراتژی‌های معاملاتی",
      description:
        "آشنایی با استراتژی‌های معاملاتی موفق و کاربردی برای بازارهای ارز دیجیتال و بورس",
      imageUrl: "/images/home/landing-slider/p03.webp",
      order: 3,
      published: true,
    },
    {
      title: "روانشناسی معامله‌گری",
      description:
        "تسلط بر احساسات و تصمیم‌گیری‌های هوشمندانه در بازارهای پرنوسان مالی",
      imageUrl: "/images/home/landing-slider/p04.webp",
      order: 4,
      published: true,
    },
    {
      title: "تحلیل بنیادی بازارها",
      description:
        "شناخت عوامل بنیادی تأثیرگذار بر بازارهای مالی و تصمیم‌گیری آگاهانه در سرمایه‌ گذاری",
      imageUrl: "/images/home/landing-slider/p05.jpg",
      order: 5,
      published: true,
    },
    {
      title: "معامله‌گری الگوریتمی",
      description:
        "آموزش اصول معامله‌گری خودکار و استفاده از ابزارهای هوشمند برای بهینه‌سازی معاملات",
      imageUrl: "/images/home/landing-slider/p06.jpg",
      order: 6,
      published: true,
    },
    {
      title: "تحلیل تکنیکال پیشرفته",
      description:
        "یادگیری اندیکاتورها و الگوهای پیشرفته برای شناسایی فرصت‌های معاملاتی سودآور",
      imageUrl: "/images/home/landing-slider/p07.jpg",
      order: 7,
      published: true,
    },
    {
      title: "استراتژی نوسان‌گیری",
      description:
        "تکنیک‌های حرفه‌ای نوسان‌گیری در بازارهای کوتاه‌مدت و میان‌مدت برای کسب سود مستمر",
      imageUrl: "/images/home/landing-slider/p08.jpg",
      order: 8,
      published: true,
    },
    {
      title: "سرمایه‌ گذاری بلندمدت",
      description:
        "اصول و استراتژی‌های سرمایه‌ گذاری بلندمدت برای رشد پایدار و ایجاد ثروت",
      imageUrl: "/images/home/landing-slider/p09.jpg",
      order: 9,
      published: true,
    },
    {
      title: "تحلیل حجم معاملات",
      description:
        "آموزش تحلیل حجم و شناسایی حرکات اصلی بازار برای ورود و خروج به‌موقع",
      imageUrl: "/images/home/landing-slider/p10.jpg",
      order: 10,
      published: true,
    },
    {
      title: "استراتژی پرایس اکشن",
      description:
        "تسلط بر تحلیل حرکت قیمت و معامله‌گری بدون نیاز به اندیکاتورهای پیچیده",
      imageUrl: "/images/home/landing-slider/p11.jpg",
      order: 11,
      published: true,
    },
    {
      title: "مدیریت پورتفولیو",
      description:
        "آموزش تخصیص دارایی و متنوع‌سازی سبد سرمایه‌ گذاری برای کاهش ریسک و افزایش بازدهی",
      imageUrl: "/images/home/landing-slider/p12.jpg",
      order: 12,
      published: true,
    },
  ];

  for (const slide of homeSlides) {
    await prisma.homeSlide.create({ data: slide });
  }
  console.log(`✅ Inserted ${homeSlides.length} home slides`);

  // ==============================================
  // 🎞️ Insert Home Mini Sliders
  // ==============================================
  console.log("🎞️ Creating Home Mini Sliders...");
  const miniSliderImages = [
    // Row 1
    "/images/home/landing-slider/p01.webp",
    "/images/home/landing-slider/p02.webp",
    "/images/home/landing-slider/p03.webp",
    "/images/home/landing-slider/p04.webp",
    "/images/home/landing-slider/p05.jpg",
    "/images/home/landing-slider/p06.jpg",
    // Row 2
    "/images/home/landing-slider/p07.jpg",
    "/images/home/landing-slider/p08.jpg",
    "/images/home/landing-slider/p09.jpg",
    "/images/home/landing-slider/p10.jpg",
    "/images/home/landing-slider/p11.jpg",
    "/images/home/landing-slider/p12.jpg",
  ];

  let miniOrder = 1;
  for (let i = 0; i < miniSliderImages.length; i++) {
    await prisma.homeMiniSlider.create({
      data: {
        imageUrl: miniSliderImages[i],
        row: i < 6 ? 1 : 2,
        order: miniOrder++,
        published: true,
      },
    });
  }
  console.log(`✅ Inserted ${miniSliderImages.length} mini slider images`);

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
// 🎯 Category Data
// ==============================================
const categories: Prisma.CategoryCreateInput[] = [
  {
    slug: "cryptocurrency",
    title: "ارزهای دیجیتال",
    description:
      "در دنیای کریپتو، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
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
      "در دنیای ایردراپ، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
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
      "در دنیای متاورس، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
    icon: "🌐",
    coverImage: "/images/utiles/student.svg",
    color: "#8B5CF6",
    metaTitle: "آموزش متاورس - پیشرو",
    metaDescription:
      "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار متاورس بساز.",
    metaKeywords: ["متاورس", "واقعیت مجازی", "VR", "سرمایه‌ گذاری متاورس"],
    published: true,
    featured: true,
    order: 3,
  },
  {
    slug: "nft",
    title: "NFT",
    description:
      "در دنیای NFT، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
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
      "در دنیای بورس، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
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
      "سرمایه‌ گذاری",
      "تحلیل بنیادی",
    ],
    published: true,
    featured: true,
    order: 5,
  },
];

// ==============================================
// 🏷️ Tag Data
// ==============================================
const tags: Prisma.TagCreateInput[] = [
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
    description: "سرمایه‌ گذاری در بورس تهران",
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
    description: "سرمایه‌ گذاری بلندمدت در سهام",
    color: "#06B6D4",
    icon: "📅",
    published: true,
  },
  {
    slug: "investment-funds",
    title: "صندوق‌های سرمایه‌ گذاری",
    description: "سرمایه‌ گذاری در صندوق‌ها",
    color: "#EC4899",
    icon: "💼",
    published: true,
  },
  {
    slug: "bonds",
    title: "اوراق قرضه",
    description: "سرمایه‌ گذاری در اوراق قرضه",
    color: "#84CC16",
    icon: "📜",
    published: true,
  },
  {
    slug: "risk-management",
    title: "مدیریت ریسک",
    description: "روش‌های مدیریت ریسک در سرمایه‌ گذاری",
    color: "#F97316",
    icon: "🛡️",
    published: true,
  },
  {
    slug: "portfolio-diversification",
    title: "تنوع سبد سرمایه‌ گذاری",
    description: "ایجاد سبد متنوع سرمایه‌ گذاری",
    color: "#14B8A6",
    icon: "🎯",
    published: true,
  },
];

// ==============================================
// 📚 Course Data
// ==============================================
interface CourseData {
  subject: string;
  price: number;
  img: string;
  rating: number;
  description: string;
  discountPercent: number;
  time: string;
  students: number;
  videosCount: number;
  slug: string;
  level: CourseLevel;
  language: Language;
  prerequisites: string[];
  learningGoals: string[];
  instructor: string;
  status: CourseStatus;
  published: boolean;
  featured: boolean;
  views: number;
}

const courses: CourseData[] = [
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
    prerequisites: ["آشنایی با بورس تهران", "دانش مالی و حسابداری پایه"],
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
      "درک عمیق از دنیای متاورس، واقعیت مجازی و فرصت‌های سرمایه‌ گذاری در این حوزه نوظهور.",
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
      "فرصت‌های سرمایه‌ گذاری",
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
    prerequisites: ["تجربه ترید در کریپتو", "آشنایی با تحلیل تکنیکال"],
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
// 💬 Comment Data (Student testimonials)
// ==============================================
interface CommentData {
  userName: string;
  userAvatar: string;
  userRole: UserRoleType;
  text: string;
  rating: number;
  published: boolean;
  verified: boolean;
  featured: boolean;
  views: number;
}

const comments: CommentData[] = [
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
