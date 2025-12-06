export const navbarData = [
  {
    label: "صفحه اصلی",
    link: "/", // Home page
  },
  {
    label: "دوره ها",
    link: "#courses", // Courses listing
    data: [
      {
        label: "کریپتو",
        link: "/courses/cryptocurrency",
      },
      {
        label: "بورس",
        link: "/courses/stock-market",
      },
      {
        label: "متاورس",
        link: "/courses/metaverse",
      },
      {
        label: "NFT",
        link: "/courses/nft",
      },
      {
        label: "ایردراپ",
        link: "/courses/airdrop",
      },
    ],
  },
  {
    label: "مشاوره کسب و کار",
    link: "/business-consulting", // Airdrop section
  },
  {
    label: "سبد های سرمایه گذاری",
    link: "/investment-plans", // Courses listing
  },
  {
    label: "کتابخانه دیجیتال",
    link: "/library", // Digital library section
  },
  {
    label: "اخبار",
    link: "/news", // News section
  },
  {
    label: "درباره ما",
    link: "/about-us", // About us section
  },
  {
    label: "همایش",
    link: "/skyroom-classes",
  },
  // {
  //   label: "سوالی دارید؟",
  //   link: "/faq", // Airdrop section
  // },
];

export const categoriesData = [
  {
    src: "/images/home/crypto.jpg",
    label: "کریپتو",
    link: "/cryptocurrency",
  },
  {
    src: "/images/home/stock.png",
    label: "بورس",
    link: "/stock-market",
  },
  {
    src: "/images/home/metaverse.png",
    label: "متاورس",
    link: "/metaverse",
  },
  {
    src: "/images/home/nft.png",
    label: "NFT",
    link: "/nft",
  },
  {
    src: "/images/home/airdrop.png",
    label: "ایردراپ",
    link: "/airdrop",
  },
];

export const whyUsData = [
  {
    label: "آموزش حرفه‌ای",
    title: "پیشرو در آموزش‌های حرفه‌ای و به‌روز سرمایه‌ گذاری",
    text: `دوره‌های آموزشی ما کامل‌ترین محتوای کریپتو، بورس، NFT، متاورس و ایردراپ رو پوشش می‌ده.
آموزش‌ها از مبتدی تا پیشرفته طراحی شدن، پس همه می‌تونن شروع کنن و رشد کنن.
با مثال‌های عملی و محتوای کاربردی، یادگیری تبدیل به تجربه‌ای لذت‌بخش و مفید میشه.
پیشرو همیشه با جدیدترین ترندها و روش‌های سرمایه‌ گذاری همراهتونه.`,
    btnLabel: "اطلاعات بیشتر",
    btnHref: "/courses",
    animationPath: "/animations/investment-education.json",
    imagePath: "/images/landing/img-1.jpg",
  },
  {
    label: "سبدهای شخصی‌سازی‌شده",
    title: "پیشرو در ارائه سبدهای سرمایه‌ گذاری شخصی‌سازی‌شده",
    text: `هر کسی با هر سطح سرمایه و ریسک‌پذیری می‌تونه بهترین پیشنهاد سرمایه‌ گذاری رو پیدا کنه.
ما با تحلیل‌های تخصصی بازار، سبدهایی متناسب با شرایطت طراحی می‌کنیم.
تنوع در سبدها باعث میشه بتونی هم سود بیشتری داشته باشی، هم ریسک کمتری تجربه کنی.
سرمایه‌ گذاری با پیشرو یعنی تصمیم‌گیری آگاهانه و مدیریت هوشمندانه پولت.`,
    btnLabel: "اطلاعات بیشتر",
    btnHref: "/investment-plans",
    animationPath: "/animations/man-taking-payout-of-cryptocurrency.json",
    imagePath: "/images/landing/img-2.jpg",
  },
  {
    label: "پشتیبانی و رشد",
    title: "پیشرو، همراهی مطمئن برای رشد و موفقیت",
    text: `از اولین قدم‌های یادگیری تا انتخاب بهترین سرمایه‌ گذاری، پیشرو همیشه کنارتونه.
تیم پشتیبانی و مشاوره ما آماده‌ست تا هر سوالی که داری رو جواب بده.
عضویت در پیشرو یعنی دسترسی به جامعه‌ای فعال و متخصص که توش همیشه یاد می‌گیری.
با انتخاب پیشرو، امنیت، شفافیت و آینده‌ای بهتر رو برای خودت می‌سازی.`,
    btnLabel: "اطلاعات بیشتر",
    btnHref: "/business-consulting",
    animationPath: "/animations/transaction-in-cryptocurrency.json",
    imagePath: "/images/landing/img-3.jpg",
  },
];

export const coursesData = [
  {
    subject: "بورس",
    price: 2500000,
    img: "/images/courses/placeholder.png",
    rating: 4.5,
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    discountPercent: 19,
    time: "12:30",
    students: 250,
    videosCount: 15,
  },
  {
    subject: "ارزهای دیجیتال",
    price: 3500000,
    img: "/images/courses/placeholder.png",
    rating: 4,
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    discountPercent: 19,
    time: "12:30",
    students: 250,
    videosCount: 15,
  },
  {
    subject: "بورس",
    price: 2000000,
    img: "/images/courses/placeholder.png",
    rating: 2.5,
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    discountPercent: 19,
    time: "12:30",
    students: 250,
    videosCount: 15,
  },
  {
    subject: "NFT",
    price: 1500000,
    img: "/images/courses/placeholder.png",
    rating: 4,
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    discountPercent: 25,
    time: "12:30",
    students: 250,
    videosCount: 15,
  },
  {
    subject: "متاورس",
    price: 4000000,
    img: "/images/courses/placeholder.png",
    rating: 4,
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    discountPercent: 19,
    time: "12:30",
    students: 250,
    videosCount: 15,
  },
  {
    subject: "ارزهای دیجیتال",
    price: 3500000,
    img: "/images/courses/placeholder.png",
    rating: 4,
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    discountPercent: 19,
    time: "12:30",
    students: 250,
    videosCount: 15,
  },
];

