import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Load .env and .env.local manually
const files = [".env", ".env.local"];

files.forEach(file => {
  const envPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    console.log(`Loading ${file}...`);
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length > 1) {
        const key = parts.shift()?.trim();
        const value = parts.join('=').trim();
        if (key && value && !key.startsWith("#")) {
          const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
          process.env[key] = cleanValue;
        }
      }
    });
  }
});

import { seedMiniSlider1 } from "./seeds/mini-slider-1-seed.js";
import { seedMiniSlider2 } from "./seeds/mini-slider-2-seed.js";
// ...
const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Starting selective database cleanup...");

  /**
   * -------------------------------------------------------
   * 🧹 Cleanup ONLY the requested tables
   * -------------------------------------------------------
   */
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
  await prisma.homeMiniSlider.deleteMany();

  console.log("✔️ Cleanup complete!");

  /**
   * -------------------------------------------------------
   * 🏠 Seed Home Landing
   * -------------------------------------------------------
   */
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

  /**
   * -------------------------------------------------------
   * 📱 Seed Mobile Scroller Steps
   * -------------------------------------------------------
   */
  console.log("📱 Creating Mobile Scroller Steps...");
  const mobileSteps = [
    {
      stepNumber: 1,
      title: "شروع سرمایه‌ گذاری هوشمند",
      description:
        "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",
      imageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-blue-400/30 via-indigo-400/20 to-transparent",
      /* cards: JSON.parse(
        JSON.stringify([
          {
            id: 1,
            title: "شروع",
            desc: "ورود مطمئن",
            icon: "LineChart",
            top: "25%",
            right: "-10%",
          },
          {
            id: 2,
            title: "آموزش",
            desc: "مبتدی‌ها",
            icon: "GraduationCap",
            top: "26%",
            left: "-10%",
          },
          {
            id: 3,
            title: "پشتیبانی",
            desc: "کاربران",
            icon: "Headphones",
            top: "55%",
            right: "-10%",
          },
          {
            id: 4,
            title: "پیشنهاد",
            desc: "سرمایه‌ گذاری",
            icon: "Lightbulb",
            top: "55%",
            left: "-10%",
          },
        ])
      ), */
      order: 1,
      published: true,
    },
    {
      stepNumber: 2,
      title: "فرصت‌های نوین",
      description:
        "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.",
      imageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-blue-400/30 via-mySecondary-400/20 to-transparent",
      /* cards: JSON.parse(
        JSON.stringify([
          {
            id: 1,
            title: "تحلیل",
            desc: "بازارها",
            icon: "BarChart3",
            top: "25%",
            right: "-10%",
          },
          {
            id: 2,
            title: "فرصت",
            desc: "سیگنال‌ها",
            icon: "Lightbulb",
            top: "25%",
            left: "-10%",
          },
          {
            id: 3,
            title: "نمودار",
            desc: "ابزارها",
            icon: "Wrench",
            top: "55%",
            right: "-10%",
          },
          {
            id: 4,
            title: "یادآوری",
            desc: "نوتیف‌ها",
            icon: "Bell",
            top: "55%",
            left: "-10%",
          },
        ])
      ), */
      order: 2,
      published: true,
    },
    {
      stepNumber: 3,
      title: "مدیریت سبد سرمایه",
      description:
        "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
      imageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-amber-400/30 via-orange-400/20 to-transparent",
      /* cards: JSON.parse(
        JSON.stringify([
          {
            id: 1,
            title: "مدیریت",
            desc: "سبد",
            icon: "LineChart",
            top: "25%",
            right: "-10%",
          },
          {
            id: 2,
            title: "ابزار",
            desc: "تحلیل",
            icon: "Wrench",
            top: "25%",
            left: "-10%",
          },
          {
            id: 3,
            title: "امنیت",
            desc: "اطلاعات",
            icon: "Lock",
            top: "55%",
            right: "-10%",
          },
          {
            id: 4,
            title: "رشد",
            desc: "سرمایه",
            icon: "TrendingUp",
            top: "55%",
            left: "-10%",
          },
        ])
      ), */
      order: 3,
      published: true,
    },
  ];

  for (const step of mobileSteps) {
    await prisma.mobileScrollerStep.create({ data: step });
  }
  console.log(`✅ Inserted ${mobileSteps.length} mobile scroller steps`);

  /**
   * -------------------------------------------------------
   * 📜 About Page
   * -------------------------------------------------------
   */
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

  /**
   * -------------------------------------------------------
   * 🧑‍💼 Investment Consulting
   * -------------------------------------------------------
   */
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

  /**
   * -------------------------------------------------------
   * 🏷️ Tags + Plans
   * -------------------------------------------------------
   */
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

  /**
   * -------------------------------------------------------
   * 🖼️ Seed Mini Sliders
   * -------------------------------------------------------
   */
  await seedMiniSlider1();
  await seedMiniSlider2();

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
