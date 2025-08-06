export const navbarData = [
  {
    label: "صفحه اصلی",
    link: "/", // Home page
  },
  {
    label: "دوره های آموزشی",
    link: "#courses", // Courses listing
    data: [
      {
        label: "کریپتوکارنسی",
        link: "/cryptocurrency?section=courses", // اضافه کردن به Query Parameters
      },
      {
        label: "بورس",
        link: "/stock-market?section=courses",
      },
      {
        label: "متاورس",
        link: "/metaverse?section=courses",
      },
      {
        label: "NFT",
        link: "/nft?section=courses",
      },
      {
        label: "ایردراپ",
        link: "/airdrop?section=courses",
      },
    ],
  },
  {
    label: "سبد های سرمایه گذاری",
    link: "/investment-plans", // Courses listing
  },
  {
    label: "کریپتوکارنسی",
    link: "/cryptocurrency", // Cryptocurrency section
  },
  {
    label: "بورس",
    link: "/stock-market", // Stock market section
  },
  {
    label: "متاورس",
    link: "/metaverse", // Metaverse section
  },
  {
    label: "NFT",
    link: "/nft", // NFT section
  },
  {
    label: "ایردراپ",
    link: "/airdrop", // Airdrop section
  },
  {
    label: "مشاوره کسب و کار",
    link: "/investment-consulting", // Airdrop section
  },
  {
    label: "کتابخانه دیجیتال",
    link: "/digital-lib", // Airdrop section
  },
  {
    label: "اخبار سایت",
    link: "#news", // Airdrop section
    data: [
      {
        label: "همگی اخبار",
        link: "/news", // Courses listing
      },
      {
        label: "کریپتوکارنسی",
        link: "/cryptocurrency?section=news", // Cryptocurrency section
      },
      {
        label: "بورس",
        link: "/stock-market?section=news", // Stock market section
      },
      {
        label: "متاورس",
        link: "/metaverse?section=news", // Metaverse section
      },
      {
        label: "NFT",
        link: "/nft?section=news", // NFT section
      },
      {
        label: "ایردراپ",
        link: "/airdrop?section=news", // Airdrop section
      },
    ],
  },
  {
    label: "درباره ما",
    link: "/about-us", // Airdrop section
  },
  {
    label: "سوالی دارید؟",
    link: "/faq", // Airdrop section
  },
];

export const categoriesData = [
  {
    src: "/images/home/crypto.jpg",
    label: "کریپتوکارنسی",
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
    title: "پیشرو در آموزش‌های حرفه‌ای و به‌روز سرمایه‌گذاری",
    text: `دوره‌های آموزشی ما کامل‌ترین محتوای کریپتو، بورس، NFT، متاورس و ایردراپ رو پوشش می‌ده.
آموزش‌ها از مبتدی تا پیشرفته طراحی شدن، پس همه می‌تونن شروع کنن و رشد کنن.
با مثال‌های عملی و محتوای کاربردی، یادگیری تبدیل به تجربه‌ای لذت‌بخش و مفید میشه.
پیشرو همیشه با جدیدترین ترندها و روش‌های سرمایه‌گذاری همراهتونه.`,
    btnLabel: "اطلاعات بیشتر",
    btnHref: "/about-us",
    animationPath: "/animations/investment-education.json",
    imagePath: "/images/landing/img-1.jpg",
  },
  {
    label: "سبدهای شخصی‌سازی‌شده",
    title: "پیشرو در ارائه سبدهای سرمایه‌گذاری شخصی‌سازی‌شده",
    text: `هر کسی با هر سطح سرمایه و ریسک‌پذیری می‌تونه بهترین پیشنهاد سرمایه‌گذاری رو پیدا کنه.
ما با تحلیل‌های تخصصی بازار، سبدهایی متناسب با شرایطت طراحی می‌کنیم.
تنوع در سبدها باعث میشه بتونی هم سود بیشتری داشته باشی، هم ریسک کمتری تجربه کنی.
سرمایه‌گذاری با پیشرو یعنی تصمیم‌گیری آگاهانه و مدیریت هوشمندانه پولت.`,
    btnLabel: "اطلاعات بیشتر",
    btnHref: "/investment-plans",
    animationPath: "/animations/man-taking-payout-of-cryptocurrency.json",
    imagePath: "/images/landing/img-2.jpg",
  },
  {
    label: "پشتیبانی و رشد",
    title: "پیشرو، همراهی مطمئن برای رشد و موفقیت",
    text: `از اولین قدم‌های یادگیری تا انتخاب بهترین سرمایه‌گذاری، پیشرو همیشه کنارتونه.
تیم پشتیبانی و مشاوره ما آماده‌ست تا هر سوالی که داری رو جواب بده.
عضویت در پیشرو یعنی دسترسی به جامعه‌ای فعال و متخصص که توش همیشه یاد می‌گیری.
با انتخاب پیشرو، امنیت، شفافیت و آینده‌ای بهتر رو برای خودت می‌سازی.`,
    btnLabel: "اطلاعات بیشتر",
    btnHref: "/investment-consulting",
    animationPath: "/animations/transaction-in-cryptocurrency.json",
    imagePath: "/images/landing/img-3.jpg",
  },
];

