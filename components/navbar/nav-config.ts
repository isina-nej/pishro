import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  CandlestickChart,
  GraduationCap,
  Home,
  Library,
  Newspaper,
  Presentation,
  Wallet,
} from "lucide-react";

export type NavLinkItem = {
  label: string;
  link: string;
  data?: { label: string; link: string }[];
};

export type NavGroupId = "explore" | "learn" | "invest";

export type NavGroup = {
  id: NavGroupId;
  title: string;
  links: string[];
};

/** Desktop/mobile shared grouping for primary site pages. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "explore",
    title: "کاوش",
    links: ["/", "/news", "/about-us"],
  },
  {
    id: "learn",
    title: "آموزش و محتوا",
    links: ["/courses", "/library", "/skyroom-classes"],
  },
  {
    id: "invest",
    title: "سرمایه‌گذاری",
    links: ["/crypto-prices", "/investment-plans", "/business-consulting"],
  },
];

const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/courses": GraduationCap,
  "/crypto-prices": CandlestickChart,
  "/business-consulting": Briefcase,
  "/investment-plans": Wallet,
  "/library": Library,
  "/news": Newspaper,
  "/about-us": BookOpen,
  "/skyroom-classes": Presentation,
};

export function getNavIcon(link: string): LucideIcon {
  return NAV_ICONS[link] || BookOpen;
}

export function groupNavbarData(navbarData: NavLinkItem[]) {
  const byLink = new Map(navbarData.map((item) => [item.link, item]));
  const grouped = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.links
      .map((link) => byLink.get(link))
      .filter((item): item is NavLinkItem => Boolean(item)),
  })).filter((group) => group.items.length > 0);

  const known = new Set(NAV_GROUPS.flatMap((group) => group.links));
  const extras = navbarData.filter((item) => !known.has(item.link));

  if (extras.length) {
    grouped.push({
      id: "explore",
      title: "بیشتر",
      links: extras.map((item) => item.link),
      items: extras,
    });
  }

  return grouped;
}
