/**
 * Unified visibility catalog — admin can hide pages, homepage blocks,
 * other page sections, profile nav items, and floating chrome.
 * Stored in SiteSettings.hiddenPages (JSON string array).
 */

export type HidableKind = "page" | "section" | "profile" | "chrome";

export type HidableGroupId =
  | "pages"
  | "home"
  | "about"
  | "courses"
  | "news"
  | "library"
  | "investment"
  | "crypto"
  | "faq"
  | "consulting"
  | "skyroom"
  | "profile"
  | "chrome";

export type HidableItem = {
  id: string;
  label: string;
  description?: string;
  kind: HidableKind;
  group: HidableGroupId;
};

export type HidableGroup = {
  id: HidableGroupId;
  label: string;
  description: string;
  items: HidableItem[];
};

const page = (
  id: string,
  label: string,
  description?: string
): HidableItem => ({
  id,
  label,
  description,
  kind: "page",
  group: "pages",
});

const section = (
  group: HidableGroupId,
  id: string,
  label: string,
  description?: string
): HidableItem => ({
  id,
  label,
  description,
  kind: "section",
  group,
});

const profile = (
  id: string,
  label: string,
  description?: string
): HidableItem => ({
  id,
  label,
  description,
  kind: "profile",
  group: "profile",
});

const chrome = (
  id: string,
  label: string,
  description?: string
): HidableItem => ({
  id,
  label,
  description,
  kind: "chrome",
  group: "chrome",
});

/** Main marketing routes — removed from nav/footer and return 404 when hidden. */
export const HIDABLE_PAGES: HidableItem[] = [
  page("/", "صفحه اصلی", "کل مسیر /"),
  page("/courses", "دوره‌ها"),
  page("/crypto-prices", "قیمت ارزها"),
  page("/business-consulting", "مشاوره کسب و کار"),
  page("/investment-plans", "سبدهای سرمایه‌گذاری", "صفحه کامل سبدها"),
  page("/library", "کتابخانه دیجیتال"),
  page("/news", "اخبار"),
  page("/about-us", "درباره ما"),
  page("/skyroom-classes", "همایش"),
  page("/faq", "سوالات متداول"),
  page("/checkout", "تسویه حساب / سبد خرید"),
];

export const HIDABLE_HOME_SECTIONS: HidableItem[] = [
  section("home", "home:hero", "هیرو صفحه اصلی", "هیرو سکه‌ها در بالای صفحه"),
  section("home", "home:mobile-view", "موبایل ویو", "قدم‌های اسکرول داخل قاب موبایل"),
  section("home", "home:comments", "نظرات کاربران", "اسلایدر نظرات"),
  section("home", "home:calculator", "ماشین‌حساب سبد", "محاسبه بازده روی خانه"),
  section("home", "home:courses", "دوره‌های صفحه اصلی"),
  section("home", "home:news", "باشگاه خبری"),
  section("home", "home:notifications", "اعلان‌های شناور خانه"),
];

export const HIDABLE_ABOUT_SECTIONS: HidableItem[] = [
  section("about", "about:hero", "هیرو درباره ما"),
  section("about", "about:resume", "رزومه / تاریخچه"),
  section("about", "about:team", "تیم"),
  section("about", "about:certificates", "گواهی‌نامه‌ها"),
  section("about", "about:journals", "مقالات / نشریات"),
  section("about", "about:cta", "فراخوان اقدام (CTA)"),
];

export const HIDABLE_COURSES_SECTIONS: HidableItem[] = [
  section("courses", "courses:hero", "هیرو دوره‌ها"),
  section("courses", "courses:filters", "فیلتر و جستجو"),
  section("courses", "courses:catalog", "لیست دوره‌ها"),
];

export const HIDABLE_NEWS_SECTIONS: HidableItem[] = [
  section("news", "news:hero", "هیرو اخبار"),
  section("news", "news:filters", "فیلتر اخبار"),
  section("news", "news:grid", "لیست اخبار"),
];

export const HIDABLE_LIBRARY_SECTIONS: HidableItem[] = [
  section("library", "library:hero", "هیرو کتابخانه"),
  section("library", "library:filters", "فیلتر کتاب‌ها"),
  section("library", "library:featured", "کتاب‌های ویژه"),
  section("library", "library:grid", "شبکه کتاب‌ها"),
];

