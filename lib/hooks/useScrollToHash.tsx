"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const useScrollToSection = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section"); // دریافت مقدار `section`
    if (section) {
      const targetElement = document.getElementById(section);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, [pathname, searchParams]);
};

export default useScrollToSection;
