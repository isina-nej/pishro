export type PublicContentFieldType = "text" | "textarea" | "link" | "image" | "icon";

export type PublicContentField = {
  key: string;
  label: string;
  defaultValue: string;
  type?: PublicContentFieldType;
  hint?: string;
};

export type PublicContentSection = {
  id: string;
  title: string;
  description?: string;
  fields: PublicContentField[];
};

export type PublicContentPage = {
  id: string;
  title: string;
  description: string;
  route: string;
  group: "landing" | "content" | "service" | "shared";
  sections: PublicContentSection[];
};

export type PublicContentOverrides = Record<string, Record<string, string>>;

const field = (
  key: string,
  label: string,
  defaultValue: string,
  type: PublicContentFieldType = "text",
  hint?: string
): PublicContentField => ({ key, label, defaultValue, type, hint });

const linkField = (
  key: string,
  label: string,
  defaultValue: string,
  hint?: string
): PublicContentField => field(key, label, defaultValue, "link", hint);

const imageField = (
  key: string,
  label: string,
  defaultValue: string,
  hint?: string
): PublicContentField => field(key, label, defaultValue, "image", hint);

const iconField = (
  key: string,
  label: string,
  defaultValue: string,
  hint?: string
): PublicContentField => field(key, label, defaultValue, "icon", hint);

