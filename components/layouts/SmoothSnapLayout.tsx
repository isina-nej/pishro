"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothSnapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    lenis.current = new Lenis({
      duration: 1.2, // ⏱ مدت زمان نرم شدن اسکرول
      lerp: 0.1, // 💧 ضریب نرمی (0 تا 1)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // منحنی easeOutExpo
      wheelMultiplier: 1, // سرعت اسکرول با موس
      touchMultiplier: 2, // سرعت اسکرول در تاچ
      infinite: false, // اسکرول بی‌نهایت خاموش
    });

    const raf = (time: number) => {
      lenis.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.current?.destroy();
    };
  }, []);

  return (
    <div className="">
      <div
        id="scroll-container"
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        {children}
      </div>
    </div>
  );
}
