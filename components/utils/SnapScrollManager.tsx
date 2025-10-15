"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { animate } from "framer-motion";
import { useSnapScroll } from "@/hooks/snap-scroll-context";

type Props = {
  children: React.ReactNode[];
  duration?: number;
  offset?: number;
  threshold?: number;
};

const SnapScrollManager = ({
  children,
  duration = 0.8,
  offset = 0,
  threshold = 0.05,
}: Props) => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const { activeIndex, setActiveIndex, isAnimating, setIsAnimating } =
    useSnapScroll();
  const lastScrollTime = useRef<number>(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 🧭 تابع اسکرول نرم به سکشن خاص
  const scrollToSection = useCallback(
    (index: number) => {
      if (!sectionsRef.current[index]) return;
      const section = sectionsRef.current[index]!;
      const targetY =
        window.scrollY + section.getBoundingClientRect().top - offset;

      if (isAnimating) return;
      if (Math.abs(window.scrollY - targetY) < 3) return;

      console.log(`🌀 در حال اسکرول به سکشن ${index}`);

      setIsAnimating(true);
      const controls = animate(window.scrollY, targetY, {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (latest) => window.scrollTo(0, latest),
        onComplete: () => {
          console.log(`✅ رسید به سکشن ${index}`);
          setTimeout(() => setIsAnimating(false), 150);
        },
      });

      // اگر کاربر وسط انیمیشن اسکرول کرد
      const stop = () => {
        console.warn("⛔ انیمیشن متوقف شد (کاربر دخالت کرد)");
        controls.stop();
        setIsAnimating(false);
      };
      window.addEventListener("wheel", stop, { once: true });
    },
    [duration, offset, isAnimating, setIsAnimating]
  );

  // 👁️ تشخیص سکشن فعال با IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce(
          (prev, curr) =>
            curr.intersectionRatio > (prev?.intersectionRatio ?? 0)
              ? curr
              : prev,
          null as IntersectionObserverEntry | null
        );

        if (!mostVisible) return;
        const idx = sectionsRef.current.findIndex(
          (sec) => sec === mostVisible.target
        );

        if (
          idx !== -1 &&
          idx !== activeIndex &&
          mostVisible.intersectionRatio >= threshold &&
          !isAnimating
        ) {
          console.log(`🎯 سکشن فعال تغییر کرد → ${idx}`);
          setActiveIndex(idx);
        }
      },
      { threshold: Array.from({ length: 10 }, (_, i) => i / 10) }
    );

    sectionsRef.current.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [threshold, activeIndex, isAnimating, setActiveIndex]);

  // 🖱️ کنترل با اسکرول ماوس
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (isAnimating || now - lastScrollTime.current < 400) return;

      if (e.deltaY > 10 && activeIndex < children.length - 1) {
        console.log("⬇️ اسکرول به پایین → سکشن بعدی");
        setActiveIndex(activeIndex + 1);
        lastScrollTime.current = now;
      } else if (e.deltaY < -10 && activeIndex > 0) {
        console.log("⬆️ اسکرول به بالا → سکشن قبلی");
        setActiveIndex(activeIndex - 1);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex, children.length, isAnimating, setActiveIndex]);

  // 📱 کنترل تاچ برای موبایل
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = startY - e.changedTouches[0].clientY;
      const now = Date.now();
      if (
        Math.abs(delta) < 30 ||
        isAnimating ||
        now - lastScrollTime.current < 500
      )
        return;

      if (delta > 0 && activeIndex < children.length - 1) {
        console.log("📱 سوایپ پایین → سکشن بعدی");
        setActiveIndex(activeIndex + 1);
        lastScrollTime.current = now;
      } else if (delta < 0 && activeIndex > 0) {
        console.log("📱 سوایپ بالا → سکشن قبلی");
        setActiveIndex(activeIndex - 1);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, children.length, isAnimating, setActiveIndex]);

  // 🎬 فقط وقتی activeIndex تغییر کنه (و بعد از mount) → اسکرول
  useEffect(() => {
    if (!hasMounted) return;
    scrollToSection(activeIndex);
  }, [activeIndex, hasMounted, scrollToSection]);

  return (
    <div className="relative w-full">
      {children.map((child, i) => (
        <section
          key={i}
          ref={(el) => {
            sectionsRef.current[i] = el;
          }}
          className="min-h-screen w-full"
        >
          {child}
        </section>
      ))}
    </div>
  );
};

export default SnapScrollManager;