export const blogData = [
  {
    img: "/images/blog/post-1.jpg",
    date: "1403/10/25",
    title: "آموزش ترید",
    description: "آموزش ترید برای مبتدیان و حرفه‌ایان",
    link: "/blog",
  },
  {
    img: "/images/blog/post-2.jpg",
    date: "1403/11/25",
    title: "آموزش ارزهای دیجیتال",
    description: "آموزش ارزهای دیجیتال برای مبتدیان و حرفه‌ایان",
    link: "/blog",
  },
  {
    img: "/images/blog/post-3.jpg",
    date: "1403/12/02",
    title: "آموزش بورس",
    description: "آموزش بورس برای مبتدیان و حرفه‌ایان",
    link: "/blog",
  },
];

export const newsTimeRange = [
  {
    value: "all",
    label: "همه",
  },
  {
    value: "lastYear",
    label: "سال اخیر",
  },
  {
    value: "lastMonth",
    label: "ماه اخیر",
  },
  {
    value: "lastWeek",
    label: "هفته اخیر",
  },
];

export const newsCategory = [
  {
    value: "all",
    label: "همه",
  },
  {
    value: "nft",
    label: "NFT",
  },
  {
    value: "crypto",
    label: "کریپتو",
  },
  {
    value: "stockMarket",
    label: "بورس",
  },
  {
    value: "metaverse",
    label: "متاورس",
  },
  {
    value: "airdrop",
    label: "ایردراپ",
  },
];

export const newsDataType = [
  {
    value: "all",
    label: "همه",
  },
  {
    value: "scientific",
    label: "علمی",
  },
  {
    value: "educational",
    label: "آموزشی",
  },
  {
    value: "news",
    label: "اخبار",
  },
];

export const newsData = [
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    description:
      "در این قسمت نهایتاً سه خط از مقاله رو درج میکنیم و باقی اون رو به لورم ایپسوم میسپاریم که لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون",
    image: "/images/news/post-1.jpg",
    date: "20241206",
    type: "news",
    category: "airdrop",
    link: "/news/post-01",
  },
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    description:
      "در این قسمت نهایتاً سه خط از مقاله رو درج میکنیم و باقی اون رو به لورم ایپسوم میسپاریم که لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون",
    image: "/images/news/post-2.jpg",
    date: "20241206",
    type: "scientific",
    category: "nft",
    link: "/news/post-02",
  },
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    description:
      "در این قسمت نهایتاً سه خط از مقاله رو درج میکنیم و باقی اون رو به لورم ایپسوم میسپاریم که لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون",
    image: "/images/news/post-3.jpg",
    date: "20241206",
    type: "scientific",
    category: "stockMarket",
    link: "/news/post-03",
  },
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    description:
      "در این قسمت نهایتاً سه خط از مقاله رو درج میکنیم و باقی اون رو به لورم ایپسوم میسپاریم که لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون",
    image: "/images/news/post-4.jpg",
    date: "20231206",
    type: "educational",
    category: "airdrop",
    link: "/news/post-04",
  },
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    description:
      "در این قسمت نهایتاً سه خط از مقاله رو درج میکنیم و باقی اون رو به لورم ایپسوم میسپاریم که لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون",
    image: "/images/news/post-5.jpg",
    date: "20241206",
    type: "news",
    category: "metaverse",
    link: "/news/post-05",
  },
];

export const pishroBranding = {
  header: "",
  title: "طاهره جهانی؛ دکترای اقتصاد ( گرایش اقتصاد سنجی)",
  description:
    "کارشناس تخصصی و فعال ( تحلیلگر و معامله گر) بازارهای مالی ، عضو هیات علمی دانشگاه، مدیرعامل آکادمی مالی پیشرو سرمایه  . به احتمال زیاد هر یک از شما دوستان جدیدم که به واسطه این سایت با شما ارتباط گرفته ام پیش از این با کارشناسان متنوعی در حوزه بازارهای مالی ، چه داخلی و چه خارجی ارتباط گرفته و یا آموزش های متنوعی را در این زمینه دیده اید یا در حال آموزش هستید. هدف از راه اندازی این سایت ارائه محتوای مفید، متنوع و جامع به فعالان بازارهای مالی است. تیم حرفه ای مجموعه آکادمی مالی پیشرو سرمایه که از سال ۱۴۰۰ فعالیت خود را آغاز کرده است به دنبال ارائه خدمات آموزشی ، خبری  ، تحلیلی ،تخصصی ، مشاوره و راهنمایی های ارزنده در بخش های مختلفی چون بورس ؛ ارز دیجیتال ؛ nft و متاورس و حتی ایردراپ ها می باشد و قصد دارد با تجمیع و گردآوری اطلاعات ارزنده در کلیه زیربخش های مورد نیاز،  بهترین و جامع ترین خدمات ممکن را در حد توان خود با حمایت و مشاوره از کارشناسان خبره، توانمند و متخصص در اختیار شما عزیزان قراردهد..",
  image: "/images/about/about.jpg",
};

