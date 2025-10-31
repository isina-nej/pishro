import { useMemo } from "react";
import { usePathname } from "next/navigation";

const DARK_PATHS = new Set([
  "/",
  "/investment-consulting",
  "/investment-plans",
  "/investment-plans/custom",
]);

export const useIsDarkNavbar = () => {
  const pathname = usePathname();

  return useMemo(() => DARK_PATHS.has(pathname ?? "/"), [pathname]);
};

export default useIsDarkNavbar;

