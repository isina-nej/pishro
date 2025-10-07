"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

type Props = {
  children: ReactNode;
  duration?: number;
  offset?: number;
  threshold?: number;
};

const SnapSingleSection = ({
  children,
  duration = 0.8,
  offset = 0,
  threshold = 0.1, // وقتی حداقل 10٪ از سکشن دیده بشه فعال میشه
}: Props) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // اگر قبلاً اسنپ شده یا در حال انیمیشن هست، کاری نکن
        if (isAnimating || hasSnapped) return;

        // اگر سکشن وارد صفحه شد (حتی کمی)
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          const targetY =
            window.scrollY + section.getBoundingClientRect().top - offset;

          setIsAnimating(true);

          const controls = animate(window.scrollY, targetY, {
            duration,
            ease: [0.25, 0.1, 0.25, 1],
            onUpdate: (latest) => window.scrollTo(0, latest),
            onComplete: () => {
              setIsAnimating(false);
              setHasSnapped(true); // ✅ فقط یک بار فعال شود تا زمانی که خارج نشود
            },
          });

          // در صورت لغو اسکرول ناگهانی
          const stop = () => {
            controls.stop();
            setIsAnimating(false);
          };
          window.addEventListener("wheel", stop, { once: true });
        }
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 20),
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [duration, offset, threshold, isAnimating, hasSnapped]);

  // وقتی سکشن از صفحه خارج شد → دوباره اجازه فعال شدن بده
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // اگر سکشن به‌طور کامل از دید خارج شده
      const completelyOut =
        rect.bottom < 10 || rect.top > window.innerHeight - 10;

      if (completelyOut && hasSnapped) {
        setHasSnapped(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasSnapped]);

  return (
    <section ref={sectionRef} className="min-h-screen w-full">
      {children}
    </section>
  );
};

export default SnapSingleSection;
