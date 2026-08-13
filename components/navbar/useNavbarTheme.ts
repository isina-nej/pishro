import { useMemo } from "react";
import { usePathname } from "next/navigation";

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

  return useMemo(() => {
    if (isSkyroomPath(pathname)) return false;
    return DARK_HERO_NAV_PATHS.has(pathname ?? "/");
  }, [pathname]);
};

export default useIsDarkNavbar;
