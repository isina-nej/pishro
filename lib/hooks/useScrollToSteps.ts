"use client";

import { useEffect } from "react";
import { useUserLevelStore } from "@/stores/user-level-store";

/**
 * بعد از تعیین سطح، فقط یک‌بار اسکرول انجام می‌دهد (در همان صفحه).
 */
export const useScrollToSteps = () => {
  const { level, hasScrolled, setHasScrolled } = useUserLevelStore();

  useEffect(() => {
    // اگر هنوز سطح تعیین نشده یا قبلاً اسکرول شده، کاری نکن
    if (!level || hasScrolled) return;

    const timeout = setTimeout(() => {
      const section = document.getElementById("stepsSection");
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setHasScrolled(true); // ✅ فقط یک بار اسکرول کن
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [level, hasScrolled, setHasScrolled]);
};
