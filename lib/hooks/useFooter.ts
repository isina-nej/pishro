"use client";

import { usePathname } from "next/navigation";

export function useFooter() {
  const pathname = usePathname();

  // مسیرهایی که نباید فوتر نمایش داده شود
  const hiddenPaths = ["/business-consulting", "/skyroom-classes"];

  // اگر در یکی از مسیرهای بالا هستیم، false برگردان
  const showFooter = !hiddenPaths.includes(pathname);

  return { showFooter };
}