export const HIDABLE_INVESTMENT_SECTIONS: HidableItem[] = [
  section("investment", "investment:hero", "هیرو سبدها"),
  section("investment", "investment:models", "مدل‌های سرمایه‌گذاری"),
  section("investment", "investment:portfolios", "نمایش پورتفوی‌ها"),
  section("investment", "investment:selection", "فرم انتخاب سبد"),
];

export const HIDABLE_CRYPTO_SECTIONS: HidableItem[] = [
  section("crypto", "crypto:header", "هدر قیمت ارزها"),
  section("crypto", "crypto:hero", "هیرو / بیت‌کوین"),
  section("crypto", "crypto:stats", "آمار کلی"),
  section("crypto", "crypto:table", "جدول قیمت‌ها"),
];

export const HIDABLE_FAQ_SECTIONS: HidableItem[] = [
  section("faq", "faq:header", "هدر سوالات"),
  section("faq", "faq:list", "لیست سوالات"),
];

export const HIDABLE_CONSULTING_SECTIONS: HidableItem[] = [
  section("consulting", "consulting:landing", "لندینگ مشاوره کسب‌وکار"),
];

export const HIDABLE_SKYROOM_SECTIONS: HidableItem[] = [
  section("skyroom", "skyroom:landing", "صفحه همایش / اسکای‌روم"),
];

export const HIDABLE_PROFILE_ITEMS: HidableItem[] = [
  profile("profile:acc", "اکانت شما", "/profile/acc"),
  profile("profile:courses", "دوره‌های من", "/profile/courses"),
  profile("profile:orders", "سفارش‌ها", "/profile/orders"),
  profile("profile:transactions", "تراکنش‌ها", "/profile/transactions"),
  profile("profile:lists", "لیست‌ها / علاقه‌مندی‌ها", "/profile/lists"),
  profile("profile:support", "تیکت و پشتیبانی", "/profile/support"),
  profile("profile:settings", "تنظیمات پروفایل", "/profile/settings"),
  profile("profile:logout", "دکمه خروج از حساب"),
];

export const HIDABLE_CHROME_ITEMS: HidableItem[] = [
  chrome("chrome:chat", "ویجت چت", "دکمه شناور گفتگو"),
  chrome("chrome:floating-cart", "سبد خرید شناور"),
  chrome("chrome:scroll-top", "دکمه بازگشت به بالا"),
  chrome("chrome:navbar", "نوار بالای سایت"),
  chrome("chrome:footer", "فوتر سایت"),
];

/** @deprecated alias — home sections only */
export const HIDABLE_SECTIONS: HidableItem[] = HIDABLE_HOME_SECTIONS;

export const HIDABLE_GROUPS: HidableGroup[] = [
  {
    id: "pages",
    label: "صفحات اصلی سایت",
    description: "مخفی = حذف از منو/فوتر و ۴۰۴ با آدرس مستقیم",
    items: HIDABLE_PAGES,
  },
  {
    id: "home",
    label: "بخش‌های صفحه اصلی",
    description: "بلوک‌های لندینگ خانه",
    items: HIDABLE_HOME_SECTIONS,
  },
  {
    id: "about",
    label: "درباره ما",
    description: "بخش‌های صفحه درباره ما",
    items: HIDABLE_ABOUT_SECTIONS,
  },
  {
    id: "courses",
    label: "دوره‌ها",
    description: "بخش‌های صفحه لیست دوره‌ها",
    items: HIDABLE_COURSES_SECTIONS,
  },
  {
    id: "news",
    label: "اخبار",
    description: "بخش‌های صفحه اخبار",
    items: HIDABLE_NEWS_SECTIONS,
  },
  {
    id: "library",
    label: "کتابخانه",
    description: "بخش‌های صفحه کتابخانه",
    items: HIDABLE_LIBRARY_SECTIONS,
  },
  {
    id: "investment",
    label: "سبد سرمایه‌گذاری",
    description: "بخش‌های صفحه سبدها",
    items: HIDABLE_INVESTMENT_SECTIONS,
  },
  {
    id: "crypto",
    label: "قیمت ارزها",
    description: "بخش‌های صفحه کریپتو",
    items: HIDABLE_CRYPTO_SECTIONS,
  },
  {
    id: "faq",
    label: "سوالات متداول",
    description: "بخش‌های صفحه FAQ",
    items: HIDABLE_FAQ_SECTIONS,
  },
  {
    id: "consulting",
    label: "مشاوره کسب‌وکار",
    description: "محتوای صفحه مشاوره",
    items: HIDABLE_CONSULTING_SECTIONS,
  },
  {
    id: "skyroom",
    label: "همایش",
    description: "محتوای صفحه اسکای‌روم",
    items: HIDABLE_SKYROOM_SECTIONS,
  },
  {
    id: "profile",
    label: "پنل کاربر",
    description: "منو و صفحات پنل کاربری",
    items: HIDABLE_PROFILE_ITEMS,
  },
  {
    id: "chrome",
    label: "ابزارهای شناور و پوسته",
    description: "چت، سبد شناور، اسکرول، نوار و فوتر",
    items: HIDABLE_CHROME_ITEMS,
  },
];