export const coursesData = [
  {
    title: "آموزش ترید",
    price: 2500000,
    img: "/images/courses/trade.jpg",
  },
  {
    title: "آموزش ارزهای دیجیتال",
    price: 3500000,
    img: "/images/courses/cryptocurrency.jpg",
  },
  {
    title: "آموزش بورس",
    price: 2000000,
    img: "/images/courses/stock-market.jpg",
  },
  {
    title: "آموزش NFT",
    price: 1500000,
    img: "/images/courses/nft.jpg",
  },
  {
    title: "آموزش متاورس",
    price: 4000000,
    img: "/images/courses/metaverse.jpg",
  },
  {
    title: "آموزش ترید",
    price: 2500000,
    img: "/images/courses/trade.jpg",
  },
  {
    title: "آموزش ارزهای دیجیتال",
    price: 3500000,
    img: "/images/courses/cryptocurrency.jpg",
  },
  {
    title: "آموزش کریپتوکارنسی",
    price: 1600000,
    img: "/images/courses/nft.jpg",
  },
  {
    title: "آموزش بورس",
    price: 2000000,
    img: "/images/courses/stock-market.jpg",
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

export const landingData = {
  "/": {
    backgroundImage: ["/images/landing.webp", "/images/landing-2.webp"],
    title: "",
    description: "",
  },
  // "/cryptocurrency": {
  //   backgroundImage: "/images/landing-crypto.jpg",
  //   title: "کریپتوکارنسی",
  //   description:
  //     "پیشرو با ارائه خدمات حرفه‌ای در زمینه آموزش مالی و سرمایه‌گذاری در کنار شماست.",
  // },
  // "/stock-market": {
  //   backgroundImage: "/images/landing-stock-market.jpg",
  //   title: "بورس",
  //   description:
  //     "پیشرو با ارائه خدمات حرفه‌ای در زمینه آموزش مالی و سرمایه‌گذاری در کنار شماست.",
  // },
  // "/airdrop": {
  //   backgroundImage: "/images/landing-airdrop.jpg",
  //   title: "ایردراپ! از این فرصت غافل نشوید",
  //   description:
  //     "ارائه تحلیل‌های تخصصی بازار و دوره‌های جامع برای ارتقاء دانش مالی شما.",
  // },
  // "/contact": {
  //   backgroundImage: "/images/contact.jpg",
  //   title: "تماس با ما",
  //   description:
  //     "برای مشاوره و ارتباط با تیم پشتیبانی ما، همین حالا با ما در تماس باشید.",
  // },
};

export const cryptoData = [
  {
    title: "در اینجا یک شعار یا جمله به عنوان تایتل بنویسید",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و ",
  },
  {
    title: "در اینجا یک شعار یا جمله به عنوان تایتل بنویسید",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و ",
  },
  {
    title: "در اینجا یک شعار یا جمله به عنوان تایتل بنویسید",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و ",
  },
  {
    title: "در اینجا یک شعار یا جمله به عنوان تایتل بنویسید",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و ",
  },
];

export const cryptoCursesData = [
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    price: 2500000,
    img: "/images/courses/trade.jpg",
    description:
      "پاسخ میتونه ولی بدون محدودیت درج بشه، به همین خاطر محدودیت تعداد کاراکتر در پاسخ ها وجود نداره؛ لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد .",
  },
  {
    title:
      "عنوان مطلب یا مقاله در این بخش به صورت دو خطی میتونه درج بشه نهایتاً",
    price: 2500000,
    img: "/images/courses/trade.jpg",
    description:
      "پاسخ میتونه ولی بدون محدودیت درج بشه، به همین خاطر محدودیت تعداد کاراکتر در پاسخ ها وجود نداره؛ لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد .",
  },
  {
    title: "آموزش متاورس",
    price: 4000000,
    img: "/images/courses/metaverse.jpg",
    description:
      "آموزش دنیای متاورس و فرصت‌های شغلی و سرمایه‌گذاری در آینده فناوری دیجیتال.",
  },
  {
    title: "آموزش ترید",
    price: 2500000,
    img: "/images/courses/trade.jpg",
    description:
      "دوره جامع آموزش ترید، شامل استراتژی‌های حرفه‌ای و اصول مدیریت ریسک برای موفقیت در بازارهای مالی.",
  },
];

export const stockMarketSliderData = [
  {
    name: "SFCL",
    logo: "/images/stock/sfcl.png",
    changes: "+2.5%",
    link: "/stock-market/sfcl",
  },
  {
    name: "SHIVAM",
    logo: "/images/stock/shivam.png",
    changes: "-1.5%",
    link: "/stock-market/shivam",
  },
  {
    name: "NTC",
    logo: "/images/stock/ntc.png",
    changes: "+3.5%",
    link: "/stock-market/ntc",
  },
  {
    name: "MLBL",
    logo: "/images/stock/mlbl.png",
    changes: "-1.5%",
    link: "/stock-market/mlbl",
  },
  {
    name: "SFCL",
    logo: "/images/stock/sfcl.png",
    changes: "+2.5%",
    link: "/stock-market/sfcl",
  },
  {
    name: "JGK",
    logo: "/images/stock/jgk.png",
    changes: "+3.5%",
    link: "/stock-market/jgk",
  },
];

export const cryptoSliderData = [
  {
    name: "Bitcoin",
    logo: "/images/crypto/bitcoin.png",
    changes: "+4.2%",
    link: "/crypto/bitcoin",
  },
  {
    name: "Ethereum",
    logo: "/images/crypto/ethereum.png",
    changes: "-2.1%",
    link: "/crypto/ethereum",
  },
  {
    name: "Solana",
    logo: "/images/crypto/solana.png",
    changes: "+5.8%",
    link: "/crypto/solana",
  },
  {
    name: "BNB",
    logo: "/images/crypto/bnb.png",
    changes: "-1.3%",
    link: "/crypto/bnb",
  },
  {
    name: "Cardano",
    logo: "/images/crypto/cardano.png",
    changes: "+3.0%",
    link: "/crypto/cardano",
  },
  {
    name: "XRP",
    logo: "/images/crypto/xrp.png",
    changes: "+1.5%",
    link: "/crypto/xrp",
  },
];

export const nftSliderData = [
  {
    name: "Bored Ape Yacht Club",
    logo: "/images/nft/bayc.png",
    changes: "+6.1%",
    link: "/nft/bayc",
  },
  {
    name: "CryptoPunks",
    logo: "/images/nft/cryptopunks.png",
    changes: "-3.4%",
    link: "/nft/cryptopunks",
  },
  {
    name: "Azuki",
    logo: "/images/nft/azuki.png",
    changes: "+2.9%",
    link: "/nft/azuki",
  },
  {
    name: "CloneX",
    logo: "/images/nft/clonex.png",
    changes: "-0.8%",
    link: "/nft/clonex",
  },
  {
    name: "Moonbirds",
    logo: "/images/nft/moonbirds.png",
    changes: "+4.5%",
    link: "/nft/moonbirds",
  },
  {
    name: "Doodles",
    logo: "/images/nft/doodles.png",
    changes: "+1.2%",
    link: "/nft/doodles",
  },
];

export const metaverseSliderData = [
  {
    name: "Decentraland",
    logo: "/images/metaverse/decentraland.png",
    changes: "+5.4%",
    link: "/metaverse/decentraland",
  },
  {
    name: "The Sandbox",
    logo: "/images/metaverse/sandbox.png",
    changes: "-2.0%",
    link: "/metaverse/sandbox",
  },
  {
    name: "Axie Infinity",
    logo: "/images/metaverse/axie.png",
    changes: "+3.7%",
    link: "/metaverse/axie",
  },
  {
    name: "Illuvium",
    logo: "/images/metaverse/illuvium.png",
    changes: "-1.1%",
    link: "/metaverse/illuvium",
  },
  {
    name: "Somnium Space",
    logo: "/images/metaverse/somnium.png",
    changes: "+4.8%",
    link: "/metaverse/somnium",
  },
  {
    name: "Star Atlas",
    logo: "/images/metaverse/staratlas.png",
    changes: "+2.6%",
    link: "/metaverse/staratlas",
  },
];

export const airdropSliderData = [
  {
    name: "Arbitrum Airdrop",
    logo: "/images/airdrop/arbitrum.png",
    changes: "+10.0%",
    link: "/airdrop/arbitrum",
  },
  {
    name: "Optimism Airdrop",
    logo: "/images/airdrop/optimism.png",
    changes: "-4.2%",
    link: "/airdrop/optimism",
  },
  {
    name: "StarkNet Airdrop",
    logo: "/images/airdrop/starknet.png",
    changes: "+7.5%",
    link: "/airdrop/starknet",
  },
  {
    name: "Aptos Airdrop",
    logo: "/images/airdrop/aptos.png",
    changes: "-2.7%",
    link: "/airdrop/aptos",
  },
  {
    name: "Sei Airdrop",
    logo: "/images/airdrop/sei.png",
    changes: "+5.9%",
    link: "/airdrop/sei",
  },
  {
    name: "Sui Airdrop",
    logo: "/images/airdrop/sui.png",
    changes: "+3.3%",
    link: "/airdrop/sui",
  },
];

export const metaverseFirstSectionData = [
  {
    title: "متاورس آینده‌ای که می‌توانید بسازید!",
    description: [
      {
        text: "متاورس فقط یک دنیای مجازی نیست، بلکه یک واقعیت دیجیتالی جدید است که مرز بین زندگی، کسب‌وکار و سرمایه‌گذاری را از نو تعریف می‌کند. جایی که شما می‌توانید مالک، و سرمایه‌گذار باشید و در اقتصادی نوظهور رشد کنید.",
      },
    ],
  },
];

export const metaverseSecondSectionData = [
  {
    title:
      "در پیشرو ،ما با آموزش‌های تخصصی و کاربردی، شما را برای حضور فعال و هوشمند در این دنیا آماده می‌کنیم:",
    description: [
      {
        text: "متاورس و فناوری‌های آن – از بلاکچین تا واقعیت افزوده",
        check: true,
      },
      { text: "سرمایه‌گذاری در زمین‌ها و پروژه‌های متاورسی", check: true },
      { text: "ساخت و توسعه کسب‌وکارهای دیجیتالی", check: true },
      { text: "آینده‌ای که شما طراحی می‌کنید!", check: true },
      {
        text: "فرصت‌های متاورس از همین حالا آغاز شده‌اند! یاد بگیرید، کشف کنید و جزو پیشگامان این تحول باشید.",
      },
    ],
  },
];

export const nftData = [
  "توکن غیر مثلی که مانند ارزهای دیجیتال بر بستر شبکه های بلاک چین فعال است",
  "هر نوع ایده خلاقانه ای را می تواند تبدیل به NFT کرد جالب تر آنکه دنیای NFT به قدری پهناور است که هیچ محدودیتی در هیچ عرصه ای ندارد (طرح ها معماری تا جواهرات) ",
  "قابل انتقال است و مالکیت حقوقی دارد دو ادم که یکی تابلو نقاشی میدهد و یکی اتریوم",
  "قابل تقسیم و تعویض نیست و منحصر به فرد است",
  "هوش مصنوعی (AI) نیز در این زمینه نفوذ کرده و برای تولید NFT میتوان از آن بهره گرفت",
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
    label: "کریپتوکارنسی",
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

export const homeSliderData = [
  {
    image: "/images/landing-stock-market.jpg",
    text: "پیشرو در مسیر موفقیت مالی",
    linkText: "برو به خانه",
    linkUrl: "/",
  },
  {
    image: "/images/landing-crypto.jpg",
    text: "کریپتوکارنسی",
    linkText: "برو به صفحه کریپتو",
    linkUrl: "/cryptocurrency",
  },
  {
    image: "/images/landing-stock-market.jpg",
    text: "بورس",
    linkText: "برو به صفحه بورس",
    linkUrl: "/stock-market",
  },
  {
    image: "/images/landing-airdrop.jpg",
    text: "ایردراپ! از این فرصت غافل نشوید",
    linkText: "برو به صفحه ایردراپ",
    linkUrl: "/airdrop",
  },
];

export const businessConsultingData = {
  title: "ایده‌هایت را به واقعیت تبدیل کن، کسب‌وکارت را پیشرو کن!",
  text: `فرقی نمی‌کند در ابتدای راه باشی یا بخواهی کسب‌وکارت را به سطحی جدید برسانی، پیشرو همراهی است که به تو قدرت عمل می‌دهد. اینجا فقط مشاوره نمی‌گیری؛ یک برنامه عملی، دقیق و شخصی‌سازی‌شده برای رشد کسب‌وکارت دریافت می‌کنی. از ایده‌پردازی و تحلیل بازار گرفته تا طراحی استراتژی‌های حرفه‌ای و عبور از چالش‌های بزرگ، هر آنچه برای موفقیت نیاز داری در کنارت خواهیم بود.
همین امروز قدم اول رو بردار و راهی که همیشه آرزو داشتی رو شروع کن. پیشرو، آینده تو را می‌سازد!`,
};

export const checkoutBank = [
  { name: "saman", label: "بانک سامان", logo: "/images/checkout/saman.png" },
  { name: "melli", label: "بانک ملی", logo: "/images/checkout/melli.png" },
  { name: "mellat", label: "بانک ملت", logo: "/images/checkout/mellat.png" },
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

export const profileOrdersData = [
  {
    name: "دوره اول",
    date: "1403/12/5",
    price: 2400000,
    isPayed: true,
    details: {
      payId: "12342",
      phoneNumber: "09123457789",
    },
  },
  {
    name: "دوره دوم",
    date: "1403/12/6",
    price: 2000000,
    isPayed: true,
    details: {
      payId: "12341",
      phoneNumber: "09123456689",
    },
  },
  {
    name: "دوره سوم",
    date: "1403/12/8",
    price: 1700000,
    isPayed: false,
    details: {
      payId: "123453",
      phoneNumber: "09123411789",
    },
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
    avatar: "/images/profile/profile-1.png",
    name: "علی رضایی",
    position: "تحلیل‌گر بازار",
    comment: "تجربه بسیار خوبی داشتم. پشتیبانی حرفه‌ای و مطالب کامل بود.",
  },
  {
    id: 2,
    avatar: "/images/profile/profile-2.png",
    name: "سمیرا محمدی",
    position: "سرمایه‌گذار",
    comment: "این دوره‌ها کمک زیادی به تصمیم‌گیری‌های سرمایه‌گذاری من کرد.",
  },
  {
    id: 3,
    avatar: "/images/profile/profile-3.png",
    name: "مهدی کاظمی",
    position: "معامله‌گر بورس",
    comment: "اساتید بسیار مسلط و نکات کاربردی زیادی ارائه شد.",
  },
  {
    id: 4,
    avatar: "/images/profile/profile-4.png",
    name: "زهرا کریمی",
    position: "مشاور مالی",
    comment: "کیفیت محتوای آموزشی فوق‌العاده و پاسخگویی سریع.",
  },
  {
    id: 5,
    avatar: "/images/profile/profile-1.png",
    name: "رضا کریمی",
    position: "مشاور مالی",
    comment: "کیفیت محتوای آموزشی فوق‌العاده و پاسخگویی سریع.",
  },
];

export const investmentConsultingData = {
  title: "مشاوره سرمایه‌گذاری پیشرو",
  text: `در بخش مشاوره کسب‌وکار، همراه شماییم تا در هر حرفه‌ای که دارید، مسیر رشد و توسعه را هموار کنیم. چه در فکر راه‌اندازی یک کسب‌وکار جدید باشید و چه بخواهید بیزنس فعلی‌تان را به مرحله‌ای بالاتر ببرید، کنار شما هستیم. با بررسی دقیق شرایط شخصی و بازار، راهکارهایی عملی برای سرمایه‌گذاری درست منابع مالی در دسترس و حتی بودجه‌های جانبی ارائه می‌دهیم. مشاوره‌های ما بر پایه تجربه، تحلیل داده‌محور و شناخت واقعی از فضای کسب‌وکار امروز شکل گرفته‌اند. آینده‌ شغلی‌تان را هوشمندانه طراحی کنید..`,
  image: "/images/investment-consulting/landing.png",
};

export const investmentPlansData = {
  title: "سبد های سرمایه گذاری پیشرو",
  text: `هر سبد سرمایه‌گذاری با تکیه بر تحلیل‌های کمّی، رویکرد مدیریت ریسک و ارزیابی جامع بازارها تدوین می‌شود.
با بهره‌گیری هم‌زمان از ظرفیت‌های بازار سرمایه و دارایی‌های دیجیتال، بهینه‌سازی بازده در چارچوب اصول مالی دنبال می‌گردد.
هدف ما، ایجاد مسیرهای باثبات برای رشد سرمایه و حفظ ارزش دارایی در بلندمدت است.`,
  image: "/images/investment-plans/landing.jpg",
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
  "صندوق‌های سرمایه‌گذاری",
  "اوراق قرضه",
  "مدیریت ریسک",
  "تنوع سبد سرمایه‌گذاری",
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
    question: "نوع سرمایه‌گذاری مورد علاقه شما چیست؟",
    type: "select",
    options: ["ارز دیجیتال", "بورس", "طلا", "سپرده بانکی"],
  },
  {
    id: 5,
    question: "توضیحات اضافی (اختیاری):",
    type: "textarea",
  },
];
