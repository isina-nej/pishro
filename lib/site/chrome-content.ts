/**
 * Editable public chrome content: navbar items + footer copy/contact/links.
 * Defaults mirror the previous hardcoded UI so unset DB fields still look right.
 */

import { contactInfo } from "@/lib/constants/contact";

export type ChromeLink = {
  label: string;
  link: string;
};

export type FooterColumnContent = {
  title: string;
  links: ChromeLink[];
};

export type FooterContent = {
  aboutText: string;
  phone: string;
  phoneTel: string;
  mobile: string;
  mobileTel: string;
  email: string;
  address: string;
  weekdaysHours: string;
  weekendsHours: string;
  instagram: string;
  telegram: string;
  twitter: string;
  columns: {
    discover: FooterColumnContent;
    learn: FooterColumnContent;
    invest: FooterColumnContent;
    support: FooterColumnContent;
  };
  legalLinks: ChromeLink[];
  copyrightSuffix: string;
};

export type NavbarItem = ChromeLink;

const MAX_NAV_ITEMS = 24;
const MAX_COLUMN_LINKS = 20;
const MAX_LABEL = 80;
const MAX_LINK = 300;
const MAX_ABOUT = 1200;

export const DEFAULT_NAVBAR_ITEMS: NavbarItem[] = [
  { label: "صفحه اصلی", link: "/" },
  { label: "دوره ها", link: "/courses" },
  { label: "قیمت ارزها", link: "/crypto-prices" },
  { label: "مشاوره کسب و کار", link: "/business-consulting" },
  { label: "سبد های سرمایه گذاری", link: "/investment-plans" },
  { label: "کتابخانه دیجیتال", link: "/library" },
  { label: "اخبار", link: "/news" },
  { label: "درباره ما", link: "/about-us" },
  { label: "همایش", link: "/skyroom-classes" },
];

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  aboutText:
    "پیشرو ارائه‌دهنده آموزش مالی، ابزارهای سرمایه‌گذاری و محتوای تخصصی برای تصمیم‌گیری آگاهانه‌تر در بازارهای مالی است.",
  phone: contactInfo.phone,
  phoneTel: contactInfo.phoneTel,
  mobile: contactInfo.mobile,
  mobileTel: contactInfo.mobileTel,
  email: contactInfo.email,
  address: contactInfo.address,
  weekdaysHours: contactInfo.businessHours.weekdays,
  weekendsHours: contactInfo.businessHours.weekends,
  instagram: contactInfo.socials.instagram,
  telegram: contactInfo.socials.telegram,
  twitter: contactInfo.socials.linkedin,
  columns: {
    discover: {
      title: "کاوش",
      links: [
        { label: "صفحه اصلی", link: "/" },
        { label: "اخبار", link: "/news" },
        { label: "درباره ما", link: "/about-us" },
        { label: "همایش‌ها", link: "/skyroom-classes" },
      ],
    },
    learn: {
      title: "آموزش",
      links: [
        { label: "دوره‌های آموزشی", link: "/courses" },
        { label: "کتابخانه دیجیتال", link: "/library" },
        { label: "کریپتو", link: "/courses/cryptocurrency" },
        { label: "بورس", link: "/courses/stock-market" },
      ],
    },
    invest: {
      title: "سرمایه‌گذاری",
      links: [
        { label: "قیمت ارزها", link: "/crypto-prices" },
        { label: "سبدهای سرمایه‌گذاری", link: "/investment-plans" },
        { label: "مشاوره کسب‌وکار", link: "/business-consulting" },
      ],
    },
    support: {
      title: "پشتیبانی",
      links: [
        { label: "سوالات متداول", link: "/faq" },
        { label: "شیوه ثبت سفارش", link: "/faq#order" },
        { label: "شیوه‌های پرداخت", link: "/faq#payment" },
      ],
    },
  },
  legalLinks: [
    { label: "قوانین و مقررات", link: "/about-us" },
    { label: "سوالات متداول", link: "/faq" },
    { label: "حریم خصوصی", link: "/about-us" },
  ],
  copyrightSuffix: "تمامی حقوق محفوظ است.",
};

function asTrimmedString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function sanitizeLink(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const link = value.trim();
  if (!link || link.length > MAX_LINK) return null;
  // Allow internal paths, hashes, mailto/tel, and https URLs
  if (
    link.startsWith("/") ||
    link.startsWith("#") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:") ||
    link.startsWith("https://") ||
    link.startsWith("http://") ||
    link === "#"
  ) {
    return link;
  }
  return null;
}

function sanitizeLabel(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const label = value.trim();
  if (!label || label.length > MAX_LABEL) return null;
  return label;
}

function parseChromeLink(value: unknown): ChromeLink | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const label = sanitizeLabel(row.label);
  const link = sanitizeLink(row.link);
  if (!label || !link) return null;
  return { label, link };
}

