import { BookOpen } from "lucide-react";
import { DynamicIcon } from "@/components/site/DynamicIcon";

export type NavLinkItem = {
  label: string;
  link: string;
  /** Optional lucide icon name (admin-managed, DynamicIcon registry). */
  icon?: string;
  data?: { label: string; link: string; icon?: string }[];
};

export type NavGroupId = "explore" | "learn" | "invest";

export type NavGroup = {
  id: NavGroupId;
  title: string;
  links: string[];
};

export const NAV_ICON_BY_LINK: Record<string, string> = {
  "/": "Home",
  "/courses": "GraduationCap",
  "/crypto-prices": "CandlestickChart",
  "/business-consulting": "Briefcase",
  "/investment-plans": "Wallet",
  "/library": "Library",
  "/news": "Newspaper",
  "/about-us": "BookOpen",
  "/skyroom-classes": "Presentation",
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

/**
 * Icon component for a nav item: admin-chosen icon first,
 * then the legacy per-route mapping, then BookOpen.
 */
export function NavItemIcon({
  item,
  className,
}: {
  item: Pick<NavLinkItem, "link" | "icon">;
  className?: string;
}) {
  const name = item.icon || NAV_ICON_BY_LINK[item.link] || "BookOpen";
  return <DynamicIcon name={name} fallback={BookOpen} className={className} />;
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
