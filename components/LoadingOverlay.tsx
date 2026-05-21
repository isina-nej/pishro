"use client";

import { useEffect } from "react";
import { useLoading } from "@/lib/contexts/LoadingContext";

export const LoadingOverlay = () => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link) {
        const href = link.getAttribute("href");
        // Only show loading for internal navigation
        if (href && !href.startsWith("http") && !href.startsWith("#")) {
          startLoading();
          timeout = setTimeout(stopLoading, 3000); // Auto-hide after 3 seconds
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      if (timeout) clearTimeout(timeout);
    };
  }, [startLoading, stopLoading]);

  return null;
};
