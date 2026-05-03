"use client";

import { useEffect, useRef, useState } from "react";

type UseHideOnScrollOptions = {
  disabled?: boolean;
  threshold?: number;
};

const DEFAULT_THRESHOLD = 4;

export const useHideOnScroll = ({
  disabled = false,
  threshold = DEFAULT_THRESHOLD,
}: UseHideOnScrollOptions = {}) => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (disabled) {
      setIsHidden(false);
      return;
    }

    const isBrowser = typeof window !== "undefined";
    if (!isBrowser) {
      return;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;

      lastScrollYRef.current = currentY;

      if (Math.abs(delta) < threshold) {
        return;
      }

      if (currentY <= 0 || delta < 0) {
        setIsHidden(false);
        return;
      }

      setIsHidden(true);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [disabled, threshold]);

  useEffect(() => {
    if (disabled) {
      setIsHidden(false);
    }
  }, [disabled]);

  return isHidden;
};

export default useHideOnScroll;