export const HIDABLE_ITEMS: HidableItem[] = HIDABLE_GROUPS.flatMap((g) => g.items);

export const HIDABLE_ITEM_IDS = new Set(HIDABLE_ITEMS.map((item) => item.id));

/** @deprecated use HIDABLE_ITEM_IDS */
export const HIDABLE_PAGE_PATHS = HIDABLE_ITEM_IDS;

export type HidablePage = { path: string; label: string };

export function parseHiddenPages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => HIDABLE_ITEM_IDS.has(item));
}

export function isItemHidden(id: string, hiddenItems: string[]): boolean {
  return hiddenItems.includes(id);
}

export function isSectionHidden(
  sectionId: string,
  hiddenItems: string[]
): boolean {
  return isItemHidden(sectionId, hiddenItems);
}

export function isPathHidden(pathname: string, hiddenPages: string[]): boolean {
  const pageHides = hiddenPages.filter((item) => item.startsWith("/"));
  if (!pageHides.length) return false;
  const path = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  return pageHides.some((hidden) => {
    if (hidden === "/") return path === "/";
    return path === hidden || path.startsWith(`${hidden}/`);
  });
}

export function filterNavByHiddenPages<T extends { link: string }>(
  items: T[],
  hiddenPages: string[]
): T[] {
  if (!hiddenPages.length) return items;
  return items.filter((item) => !isPathHidden(item.link, hiddenPages));
}

/** Map a profile URL to its visibility id. */
export function profilePathToVisibilityId(pathname: string): string | null {
  const path = (pathname.split("?")[0] || "").replace(/\/+$/, "") || "/";
  if (path === "/profile" || path === "/profile/acc") return "profile:acc";
  if (path.startsWith("/profile/courses")) return "profile:courses";
  if (path.startsWith("/profile/orders")) return "profile:orders";
  if (path.startsWith("/profile/transactions")) return "profile:transactions";
  if (path.startsWith("/profile/lists")) return "profile:lists";
  if (path.startsWith("/profile/support")) return "profile:support";
  if (path.startsWith("/profile/settings")) return "profile:settings";
  return null;
}

export const PROFILE_NAV_DEFS: { id: string; link: string; label: string }[] = [
  { id: "profile:acc", link: "/profile/acc", label: "اکانت شما" },
  { id: "profile:courses", link: "/profile/courses", label: "دوره‌های من" },
  { id: "profile:orders", link: "/profile/orders", label: "سفارش ها" },
  { id: "profile:transactions", link: "/profile/transactions", label: "تراکنش‌ها" },
  { id: "profile:lists", link: "/profile/lists", label: "لیست ها" },
  { id: "profile:support", link: "/profile/support", label: "تیکت و پشتیبانی" },
  { id: "profile:settings", link: "/profile/settings", label: "تنظیمات پروفایل" },
];

export function filterProfileNav<T extends { id?: string; link: string }>(
  items: T[],
  hiddenItems: string[]
): T[] {
  return items.filter((item) => {
    const id =
      item.id ||
      PROFILE_NAV_DEFS.find((d) => d.link === item.link)?.id ||
      profilePathToVisibilityId(item.link);
    if (!id) return true;
    return !isItemHidden(id, hiddenItems);
  });
}

export function firstVisibleProfilePath(hiddenItems: string[]): string | null {
  for (const item of PROFILE_NAV_DEFS) {
    if (!isItemHidden(item.id, hiddenItems)) return item.link;
  }
  return null;
}

export function createVisibility(hiddenItems: string[]) {
  return {
    hidden: hiddenItems,
    isHidden: (id: string) => isItemHidden(id, hiddenItems),
    show: (id: string) => !isItemHidden(id, hiddenItems),
  };
}