function parseLinkList(value: unknown, max = MAX_COLUMN_LINKS): ChromeLink[] {
  if (!Array.isArray(value)) return [];
  const links: ChromeLink[] = [];
  for (const item of value.slice(0, max)) {
    const parsed = parseChromeLink(item);
    if (parsed) links.push(parsed);
  }
  return links;
}

function parseColumn(
  value: unknown,
  fallback: FooterColumnContent
): FooterColumnContent {
  if (!value || typeof value !== "object") return fallback;
  const row = value as Record<string, unknown>;
  const title = asTrimmedString(row.title, fallback.title).slice(0, MAX_LABEL);
  const links = parseLinkList(row.links);
  return {
    title: title || fallback.title,
    links: links.length ? links : fallback.links,
  };
}

/**
 * Normalize navbar items from DB/API. Invalid payload falls back to defaults.
 */
export function parseNavbarItems(value: unknown): NavbarItem[] {
  if (value == null) return DEFAULT_NAVBAR_ITEMS.map((item) => ({ ...item }));
  if (!Array.isArray(value)) return DEFAULT_NAVBAR_ITEMS.map((item) => ({ ...item }));

  const items = parseLinkList(value, MAX_NAV_ITEMS);
  return items.length
    ? items
    : DEFAULT_NAVBAR_ITEMS.map((item) => ({ ...item }));
}

/**
 * Validate admin PATCH navbar payload. Returns null when invalid.
 */
export function validateNavbarItemsInput(value: unknown): NavbarItem[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length === 0 || value.length > MAX_NAV_ITEMS) return null;
  const items: NavbarItem[] = [];
  for (const item of value) {
    const parsed = parseChromeLink(item);
    if (!parsed) return null;
    items.push(parsed);
  }
  return items;
}

export function parseFooterContent(value: unknown): FooterContent {
  const base = structuredClone(DEFAULT_FOOTER_CONTENT);
  if (value == null || typeof value !== "object") return base;

  const row = value as Record<string, unknown>;
  const columnsRaw =
    row.columns && typeof row.columns === "object"
      ? (row.columns as Record<string, unknown>)
      : {};

  return {
    aboutText: asTrimmedString(row.aboutText, base.aboutText).slice(0, MAX_ABOUT) || base.aboutText,
    phone: asTrimmedString(row.phone, base.phone).slice(0, 60) || base.phone,
    phoneTel: asTrimmedString(row.phoneTel, base.phoneTel).slice(0, 40) || base.phoneTel,
    mobile: asTrimmedString(row.mobile, base.mobile).slice(0, 60) || base.mobile,
    mobileTel: asTrimmedString(row.mobileTel, base.mobileTel).slice(0, 40) || base.mobileTel,
    email: asTrimmedString(row.email, base.email).slice(0, 120) || base.email,
    address: asTrimmedString(row.address, base.address).slice(0, 240) || base.address,
    weekdaysHours:
      asTrimmedString(row.weekdaysHours, base.weekdaysHours).slice(0, 80) ||
      base.weekdaysHours,
    weekendsHours:
      asTrimmedString(row.weekendsHours, base.weekendsHours).slice(0, 80) ||
      base.weekendsHours,
    instagram: asTrimmedString(row.instagram, base.instagram).slice(0, MAX_LINK) || base.instagram,
    telegram: asTrimmedString(row.telegram, base.telegram).slice(0, MAX_LINK) || base.telegram,
    twitter: asTrimmedString(row.twitter, base.twitter).slice(0, MAX_LINK) || base.twitter,
    columns: {
      discover: parseColumn(columnsRaw.discover, base.columns.discover),
      learn: parseColumn(columnsRaw.learn, base.columns.learn),
      invest: parseColumn(columnsRaw.invest, base.columns.invest),
      support: parseColumn(columnsRaw.support, base.columns.support),
    },
    legalLinks: (() => {
      const links = parseLinkList(row.legalLinks);
      return links.length ? links : base.legalLinks;
    })(),
    copyrightSuffix:
      asTrimmedString(row.copyrightSuffix, base.copyrightSuffix).slice(0, 120) ||
      base.copyrightSuffix,
  };
}

/**
 * Validate admin PATCH footer payload. Returns null when shape is unusable.
 */
export function validateFooterContentInput(value: unknown): FooterContent | null {
  if (value == null || typeof value !== "object") return null;
  try {
    return parseFooterContent(value);
  } catch {
    return null;
  }
}

export function footerContentToContactShape(footer: FooterContent) {
  return {
    phone: footer.phone,
    phoneTel: footer.phoneTel,
    mobile: footer.mobile,
    mobileTel: footer.mobileTel,
    email: footer.email,
    address: footer.address,
    socials: {
      instagram: footer.instagram,
      telegram: footer.telegram,
      linkedin: footer.twitter,
    },
    businessHours: {
      weekdays: footer.weekdaysHours,
      weekends: footer.weekendsHours,
    },
  };
}