export const aboutPishro = {
  title: "سید عنایت الله مومنی، دکترای مدیریت آموزشی",
  description:
    "سید عنایت الله مومنی هستم، دارای دکترای مدیریت آموزشی، ۳۰ سال تجربه تخصصی بانکداری، مدرس دانشگاه، کارمند نمونه ملی در سال ۱۳۸۳،رتبه ۱ توانمندی مالی و مدیریتی از سال ۹۲تا۹۸، دارای ترجمه و تالیف ۴ کتاب، داوری مقالات داخلی و مدرس علوم بانکی کل شعب استان دارای فیلد تخصصی شبکه سازی،مهارت‌های ارتباطی، فروش و بازاریابی و مشاوره کسب وکار و همچنین مدیرعامل شرکت تخصصی پیشرو سرمایه ثروت آفرین که در کنار خانم دکتر طاهره جهانی و تیمی حرفه‌ای از سال ۱۴۰۰ فعالیت خود را آغاز کرده‌ و امیدواریم با عنایت و توکل به خداوند رحمان در جهت آموزش و رشد سواد مالی عزیزان سرزمینمان ایران گام موثر برداریم.",
  image: "/images/about/about3.jpg",
};

export const pishroJournals = [
  {
    title: "عنوان متن منتشر شده",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده",
    link: "/news/journal-1",
  },
  {
    title: "عنوان متن منتشر شده",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده",
    link: "/news/journal-2",
  },
  {
    title: "عنوان متن منتشر شده",
    text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده",
    link: "/news/journal-3",
  },
];

export const faqData = [
  {
    question: "میتوانم سفارشم را بصورت اقساطی ( اعتباری ) پرداخت کنم؟",
    answer:
      "پاسخ سوال در اینجا قرار میگیره و به مقدار هر چند خطی که باشه باید در اینجا لحاظ بشه و به کاربر نمایش پیدا کنه، نکته مهم در اینه که طول این تکست باکس به صورت تمام عرض نیست و باید به نحوی باشه که فضای سفید (تنفس) ما حفظ بشه.",
  },
  {
    question: "میتوانم سفارشم را بصورت اقساطی ( اعتباری ) پرداخت کنم؟",
    answer:
      "پاسخ سوال در اینجا قرار میگیره و به مقدار هر چند خطی که باشه باید در اینجا لحاظ بشه و به کاربر نمایش پیدا کنه، نکته مهم در اینه که طول این تکست باکس به صورت تمام عرض نیست و باید به نحوی باشه که فضای سفید (تنفس) ما حفظ بشه.",
  },
  {
    question: "میتوانم سفارشم را بصورت اقساطی ( اعتباری ) پرداخت کنم؟",
    answer:
      "پاسخ سوال در اینجا قرار میگیره و به مقدار هر چند خطی که باشه باید در اینجا لحاظ بشه و به کاربر نمایش پیدا کنه، نکته مهم در اینه که طول این تکست باکس به صورت تمام عرض نیست و باید به نحوی باشه که فضای سفید (تنفس) ما حفظ بشه.",
  },
  {
    question: "میتوانم سفارشم را بصورت اقساطی ( اعتباری ) پرداخت کنم؟",
    answer:
      "پاسخ سوال در اینجا قرار میگیره و به مقدار هر چند خطی که باشه باید در اینجا لحاظ بشه و به کاربر نمایش پیدا کنه، نکته مهم در اینه که طول این تکست باکس به صورت تمام عرض نیست و باید به نحوی باشه که فضای سفید (تنفس) ما حفظ بشه.",
  },
];

export const profileAvatars = [
  {
    img: "/images/profile/profile-1.png",
  },
  {
    img: "/images/profile/profile-2.png",
  },
  {
    img: "/images/profile/profile-3.png",
  },
  {
    img: "/images/profile/profile-4.png",
  },
  {
    img: "/images/profile/profile-5.png",
  },
  {
    img: "/images/profile/profile-6.png",
  },
  {
    img: "/images/profile/profile-7.png",
  },
  {
    img: "/images/profile/profile-1.png",
  },
];

export const bankCardsInfo = [
  {
    label: "کارت بانک ملی",
    cardNumber: "6037991234567890",
    cardShaba: "870570028180010653892101",
  },
  {
    label: "کارت بانک تجارت",
    cardNumber: "6037993234567890",
    cardShaba: "870570038180010653892101",
  },
];

export const videoList = [
  {
    id: "1",
    label: "جلسه اول",
    date: "1403/12/26",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است",
    videoUrl: "/videos/nft.webm",
    thumbnail: "/images/home/c/crypto.jpg",
  },
  {
    id: "2",
    label: "جلسه دوم",
    date: "1403/12/26",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است",
    videoUrl: "/videos/metaverse.webm",
    thumbnail: "/images/home/c/crypto.jpg",
  },
  {
    id: "3",
    label: "جلسه سوم",
    date: "1403/12/26",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است",
    videoUrl: "/videos/stock.webm",
    thumbnail: "/images/home/c/crypto.jpg",
  },
];

export interface Comment {
  id: string;
  name: string;
  message: string;
  date: string;
  profile: string;
  replies: Comment[];
}
// Fake comments data with nested replies
export const commentsData: Comment[] = [
  {
    id: "1",
    name: "نام خریدار",
    message: "متن دیدگاه اول...",
    date: "1404/1/13",
    profile: "/images/profile/Avatar-24-24.png",
    replies: [],
  },
  {
    id: "2",
    name: "نام خریدار",
    message: "متن دیدگاه دوم...",
    date: "1404/1/13",
    profile: "/images/profile/Avatar-24-24.png",
    replies: [
      {
        id: "21",
        name: "نام خریدار",
        message: "پاسخ به دیدگاه دوم...",
        date: "1404/1/13",
        profile: "/images/profile/Avatar-24-24.png",
        replies: [],
      },
    ],
  },
];

