import { useMemo } from "react";
import { usePathname } from "next/navigation";

const DARK_PATHS = new Set([
  "/",
  "/business-consulting",
  "/investment-plans",
  "/library",
  "/about-us",
  "/faq",
  "/courses",
  "/news",
]);

export const useIsDarkNavbar = () => {
  const pathname = usePathname();

  return useMemo(() => DARK_PATHS.has(pathname ?? "/"), [pathname]);
};

export default useIsDarkNavbar;
