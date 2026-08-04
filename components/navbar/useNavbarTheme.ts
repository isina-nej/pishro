import { useMemo } from "react";
import { usePathname } from "next/navigation";

/**
 * Pages with hero media where the desktop navbar uses a dark top shadow
 * and light text (same treatment as the home hero).
 * Excludes `/skyroom-classes` (همایش) by design.
 */
const DARK_NAV_PATHS = new Set([
  "/",
  "/business-consulting",
  "/investment-plans",
  "/library",
  "/about-us",
  "/faq",
  "/courses",
  "/news",
  "/crypto-prices",
]);

/** همایش — keep its own overlays / navbar styling */
export const isSkyroomPath = (pathname: string | null | undefined) =>
  (pathname ?? "") === "/skyroom-classes" ||
  (pathname ?? "").startsWith("/skyroom-classes/");

export const useIsDarkNavbar = () => {
  const pathname = usePathname();

  return useMemo(() => {
    if (isSkyroomPath(pathname)) return false;
    return DARK_NAV_PATHS.has(pathname ?? "/");
  }, [pathname]);
};

export default useIsDarkNavbar;
