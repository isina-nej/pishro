/**
 * Main public pages that admins can hide from navigation and direct access.
 */

export type HidablePage = {
  path: string;
  label: string;
};

export const HIDABLE_PAGES: HidablePage[] = [
  { path: "/", label: "صفحه اصلی" },
  { path: "/courses", label: "دوره‌ها" },
  { path: "/crypto-prices", label: "قیمت ارزها" },
  { path: "/business-consulting", label: "مشاوره کسب و کار" },
  { path: "/investment-plans", label: "سبدهای سرمایه‌گذاری" },
  { path: "/library", label: "کتابخانه دیجیتال" },
  { path: "/news", label: "اخبار" },
  { path: "/about-us", label: "درباره ما" },
  { path: "/skyroom-classes", label: "همایش" },
  { path: "/faq", label: "سوالات متداول" },
];

export const HIDABLE_PAGE_PATHS = new Set(HIDABLE_PAGES.map((p) => p.path));

export function parseHiddenPages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => HIDABLE_PAGE_PATHS.has(item));
}

export function isPathHidden(pathname: string, hiddenPages: string[]): boolean {
  if (!hiddenPages.length) return false;
  const path = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  return hiddenPages.some((hidden) => {
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