export const homeCommentsData = [
  {
    id: 1,
    avatar: "/images/home/real-comments/1.jpg",
    name: "آزاده بهرامی",
    position: "دانشجوی دوره کریپتو تریدینگ",
    comment:
      "خیلی خوشحالم ازینکه حدود ۲ سال پیش با این مجموعه خصوصا خانم دکتر عزیز آشنا شدم. کلاس‌های ایشون بسیار پربار و عالی بود. همچنین پشتیبانی ایشون بعد از اتمام کلاس بسیار انگیزه و اعتمادبه‌نفس به دوره‌آموزان میده. تا همیشه مدیون ایشون هستم.",
  },
  {
    id: 2,
    avatar: "/images/home/real-comments/2.jpg",
    name: "محمد‌جواد نوری",
    position: "دانشجوی دوره کریپتو تریدینگ",
    comment:
      "دوره کریپتو تریدینگ یکی از بهترین سرمایه‌ گذاری‌های من بود! از پایه و کاملاً روان آموزش داده شد، هم فنی هم روان‌شناسی معامله. تمرین با چارت زنده و شبیه‌سازی معاملات باعث شد بدون ضرر وارد بازار واقعی بشم. جامعه‌ی دوره هم مثل یه تیم حمایتیه. حالا بعد از چند هفته، سود واقعی می‌گیرم و می‌بینم چقدر رشد کردم!",
  },
  {
    id: 3,
    avatar: "/images/home/real-comments/3.jpg",
    name: "امیرحسین محمد زاده",
    position: "دانشجوی دوره کریپتو تریدینگ",
    comment:
      "دوره کریپتو تریدینگ واقعاً فوق‌العاده بود! از همون جلسه اول، مربی‌ها با زبانی ساده مفاهیم پیچیده‌ای مثل تحلیل تکنیکال، مدیریت ریسک و استراتژی‌های معاملاتی رو توضیح دادن. ویدیوها و مثال‌های عملی با داده‌های واقعی بازار باعث شد بدون ترس و با اعتمادبه‌نفس وارد دنیای پرنوسان کریپتو بشم.",
  },
  {
    id: 4,
    avatar: "/images/home/real-comments/4.jpg",
    name: "امیرحسین نامدار",
    position: "دانشجوی دوره ترید",
    comment:
      "این دوره ترید واقعاً فوق‌العاده بود! 😍 از صفر شروع کردم و حالا با اطمینان ترید می‌کنم. تحلیل تکنیکال، مدیریت ریسک و روانشناسی معامله رو عالی یاد گرفتم. 💪 تو دو هفته حساب دموم به ۳۰٪ سود رسید! آموزش‌ها جذاب، مدرس‌ها حرفه‌ای و پشتیبانی عالی بود. ⭐",
  },
  {
    id: 5,
    avatar: "/images/home/real-comments/5.jpg",
    name: "مازیار ساعدی",
    position: "دانشجوی دوره ترید",
    comment:
      "محتوای آموزشی این دوره کاربردی، مفید و منظم بود و خانم دکتر با تسلط کامل مطالب را ارائه کردند. این دوره باعث افزایش دانش و مهارت من در ترید شد و شرکت در آن را به دیگران نیز توصیه می‌کنم.",
  },
  {
    id: 6,
    avatar: "/images/home/real-comments/6.jpg",
    name: "حمید محمدی",
    position: "دانشجوی دوره ترید",
    comment:
      "همه‌چیز از پایه و با زبون ساده توضیح داده شده، از تحلیل تکنیکال تا کنترل احساسات. با تمرین‌های عملی یاد می‌گیری چطور مثل یه تریدر واقعی تصمیم بگیری. بعدش با اطمینان وارد بازار می‌شی و نتیجه‌اش رو تو سود و آرامشت می‌بینی. 💰",
  },
  {
    id: 7,
    avatar: "/images/home/real-comments/7.jpg",
    name: "زهرا علیپور",
    position: "دانشجوی دوره ترید",
    comment:
      "دوره ترید خانم دکتر باعث شد اصول معامله‌گری رو درست و حرفه‌ای یاد بگیرم. روش‌های مدیریت ریسک و تحلیل بازار که تو دوره‌هاشون یاد گرفتم واقعا کاربردی هستن.",
  },
  {
    id: 8,
    avatar: "/images/home/real-comments/8.jpg",
    name: "شمیم شاهمنصوری",
    position: "دانشجوی دوره ترید",
    comment:
      "شرکت در دوره‌ها باعث شد خیلی تو این حوزه پیشرفت کنم، روش تدریسشون بسیار اصولی هستش و تونستم با کمک‌های خانم دکتر و پشتیبانی ایشون حتی بعد از اتمام دوره به سودهای مستمر برسم.",
  },
  {
    id: 9,
    avatar: "/images/home/real-comments/9.jpg",
    name: "مجید نیکفرجام",
    position: "دانشجوی دوره ترید",
    comment:
      "به همه توصیه می‌کنم که اگر می‌خوان ترید رو واقعا حرفه‌ای شروع کنند، حتما تو دوره‌های استاد شرکت کنند. محتوای دوره و پشتیبانی مدرس فوق‌العاده است.",
  },
  {
    id: 10,
    avatar: "/images/home/real-comments/10.jpg",
    name: "مرضیه کامرانی",
    position: "دانشجوی دوره ترید",
    comment:
      "قبل از شرکت در دوره، بیشتر معاملاتم بر اساس حدس و شانس بود اما بعد از گذروندن دوره توسط خانم دکتر، یاد گرفتم چطور بازار رو تحلیل کنم، استراتژی مناسب خودم رو بسازم و مدیریت ریسک رو جدی بگیرم. الان با دید بهتری وارد معاملات می‌شم و نتایجم خیلی بهتر شده.",
  },
  {
    id: 11,
    avatar: "/images/home/real-comments/11.jpg",
    name: "شایان فرزاد",
    position: "دانشجوی دوره ترید",
    comment:
      "یکی از بهترین بخش‌های این دوره، آموزش روانشناسی بازار و مدیریت احساسات بود. قبل از این دوره، استرس و ترس باعث می‌شد اشتباهات زیادی کنم، اما حالا با تکنیک‌های گفته‌شده می‌تونم آرامش بیشتری داشته باشم و تصمیمات منطقی‌تر بگیرم.",
  },
  {
    id: 12,
    avatar: "/images/home/real-comments/12.jpg",
    name: "مریم بهرامی",
    position: "دانشجوی دوره ترید",
    comment:
      "دوره ترید خانم دکتر باعث شد اصول معامله‌گری و مدیریت ریسک رو سریع و کاربردی یاد بگیرم. الان با اعتمادبه‌نفس بیشتری معامله می‌کنم.",
  },
  {
    id: 13,
    avatar: "/images/home/real-comments/13.jpg",
    name: "فاطمه کوزه‌گر",
    position: "دانشجوی دوره ترید",
    comment:
      "قبل از این دوره فکر می‌کردم ترید فقط نمودارهاست، اما اینجا یاد گرفتم صبر، استراتژی و کنترل احساسات چقدر مهمه. حالا معاملاتم هدفمندتر و مطمئن‌تر شده.",
  },
];

