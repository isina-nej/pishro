"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

type Props = {
  children: ReactNode | ReactNode[];
  threshold?: number;
  duration?: number;
  offset?: number;
  snapGap?: number;
};

const SnapScrollWrapper = ({
  children,
  threshold = 0.2,
  duration = 0.8,
  offset = 0,
  snapGap = 0.2,
}: Props) => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const lastScrollY = useRef(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  console.log("direction:", direction);
  const childArray = Array.isArray(children) ? children : [children];

  // تشخیص جهت اسکرول
  useEffect(() => {
    const handleScrollDirection = () => {
      const currentY = window.scrollY;
      setDirection(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScrollDirection);
    return () => window.removeEventListener("scroll", handleScrollDirection);
  }, []);

  // اسنپ اسکرول با IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isAnimating) return;

        // پیدا کردن سکشنی که بیشترین نسبت دیده شدن رو داره
        const visible = entries.reduce(
          (prev, curr) =>
            curr.intersectionRatio > (prev?.intersectionRatio ?? 0)
              ? curr
              : prev,
          null as IntersectionObserverEntry | null
        );
        if (!visible) return;

        // ایندکس سکشن دیده شده
        const index = sectionsRef.current.findIndex(
          (s) => s === visible.target
        );
        if (index === -1 || index === activeSection) return; // ⚠️ نادیده گرفتن سکشن فعلی

        // فقط وقتی بیش از snapGap از سکشن وارد دید شد snap کن
        if (visible.intersectionRatio < snapGap) return;

        const target = visible.target as HTMLElement;
        const targetY =
          window.scrollY + target.getBoundingClientRect().top - offset;

        setIsAnimating(true);

        const controls = animate(window.scrollY, targetY, {
          duration,
          ease: [0.25, 0.1, 0.25, 1],
          onUpdate: (latest) => window.scrollTo(0, latest),
          onComplete: () => {
            setActiveSection(index); // ✅ برو به سکشن جدید
            setTimeout(() => setIsAnimating(false), 200);
          },
        });

        // اگر وسط انیمیشن اسکرول دوباره انجام شد → لغو
        const stop = () => {
          controls.stop();
          setIsAnimating(false);
        };
        window.addEventListener("wheel", stop, { once: true });
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 20),
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [threshold, duration, offset, snapGap, isAnimating, activeSection]);

  return (
    <div className="relative w-full">
      {childArray.map((child, i) => (
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

export default SnapScrollWrapper;
