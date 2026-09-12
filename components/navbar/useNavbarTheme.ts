"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

/**
 * Pages whose first viewport is dark media (video/photo) so the floating
 * navbar should use light text. Light content pages must NOT be listed here
 * or the bar becomes invisible in light mode.
 */
const DARK_HERO_NAV_PATHS = new Set([
  "/",
  "/business-consulting",
  "/investment-plans",
  "/library",
  "/about-us",
  "/faq",
  "/courses",
  "/news",
]);

/** همایش — keep its own overlays / navbar styling */
export const isSkyroomPath = (pathname: string | null | undefined) =>
  (pathname ?? "") === "/skyroom-classes" ||
  (pathname ?? "").startsWith("/skyroom-classes/");

export const useIsDarkNavbar = () => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    if (isSkyroomPath(pathname)) return false;
    // In light mode the glass bar is light, so white navbar text would be
    // invisible — dark styling only applies when the site theme is dark.
    if (resolvedTheme !== "dark") return false;
    return DARK_HERO_NAV_PATHS.has(pathname ?? "/");
  }, [pathname, resolvedTheme]);
};

export default useIsDarkNavbar;
