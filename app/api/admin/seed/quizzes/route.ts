import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { QuestionType } from "@prisma/client";

export const dynamic = "force-dynamic";

// داده‌های آزمون‌های تعیین سطح
const quizData = [
  {
    categorySlug: "airdrop",
    title: "آزمون تعیین سطح ایردراپ",
    description:
      "با پاسخ به این سوالات، سطح دانش خود در زمینه ایردراپ را تعیین کنید و دوره‌های مناسب را دریافت نمایید.",
    questions: [
      {
        question: "ایردراپ (Airdrop) در دنیای کریپتو به چه معناست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "توزیع رایگان توکن‌ها به کیف‌پول‌های کاربران", isCorrect: true },
          { text: "خرید توکن با قیمت پایین", isCorrect: false },
          { text: "فروش توکن در صرافی", isCorrect: false },
          { text: "استخراج ارز دیجیتال", isCorrect: false },
        ],
        explanation:
          "ایردراپ به توزیع رایگان توکن‌ها توسط پروژه‌ها به کاربران گفته می‌شود.",
        points: 10,
        order: 0,
      },
      {
        question:
          "برای شرکت در ایردراپ‌ها به چه چیزهایی نیاز دارید؟ (چند گزینه)",
        questionType: "MULTIPLE_SELECT" as QuestionType,
        options: [
          { text: "کیف پول غیرمتمرکز", isCorrect: true },
          { text: "آدرس ایمیل", isCorrect: true },
          { text: "حساب شبکه‌های اجتماعی", isCorrect: true },
          { text: "مدرک تحصیلی", isCorrect: false },
        ],
        explanation:
          "معمولاً برای شرکت در ایردراپ‌ها به کیف پول، ایمیل و حساب‌های اجتماعی نیاز دارید.",
        points: 15,
        order: 1,
      },
      {
        question: "Retroactive Airdrop چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "ایردراپ برای کاربران قدیمی که قبلاً از پروژه استفاده کرده‌اند",
            isCorrect: true,
          },
          { text: "ایردراپ برای کاربران جدید", isCorrect: false },
          { text: "ایردراپ برای توسعه‌دهندگان", isCorrect: false },
          { text: "ایردراپ برای سرمایه‌گذاران بزرگ", isCorrect: false },
        ],
        explanation:
          "Retroactive Airdrop برای پاداش به کاربران قدیمی است که قبلاً از پروژه استفاده کرده‌اند.",
        points: 20,
        order: 2,
      },
      {
        question: "کدام شبکه برای دریافت ایردراپ‌های DeFi محبوب‌تر است؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "Ethereum", isCorrect: true },
          { text: "Bitcoin", isCorrect: false },
          { text: "Litecoin", isCorrect: false },
          { text: "Dogecoin", isCorrect: false },
        ],
        explanation:
          "Ethereum پلتفرم اصلی برای پروژه‌های DeFi و ایردراپ‌های آن‌هاست.",
        points: 15,
        order: 3,
      },
      {
        question:
          "برای افزایش شانس دریافت ایردراپ‌های بزرگ، کدام استراتژی بهتر است؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "استفاده فعال از پروژه‌های جدید و تعامل با قراردادهای هوشمند",
            isCorrect: true,
          },
          { text: "فقط عضویت در کانال‌های تلگرام", isCorrect: false },
          { text: "خرید توکن از صرافی", isCorrect: false },
          { text: "منتظر ماندن بدون هیچ اقدامی", isCorrect: false },
        ],
        explanation:
          "استفاده فعال از پروژه‌ها و تعامل با قراردادهای هوشمند شانس دریافت ایردراپ‌های بزرگ را افزایش می‌دهد.",
        points: 25,
        order: 4,
      },
    ],
  },
  {
    categorySlug: "nft",
    title: "آزمون تعیین سطح NFT",
    description:
      "دانش خود را در زمینه توکن‌های غیرقابل تعویض (NFT) ارزیابی کنید.",
    questions: [
      {
        question: "NFT مخفف چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "Non-Fungible Token", isCorrect: true },
          { text: "New Financial Technology", isCorrect: false },
          { text: "Network File Transfer", isCorrect: false },
          { text: "Native Function Type", isCorrect: false },
        ],
        explanation:
          "NFT مخفف Non-Fungible Token به معنای توکن غیرقابل تعویض است.",
        points: 10,
        order: 0,
      },
      {
        question: "تفاوت اصلی NFT با ارزهای دیجیتال معمولی چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "NFT منحصر به فرد و غیرقابل تعویض است", isCorrect: true },
          { text: "NFT ارزان‌تر است", isCorrect: false },
          { text: "NFT سریع‌تر انتقال می‌یابد", isCorrect: false },
          { text: "NFT بدون بلاکچین است", isCorrect: false },
        ],
        explanation:
          "NFT‌ها منحصر به فرد هستند و هر کدام ویژگی‌های خاص خود را دارند، برخلاف ارزهای دیجیتال که قابل تعویض هستند.",
        points: 15,
        order: 1,
      },
      {
        question: "استاندارد ERC-721 مربوط به چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "استاندارد NFT در شبکه Ethereum", isCorrect: true },
          { text: "استاندارد توکن‌های قابل تعویض", isCorrect: false },
          { text: "پروتکل شبکه", isCorrect: false },
          { text: "الگوریتم استخراج", isCorrect: false },
        ],
        explanation: "ERC-721 استاندارد NFT در بلاکچین Ethereum است.",
        points: 20,
        order: 2,
      },
      {
        question:
          "کدام‌یک از موارد زیر کاربردهای NFT است؟ (چند گزینه)",
        questionType: "MULTIPLE_SELECT" as QuestionType,
        options: [
          { text: "آثار هنری دیجیتال", isCorrect: true },
          { text: "کلکسیون‌های دیجیتال", isCorrect: true },
          { text: "املاک مجازی", isCorrect: true },
          { text: "استخراج بیت کوین", isCorrect: false },
        ],
        explanation:
          "NFT‌ها در هنر دیجیتال، کلکسیون‌ها، املاک مجازی و بسیاری موارد دیگر کاربرد دارند.",
        points: 20,
        order: 3,
      },
      {
        question: "Gas Fee در خرید NFT چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "کارمزد تراکنش در شبکه بلاکچین", isCorrect: true },
          { text: "قیمت NFT", isCorrect: false },
          { text: "مالیات دولتی", isCorrect: false },
          { text: "سود فروشنده", isCorrect: false },
        ],
        explanation:
          "Gas Fee کارمزدی است که برای پردازش تراکنش در شبکه بلاکچین پرداخت می‌شود.",
        points: 20,
        order: 4,
      },
    ],
  },
  {
    categorySlug: "cryptocurrency",
    title: "آزمون تعیین سطح ارزهای دیجیتال",
    description:
      "سطح دانش خود در زمینه ارزهای دیجیتال و تکنولوژی بلاکچین را ارزیابی کنید.",
    questions: [
      {
        question: "بلاکچین چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "یک دفتر کل توزیع‌شده و غیرمتمرکز", isCorrect: true },
          { text: "یک نوع رمزارز", isCorrect: false },
          { text: "یک صرافی آنلاین", isCorrect: false },
          { text: "یک نرم‌افزار استخراج", isCorrect: false },
        ],
        explanation:
          "بلاکچین یک دفتر کل توزیع‌شده است که تراکنش‌ها را به صورت غیرمتمرکز ثبت می‌کند.",
        points: 10,
        order: 0,
      },
      {
        question: "تفاوت اصلی Bitcoin و Ethereum چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "Ethereum از قراردادهای هوشمند پشتیبانی می‌کند",
            isCorrect: true,
          },
          { text: "Bitcoin سریع‌تر است", isCorrect: false },
          { text: "Ethereum قدیمی‌تر است", isCorrect: false },
          { text: "هیچ تفاوتی ندارند", isCorrect: false },
        ],
        explanation:
          "Ethereum به عنوان یک پلتفرم قراردادهای هوشمند طراحی شده است.",
        points: 15,
        order: 1,
      },
      {
        question:
          "کدام‌یک از موارد زیر از انواع کیف پول ارزهای دیجیتال هستند؟ (چند گزینه)",
        questionType: "MULTIPLE_SELECT" as QuestionType,
        options: [
          { text: "کیف پول سخت‌افزاری (Hardware)", isCorrect: true },
          { text: "کیف پول نرم‌افزاری (Software)", isCorrect: true },
          { text: "کیف پول کاغذی (Paper)", isCorrect: true },
          { text: "کیف پول شیشه‌ای (Glass)", isCorrect: false },
        ],
        explanation:
          "کیف پول‌های سخت‌افزاری، نرم‌افزاری و کاغذی از انواع معروف کیف پول‌ها هستند.",
        points: 20,
        order: 2,
      },
      {
        question: "DeFi مخفف چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "Decentralized Finance", isCorrect: true },
          { text: "Digital Finance", isCorrect: false },
          { text: "Direct Finance", isCorrect: false },
          { text: "Distributed Finance Integration", isCorrect: false },
        ],
        explanation:
          "DeFi مخفف امور مالی غیرمتمرکز (Decentralized Finance) است.",
        points: 15,
        order: 3,
      },
      {
        question: "استیکینگ (Staking) در ارزهای دیجیتال به چه معناست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "قفل کردن رمزارز برای دریافت پاداش و تأیید تراکنش‌ها",
            isCorrect: true,
          },
          { text: "خرید و فروش سریع ارز", isCorrect: false },
          { text: "استخراج ارز با کارت گرافیک", isCorrect: false },
          { text: "ذخیره ارز در صرافی", isCorrect: false },
        ],
        explanation:
          "استیکینگ به قفل کردن رمزارز در شبکه برای کمک به تأیید تراکنش‌ها و دریافت پاداش گفته می‌شود.",
        points: 25,
        order: 4,
      },
    ],
  },
  {
    categorySlug: "defi",
    title: "آزمون تعیین سطح DeFi",
    description:
      "دانش خود را در زمینه امور مالی غیرمتمرکز (DeFi) ارزیابی کنید.",
    questions: [
      {
        question: "قرارداد هوشمند (Smart Contract) چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "برنامه‌ای که به صورت خودکار روی بلاکچین اجرا می‌شود",
            isCorrect: true,
          },
          { text: "یک نوع رمزارز", isCorrect: false },
          { text: "یک قرارداد کاغذی هوشمند", isCorrect: false },
          { text: "یک الگوریتم استخراج", isCorrect: false },
        ],
        explanation:
          "قرارداد هوشمند یک برنامه است که بدون نیاز به واسطه روی بلاکچین اجرا می‌شود.",
        points: 10,
        order: 0,
      },
      {
        question: "AMM در DeFi به چه معناست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "Automated Market Maker", isCorrect: true },
          { text: "Advanced Money Management", isCorrect: false },
          { text: "Automatic Mining Machine", isCorrect: false },
          { text: "Asset Management Module", isCorrect: false },
        ],
        explanation:
          "AMM مخفف بازارساز خودکار است که برای مبادله توکن‌ها بدون نیاز به دفتر سفارش استفاده می‌شود.",
        points: 15,
        order: 1,
      },
      {
        question: "Liquidity Pool چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "استخری از توکن‌ها برای تسهیل معاملات در DEX",
            isCorrect: true,
          },
          { text: "یک نوع کیف پول", isCorrect: false },
          { text: "الگوریتم استخراج", isCorrect: false },
          { text: "یک صرافی متمرکز", isCorrect: false },
        ],
        explanation:
          "استخر نقدینگی شامل توکن‌هایی است که کاربران قفل می‌کنند تا معاملات را در صرافی‌های غیرمتمرکز امکان‌پذیر کنند.",
        points: 20,
        order: 2,
      },
      {
        question: "Yield Farming به چه معناست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "سرمایه‌گذاری در پروتکل‌های DeFi برای کسب سود",
            isCorrect: true,
          },
          { text: "استخراج ارز دیجیتال", isCorrect: false },
          { text: "کشاورزی واقعی", isCorrect: false },
          { text: "خرید و نگهداری ارز", isCorrect: false },
        ],
        explanation:
          "Yield Farming به سرمایه‌گذاری در پروتکل‌های DeFi برای دریافت پاداش و سود گفته می‌شود.",
        points: 25,
        order: 3,
      },
      {
        question:
          "کدام‌یک از موارد زیر ریسک‌های DeFi هستند؟ (چند گزینه)",
        questionType: "MULTIPLE_SELECT" as QuestionType,
        options: [
          { text: "آسیب‌پذیری قراردادهای هوشمند", isCorrect: true },
          { text: "Impermanent Loss", isCorrect: true },
          { text: "Rug Pull", isCorrect: true },
          { text: "سود تضمین‌شده", isCorrect: false },
        ],
        explanation:
          "DeFi دارای ریسک‌هایی مانند باگ قراردادها، ضرر ناپایدار و کلاهبرداری است.",
        points: 25,
        order: 4,
      },
    ],
  },
  {
    categorySlug: "trading",
    title: "آزمون تعیین سطح معامله‌گری",
    description:
      "مهارت‌های معامله‌گری خود در بازار ارزهای دیجیتال را ارزیابی کنید.",
    questions: [
      {
        question: "تحلیل تکنیکال (Technical Analysis) چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "تحلیل نمودارها و الگوهای قیمتی برای پیش‌بینی روند",
            isCorrect: true,
          },
          { text: "بررسی اخبار بازار", isCorrect: false },
          { text: "تحلیل کد منبع پروژه", isCorrect: false },
          { text: "بررسی تیم پروژه", isCorrect: false },
        ],
        explanation:
          "تحلیل تکنیکال به بررسی نمودارها، الگوها و اندیکاتورها برای پیش‌بینی قیمت می‌پردازد.",
        points: 10,
        order: 0,
      },
      {
        question: "Stop Loss چه کاربردی دارد؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          { text: "محدود کردن ضرر در معاملات", isCorrect: true },
          { text: "افزایش سود", isCorrect: false },
          { text: "توقف کامل معاملات", isCorrect: false },
          { text: "خرید خودکار", isCorrect: false },
        ],
        explanation:
          "Stop Loss سفارشی است که برای محدود کردن ضرر در صورت حرکت نامطلوب قیمت استفاده می‌شود.",
        points: 15,
        order: 1,
      },
      {
        question:
          "کدام‌یک از اندیکاتورهای رایج در تحلیل تکنیکال هستند؟ (چند گزینه)",
        questionType: "MULTIPLE_SELECT" as QuestionType,
        options: [
          { text: "RSI (Relative Strength Index)", isCorrect: true },
          { text: "MACD", isCorrect: true },
          { text: "Moving Averages", isCorrect: true },
          { text: "GDP", isCorrect: false },
        ],
        explanation:
          "RSI، MACD و میانگین‌های متحرک از اندیکاتورهای محبوب تحلیل تکنیکال هستند.",
        points: 20,
        order: 2,
      },
      {
        question: "معامله با اهرم (Leverage Trading) چیست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "معامله با سرمایه قرض‌گرفته شده برای افزایش سود یا ضرر",
            isCorrect: true,
          },
          { text: "معامله بدون کارمزد", isCorrect: false },
          { text: "معامله خودکار", isCorrect: false },
          { text: "معامله با قیمت ثابت", isCorrect: false },
        ],
        explanation:
          "معامله با اهرم به استفاده از سرمایه قرض‌گرفته شده برای افزایش قدرت خرید گفته می‌شود که می‌تواند سود یا ضرر را چندبرابر کند.",
        points: 25,
        order: 3,
      },
      {
        question: "FOMO در معامله‌گری به چه معناست؟",
        questionType: "MULTIPLE_CHOICE" as QuestionType,
        options: [
          {
            text: "Fear Of Missing Out - ترس از دست دادن فرصت",
            isCorrect: true,
          },
          { text: "نوعی استراتژی معاملاتی", isCorrect: false },
          { text: "یک اندیکاتور تکنیکال", isCorrect: false },
          { text: "نوعی سفارش معاملاتی", isCorrect: false },
        ],
        explanation:
          "FOMO یک حالت روانی است که باعث می‌شود معامله‌گران بدون تحلیل کافی وارد معاملات شوند.",
        points: 20,
        order: 4,
      },
    ],
  },
];