export const investmentPlansData = {
  title: "سبد های سرمایه گذاری پیشرو",
  text: `هر سبد سرمایه‌ گذاری با تکیه بر تحلیل‌های کمّی، رویکرد مدیریت ریسک و ارزیابی جامع بازارها تدوین می‌شود.
با بهره‌گیری هم‌زمان از ظرفیت‌های بازار سرمایه و دارایی‌های دیجیتال، بهینه‌سازی بازده در چارچوب اصول مالی دنبال می‌گردد.
هدف ما، ایجاد مسیرهای باثبات برای رشد سرمایه و حفظ ارزش دارایی در بلندمدت است.`,
  image: "/images/investment-plans/landing.jpg",
};

export const businessConsultingData = {
  title: "مشاوره کسب وکار پیشرو",
  text: `در بخش مشاوره کسب‌وکار، همراه شماییم تا در هر حرفه‌ای که دارید، مسیر رشد و توسعه را هموار کنیم. چه در فکر راه‌اندازی یک کسب‌وکار جدید باشید و چه بخواهید بیزنس فعلی‌تان را به مرحله‌ای بالاتر ببرید، کنار شما هستیم. با بررسی دقیق شرایط شخصی و بازار، راهکارهایی عملی برای سرمایه‌ گذاری درست منابع مالی در دسترس و حتی بودجه‌های جانبی ارائه می‌دهیم. مشاوره‌های ما بر پایه تجربه، تحلیل داده‌محور و شناخت واقعی از فضای کسب‌وکار امروز شکل گرفته‌اند. آینده‌ شغلی‌تان را هوشمندانه طراحی کنید..`,
  image: "/images/business-consulting/landing.jpg",
};