export const PUBLIC_CONTENT_PAGES: PublicContentPage[] = [
  {
    id: "home-v32",
    title: "صفحه اصلی — نسخه ۳۲",
    description: "هیرو، کارت‌های اعتماد، معرفی خدمات و مسیرهای مخاطب",
    route: "/",
    group: "landing",
    sections: [
      {
        id: "hero",
        title: "هیرو",
        description: "اولین محتوایی که کاربر در صفحه اصلی می‌بیند.",
        fields: [
          field("hero.title", "عنوان اصلی", "پیشرو سرمایه"),
          field("hero.subtitle", "زیرعنوان", "پیشرو در آموزش و سرمایه‌گذاری", "textarea"),
          field("hero.cta", "متن دکمه تماس", "شروع کنید"),
          linkField("hero.ctaLink", "لینک دکمه تماس", "", "خالی = تماس تلفنی با شماره فوتر"),
          field("hero.chip1", "برچسب ۱", "آموزش ترید"),
          field("hero.chip2", "برچسب ۲", "سبدهای تضمینی"),
          field("hero.chip3", "برچسب ۳", "مشاوره"),
          field("hero.chip4", "برچسب ۴", "پشتیبانی ۲۴ ساعته"),
        ],
      },
      {
        id: "phone",
        title: "نمای موبایل",
        fields: [
          field("phone.card1Label", "کارت اول — برچسب", "سرمایه‌گذاری"),
          field("phone.card1Value", "کارت اول — مقدار", "تضمینی"),
          field("phone.card2Label", "کارت دوم — برچسب", "سرمایه‌گذاری خودکار"),
          field("phone.card2Value", "کارت دوم — مقدار", "ماهانه"),
          field("phone.portfolioLabel", "عنوان ارزش", "ارزش سبد"),
          field("phone.portfolioValue", "ارزش نمایشی", "۲۲۳٬۱۵۸٬۷۰۰"),
          field("phone.portfolioChange", "تغییر نمایشی", "+۴٫۲٪"),
          field("phone.title", "عنوان داخل موبایل", "سرمایه‌گذاری"),
          field("phone.currency", "واحد مبلغ", "تومان"),
          field("phone.confirm", "متن دکمه تأیید", "تأیید سرمایه‌گذاری"),
        ],
      },
      {
        id: "trust",
        title: "مزیت‌های کلیدی",
        description: "چهار کارت زیر هیرو.",
        fields: [
          field("trust.1Title", "کارت ۱ — عنوان", "دوره‌های پیشرفته"),
          field("trust.1Text", "کارت ۱ — توضیح", "آموزش حرفه‌ای ترید"),
          iconField("trust.1Icon", "کارت ۱ — آیکن", "GraduationCap"),
          field("trust.2Title", "کارت ۲ — عنوان", "پشتیبانی"),
          field("trust.2Text", "کارت ۲ — توضیح", "دسترسی به مشاوران مجموعه"),
          iconField("trust.2Icon", "کارت ۲ — آیکن", "Headphones"),
          field("trust.3Title", "کارت ۳ — عنوان", "متناسب با نیاز شما"),
          field("trust.3Text", "کارت ۳ — توضیح", "از آموزش تا سرمایه‌گذاری زیر نظر متخصصان"),
          iconField("trust.3Icon", "کارت ۳ — آیکن", "Sparkles"),
          field("trust.4Title", "کارت ۴ — عنوان", "+۶ سال"),
          field("trust.4Text", "کارت ۴ — توضیح", "سابقه درخشان فعالیت حرفه‌ای"),
          iconField("trust.4Icon", "کارت ۴ — آیکن", "Award"),
        ],
      },
      {
        id: "split",
        title: "معرفی میانی",
        fields: [
          field("split.balanceLabel", "برچسب موجودی", "موجودی سبد"),
          field("split.balanceValue", "موجودی نمایشی", "۵۲۶٬۸۲۵٬۰۰۰"),
          field("split.row1Label", "ردیف ۱ — نام", "سبد ثابت"),
          field("split.row1Value", "ردیف ۱ — مقدار", "+۲٫۱٪"),
          field("split.row2Label", "ردیف ۲ — نام", "سبد ترکیبی"),
          field("split.row2Value", "ردیف ۲ — مقدار", "+۱٫۴٪"),
          field("split.title", "عنوان", "متناسب با نیاز شما"),
          field(
            "split.description",
            "توضیحات",
            "از آموزش تا سرمایه‌گذاری، همه زیر نظر متخصصان مجموعه و متناسب با نیاز شما طراحی شده است.",
            "textarea"
          ),
          field("split.cta", "متن دکمه تماس", "شروع کنید"),
          linkField("split.ctaLink", "لینک دکمه تماس", "", "خالی = تماس تلفنی با شماره فوتر"),
        ],
      },
      {
        id: "audience",
        title: "مسیرهای مخاطب",
        fields: [
          field("audience.title", "عنوان", "مسیر مناسب خود را پیدا کنید"),
          field("audience.subtitle", "توضیح", "هدف هر نفر متفاوت است. ما برای هر مسیر راهکاری داریم.", "textarea"),
          field("audience.card1", "کارت ۱", "مبتدی"),
          iconField("audience.card1Icon", "کارت ۱ — آیکن", "GraduationCap"),
          linkField("audience.card1Link", "کارت ۱ — لینک", "/courses"),
          field("audience.card2", "کارت ۲", "معامله‌گر"),
          iconField("audience.card2Icon", "کارت ۲ — آیکن", "TrendingUp"),
          linkField("audience.card2Link", "کارت ۲ — لینک", "/investment-plans"),
          field("audience.card3", "کارت ۳", "سبد و نهاد"),
          iconField("audience.card3Icon", "کارت ۳ — آیکن", "PieChart"),
          linkField("audience.card3Link", "کارت ۳ — لینک", "/investment-plans"),
          field("audience.card4", "کارت ۴", "مشاوره"),
          iconField("audience.card4Icon", "کارت ۴ — آیکن", "Briefcase"),
          linkField("audience.card4Link", "کارت ۴ — لینک", "/business-consulting"),
        ],
      },
    ],
  },
  {
    id: "home-sections",
    title: "صفحه اصلی — بخش‌های مشترک",
    description: "هیروی کلاسیک، اسکرولر موبایل، دوره‌ها، نظرات، ماشین‌حساب و باشگاه پیشرو",
    route: "/",
    group: "landing",
    sections: [
      {
        id: "classicHero",
        title: "هیروی کلاسیک (سکه‌ها)",
        description: "نسخه کلاسیک صفحه اصلی؛ وقتی طرح کلاسیک فعال باشد نمایش داده می‌شود.",
        fields: [
          field("classic.title", "عنوان هیرو", "پیشرو در مسیر سرمایه گذاری هوشمند", "textarea"),
          linkField("classic.video", "فایل ویدیوی سکه‌ها", "/videos/v32-coins.mp4"),
        ],
      },
      {
        id: "mobile",
        title: "اسکرولر موبایل",
        description: "سربرگ ثابت بخش اسکرولر؛ قدم‌ها از ویرایشگر «لندینگ خانه» می‌آیند.",
        fields: [
          field("mobile.eyebrow", "برچسب", "سامانه پیشرو"),
          field("mobile.title", "عنوان (نسخه ساده)", "سامانه پیشرو"),
          field("mobile.description", "توضیح (نسخه ساده)", "سامانه پیشرو، مشاور و همراه مالی شما در مسیر پیشرفت", "textarea"),
          field("mobile.more", "متن لینک اطلاعات", "اطلاعات بیشتر"),
          field("mobile.scrollHint", "راهنمای اسکرول", "برای ادامه اسکرول کنید"),
        ],
      },
      {
        id: "courses",
        title: "دوره‌ها",
        fields: [
          field("courses.all", "دسته — همه", "همه"),
          field("courses.eyebrow", "برچسب بالای عنوان", "مسیر یادگیری شما"),
          field("courses.title", "عنوان", "دوره‌ها"),
          field("courses.description", "توضیح", "این دوره‌ها منتخب بهترین دوره‌های مجموعه ماست", "textarea"),
          field("courses.pageLabel", "متن دکمه دسته‌بندی", "صفحه"),
          field("courses.empty", "پیام نبود دوره", "دوره‌ای در این دسته‌بندی یافت نشد"),
          field("courses.emptyHint", "راهنمای نبود دوره", "لطفاً دسته‌بندی دیگری را انتخاب کنید"),
          field("courses.comingSoon", "پیام دوره‌های آینده", "به زودی دوره‌های جدید اضافه می‌شود"),
          field("courses.none", "پیام نبود هیچ دوره", "در حال حاضر دوره‌ای برای نمایش وجود ندارد"),
        ],
      },
      {
        id: "testimonials",
        title: "نظرات کاربران",
        fields: [
          field("testimonials.eyebrow", "برچسب بالای عنوان", "اعتماد ساخته‌شده با تجربه"),
          field("testimonials.title", "عنوان", "نظرات و تجربیات کاربران"),
          field("testimonials.subtitle", "زیرعنوان", "بهترین‌های بازار چرا ما را انتخاب می‌کنند", "textarea"),
          field("testimonials.empty", "پیام نبود نظر", "به‌زودی نظرات کاربران اینجا نمایش داده می‌شود."),
        ],
      },
      {
        id: "calculator",
        title: "ماشین‌حساب سرمایه‌گذاری",
        fields: [
          field("calculator.title", "عنوان", "ماشین حساب"),
          field("calculator.description", "توضیح", "با انتخاب نوع صندوق سرمایه‌ گذاری، مبلغ و مدت، میزان بازده خود را مشاهده کنید.", "textarea"),
          field("calculator.fundType", "عنوان انتخاب صندوق", "نوع صندوق سرمایه‌ گذاری"),
          field("calculator.amount", "عنوان مبلغ", "مبلغ سرمایه‌ گذاری"),
          field("calculator.duration", "عنوان مدت", "مدت سرمایه‌ گذاری"),
          field("calculator.compound", "توضیح سود مرکب", "سودها به صورت مرکب حساب می‌شود"),
          field("calculator.result", "عنوان نتیجه", "نتیجه سرمایه‌ گذاریت"),
          field("calculator.resultHint", "توضیح نتیجه", "اصل سرمایه + سود"),
          field("calculator.holdRate", "متن ویژه صندوق هولد", "حداقل سود تضمین‌شده دوره سه‌ماهه", "textarea"),
          field("calculator.monthlyRate", "عنوان نرخ ماهانه", "سود ماهیانه"),
          field("calculator.invest", "متن دکمه سرمایه‌گذاری", "سرمایه‌ گذاری"),
          field("calculator.reserve", "متن دکمه رزرو", "رزرو مشاوره حضوری"),
          field("calculator.drawerTitle", "عنوان پنجره رزرو", "مشاوره حضوری"),
          field("calculator.drawerDescription", "توضیح پنجره رزرو", "برای رزرو مشاوره حضوری با ما تماس بگیرید:", "textarea"),
          field("calculator.call", "متن دکمه تماس", "تماس بگیرید"),
          field("calculator.currency", "واحد پول", "تومان"),
          field("calculator.monthUnit", "واحد مدت", "ماه"),
          field("calculator.monthSuffix", "پسوند مدت", "ماهه"),
        ],
      },
      {
        id: "club",
        title: "باشگاه پیشرو",
        fields: [
          field("club.eyebrow", "برچسب", "همیشه یک گام جلوتر"),
          field("club.title", "عنوان اول", "باشگاه"),
          field("club.titleAccent", "عنوان رنگی", "پیشرو"),
          field("club.description", "توضیحات", "با عضویت در باشگاه خبری پیشرو، از تازه‌ترین مقالات آموزشی، نکات تخصصی و تحلیل‌های روز دنیای دیجیتال باخبر شوید و همیشه یک گام جلوتر از رقبا بمانید. جدیدترین مطالب مستقیماً در تلفن همراه شما ارسال خواهد شد.", "textarea"),
          imageField("club.image", "تصویر باشگاه", "/images/home/news-club/news-club.svg"),
          field("club.phonePlaceholder", "نمونه شماره موبایل", "09115829721"),
          field("club.submit", "متن دکمه", "عضویت"),
          field("club.sending", "پیام در حال ارسال", "در حال ارسال اطلاعات..."),
          field("club.success", "پیام موفقیت", "عضویت شما با موفقیت ثبت شد ✅"),
          field("club.error", "پیام خطا", "خطا در ثبت عضویت ❌"),
          field("club.serverError", "پیام خطای سرور", "خطا در برقراری ارتباط با سرور ❌"),
        ],
      },
    ],
  },
  {
    id: "courses",
    title: "دوره‌ها",
    description: "هیرو، فیلترها، وضعیت خالی و فراخوان پایانی",
    route: "/courses",
    group: "content",
    sections: [
      {
        id: "hero",
        title: "هیرو دوره‌ها",
        fields: [
          field("hero.badge", "برچسب", "دوره‌های آموزشی پیشرو"),
          field("hero.title", "عنوان", "مجموعه کامل دوره‌های تخصصی سرمایه‌ گذاری و بازارهای مالی", "textarea"),
          field("hero.description", "توضیح", "از صفر تا صد آموزش‌های کاربردی و حرفه‌ای در زمینه سرمایه‌ گذاری، تحلیل بازار و مدیریت مالی که توسط اساتید مجرب پیشرو تهیه شده‌اند.", "textarea"),
          imageField("hero.image", "تصویر پس‌زمینه هیرو", "/images/courses/landing.jpg"),
          field("hero.stat1", "آمار ۱", "دوره آموزشی"),
          field("hero.stat2", "آمار ۲", "دانشجوی فعال"),
          field("hero.stat3", "آمار ۳", "دسته‌بندی"),
          field("hero.stat4", "آمار ۴", "میانگین رضایت"),
        ],
      },
      {
        id: "filters",
        title: "فهرست و فیلترها",
        fields: [
          field("filters.title", "عنوان فیلتر", "دوره‌های آموزشی"),
          field("filters.description", "توضیح فیلتر", "سطح و مرتب‌سازی را انتخاب کنید"),
          field("filters.searchPlaceholder", "متن جستجو", "جستجوی سریع در بین دوره‌ها"),
          field("filters.clear", "پاک‌کردن فیلتر", "پاک کردن فیلترها"),
          field("filters.levelLabel", "عنوان سطح", "سطح دوره"),
          field("filters.level1", "سطح ۱", "همه سطح‌ها"),
          field("filters.level2", "سطح ۲", "مقدماتی"),
          field("filters.level3", "سطح ۳", "متوسط"),
          field("filters.level4", "سطح ۴", "پیشرفته"),
          field("filters.sortLabel", "عنوان مرتب‌سازی", "مرتب‌سازی"),
          field("filters.clearSearch", "پاک‌کردن جستجو", "پاک کردن جستجو"),
          field("results.unit", "واحد شمارش", "دوره"),
          field("results.queryPrefix", "پیشوند جستجو", "برای جستجوی"),
          field("results.found", "پسوند نتیجه", "یافت شد"),
          field("results.empty", "پیام نتیجه خالی", "هیچ دوره‌ای با این فیلترها یافت نشد"),
          field("results.emptyHint", "راهنمای نتیجه خالی", "لطفاً دسته‌بندی دیگری را انتخاب کنید"),
          field("results.none", "پیام نبود دوره", "هیچ دوره‌ای برای نمایش وجود ندارد"),
          field("results.comingSoon", "پیام دوره‌های آینده", "به زودی دوره‌های جدید اضافه می‌شود"),
        ],
      },
      {
        id: "cta",
        title: "فراخوان پایانی",
        fields: [
          field("cta.badge", "برچسب", "شروع مسیر موفقیت"),
          field("cta.title", "عنوان", "آماده‌اید برای شروع یادگیری؟"),
          field("cta.description", "توضیح", "با ثبت‌نام در دوره‌های ما، دانش و مهارت‌های لازم برای موفقیت بازارهای مالی را کسب کنید", "textarea"),
          field("cta.button", "متن دکمه", "درباره ما بیشتر بدانید"),
          linkField("cta.link", "لینک دکمه", "/about-us"),
        ],
      },
    ],
  },
  {
    id: "news",
    title: "مقالات و اخبار",
    description: "هیرو، آمار، فیلترها و پیام‌های فهرست مقالات",
    route: "/news",
    group: "content",
    sections: [
      {
        id: "hero",
        title: "هیرو",
        fields: [
          field("hero.badge", "برچسب", "اخبار و رویدادهای پیشرو"),
          field("hero.title", "خط اول عنوان", "به‌روزترین مقالات"),
          field("hero.titleSecond", "خط دوم عنوان", "دنیای سرمایه‌گذاری"),
          field("hero.description", "توضیح", "تازه‌ترین اخبار و تحلیل‌های بازار سرمایه — اسکرول کنید و ادامه مطالب را ببینید.", "textarea"),
          imageField("hero.image", "تصویر پس‌زمینه هیرو", "/images/news/header.jpg"),
          field("hero.stat1", "آمار ۱", "خبر منتشر شده"),
          field("hero.stat2", "آمار ۲", "اخبار ویژه"),
          field("hero.stat3", "آمار ۳", "انتشار این ماه"),
          field("hero.stat4", "آمار ۴", "میانگین بازدید"),
        ],
      },
      {
        id: "list",
        title: "فهرست مقالات",
        fields: [
          field("list.title", "عنوان فهرست", "آخرین اخبار پیشرو"),
          field("list.filters", "عنوان فیلتر", "فیلترها"),
          field("list.filtersHint", "توضیح فیلتر", "جستجو، دسته و زمان"),
          field("list.searchPlaceholder", "متن جستجو", "جستجو در اخبار..."),
          field("list.sortPlaceholder", "متن مرتب‌سازی", "مرتب‌سازی"),
          field("list.timePlaceholder", "متن بازه زمانی", "بازه زمانی"),
          field("list.categoryLabel", "عنوان دسته‌بندی", "دسته‌بندی"),
          field("list.timeAll", "بازه — همه", "همه"),
          field("list.timeToday", "بازه — امروز", "امروز"),
          field("list.timeWeek", "بازه — هفته گذشته", "هفته گذشته"),
          field("list.timeMonth", "بازه — ماه گذشته", "ماه گذشته"),
          field("list.timeYear", "بازه — سال گذشته", "سال گذشته"),
          field("list.empty", "عنوان نتیجه خالی", "هیچ خبری پیدا نشد"),
          field("list.emptyHint", "توضیح نتیجه خالی", "با فیلترهای فعلی خبری نیست. فیلترها را تغییر دهید یا پاک کنید.", "textarea"),
          field("list.clear", "متن پاک‌کردن", "حذف تمام فیلترها"),
          field("list.clearShort", "پاک‌کردن کوتاه", "پاک کردن"),
          field("list.clearSearch", "پاک‌کردن جستجو", "پاک کردن جستجو"),
          field("list.loading", "پیام بارگذاری", "در حال بارگذاری اخبار..."),
          field("list.countPrefix", "پیشوند شمارش", "نمایش"),
          field("list.countMiddle", "میانه شمارش", "از"),
          field("list.countSuffix", "پسوند شمارش", "خبر"),
          field("list.queryPrefix", "پیشوند جستجو", "نتایج برای:"),
          field("card.more", "متن کارت مقاله", "مطالعه بیشتر"),
          field("card.minutesShort", "دقیقه کوتاه", "د"),
        ],
      },
    ],
  },
  {
    id: "library",
    title: "کتابخانه دیجیتال",
    description: "هیرو، پیشنهادها، فیلترها و پیام‌های فهرست کتاب",
    route: "/library",
    group: "content",
    sections: [
      {
        id: "hero",
        title: "هیرو",
        fields: [
          field("hero.title", "عنوان", "کتابخانه الهام‌بخش پیشرو"),
          field("hero.subtitle", "زیرعنوان", "دنیای کتاب‌هایی که ذهنیت سرمایه‌گذاران آینده را می‌سازند", "textarea"),
          field("hero.description", "توضیح", "مجموعه‌ای منتخب از کتاب‌های داستانی و تخصصی که با دقت توسط تیم محتوای پیشرو انتخاب شده‌اند تا شما را در مسیر رشد شخصی، حرفه‌ای و خلاقانه همراهی کنند.", "textarea"),
          imageField("hero.image", "تصویر پس‌زمینه هیرو", "/images/library/landing.jpg"),
          field("hero.stat1", "آمار ۱", "کتاب در دسترس"),
          field("hero.stat2", "آمار ۲", "منتخب تحریریه"),
          field("hero.stat3", "آمار ۳", "انتشار سال جاری"),
          field("hero.stat4", "آمار ۴", "میانگین امتیاز"),
        ],
      },
      {
        id: "list",
        title: "فهرست کتاب‌ها",
        fields: [
          field("featured.title", "عنوان پیشنهادها", "پیشنهادهای ویژه کتابخانه"),
          field("featured.description", "توضیح پیشنهادها", "کتاب‌هایی که بیشترین امتیاز و بازدید را این هفته داشته‌اند", "textarea"),
          field("featured.all", "متن مشاهده همه", "مشاهده همه پیشنهادها"),
          field("filters.title", "عنوان فیلتر", "کتاب‌ها"),
          field("filters.description", "توضیح فیلتر", "کتابخانه را بر اساس علاقه خود فیلتر کنید و پیشنهادهای جدید را ببینید.", "textarea"),
          field("filters.formatPlaceholder", "متن فرمت", "فرمت"),
          field("filters.sortPlaceholder", "متن مرتب‌سازی", "مرتب‌سازی"),
          field("filters.searchPlaceholder", "متن جستجو", "جستجوی سریع در بین کتاب‌ها"),
          field("filters.clear", "متن حذف فیلتر", "حذف فیلترها"),
          field("empty.title", "عنوان نتیجه خالی", "کتابی با این مشخصات پیدا نکردیم"),
          field("empty.description", "توضیح نتیجه خالی", "فیلترهای فعال را تغییر دهید یا دسته‌بندی دیگری را انتخاب کنید. ما هر هفته کتاب‌های جدیدی به کتابخانه اضافه می‌کنیم.", "textarea"),
          field("results.filtered", "عنوان نتایج فیلتر", "نتایج فیلتر شده"),
          field("results.searchPrefix", "پیشوند جستجو", "نتایج جستجو برای"),
          field("results.foundSuffix", "پسوند نتیجه", "عنوان مطابق با فیلترهای شما یافت شد."),
          field("results.none", "پیام نبود نتیجه", "موردی مطابق فیلترها پیدا نشد."),
        ],
      },
    ],
  },
  {
    id: "course-detail",
    title: "جزئیات دوره",
    description: "بردکرامب، مشخصات، تب‌ها و فراخوان صفحه تکی دوره",
    route: "/courses/[category]/[course]",
    group: "content",
    sections: [
      {
        id: "breadcrumb",
        title: "مسیر صفحه",
        fields: [
          field("crumb.home", "خانه", "خانه"),
          field("crumb.courses", "دوره‌ها", "دوره‌ها"),
          field("crumb.categoryFallback", "دسته پیش‌فرض", "دسته‌بندی"),
        ],
      },
      {
        id: "info",
        title: "اطلاعات دوره",
        fields: [
          field("info.reviewsSuffix", "پسوند نظرات", "نظر"),
          field("info.students", "دانشجو", "دانشجو"),
          field("info.teacher", "مدرس دوره", "مدرس دوره"),
          field("info.currency", "واحد پول", "تومان"),
          field("info.videoFallback", "جایگزین ویدیو", "مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند."),
          field("info.doctorButton", "دکمه توضیحات", "توضیحات خانم دکتر"),
          field("info.doctorTitle", "عنوان پنجره توضیحات", "توضیحات خانم دکتر"),
          field("info.doctorDescription", "توضیح پنجره توضیحات", "ویدیو توضیحات تکمیلی دوره"),
        ],
      },
      {
        id: "tabs",
        title: "تب‌ها و مشخصات",
        fields: [
          field("tabs.about", "تب درباره", "درباره"),
          field("tabs.lessons", "تب درس‌ها", "درس‌ها"),
          field("tabs.reviews", "تب نظرات", "نظرات"),
          field("tabs.descriptionTitle", "عنوان توضیحات", "توضیحات"),
          field("tabs.goalsTitle", "عنوان اهداف", "اهداف یادگیری"),
          field("tabs.lessonsHint", "راهنمای درس‌ها", "این دوره دارای {count} درس است. برای مشاهده کامل درس‌ها صفحه دوره را باز کنید."),
          field("tabs.reviewsHint", "راهنمای نظرات", "برای مشاهده تمام نظرات، صفحه کامل دوره را باز کنید."),
          field("tabs.learnTitle", "یادگیری", "چه چیزهایی یاد می‌گیرید؟"),
          field("tabs.prereqTitle", "پیش‌نیازها", "پیش‌نیازهای دوره"),
          field("tabs.specsTitle", "مشخصات دوره", "مشخصات دوره"),
          field("tabs.duration", "مدت زمان", "مدت زمان"),
          field("tabs.videoCount", "تعداد ویدئو", "تعداد ویدئو"),
          field("tabs.videoUnit", "واحد ویدئو", "ویدئو"),
          field("tabs.level", "سطح دوره", "سطح دوره"),
          field("tabs.language", "زبان", "زبان"),
          field("tabs.studentsLabel", "دانشجویان", "دانشجویان"),
          field("tabs.studentsUnit", "واحد دانشجو", "نفر"),
        ],
      },
      {
        id: "cta",
        title: "فراخوان پایانی",
        fields: [
          field("cta.title", "عنوان", "آماده شروع این دوره هستید؟"),
          field("cta.description", "توضیح", "با ثبت‌نام در این دوره، مهارت‌های جدید کسب کنید و در مسیر موفقیت قدم بردارید. همین حالا شروع کنید!", "textarea"),
          field("cta.button", "متن دکمه", "مشاهده همه دوره‌ها"),
          linkField("cta.link", "لینک دکمه", "/courses"),
        ],
      },
    ],
  },
  {
    id: "category",
    title: "دسته‌بندی دوره",
    description: "عنوان‌ها و پیام‌های صفحه تکی دسته",
    route: "/courses/[category]",
    group: "content",
    sections: [
      {
        id: "main",
        title: "محتوا",
        fields: [
          field("title.prefix", "پیشوند عنوان", "دوره‌های"),
          field("list.description", "توضیح فهرست", "دوره‌های آموزشی تخصصی"),
          field("list.levelAll", "سطح — همه", "همه سطوح"),
          field("list.empty", "پیام خالی", "هیچ دوره‌ای در این سطح یافت نشد"),
          field("tags.title", "عنوان تگ‌ها", "کلید واژه‌های"),
          field("faq.title", "عنوان سوالات", "سوالات متداول"),
        ],
      },
    ],
  },
  {
    id: "article",
    title: "جزئیات مقاله و کتاب",
    description: "برچسب‌ها و دکمه‌های صفحه تکی مقاله/کتاب",
    route: "/news/[slug]",
    group: "content",
    sections: [
      {
        id: "news",
        title: "مقاله",
        fields: [
          field("news.back", "بازگشت", "بازگشت"),
          field("news.readingTime", "واحد مطالعه", "دقیقه مطالعه"),
          field("news.views", "بازدید", "بازدید"),
          field("news.writtenBy", "نوشته توسط", "نوشتار توسط:"),
          field("news.imageAlt", "جایگزین تصویر", "تصویر مقاله"),
          field("news.summaryTitle", "عنوان خلاصه", "خلاصه مقاله"),
          field("news.summaryHint", "توضیح خلاصه", "اطلاعات کلی و مرجع محتوا"),
          field("news.readingLabel", "برچسب خواندن", "دقیقه خواندن"),
          field("news.more", "مطالعه بیشتر", "مطالعه بیشتر"),
          field("news.minutesShort", "دقیقه کوتاه", "د"),
        ],
      },
      {
        id: "book",
        title: "کتاب",
        fields: [
          field("book.loading", "بارگذاری", "در حال بارگذاری..."),
          field("book.loadError", "خطای بارگذاری", "خطا در بارگذاری کتاب"),
          field("book.notFound", "کتاب نیست", "کتاب یافت نشد"),
          field("book.score", "امتیاز", "امتیاز:"),
          field("book.votes", "آرا", "رای"),
          field("book.views", "بازدید", "بازدید:"),
          field("book.downloads", "دانلود", "دانلود:"),
          field("book.readingTime", "زمان مطالعه", "زمان مطالعه:"),
          field("book.downloadPdf", "دانلود PDF", "دانلود PDF"),
          field("book.downloadAudio", "دانلود صوتی", "دانلود صوتی"),
          field("book.downloadCover", "دانلود کاور", "دانلود کاور"),
          field("book.downloading", "در حال دانلود", "در حال دانلود..."),
          field("book.writtenBy", "نوشته", "نوشته:"),
          field("book.publisher", "ناشر", "ناشر"),
          field("book.year", "سال انتشار", "سال انتشار"),
          field("book.pages", "تعداد صفحات", "تعداد صفحات"),
          field("book.language", "زبان", "زبان"),
          field("book.formats", "فرمت‌ها", "فرمت‌های موجود"),
          field("book.about", "درباره کتاب", "درباره کتاب"),
          field("book.tags", "برچسب‌ها", "برچسب‌ها"),
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "تماس با ما",
    description: "متن معرفی، کارت‌های ارتباط و دکمه‌های راهنما",
    route: "/contact",
    group: "service",
    sections: [
      {
        id: "main",
        title: "محتوای صفحه",
        fields: [
          field("badge", "برچسب", "ارتباط با پیشرو"),
          field("title", "عنوان", "تماس با ما"),
          field("description", "توضیح", "برای پشتیبانی دوره‌ها، مشاوره سرمایه‌گذاری یا همکاری سازمانی از راه‌های زیر با ما در ارتباط باشید. معمولاً در ساعات کاری پاسخ‌گو هستیم.", "textarea"),
          field("phoneLabel", "عنوان تلفن ثابت", "تلفن ثابت"),
          field("mobileLabel", "عنوان موبایل", "موبایل"),
          field("emailLabel", "عنوان ایمیل", "ایمیل"),
          field("addressLabel", "عنوان آدرس", "آدرس"),
          field("hoursTitle", "عنوان ساعات", "ساعات پاسخ‌گویی"),
          field("weekdaysLabel", "برچسب روزهای کاری", "روزهای کاری"),
          field("weekendsLabel", "برچسب تعطیلات", "تعطیلات"),
          field("consultation", "متن دکمه مشاوره", "درخواست مشاوره"),
          linkField("consultationLink", "لینک دکمه مشاوره", "/business-consulting"),
          field("faq", "متن دکمه FAQ", "سوالات متداول"),
          linkField("faqLink", "لینک دکمه FAQ", "/faq"),
        ],
      },
    ],
  },
  {
    id: "crypto",
    title: "قیمت رمزارزها",
    description: "هیرو، آمار، جدول بازار و پیام‌های صفحه قیمت‌ها",
    route: "/crypto-prices",
    group: "service",
    sections: [
      {
        id: "header",
        title: "سربرگ و هیرو",
        fields: [
          field("header.brand", "نام برند", "پیشرو / بازارها"),
          field("header.subtitle", "زیرعنوان", "داده زنده بازار دارایی‌های دیجیتال"),
          field("header.refresh", "متن به‌روزرسانی", "به‌روزرسانی"),
          field("header.active", "وضعیت فعال", "بازار فعال"),
          field("header.stale", "وضعیت قدیمی", "آخرین داده موجود"),
          field("hero.badge", "برچسب هیرو", "نبض زنده بازار"),
          field("hero.titleA", "عنوان — بخش اول", "تصمیم‌های بهتر، با یک نگاه به", "textarea"),
          field("hero.titleAccent", "عنوان — بخش رنگی", "بازار"),
          field("hero.description", "توضیح هیرو", "قیمت جهانی، نمودار هفت‌روزه و ارزش ریالی رمزارزهای مهم را یکجا دنبال کنید.", "textarea"),
          field("hero.livePrice", "عنوان قیمت لحظه‌ای", "قیمت لحظه‌ای"),
          field("hero.change24h", "عنوان تغییر ۲۴ ساعت", "تغییر ۲۴ ساعت"),
          field("hero.irtMissing", "پیام نبود قیمت تومانی", "قیمت تومانی در دسترس نیست"),
          field("hero.marketCap", "عنوان ارزش بازار", "ارزش بازار"),
        ],
      },
      {
        id: "stats",
        title: "آمار بازار",
        fields: [
          field("stats.total", "ارزش کل بازار", "ارزش کل بازار"),
          field("stats.volume", "حجم معاملات ۲۴ ساعت", "حجم معاملات ۲۴ ساعت"),
          field("stats.dominance", "دامیننس بیت‌کوین", "دامیننس بیت‌کوین"),
          field("stats.rising", "ارزهای صعودی", "ارزهای صعودی"),
          field("stats.live", "برچسب زنده", "زنده"),
        ],
      },
      {
        id: "table",
        title: "جدول بازار",
        fields: [
          field("table.title", "عنوان جدول", "۱۵۰ ارز برتر بازار"),
          field("table.subtitle", "زیرعنوان جدول", "صفحه فوری باز می‌شود؛ قیمت‌ها دانه‌دانه تکمیل می‌شوند"),
          field("table.search", "متن جستجو", "جستجوی هر ارز، نام یا نماد"),
          field("table.filterAll", "فیلتر — همه", "همه بازار"),
          field("table.filterFavorites", "فیلتر — علاقه", "مورد علاقه"),
          field("table.filterGainers", "فیلتر — رشد", "بیشترین رشد"),
          field("table.filterLosers", "فیلتر — افت", "بیشترین افت"),
          field("table.colAsset", "ستون دارایی", "دارایی"),
          field("table.colUsd", "ستون قیمت جهانی", "قیمت جهانی"),
          field("table.colIrt", "ستون قیمت تومان", "قیمت تومان"),
          field("table.col24h", "ستون تغییر ۲۴ ساعت", "تغییر ۲۴ ساعت"),
          field("table.col7d", "ستون تغییر ۷ روز", "تغییر ۷ روز"),
          field("table.colChart", "ستون نمودار", "نمودار ۷ روز"),
          field("table.colVolume", "ستون حجم", "حجم معاملات"),
          field("table.colCap", "ستون ارزش بازار", "ارزش بازار"),
          field("table.empty", "پیام نتیجه خالی", "ارزی با این نام یا نماد در داده‌های بارگذاری‌شده پیدا نشد."),
          field("table.scrollMore", "راهنمای اسکرول", "برای دیدن ارزهای بیشتر اسکرول کنید"),
          field("table.allShown", "پیام پایان", "همه داده‌های بارگذاری‌شده نمایش داده شد"),
          field("table.updatedAt", "برچسب به‌روزرسانی", "آخرین به‌روزرسانی:"),
          field("table.disclaimer", "سلب مسئولیت", "این صفحه توصیه سرمایه‌گذاری نیست."),
          field("table.error", "پیام خطا", "اطلاعات بازار در دسترس نیست."),
          field("table.retry", "متن تلاش دوباره", "تلاش دوباره"),
        ],
      },
      {
        id: "detail",
        title: "صفحه تحلیل ارز",
        fields: [
          field("detail.back", "بازگشت", "بازگشت به بازار"),
          field("detail.error", "خطای تحلیل", "تحلیل ارز در دسترس نیست"),
          field("detail.retry", "تلاش دوباره", "تلاش دوباره"),
          field("detail.refresh", "به‌روزرسانی", "به‌روزرسانی"),
          field("detail.livePrice", "قیمت لحظه‌ای", "قیمت لحظه‌ای"),
          field("detail.irtMissing", "نبود قیمت تومانی", "قیمت تومانی در دسترس نیست"),
          field("detail.momentum", "عنوان مومنتوم", "مومنتوم بازار"),
          field("detail.momentumTitle", "زیرعنوان مومنتوم", "نمای تغییرات"),
          field("detail.chart", "عنوان نمودار", "نمودار هفت‌روزه"),
          field("detail.chartHint", "توضیح نمودار", "روند قیمت بر پایه داده‌های بازار"),
          field("detail.disclaimer", "سلب مسئولیت", "این تحلیل توصیه سرمایه‌گذاری نیست."),
          field("detail.updatedAt", "آخرین بروزرسانی", "آخرین بروزرسانی:"),
        ],
      },
    ],
  },
  {
    id: "checkout",
    title: "سبد خرید و پرداخت",
    description: "عنوان‌ها، دکمه‌ها و پیام‌های مراحل خرید",
    route: "/checkout",
    group: "service",
    sections: [
      {
        id: "steps",
        title: "مراحل خرید",
        fields: [
          field("steps.cart", "سبد خرید", "سبد خرید شما"),
          field("steps.pay", "تکمیل خرید", "تکمیل خرید"),
          field("steps.result", "نتیجه پرداخت", "نتیجه پرداخت"),
          field("steps.cartHint", "راهنمای سبد", "دوره‌های انتخابی خود را بررسی و خرید کنید", "textarea"),
          field("steps.payHint", "راهنمای پرداخت", "روش پرداخت را انتخاب کنید"),
          field("steps.resultHint", "راهنمای نتیجه", "وضعیت پرداخت شما"),
          field("steps.step1", "قدم ۱", "سبد خرید"),
          field("steps.step2", "قدم ۲", "پرداخت"),
          field("steps.step3", "قدم ۳", "تکمیل خرید"),
          field("steps.stage", "پیشوند مرحله", "مرحله"),
          field("steps.loginRequired", "نیاز به ورود", "برای ادامه ابتدا وارد حساب خود شوید"),
          field("steps.redirecting", "انتقال به پرداخت", "در حال انتقال به صفحه پرداخت..."),
        ],
      },
      {
        id: "summary",
        title: "خلاصه سفارش",
        fields: [
          field("summary.title", "عنوان", "خلاصه سفارش"),
          field("summary.subtitle", "زیرعنوان", "دوره‌های منتخب شما"),
          field("summary.total", "قیمت کل", "قیمت کل دوره‌ها"),
          field("summary.currency", "واحد پول", "تومان"),
          field("summary.profit", "سود خرید", "سود شما از خرید"),
          field("summary.discountSuffix", "پسوند تخفیف", "٪ تخفیف"),
          field("summary.payable", "مبلغ قابل پرداخت", "مبلغ قابل پرداخت"),
          field("summary.finalHint", "راهنمای نهایی", "قیمت نهایی با تخفیف"),
          field("summary.continue", "ادامه خرید", "ادامه فرایند خرید"),
          field("summary.connecting", "اتصال به درگاه", "در حال اتصال به درگاه..."),
          field("summary.securePay", "پرداخت امن", "پرداخت امن"),
          field("summary.secureNote", "امنیت", "پرداخت امن و محافظت شده"),
          field("summary.instantNote", "دسترسی فوری", "دسترسی فوری پس از پرداخت"),
        ],
      },
      {
        id: "empty",
        title: "سبد خالی",
        fields: [
          field("empty.title", "عنوان", "سبد خرید شما خالی است"),
          field("empty.description", "توضیح", "هنوز دوره‌ای به سبد خرید خود اضافه نکرده‌اید. دوره‌های متنوع ما را کشف کنید و یادگیری خود را آغاز کنید!", "textarea"),
          field("empty.courses", "دکمه دوره‌ها", "مشاهده دوره‌ها"),
          field("empty.home", "بازگشت خانه", "بازگشت به صفحه اصلی"),
          field("empty.tip", "نکته", "💡 نکته: با افزودن دوره‌ها به سبد خرید، می‌توانید همه را یکجا خریداری کنید"),
        ],
      },
      {
        id: "pay",
        title: "بازبینی پرداخت",
        fields: [
          field("pay.title", "عنوان", "بررسی نهایی سفارش"),
          field("pay.subtitle", "زیرعنوان", "جزئیات دوره‌های خریداری شده"),
          field("pay.original", "قیمت اصلی", "قیمت اصلی"),
          field("pay.discount", "تخفیف", "تخفیف"),
          field("pay.final", "قیمت نهایی", "قیمت نهایی"),
          field("pay.total", "مبلغ کل", "مبلغ کل قابل پرداخت"),
          field("pay.countSuffix", "پسوند شمارش", "دوره آموزشی"),
          field("pay.countPrefix", "پیشوند شمارش", "جمع"),
          field("pay.currency", "واحد پول", "تومان"),
          field("pay.empty", "سبد خالی", "سبد خرید شما خالی است."),
          field("pay.portfolioPrefix", "پیشوند سبد", "سبد سرمایه‌ گذاری -"),
          field("pay.riskLow", "کم‌ریسک", "کم‌ریسک"),
          field("pay.riskMedium", "متوسط", "متوسط"),
          field("pay.riskHigh", "پرریسک", "پرریسک"),
          field("pay.courseFallback", "دوره پیش‌فرض", "دوره"),
        ],
      },
    ],
  },
  {
    id: "class",
    title: "کلاس آنلاین",
    description: "پیام‌ها و عنوان‌های صفحه پخش درس",
    route: "/class",
    group: "service",
    sections: [
      {
        id: "main",
        title: "محتوا",
        fields: [
          field("empty", "نبود ویدیو", "ویدیویی برای نمایش وجود ندارد"),
          field("sidebar", "عنوان سایدبار", "ویدیو سایر جلسات"),
          field("duration", "پیشوند مدت", "مدت زمان:"),
        ],
      },
    ],
  },
  {
    id: "about",
    title: "درباره ما — متن‌های ثابت",
    description: "برچسب‌ها و تیترهایی که خارج از مدل ساختاری درباره ما بودند",
    route: "/about-us",
    group: "landing",
    sections: [
      {
        id: "sections",
        title: "تیتر بخش‌ها",
        fields: [
          field("resume.title", "عنوان داستان", "داستان پیشرو"),
          field("resume.subtitle", "توضیح داستان", "از آغاز تا امروز، با هدف واحد: ساختن آینده‌ای روشن‌تر برای سرمایه‌گذاران", "textarea"),
          field("team.title", "عنوان تیم", "تیم پیشرو"),
          field("team.subtitle", "توضیح تیم", "بنیانگذاران و رهبران آکادمی مالی پیشرو سرمایه", "textarea"),
          field("team.specialties", "عنوان تخصص‌ها", "تخصص‌های کلیدی:"),
          field("team.linkedin", "لینکدین", "لینکدین"),
          field("team.email", "ایمیل", "ایمیل"),
          field("team.twitter", "توییتر", "توییتر"),
          field("team.whatsapp", "واتساپ", "واتساپ"),
          field("team.telegram", "تلگرام", "تلگرام"),
          field("certificates.badge", "برچسب افتخارات", "افتخارات و دستاوردها"),
          field("certificates.title", "عنوان گالری", "گالری تقدیرنامه‌ها"),
          field("certificates.description", "توضیح گالری", "مجموعه‌ای از افتخارات و دستاوردهای ما در مسیر خدمت‌رسانی به جامعه", "textarea"),
          field("certificates.more", "متن پایانی گالری", "و افتخارات بیشتری در مسیر خدمت‌رسانی به جامعه..."),
          field("news.badge", "برچسب تازه‌ها", "اطلاعیه‌ها و مقالات"),
          field("news.title", "عنوان تازه‌ها", "تازه‌ها و رویدادهای پیشرو"),
          field("news.description", "توضیح تازه‌ها", "آخرین اخبار، رویدادها و مقالات آموزشی ما را دنبال کنید", "textarea"),
          field("news.more", "متن مطالعه بیشتر", "مطالعه بیشتر"),
          field("cta.badge", "برچسب CTA", "شروع مسیر موفقیت"),
          field("cta.title", "عنوان CTA", "آماده‌اید برای شروع سفر سرمایه‌ گذاری هوشمند؟", "textarea"),
          field("cta.description", "توضیح CTA", "با پیوستن به جمع هزاران دانشجوی موفق ما، اولین قدم را برای دستیابی استقلال مالی بردارید", "textarea"),
          field("cta.button", "متن دکمه CTA", "مشاهده دوره‌ها"),
          linkField("cta.link", "لینک دکمه CTA", "/courses"),
        ],
      },
    ],
  },
  {
    id: "investment",
    title: "سرمایه‌گذاری",
    description: "متن‌های ثابت صفحه سبدها و مدل‌های سرمایه‌گذاری",
    route: "/investment-plans",
    group: "service",
    sections: [
      {
        id: "hero",
        title: "هیرو سبدها",
        fields: [
          field("hero.badge", "برچسب", "سبدهای سرمایه‌ گذاری پیشرو"),
          field("hero.cta", "متن دکمه", "شروع سرمایه‌گذاری"),
          field("hero.stat1", "آمار ۱", "نوع سبد"),
          field("hero.stat2", "آمار ۲", "حداقل سرمایه (میلیون)"),
          field("hero.stat3", "آمار ۳", "حداکثر بازدهی"),
          field("hero.stat4", "آمار ۴", "تضمین سرمایه"),
          field("hero.guaranteeValue", "مقدار تضمین", "100٪"),
          field("hero.view", "مشاهده سبدها", "مشاهده سبدها"),
        ],
      },
      {
        id: "funds",
        title: "انتخاب صندوق",
        fields: [
          field("funds.title", "عنوان", "انتخاب صندوق سرمایه‌ گذاری"),
          field("funds.description", "توضیح", "بر اساس هدف سرمایه‌ گذاری خود، یکی از صندوق‌های زیر را انتخاب کنید", "textarea"),
          field("funds.loading", "پیام بارگذاری", "در حال بارگذاری صندوق‌ها..."),
          field("funds.return", "عنوان بازده", "بازدهی ماهیانه"),
          field("funds.duration", "عنوان حداقل مدت", "حداقل مدت سرمایه‌ گذاری"),
          field("funds.durationUnit", "واحد مدت", "ماه"),
          field("funds.profitPrefix", "پیشوند سود", "سود"),
          field("funds.profitSuffix", "پسوند سود", "ماهیانه"),
          field("funds.noteTitle", "عنوان نکته", "نکته مهم"),
          field("funds.note", "متن نکته", "تمامی صندوق‌های سرمایه‌ گذاری پیشرو با تضمین اصل سرمایه ارائه می‌شوند. سود هر صندوق متناسب با مبلغ سرمایه‌ گذاری و مدت زمان انتخابی شما محاسبه خواهد شد.", "textarea"),
        ],
      },
      {
        id: "models",
        title: "مدل‌های سرمایه‌گذاری",
        description: "کارت‌های حضوری/آنلاین، ویژگی‌ها و اطلاعات تماس — مقادیر خالی یعنی پیش‌فرض کد",
        fields: [
          field("models.loading", "پیام بارگذاری", "در حال بارگذاری..."),
          field("models.featuresTitle", "عنوان ویژگی‌ها", "ویژگی‌ها"),
          field("models.benefitsTitle", "عنوان مزایا", "مزایا"),
          field("models.contactFallback", "عنوان تماس پیش‌فرض", "اطلاعات تماس"),
          field("models.additionalTitle", "عنوان توجه مهم", "توجه مهم"),
          field("models.additionalFallback", "متن توجه پیش‌فرض", "در مدل آنلاین، هزینه سبد متناسب با مبلغ سرمایه‌ گذاری و مدت زمان انتخابی شما محاسبه می‌شود. فرمول دقیق آینده نزدیک به سیستم اضافه خواهد شد. پس از پرداخت، فایل اکسل شامل اطلاعات، سیگنال‌ها فرمول‌های محاسباتی پنل کاربری قرار می‌گیرد.", "textarea"),
        ],
      },
    ],
  },
  {
    id: "business",
    title: "مشاوره کسب‌وکار — متن‌های ثابت",
    description: "دکمه‌ها و متن‌های پنجره‌های تماس؛ محتوای اصلی در ویرایشگر تخصصی است",
    route: "/business-consulting",
    group: "service",
    sections: [
      {
        id: "actions",
        title: "دکمه‌ها و پنجره‌ها",
        fields: [
          field("inPerson.button", "دکمه حضوری", "رزرو مشاوره حضوری"),
          field("inPerson.title", "عنوان حضوری", "مشاوره حضوری"),
          field("inPerson.description", "توضیح حضوری", "برای رزرو مشاوره حضوری با ما تماس بگیرید:", "textarea"),
          field("inPerson.call", "متن تماس", "تماس بگیرید"),
          field("online.button", "دکمه آنلاین", "رزرو مشاوره آنلاین"),
          field("online.title", "عنوان آنلاین", "مشاوره آنلاین"),
          field("online.description", "توضیح آنلاین", "برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید:", "textarea"),
          field("online.send", "متن ارسال", "پیام در تلگرام"),
          field("courses.button", "دکمه دوره‌ها", "دوره‌ها"),
          field("courses.title", "عنوان دوره‌ها", "دوره‌های آموزشی"),
          field("courses.description", "توضیح دوره‌ها", "برای مشاهده دوره‌های ما کلیک کنید:", "textarea"),
          field("courses.view", "متن مشاهده", "مشاهده دوره‌ها"),
          linkField("courses.link", "لینک دوره‌ها", "/courses"),
          imageField("hero.image", "تصویر پس‌زمینه", "/images/investment-consulting/landing.jpg"),
        ],
      },
    ],
  },
  {
    id: "faq",
    title: "سوالات متداول",
    description: "عنوان و وضعیت خالی صفحه FAQ",
    route: "/faq",
    group: "service",
    sections: [
      {
        id: "main",
        title: "محتوا",
        fields: [
          field("title", "عنوان", "چه ابهامی دارید؟"),
          field("empty", "پیام نبود سوال", "هنوز سوال متداولی ثبت نشده است."),
          imageField("image", "تصویر سربرگ", "/images/faq/header.png"),
        ],
      },
    ],
  },
  {
    id: "skyroom",
    title: "همایش آنلاین",
    description: "عنوان، دکمه ورود و وضعیت نبود همایش",
    route: "/skyroom-classes",
    group: "service",
    sections: [
      {
        id: "main",
        title: "محتوا",
        fields: [
          field("badge", "برچسب", "همایش آنلاین"),
          field("heading", "تیتر اصلی", "همایش آنلاین"),
          field("title", "عنوان", "به همایش ما خوش آمدید"),
          field("enter", "متن ورود", "ورود به همایش"),
          field("empty", "پیام نبود همایش", "در حال حاضر همایشی برگزار نمی‌شود"),
          field("brand", "متن برند", "پیشرو - پلتفرم آموزش آنلاین"),
          imageField("poster", "تصویر پس‌زمینه", "/images/home/c/main.webp"),
          linkField("video", "فایل ویدیو", "/videos/aboutUs.webm"),
        ],
      },
    ],
  },
  {
    id: "shared",
    title: "اجزای مشترک سایت",
    description: "منوی موبایل، چت آنلاین و اعلان‌های شناور",
    route: "/",
    group: "shared",
    sections: [
      {
        id: "navbar",
        title: "منوی موبایل",
        fields: [
          field("navbar.menu", "برچسب منو", "منو"),
          field("navbar.subtitle", "توضیح منو", "مسیر خود را انتخاب کنید"),
          field("navbar.socials", "عنوان شبکه‌ها", "شبکه‌های اجتماعی"),
          field("navbar.login", "ورود", "ورود | ثبت‌نام"),
          field("navbar.dashboard", "حساب واردشده", "داشبورد"),
          field("navbar.account", "حساب (فشرده)", "حساب"),
          field("navbar.cart", "سبد خرید", "سبد خرید"),
        ],
      },
      {
        id: "chat",
        title: "چت آنلاین",
        fields: [
          field("chat.title", "عنوان", "پشتیبانی آنلاین پیشرو"),
          field("chat.subtitle", "زیرعنوان", "پاسخ‌گویی سریع تیم پشتیبانی"),
          field("chat.choose", "راهنمای انتخاب", "موضوع گفتگو را انتخاب کنید:"),
          field("chat.identity", "راهنمای مشخصات", "برای شروع چت، مشخصات تماس را وارد کنید.", "textarea"),
          field("chat.start", "متن شروع", "شروع گفتگو"),
          field("chat.empty", "پیام ابتدای گفتگو", "پیام خود را بنویسید؛ پشتیبانی به‌زودی پاسخ می‌دهد.", "textarea"),
          field("chat.placeholder", "متن کادر پیام", "پیام خود را بنویسید..."),
          field("chat.firstName", "نام", "نام"),
          field("chat.lastName", "نام خانوادگی", "نام خانوادگی"),
          field("chat.phone", "شماره تماس", "شماره تماس"),
          field("chat.firstMessage", "پیام اول", "پیام اول (اختیاری)"),
          field("chat.back", "بازگشت", "بازگشت"),
          field("chat.topicLabel", "برچسب موضوع", "موضوع:"),
          field("chat.topic1", "موضوع ۱", "دوره‌های آموزشی"),
          field("chat.topic2", "موضوع ۲", "سبدهای سرمایه‌گذاری"),
          field("chat.topic3", "موضوع ۳", "کریپتو"),
          field("chat.topic4", "موضوع ۴", "بورس"),
          field("chat.topic5", "موضوع ۵", "متاورس"),
          field("chat.topic6", "موضوع ۶", "NFT"),
          field("chat.topic7", "موضوع ۷", "ایردراپ"),
          field("chat.topic8", "موضوع ۸", "مشاوره کسب‌وکار"),
        ],
      },
      {
        id: "notifications",
        title: "اعلان شناور",
        fields: [
          field("notification.title", "عنوان", "پشتیبانی پیشرو"),
          field("notification.welcome", "پیام آغاز", "سلام خوبین؟ نیاز به راهنمایی دارین؟"),
          field("notification.courses", "پیام خرید دوره", "برای خرید دوره‌ها نیاز به کمک دارین؟"),
        ],
      },
    ],
  },
];

const pageMap = new Map(PUBLIC_CONTENT_PAGES.map((page) => [page.id, page]));

export const PUBLIC_CONTENT_GROUP_LABELS: Record<PublicContentPage["group"], string> = {
  landing: "لندینگ‌ها",
  content: "محتوا",
  service: "خدمات",
  shared: "اجزای مشترک",
};

export function getPublicContentPage(pageId: string) {
  return pageMap.get(pageId);
}

export function getPublicContentDefaults(pageId?: string): PublicContentOverrides {
  const pages = pageId ? PUBLIC_CONTENT_PAGES.filter((page) => page.id === pageId) : PUBLIC_CONTENT_PAGES;
  return Object.fromEntries(
    pages.map((page) => [
      page.id,
      Object.fromEntries(
        page.sections.flatMap((section) =>
          section.fields.map((item) => [item.key, item.defaultValue])
        )
      ),
    ])
  );
}

export function parsePublicContent(value: unknown): PublicContentOverrides {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const source = value as Record<string, unknown>;
  const result: PublicContentOverrides = {};

  for (const page of PUBLIC_CONTENT_PAGES) {
    const rawPage = source[page.id];
    if (!rawPage || typeof rawPage !== "object" || Array.isArray(rawPage)) continue;
    const allowed = new Set(page.sections.flatMap((section) => section.fields.map((item) => item.key)));
    const parsed: Record<string, string> = {};

    for (const [key, rawValue] of Object.entries(rawPage as Record<string, unknown>)) {
      if (!allowed.has(key) || typeof rawValue !== "string") continue;
      parsed[key] = rawValue.slice(0, 5000);
    }

    if (Object.keys(parsed).length) result[page.id] = parsed;
  }

  return result;
}

export function resolvePublicContent(value: unknown): PublicContentOverrides {
  const defaults = getPublicContentDefaults();
  const overrides = parsePublicContent(value);
  for (const [pageId, values] of Object.entries(overrides)) {
    defaults[pageId] = { ...defaults[pageId], ...values };
  }
  return defaults;
}

function isValidLinkValue(value: string): boolean {
  const link = value.trim();
  if (!link) return true;
  if (link.length > 300) return false;
  return (
    link.startsWith("/") ||
    link.startsWith("#") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:") ||
    link.startsWith("https://") ||
    link.startsWith("http://")
  );
}

function isValidImageValue(value: string): boolean {
  const src = value.trim();
  if (!src) return true;
  if (src.length > 500 || /\s/.test(src)) return false;
  return src.startsWith("/") || src.startsWith("https://") || src.startsWith("http://");
}

function isValidIconValue(value: string): boolean {
  const icon = value.trim();
  if (!icon) return true;
  if (icon.length > 200) return false;
  return /^[a-zA-Z0-9_-]+$/.test(icon) || icon.startsWith("<svg");
}

export function validatePublicContentPage(
  pageId: string,
  value: unknown
): Record<string, string> | null {
  const page = getPublicContentPage(pageId);
  if (!page || !value || typeof value !== "object" || Array.isArray(value)) return null;

  const fields = page.sections.flatMap((section) => section.fields);
  const source = value as Record<string, unknown>;
  const result: Record<string, string> = {};

  for (const item of fields) {
    const rawValue = source[item.key];
    if (typeof rawValue !== "string") return null;
    const type = item.type ?? "text";
    if (type === "link" && !isValidLinkValue(rawValue)) return null;
    if (type === "image" && !isValidImageValue(rawValue)) return null;
    if (type === "icon" && !isValidIconValue(rawValue)) return null;
    const valueLimit =
      type === "textarea" ? 5000 : type === "link" ? 300 : type === "icon" ? 200 : 500;
    result[item.key] = rawValue.slice(0, valueLimit);
  }

  return result;
}