export async function POST(_req: NextRequest) {
  try {
    console.log("🌱 شروع Seed کردن آزمون‌های تعیین سطح...");

    const results = {
      created: [] as string[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const quiz of quizData) {
      console.log(
        `📝 در حال ایجاد آزمون برای دسته‌بندی: ${quiz.categorySlug}`
      );

      // بررسی وجود دسته‌بندی
      const category = await prisma.category.findUnique({
        where: { slug: quiz.categorySlug },
      });

      if (!category) {
        console.log(
          `⚠️  دسته‌بندی ${quiz.categorySlug} یافت نشد - رد شد`
        );
        results.skipped.push(quiz.categorySlug);
        continue;
      }

      // حذف آزمون قبلی در صورت وجود
      const existingQuiz = await prisma.quiz.findFirst({
        where: {
          title: quiz.title,
          courseId: null,
        },
      });

      if (existingQuiz) {
        console.log(`   🗑️  حذف آزمون قبلی...`);
        await prisma.quiz.delete({
          where: { id: existingQuiz.id },
        });
      }

      // ایجاد آزمون جدید
      const createdQuiz = await prisma.quiz.create({
        data: {
          title: quiz.title,
          description: quiz.description,
          courseId: null, // آزمون مستقل از دوره
          categoryId: category.id, // مرتبط با دسته‌بندی
          timeLimit: 15, // 15 دقیقه
          passingScore: 60, // حداقل 60% برای قبولی
          maxAttempts: null, // تعداد دفعات نامحدود
          shuffleQuestions: true,
          shuffleAnswers: true,
          showResults: true,
          showCorrectAnswers: true,
          published: true,
          order: 0,
        },
      });

      console.log(`   ✅ آزمون ایجاد شد: ${createdQuiz.id}`);

      // ایجاد سوالات
      for (const question of quiz.questions) {
        await prisma.quizQuestion.create({
          data: {
            quizId: createdQuiz.id,
            question: question.question,
            questionType: question.questionType,
            options: question.options,
            explanation: question.explanation,
            points: question.points,
            order: question.order,
          },
        });
      }

      console.log(`   ✅ ${quiz.questions.length} سوال ایجاد شد`);
      results.created.push(quiz.categorySlug);
    }

    // نمایش آمار نهایی
    const totalQuizzes = await prisma.quiz.count({
      where: { courseId: null },
    });
    const totalQuestions = await prisma.quizQuestion.count();

    console.log("═══════════════════════════════════════");
    console.log("✅ Seed کردن با موفقیت انجام شد!");
    console.log(`📊 تعداد کل آزمون‌های تعیین سطح: ${totalQuizzes}`);
    console.log(`📝 تعداد کل سوالات: ${totalQuestions}`);
    console.log("═══════════════════════════════════════");

    return successResponse({
      message: "آزمون‌ها با موفقیت ایجاد شدند",
      stats: {
        totalQuizzes,
        totalQuestions,
        created: results.created,
        skipped: results.skipped,
        errors: results.errors,
      },
    });
  } catch (error) {
    console.error("❌ خطا در Seed کردن:", error);
    return errorResponse(
      "خطا در ایجاد آزمون‌ها",
      "SEED_ERROR",
      500
    );
  }
}
