/**
 * Public pages and homepage sections that admins can hide.
 * Stored together in SiteSettings.hiddenPages (JSON string array).
 */

export type HidableKind = "page" | "section";

export type HidableItem = {
  /** Path for pages (`/news`) or section key (`home:album`) */
  id: string;
  label: string;
  description?: string;
  kind: HidableKind;
};

/** Main marketing routes — removed from nav/footer and return 404 when hidden. */
export const HIDABLE_PAGES: HidableItem[] = [
  { id: "/", kind: "page", label: "صفحه اصلی", description: "کل مسیر /" },
  { id: "/courses", kind: "page", label: "دوره‌ها" },
  { id: "/crypto-prices", kind: "page", label: "قیمت ارزها" },
  { id: "/business-consulting", kind: "page", label: "مشاوره کسب و کار" },
  {
    id: "/investment-plans",
    kind: "page",
    label: "سبدهای سرمایه‌گذاری",
    description: "صفحه کامل سبدها",
  },
  { id: "/library", kind: "page", label: "کتابخانه دیجیتال" },
  { id: "/news", kind: "page", label: "اخبار" },
  { id: "/about-us", kind: "page", label: "درباره ما" },
  { id: "/skyroom-classes", kind: "page", label: "همایش" },
  { id: "/faq", kind: "page", label: "سوالات متداول" },
];

/** Homepage blocks — stay on `/` but the section is not rendered. */
export const HIDABLE_SECTIONS: HidableItem[] = [
  {
    id: "home:album",
    kind: "section",
    label: "آلبوم صفحه اصلی",
    description: "اسلایدر زوم و مینی‌اسلایدر بعد از هیرو (دسکتاپ)",
  },
  {
    id: "home:mobile-view",
    kind: "section",
    label: "موبایل ویو",
    description: "قدم‌های اسکرول داخل قاب موبایل",
  },
  {
    id: "home:calculator",
    kind: "section",
    label: "ماشین‌حساب سبد سرمایه‌گذاری",
    description: "بخش محاسبه بازده روی صفحه اصلی",
  },
  {
    id: "home:comments",
    kind: "section",
    label: "نظرات کاربران",
    description: "اسلایدر نظرات روی صفحه اصلی",
  },
  {
    id: "home:courses",
    kind: "section",
    label: "دوره‌های صفحه اصلی",
    description: "لیست دوره‌ها روی لندینگ",
  },
  {
    id: "home:news",
    kind: "section",
    label: "باشگاه خبری",
    description: "بخش اخبار روی صفحه اصلی",
  },
];

export const HIDABLE_ITEMS: HidableItem[] = [
  ...HIDABLE_PAGES,
  ...HIDABLE_SECTIONS,
];

export const HIDABLE_ITEM_IDS = new Set(HIDABLE_ITEMS.map((item) => item.id));

/** @deprecated use HIDABLE_ITEM_IDS — kept for older imports */
export const HIDABLE_PAGE_PATHS = HIDABLE_ITEM_IDS;

/** Compatibility shape used by older UI that expected `.path` */
export type HidablePage = { path: string; label: string };

export function parseHiddenPages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => HIDABLE_ITEM_IDS.has(item));
}

export function isSectionHidden(
  sectionId: string,
  hiddenItems: string[]
): boolean {
  return hiddenItems.includes(sectionId);
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
