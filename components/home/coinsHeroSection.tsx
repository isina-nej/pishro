"use client";

import { useEffect, useRef } from "react";

type CoinsHeroSectionProps = {
  title?: string;
  videoSrc?: string;
};

/**
 * V32 coins hero — title + full coins reel, fitted to one viewport.
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
      className="coins-hero relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] grid h-[100svh] max-h-[100svh] w-screen max-w-none grid-rows-[auto_minmax(0,1fr)] overflow-hidden text-[#F4F6F8]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#000412]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-[radial-gradient(ellipse_at_50%_55%,_rgba(68,144,216,0.34)_0%,_rgba(19,51,212,0.14)_36%,_transparent_72%)]"
      />

      {/* Navbar clearance + title */}
      <div className="relative z-[1] flex items-end justify-center px-4 pb-2 pt-[4.75rem] text-center sm:px-6 sm:pb-3 md:pt-[5.5rem] md:pb-4">
        <h1 className="m-0 max-w-[22ch] text-[clamp(1.25rem,2.8vw+0.6rem,2.6rem)] font-black leading-[1.3] tracking-tight text-white">
          {title}
        </h1>
      </div>

      {/* Coins fill remaining viewport height, full bleed width */}
      <div className="coins-hero-reel relative z-[1] min-h-0 w-full overflow-hidden">
        <div
          aria-hidden
          className="coins-hero-fade-top pointer-events-none absolute inset-x-0 top-0 z-[2] h-[8%]"
        />
        <div
          aria-hidden
          className="coins-hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[6%]"
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
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full select-none bg-transparent object-contain object-bottom"
        />
      </div>
    </section>
  );
}
