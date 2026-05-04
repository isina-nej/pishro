import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { QuestionType } from "@/types/prisma";

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
          {
            text: "توزیع رایگان توکن‌ها به کیف‌پول‌های کاربران",
            isCorrect: true
          },
          { text: "خرید توکن با قیمت پایین", isCorrect: false },
          { text: "فروش توکن در صرافی", isCorrect: false },
          { text: "استخراج ارز دیجیتال", isCorrect: false },
        ],
        explanation:
          "ایردراپ به توزیع رایگان توکن‌ها توسط پروژه‌ها به کاربران گفته می‌شود.",
        points: 10,
        order: 0
      },
        question:
          "برای شرکت در ایردراپ‌ها به چه چیزهایی نیاز دارید؟ (چند گزینه)",
        questionType: "MULTIPLE_SELECT" as QuestionType,
          { text: "کیف پول غیرمتمرکز", isCorrect: true },
          { text: "آدرس ایمیل", isCorrect: true },
          { text: "حساب شبکه‌های اجتماعی", isCorrect: true },
          { text: "مدرک تحصیلی", isCorrect: false },
          "معمولاً برای شرکت در ایردراپ‌ها به کیف پول، ایمیل و حساب‌های اجتماعی نیاز دارید.",
        points: 15,
        order: 1
        question: "Retroactive Airdrop چیست؟",
            text: "ایردراپ برای کاربران قدیمی که قبلاً از پروژه استفاده کرده‌اند",
          { text: "ایردراپ برای کاربران جدید", isCorrect: false },
          { text: "ایردراپ برای توسعه‌دهندگان", isCorrect: false },
          { text: "ایردراپ برای سرمایه‌گذاران بزرگ", isCorrect: false },
          "Retroactive Airdrop برای پاداش به کاربران قدیمی است که قبلاً از پروژه استفاده کرده‌اند.",
        points: 20,
        order: 2
        question: "کدام شبکه برای دریافت ایردراپ‌های DeFi محبوب‌تر است؟",
          { text: "Ethereum", isCorrect: true },
          { text: "Bitcoin", isCorrect: false },
          { text: "Litecoin", isCorrect: false },
          { text: "Dogecoin", isCorrect: false },
          "Ethereum پلتفرم اصلی برای پروژه‌های DeFi و ایردراپ‌های آن‌هاست.",
        order: 3
          "برای افزایش شانس دریافت ایردراپ‌های بزرگ، کدام استراتژی بهتر است؟",
            text: "استفاده فعال از پروژه‌های جدید و تعامل با قراردادهای هوشمند",
          { text: "فقط عضویت در کانال‌های تلگرام", isCorrect: false },
          { text: "خرید توکن از صرافی", isCorrect: false },
          { text: "منتظر ماندن بدون هیچ اقدامی", isCorrect: false },
          "استفاده فعال از پروژه‌ها و تعامل با قراردادهای هوشمند شانس دریافت ایردراپ‌های بزرگ را افزایش می‌دهد.",
        points: 25,
        order: 4
    ]
  },
    categorySlug: "nft",
    title: "آزمون تعیین سطح NFT",
      "دانش خود را در زمینه توکن‌های غیرقابل تعویض (NFT) ارزیابی کنید.",
        question: "NFT مخفف چیست؟",
          { text: "Non-Fungible Token", isCorrect: true },
          { text: "New Financial Technology", isCorrect: false },
          { text: "Network File Transfer", isCorrect: false },
          { text: "Native Function Type", isCorrect: false },
          "NFT مخفف Non-Fungible Token به معنای توکن غیرقابل تعویض است.",
        question: "تفاوت اصلی NFT با ارزهای دیجیتال معمولی چیست؟",
          { text: "NFT منحصر به فرد و غیرقابل تعویض است", isCorrect: true },
          { text: "NFT ارزان‌تر است", isCorrect: false },
          { text: "NFT سریع‌تر انتقال می‌یابد", isCorrect: false },
          { text: "NFT بدون بلاکچین است", isCorrect: false },
          "NFT‌ها منحصر به فرد هستند و هر کدام ویژگی‌های خاص خود را دارند، برخلاف ارزهای دیجیتال که قابل تعویض هستند.",
        question: "استاندارد ERC-721 مربوط به چیست؟",
          { text: "استاندارد NFT در شبکه Ethereum", isCorrect: true },
          { text: "استاندارد توکن‌های قابل تعویض", isCorrect: false },
          { text: "پروتکل شبکه", isCorrect: false },
          { text: "الگوریتم استخراج", isCorrect: false },
        explanation: "ERC-721 استاندارد NFT در بلاکچین Ethereum است.",
        question: "کدام‌یک از موارد زیر کاربردهای NFT است؟ (چند گزینه)",
          { text: "آثار هنری دیجیتال", isCorrect: true },
          { text: "کلکسیون‌های دیجیتال", isCorrect: true },
          { text: "املاک مجازی", isCorrect: true },
          { text: "استخراج بیت کوین", isCorrect: false },
          "NFT‌ها در هنر دیجیتال، کلکسیون‌ها، املاک مجازی و بسیاری موارد دیگر کاربرد دارند.",
        question: "Gas Fee در خرید NFT چیست؟",
          { text: "کارمزد تراکنش در شبکه بلاکچین", isCorrect: true },
          { text: "قیمت NFT", isCorrect: false },
          { text: "مالیات دولتی", isCorrect: false },
          { text: "سود فروشنده", isCorrect: false },
          "Gas Fee کارمزدی است که برای پردازش تراکنش در شبکه بلاکچین پرداخت می‌شود.",
    categorySlug: "cryptocurrency",
    title: "آزمون تعیین سطح ارزهای دیجیتال",
      "سطح دانش خود در زمینه ارزهای دیجیتال و تکنولوژی بلاکچین را ارزیابی کنید.",
        question: "بلاکچین چیست؟",
          { text: "یک دفتر کل توزیع‌شده و غیرمتمرکز", isCorrect: true },
          { text: "یک نوع رمزارز", isCorrect: false },
          { text: "یک صرافی آنلاین", isCorrect: false },
          { text: "یک نرم‌افزار استخراج", isCorrect: false },
          "بلاکچین یک دفتر کل توزیع‌شده است که تراکنش‌ها را به صورت غیرمتمرکز ثبت می‌کند.",
        question: "تفاوت اصلی Bitcoin و Ethereum چیست؟",
            text: "Ethereum از قراردادهای هوشمند پشتیبانی می‌کند",
          { text: "Bitcoin سریع‌تر است", isCorrect: false },
          { text: "Ethereum قدیمی‌تر است", isCorrect: false },
          { text: "هیچ تفاوتی ندارند", isCorrect: false },
          "Ethereum به عنوان یک پلتفرم قراردادهای هوشمند طراحی شده است.",
          "کدام‌یک از موارد زیر از انواع کیف پول ارزهای دیجیتال هستند؟ (چند گزینه)",
          { text: "کیف پول سخت‌افزاری (Hardware)", isCorrect: true },
          { text: "کیف پول نرم‌افزاری (Software)", isCorrect: true },
          { text: "کیف پول کاغذی (Paper)", isCorrect: true },
          { text: "کیف پول شیشه‌ای (Glass)", isCorrect: false },
          "کیف پول‌های سخت‌افزاری، نرم‌افزاری و کاغذی از انواع معروف کیف پول‌ها هستند.",
        question: "DeFi مخفف چیست؟",
          { text: "Decentralized Finance", isCorrect: true },
          { text: "Digital Finance", isCorrect: false },
          { text: "Direct Finance", isCorrect: false },
          { text: "Distributed Finance Integration", isCorrect: false },
          "DeFi مخفف امور مالی غیرمتمرکز (Decentralized Finance) است.",
        question: "استیکینگ (Staking) در ارزهای دیجیتال به چه معناست؟",
            text: "قفل کردن رمزارز برای دریافت پاداش و تأیید تراکنش‌ها",
          { text: "خرید و فروش سریع ارز", isCorrect: false },
          { text: "استخراج ارز با کارت گرافیک", isCorrect: false },
          { text: "ذخیره ارز در صرافی", isCorrect: false },
          "استیکینگ به قفل کردن رمزارز در شبکه برای کمک به تأیید تراکنش‌ها و دریافت پاداش گفته می‌شود.",
    categorySlug: "defi",
    title: "آزمون تعیین سطح DeFi",
      "دانش خود را در زمینه امور مالی غیرمتمرکز (DeFi) ارزیابی کنید.",
        question: "قرارداد هوشمند (Smart Contract) چیست؟",
            text: "برنامه‌ای که به صورت خودکار روی بلاکچین اجرا می‌شود",
          { text: "یک قرارداد کاغذی هوشمند", isCorrect: false },
          { text: "یک الگوریتم استخراج", isCorrect: false },
          "قرارداد هوشمند یک برنامه است که بدون نیاز به واسطه روی بلاکچین اجرا می‌شود.",
        question: "AMM در DeFi به چه معناست؟",
          { text: "Automated Market Maker", isCorrect: true },
          { text: "Advanced Money Management", isCorrect: false },
          { text: "Automatic Mining Machine", isCorrect: false },
          { text: "Asset Management Module", isCorrect: false },
          "AMM مخفف بازارساز خودکار است که برای مبادله توکن‌ها بدون نیاز به دفتر سفارش استفاده می‌شود.",
        question: "Liquidity Pool چیست؟",
            text: "استخری از توکن‌ها برای تسهیل معاملات در DEX",
          { text: "یک نوع کیف پول", isCorrect: false },
          { text: "یک صرافی متمرکز", isCorrect: false },
          "استخر نقدینگی شامل توکن‌هایی است که کاربران قفل می‌کنند تا معاملات را در صرافی‌های غیرمتمرکز امکان‌پذیر کنند.",
        question: "Yield Farming به چه معناست؟",
            text: "سرمایه‌ گذاری در پروتکل‌های DeFi برای کسب سود",
          { text: "کشاورزی واقعی", isCorrect: false },
          { text: "خرید و نگهداری ارز", isCorrect: false },
          "Yield Farming به سرمایه‌ گذاری در پروتکل‌های DeFi برای دریافت پاداش و سود گفته می‌شود.",
        question: "کدام‌یک از موارد زیر ریسک‌های DeFi هستند؟ (چند گزینه)",
          { text: "آسیب‌پذیری قراردادهای هوشمند", isCorrect: true },
          { text: "Impermanent Loss", isCorrect: true },
          { text: "Rug Pull", isCorrect: true },
          { text: "سود تضمین‌شده", isCorrect: false },
          "DeFi دارای ریسک‌هایی مانند باگ قراردادها، ضرر ناپایدار و کلاهبرداری است.",
    categorySlug: "trading",
    title: "آزمون تعیین سطح معامله‌گری",
      "مهارت‌های معامله‌گری خود در بازار ارزهای دیجیتال را ارزیابی کنید.",
        question: "تحلیل تکنیکال (Technical Analysis) چیست؟",
            text: "تحلیل نمودارها و الگوهای قیمتی برای پیش‌بینی روند",
          { text: "بررسی اخبار بازار", isCorrect: false },
          { text: "تحلیل کد منبع پروژه", isCorrect: false },
          { text: "بررسی تیم پروژه", isCorrect: false },
          "تحلیل تکنیکال به بررسی نمودارها، الگوها و اندیکاتورها برای پیش‌بینی قیمت می‌پردازد.",
        question: "Stop Loss چه کاربردی دارد؟",
          { text: "محدود کردن ضرر در معاملات", isCorrect: true },
          { text: "افزایش سود", isCorrect: false },
          { text: "توقف کامل معاملات", isCorrect: false },
          { text: "خرید خودکار", isCorrect: false },
          "Stop Loss سفارشی است که برای محدود کردن ضرر در صورت حرکت نامطلوب قیمت استفاده می‌شود.",
          "کدام‌یک از اندیکاتورهای رایج در تحلیل تکنیکال هستند؟ (چند گزینه)",
          { text: "RSI (Relative Strength Index)", isCorrect: true },
          { text: "MACD", isCorrect: true },
          { text: "Moving Averages", isCorrect: true },
          { text: "GDP", isCorrect: false },
          "RSI، MACD و میانگین‌های متحرک از اندیکاتورهای محبوب تحلیل تکنیکال هستند.",
        question: "معامله با اهرم (Leverage Trading) چیست؟",
            text: "معامله با سرمایه قرض‌گرفته شده برای افزایش سود یا ضرر",
          { text: "معامله بدون کارمزد", isCorrect: false },
          { text: "معامله خودکار", isCorrect: false },
          { text: "معامله با قیمت ثابت", isCorrect: false },
          "معامله با اهرم به استفاده از سرمایه قرض‌گرفته شده برای افزایش قدرت خرید گفته می‌شود که می‌تواند سود یا ضرر را چندبرابر کند.",
        question: "FOMO در معامله‌گری به چه معناست؟",
            text: "Fear Of Missing Out - ترس از دست دادن فرصت",
          { text: "نوعی استراتژی معاملاتی", isCorrect: false },
          { text: "یک اندیکاتور تکنیکال", isCorrect: false },
          { text: "نوعی سفارش معاملاتی", isCorrect: false },
          "FOMO یک حالت روانی است که باعث می‌شود معامله‌گران بدون تحلیل کافی وارد معاملات شوند.",
];
export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    console.log("🌱 شروع Seed کردن آزمون‌های تعیین سطح...");
    const results = {
      created: [] as string[],
      skipped: [] as string[],
      errors: [] as string[]
    };
    for (const quiz of quizData) {
      console.log(`📝 در حال ایجاد آزمون برای دسته‌بندی: ${quiz.categorySlug}`);
      // بررسی وجود دسته‌بندی
      const category = await prisma.category.findUnique({
        where: { slug: quiz.categorySlug }
      });
      if (!category) {
        console.log(`⚠️  دسته‌بندی ${quiz.categorySlug} یافت نشد - رد شد`);
        results.skipped.push(quiz.categorySlug);
        continue;
      }
      // حذف آزمون قبلی در صورت وجود
      const existingQuiz = await prisma.quiz.findFirst({
        where: {
          title: quiz.title,
          courseId: null
        }
      if (existingQuiz) {
        console.log(`   🗑️  حذف آزمون قبلی...`);
        await prisma.quiz.delete({
          where: { id: existingQuiz.id }
        });
      // ایجاد آزمون جدید
      const createdQuiz = await prisma.quiz.create({
        data: {
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
          order: 0
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
            order: question.order
          }
      console.log(`   ✅ ${quiz.questions.length} سوال ایجاد شد`);
      results.created.push(quiz.categorySlug);
    }
    // نمایش آمار نهایی
    const totalQuizzes = await prisma.quiz.count({
      where: { courseId: null }
    });
    const totalQuestions = await prisma.quizQuestion.count();
    console.log("═══════════════════════════════════════");
    console.log("✅ Seed کردن با موفقیت انجام شد!");
    console.log(`📊 تعداد کل آزمون‌های تعیین سطح: ${totalQuizzes}`);
    console.log(`📝 تعداد کل سوالات: ${totalQuestions}`);
    return successResponse({
      message: "آزمون‌ها با موفقیت ایجاد شدند",
      stats: {
        totalQuizzes,
        totalQuestions,
        created: results.created,
        skipped: results.skipped,
        errors: results.errors
  } catch (error) {
    console.error("❌ خطا در Seed کردن:", error);
    return errorResponse("خطا در ایجاد آزمون‌ها", "SEED_ERROR", 500);
  }
}
