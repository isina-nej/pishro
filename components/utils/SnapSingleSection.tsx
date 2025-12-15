"use client";

import { ReactNode, useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { useScrollStore } from "@/stores/scroll-store";

type Props = {
  children: ReactNode;
  duration?: number;
  offset?: number;
  threshold?: number;
  id: string;
};

const SnapSingleSection = ({
  children,
  duration = 0.8,
  offset = 0,
  threshold = 0.05,
  id,
}: Props) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const {
    activeSection,
    setActiveSection,
    isScrolling,
    setIsScrolling,
    // targetSection,
    setTargetSection,
    snapEnabled,
  } = useScrollStore();

  const isSnappingRef = useRef(false); // 🚫 جلوگیری از اسکرول تکراری

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // 🚫 اگر در حال انیمیشن هستیم یا قبلاً فعال شده، خروج
        if (!snapEnabled || isScrolling || isSnappingRef.current) return;

        // ✅ وقتی سکشن واقعا وارد دید می‌شود
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (activeSection === id) return; // جلوگیری از تریگر دوباره

          isSnappingRef.current = true;
          setTargetSection(id);
          setIsScrolling(true);

          const targetY =
            window.scrollY + section.getBoundingClientRect().top - offset;

          const controls = animate(window.scrollY, targetY, {
            duration,
            ease: [0.25, 0.1, 0.25, 1],
            onUpdate: (latest) => window.scrollTo(0, latest),
            onComplete: () => {
              setActiveSection(id);
              setIsScrolling(false);
              isSnappingRef.current = false;
            },
          });

          const stop = () => {
            controls.stop();
            setIsScrolling(false);
            isSnappingRef.current = false;
          };
          window.addEventListener("wheel", stop, { once: true });
        }
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [
    duration,
    offset,
    threshold,
    id,
    isScrolling,
    activeSection,
    snapEnabled,
    setTargetSection,
    setIsScrolling,
    setActiveSection,
  ]);

  return (
    <section ref={sectionRef} id={id} className="min-h-screen w-full">
      {children}
    </section>
  );
};

export default SnapSingleSection;