export const aboutItCardsData = [
  {
    title: "مدیریت سرمایه",
    description: "تقسیم سرمایه، ریسک به ریوارد، و جلوگیری از ضررهای بزرگ",
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
  {
    title: "تحلیل تکنیکال حرفه‌ای",
    description:
      "یادگیری الگوها، کندل‌ها، و سطوح مهم در بازار بورس با مثال‌های عملی",
  },
  {
    title: "روانشناسی معامله‌گری",
    description: "شناخت رفتار بازار، کنترل احساسات و تصمیم‌گیری هوشمند",
  },
];

export const investmentTagsData: string[] = [
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
  "بورس تهران",
  "ارز دیجیتال",
  "فارکس",
  "سهام بلندمدت",
  "صندوق‌های سرمایه‌ گذاری",
  "اوراق قرضه",
  "بورس تهران",
  "ارز دیجیتال",
  "فارکس",
  "سهام بلندمدت",
  "اوراق قرضه",
];

export const alibabaData = {
  topImages: [
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
  ],
  middleImages: [
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
    "/images/investment3.jpg",
  ],
  bottomImages: [
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
    "/images/investment1.jpg",
    "/images/investment2.jpg",
    "/images/investment3.jpg",
  ],
};

export const fakeQuestions = [
  {
    id: 1,
    question: "نام و نام خانوادگی خود را وارد کنید:",
    type: "text",
  },
  {
    id: 2,
    question: "ایمیل خود را وارد کنید:",
    type: "text",
  },
  {
    id: 3,
    question: "شماره موبایل جهت تایید هویت:",
    type: "text",
  },
  {
    id: 4,
    question: "نوع سرمایه‌ گذاری مورد علاقه شما چیست؟",
    type: "select",
    options: ["ارز دیجیتال", "بورس", "طلا", "سپرده بانکی"],
  },
  {
    id: 5,
    question: "توضیحات اضافی (اختیاری):",
    type: "textarea",
  },
];

export const aboutUsData = {
  title: "درباره شرکت پیشرو",
  description: `ما در "پیشرو" به شما کمک می‌کنیم تا در دنیای پیچیده و پر سرعت کریپتو و ترید موفق شوید. 
  با ارائه منابع آموزشی، مشاوره‌های حرفه‌ای و ابزارهای کارآمد، هدف ما ارتقاء دانش مالی شما و دستیابی به 
  فرصت‌های سرمایه‌ گذاری هوشمندانه است. به جمع پیشروها بپیوندید و گام‌های اول را به سوی موفقیت بردارید.`,
  stats: [
    { id: 1, value: 300, label: "کلاینت" },
    { id: 2, value: 30, label: "کارمند" },
    { id: 3, value: 100, label: "پروژه" },
  ],
  image: {
    src: "/images/home/no-bg-person.png",
    alt: "آقای مومنی",
  },
};

export const mobileScrollerSteps = [
  {
    id: 1,
    header: "شروع سرمایه‌ گذاری هوشمند",
    items: [
      "مشاوره تخصصی در بازار بورس ایران و بین‌الملل",
      "تحلیل روزانه سهام و شاخص‌ها",
      "پشتیبانی حرفه‌ای برای تازه‌واردها",
    ],
    ctaText: "رزرو مشاوره رایگان",
    img: "/images/mobile-1.png",
  },
  {
    id: 2,
    header: "فرصت‌های نوین متاورس",
    items: [
      "آشنایی با پروژه‌های متاورسی برتر",
      "آموزش ورود امن به بازار NFT",
      "استراتژی‌های سرمایه‌ گذاری بلندمدت",
    ],
    ctaText: "مشاهده دوره‌ها",
    img: "/images/mobile-2.png",
  },
  {
    id: 3,
    header: "مدیریت سبد سرمایه",
    items: [
      "تنوع‌بخشی هوشمند به دارایی‌ها",
      "ابزارهای آنلاین برای پیگیری لحظه‌ای",
      "کاهش ریسک با استراتژی‌های اختصاصی",
    ],
    ctaText: "شروع مدیریت سرمایه",
    img: "/images/mobile-3.png",
  },
];

export const beginnerSteps = {
  sectionQuote: "از همین امروز یادگیری سرمایه‌ گذاری را شروع کنید",
  sectionTitle: "مراحل یادگیری برای سطح مبتدی",
  sectionSubtitle:
    "در این سطح با مفاهیم پایه و اصول اولیه سرمایه‌ گذاری آشنا می‌شوید. هدف، درک مفاهیم و ساخت ذهنیت مالی صحیح است.",
  sectionCta: "شروع یادگیری",
  steps: [
    {
      id: 1,
      title: "مبانی مالی شخصی",
      description:
        "با اصول اولیه مدیریت بودجه، پس‌انداز، و اهمیت سرمایه‌ گذاری آشنا شوید.",
    },
    {
      id: 2,
      title: "شناخت انواع سرمایه‌ گذاری",
      description:
        "با گزینه‌هایی مثل سهام، طلا، ارز دیجیتال و صندوق‌های سرمایه‌ گذاری آشنا شوید.",
    },
    {
      id: 3,
      title: "شروع با حساب آزمایشی",
      description:
        "پیش از ورود به بازار واقعی، با حساب دمو تمرین کنید تا بدون ریسک تجربه کسب کنید.",
      cta: "شروع تمرین",
    },
  ],
};

export const intermediateSteps = {
  sectionQuote: "یک گام جلوتر، به تحلیل و تصمیم‌گیری هوشمند برسید",
  sectionTitle: "مراحل یادگیری برای سطح متوسط",
  sectionSubtitle:
    "در این سطح وارد دنیای تحلیل و درک بازار می‌شوید. هدف، افزایش مهارت در تحلیل و تصمیم‌گیری حرفه‌ای‌تر است.",
  sectionCta: "ادامه مسیر یادگیری",
  steps: [
    {
      id: 1,
      title: "تحلیل بنیادی و تکنیکال",
      description:
        "با ابزارها و نمودارها آشنا شوید و یاد بگیرید داده‌ها را تحلیل کنید تا تصمیمات بهتری بگیرید.",
    },
    {
      id: 2,
      title: "مدیریت ریسک و احساسات",
      description:
        "یاد بگیرید چگونه از سرمایه خود محافظت کرده و احساسات خود را در نوسانات بازار کنترل کنید.",
    },
    {
      id: 3,
      title: "ساخت استراتژی شخصی",
      description:
        "با ترکیب تجربه و تحلیل، استراتژی معاملاتی مخصوص خود را بسازید و عملکردتان را بسنجید.",
      cta: "شروع تحلیل‌ها",
    },
  ],
};

export const advancedSteps = {
  sectionQuote: "قدم نهایی؛ تبدیل دانش به سود پایدار",
  sectionTitle: "مراحل یادگیری برای سطح حرفه‌ای",
  sectionSubtitle:
    "در این سطح به عمق بازار می‌روید، تحلیل‌های تخصصی انجام می‌دهید و مدیریت پورتفوی و سرمایه را در سطح بالا یاد می‌گیرید.",
  sectionCta: "شروع سرمایه‌ گذاری پیشرفته",
  steps: [
    {
      id: 1,
      title: "تحلیل عمیق بازار و رفتار سرمایه‌گذاران",
      description:
        "یاد بگیرید چگونه روان‌شناسی بازار و داده‌های کلان اقتصادی را تحلیل کرده و جهت حرکات بعدی را پیش‌بینی کنید.",
    },
    {
      id: 2,
      title: "طراحی سبد سرمایه‌ گذاری بهینه",
      description:
        "با اصول تخصیص دارایی، توازن ریسک و بازده، و مدیریت پورتفوی حرفه‌ای آشنا شوید.",
    },
    {
      id: 3,
      title: "توسعه استراتژی‌های خودکار و پیشرفته",
      description:
        "در این مرحله با الگوریتم‌ها، بک‌تست و بهینه‌سازی استراتژی معاملاتی خود آشنا می‌شوید.",
      cta: "شروع تحلیل حرفه‌ای",
    },
  ],
};

export const miniSliderData1 = [
  "/images/home/landing-slider/p01.jpg",
  "/images/home/landing-slider/p02.jpg",
  "/images/home/landing-slider/p03.jpg",
  "/images/home/landing-slider/p04.jpg",
  "/images/home/landing-slider/p05.jpg",
  "/images/home/landing-slider/p06.jpg",
  "/images/home/landing-slider/p07.jpg",
  "/images/home/landing-slider/p08.jpg",
  "/images/home/landing-slider/p09.jpg",
  "/images/home/landing-slider/p10.jpg",
  "/images/home/landing-slider/p11.jpg",
  "/images/home/landing-slider/p12.jpg",
];

export const miniSliderData2 = [
  "/images/home/landing-slider/p06.jpg",
  "/images/home/landing-slider/p05.jpg",
  "/images/home/landing-slider/p07.jpg",
  "/images/home/landing-slider/p03.jpg",
  "/images/home/landing-slider/p04.jpg",
  "/images/home/landing-slider/p08.jpg",
  "/images/home/landing-slider/p02.jpg",
  "/images/home/landing-slider/p10.jpg",
  "/images/home/landing-slider/p01.jpg",
  "/images/home/landing-slider/p12.jpg",
  "/images/home/landing-slider/p09.jpg",
  "/images/home/landing-slider/p11.jpg",
];

import { LuTarget, LuBookOpen, LuUsers } from "react-icons/lu";

export const cryptoLandingData = {
  title: "سرمایه‌ گذاری هوشمند در دنیای کریپتو با پیشرو",
  description:
    "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار کریپتو بساز.",
  button1: "شروع مسیر کریپتو",
  button2: "مشاهده دوره‌ها",
  image: "/images/utiles/student.svg",

  // 🟩 Box Data
  boxes: [
    {
      text: "محتوای کاربردی",
      number: "1K+",
      imgSrc: "/images/utiles/ring.svg",
      top: "5%",
      left: "-2%",
      align: "center" as const,
      col: true,
    },
    {
      text: "ویدئوهای آموزشی",
      number: "250+",
      imgSrc: "/images/utiles/icon1.svg",
      top: "80%",
      left: "9%",
      align: "right" as const,
      col: false,
    },
    {
      text: "دانشجویان راضی",
      number: "3K+",
      imgSrc: "/images/utiles/icon2.svg",
      top: "30%",
      left: "78%",
      align: "right" as const,
      col: false,
    },
  ],

  // 🟦 Stats Data
  stats: [
    { number: 1000, suffix: "+", label: "دانشجو" },
    { number: 250, suffix: "+", label: "دوره آموزشی" },
    { number: 95, suffix: "%", label: "رضایت کاربران" },
    { number: 5, suffix: "سال", label: "تجربه آموزشی" },
  ],

  // 🌟 Features
  features: [
    {
      icon: <LuTarget className="text-myPrimary text-3xl" />,
      text: "نقشه راه کامل از صفر",
    },
    {
      icon: <LuBookOpen className="text-myPrimary text-3xl" />,
      text: "کامل‌ترین محتوا",
    },
    {
      icon: <LuUsers className="text-myPrimary text-3xl" />,
      text: "اجتماع بزرگ دانش‌آموزان",
    },
  ],
};

export const cryptoAboutData = {
  title1: "دنیای",
  title2: "کریپتو",
  description:
    "در دنیای کریپتو، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
  button1: "راهنمایی بیشتر",
  button2: "توضیحات خانم دکتر",
  image: "/images/utiles/font-iran-section.svg",
};

export const airdropLandingData = {
  title: "سرمایه‌ گذاری هوشمند در دنیای ایردراپ با پیشرو",
  description:
    "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار ایردراپ بساز.",
  button1: "شروع مسیر ایردراپ",
  button2: "مشاهده دوره‌ها",
  image: "/images/utiles/student.svg",

  // 🟩 Box Data
  boxes: [
    {
      text: "محتوای کاربردی",
      number: "1K+",
      imgSrc: "/images/utiles/ring.svg",
      top: "5%",
      left: "-2%",
      align: "center" as const,
      col: true,
    },
    {
      text: "ویدئوهای آموزشی",
      number: "250+",
      imgSrc: "/images/utiles/icon1.svg",
      top: "80%",
      left: "9%",
      align: "right" as const,
      col: false,
    },
    {
      text: "دانشجویان راضی",
      number: "3K+",
      imgSrc: "/images/utiles/icon2.svg",
      top: "30%",
      left: "78%",
      align: "right" as const,
      col: false,
    },
  ],

  // 🟦 Stats Data
  stats: [
    { number: 1000, suffix: "+", label: "دانشجو" },
    { number: 250, suffix: "+", label: "دوره آموزشی" },
    { number: 95, suffix: "%", label: "رضایت کاربران" },
    { number: 5, suffix: "سال", label: "تجربه آموزشی" },
  ],

  // 🌟 Features
  features: [
    {
      icon: <LuTarget className="text-myPrimary text-3xl" />,
      text: "نقشه راه کامل از صفر",
    },
    {
      icon: <LuBookOpen className="text-myPrimary text-3xl" />,
      text: "کامل‌ترین محتوا",
    },
    {
      icon: <LuUsers className="text-myPrimary text-3xl" />,
      text: "اجتماع بزرگ دانش‌آموزان",
    },
  ],
};

export const airdropAboutData = {
  title1: "دنیای",
  title2: "ایردراپ",
  description:
    "در دنیای ایردراپ، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
  button1: "راهنمایی بیشتر",
  button2: "توضیحات خانم دکتر",
  image: "/images/utiles/font-iran-section.svg",
};

export const metaverseLandingData = {
  title: "سرمایه‌ گذاری هوشمند در دنیای متاورس با پیشرو",
  description:
    "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار متاورس بساز.",
  button1: "شروع مسیر متاورس",
  button2: "مشاهده دوره‌ها",
  image: "/images/utiles/student.svg",

  // 🟩 Box Data
  boxes: [
    {
      text: "محتوای کاربردی",
      number: "1K+",
      imgSrc: "/images/utiles/ring.svg",
      top: "5%",
      left: "-2%",
      align: "center" as const,
      col: true,
    },
    {
      text: "ویدئوهای آموزشی",
      number: "250+",
      imgSrc: "/images/utiles/icon1.svg",
      top: "80%",
      left: "9%",
      align: "right" as const,
      col: false,
    },
    {
      text: "دانشجویان راضی",
      number: "3K+",
      imgSrc: "/images/utiles/icon2.svg",
      top: "30%",
      left: "78%",
      align: "right" as const,
      col: false,
    },
  ],

  // 🟦 Stats Data
  stats: [
    { number: 1000, suffix: "+", label: "دانشجو" },
    { number: 250, suffix: "+", label: "دوره آموزشی" },
    { number: 95, suffix: "%", label: "رضایت کاربران" },
    { number: 5, suffix: "سال", label: "تجربه آموزشی" },
  ],

  // 🌟 Features
  features: [
    {
      icon: <LuTarget className="text-myPrimary text-3xl" />,
      text: "نقشه راه کامل از صفر",
    },
    {
      icon: <LuBookOpen className="text-myPrimary text-3xl" />,
      text: "کامل‌ترین محتوا",
    },
    {
      icon: <LuUsers className="text-myPrimary text-3xl" />,
      text: "اجتماع بزرگ دانش‌آموزان",
    },
  ],
};

export const metaverseAboutData = {
  title1: "دنیای",
  title2: "متاورس",
  description:
    "در دنیای متاورس، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
  button1: "راهنمایی بیشتر",
  button2: "توضیحات خانم دکتر",
  image: "/images/utiles/font-iran-section.svg",
};

export const nftLandingData = {
  title: "سرمایه‌ گذاری هوشمند در دنیای NFT با پیشرو",
  description:
    "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار NFT بساز.",
  button1: "شروع مسیر NFT",
  button2: "مشاهده دوره‌ها",
  image: "/images/utiles/student.svg",

  // 🟩 Box Data
  boxes: [
    {
      text: "محتوای کاربردی",
      number: "1K+",
      imgSrc: "/images/utiles/ring.svg",
      top: "5%",
      left: "-2%",
      align: "center" as const,
      col: true,
    },
    {
      text: "ویدئوهای آموزشی",
      number: "250+",
      imgSrc: "/images/utiles/icon1.svg",
      top: "80%",
      left: "9%",
      align: "right" as const,
      col: false,
    },
    {
      text: "دانشجویان راضی",
      number: "3K+",
      imgSrc: "/images/utiles/icon2.svg",
      top: "30%",
      left: "78%",
      align: "right" as const,
      col: false,
    },
  ],

  // 🟦 Stats Data
  stats: [
    { number: 1000, suffix: "+", label: "دانشجو" },
    { number: 250, suffix: "+", label: "دوره آموزشی" },
    { number: 95, suffix: "%", label: "رضایت کاربران" },
    { number: 5, suffix: "سال", label: "تجربه آموزشی" },
  ],

  // 🌟 Features
  features: [
    {
      icon: <LuTarget className="text-myPrimary text-3xl" />,
      text: "نقشه راه کامل از صفر",
    },
    {
      icon: <LuBookOpen className="text-myPrimary text-3xl" />,
      text: "کامل‌ترین محتوا",
    },
    {
      icon: <LuUsers className="text-myPrimary text-3xl" />,
      text: "اجتماع بزرگ دانش‌آموزان",
    },
  ],
};

export const nftAboutData = {
  title1: "دنیای",
  title2: "NFT",
  description:
    "در دنیای NFT، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
  button1: "راهنمایی بیشتر",
  button2: "توضیحات خانم دکتر",
  image: "/images/utiles/font-iran-section.svg",
};

export const stockMarketLandingData = {
  title: "سرمایه‌ گذاری هوشمند در دنیای بورس با پیشرو",
  description:
    "با آموزش‌های دقیق و کاربردی دنیای رمزارزها، از مفاهیم پایه تا تحلیل تکنیکال و فاندامنتال، مسیر خودت رو برای موفقیت در بازار بورس بساز.",
  button1: "شروع مسیر بورس",
  button2: "مشاهده دوره‌ها",
  image: "/images/utiles/student.svg",

  // 🟩 Box Data
  boxes: [
    {
      text: "محتوای کاربردی",
      number: "1K+",
      imgSrc: "/images/utiles/ring.svg",
      top: "5%",
      left: "-2%",
      align: "center" as const,
      col: true,
    },
    {
      text: "ویدئوهای آموزشی",
      number: "250+",
      imgSrc: "/images/utiles/icon1.svg",
      top: "80%",
      left: "9%",
      align: "right" as const,
      col: false,
    },
    {
      text: "دانشجویان راضی",
      number: "3K+",
      imgSrc: "/images/utiles/icon2.svg",
      top: "30%",
      left: "78%",
      align: "right" as const,
      col: false,
    },
  ],

  // 🟦 Stats Data
  stats: [
    { number: 1000, suffix: "+", label: "دانشجو" },
    { number: 250, suffix: "+", label: "دوره آموزشی" },
    { number: 95, suffix: "%", label: "رضایت کاربران" },
    { number: 5, suffix: "سال", label: "تجربه آموزشی" },
  ],

  // 🌟 Features
  features: [
    {
      icon: <LuTarget className="text-myPrimary text-3xl" />,
      text: "نقشه راه کامل از صفر",
    },
    {
      icon: <LuBookOpen className="text-myPrimary text-3xl" />,
      text: "کامل‌ترین محتوا",
    },
    {
      icon: <LuUsers className="text-myPrimary text-3xl" />,
      text: "اجتماع بزرگ دانش‌آموزان",
    },
  ],
};

export const stockMarketAboutData = {
  title1: "دنیای",
  title2: "بورس",
  description:
    "در دنیای بورس، ما به دنبال آموزش مفاهیم واقعی سرمایه‌ گذاری و تحلیل بازار رمزارزها هستیم. هدف ما این است که با یادگیری اصولی، تصمیم‌های آگاهانه بگیرید و از فرصت‌های دنیای دیجیتال بهترین استفاده را ببرید.",
  button1: "راهنمایی بیشتر",
  button2: "توضیحات خانم دکتر",
  image: "/images/utiles/font-iran-section.svg",
};
