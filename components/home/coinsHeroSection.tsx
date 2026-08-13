"use client";

import { useEffect, useRef } from "react";

type CoinsHeroSectionProps = {
  title?: string;
  videoSrc?: string;
};

/**
 * V32 coins hero — title + full coins reel.
 */
export default function CoinsHeroSection({
  title = "پیشرو در مسیر سرمایه گذاری هوشمند",
  videoSrc = "/videos/v32-coins.mp4",
}: CoinsHeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("autoplay", "");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();

    const onPause = () => {
      if (v.ended || document.hidden) return;
      tryPlay();
    };
    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };

    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) tryPlay();
          else v.pause();
        },
        { threshold: 0.15 }
      );
      io.observe(v);
    }

    return () => {
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, []);

  return (
    <section
      dir="rtl"
      aria-label="هیرو پیشرو"
      className="coins-hero relative w-full overflow-hidden text-[#F4F6F8]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#000412]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-10%] h-[70%] bg-[radial-gradient(ellipse_at_50%_40%,_rgba(68,144,216,0.38)_0%,_rgba(19,51,212,0.18)_32%,_transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[linear-gradient(180deg,#000412_0%,rgba(0,4,18,0.8)_50%,transparent_100%)]"
      />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1180px] flex-col items-center px-4 pb-2 pt-12 text-center sm:px-6 sm:pb-3 sm:pt-16 md:pt-20 lg:pt-24">
        <h1 className="m-0 max-w-[20ch] text-[clamp(1.75rem,5vw,3.75rem)] font-black leading-[1.3] tracking-tight text-white">
          {title}
        </h1>
      </div>

      <div className="coins-hero-reel relative z-[1] mx-auto w-full max-w-[1400px] overflow-hidden">
        {/* Soft top/bottom color bridges only — keep full coins visible */}
        <div
          aria-hidden
          className="coins-hero-fade-top pointer-events-none absolute inset-x-0 top-0 z-[2] h-[14%] sm:h-[12%]"
        />
        <div
          aria-hidden
          className="coins-hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[16%] sm:h-[14%]"
        />
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className="pointer-events-none relative z-[1] block h-auto w-full select-none bg-transparent"
        />
      </div>
    </section>
  );
}
