"use client";

import { useEffect, useRef } from "react";

type CoinsHeroSectionProps = {
  title?: string;
  videoSrc?: string;
};

/**
 * V32 coins hero — title + coins reel scaled to fit the viewport.
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
      className="coins-hero relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex h-[100svh] max-h-[100svh] w-screen max-w-none flex-col overflow-hidden text-[#F4F6F8]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#000412]"
      />
      {/* Soft dual glow — teal continues into blue so the join never reads as a hard cut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[72%] coins-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 coins-hero-fade-bottom"
      />

      {/* Title only — no panel/background so coins are not covered */}
      <div className="relative z-[1] flex shrink-0 items-end justify-center bg-transparent px-4 pb-1 pt-[4.5rem] text-center sm:px-6 sm:pb-2 md:pt-24 md:pb-3">
        <h1 className="m-0 max-w-[22ch] bg-transparent text-[clamp(1.15rem,2.4vw+0.55rem,2.45rem)] font-black leading-[1.3] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          {title}
        </h1>
      </div>

      {/*
        Scale reel to page: grow as wide as possible, shrink on small
        screens, never crop coins (object-contain + max bounds).
      */}
      <div className="relative z-[1] flex min-h-0 w-full flex-1 items-end justify-center overflow-hidden bg-transparent">
        <div className="coins-hero-reel relative flex h-full max-h-full w-full max-w-full items-end justify-center overflow-hidden bg-transparent">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="pointer-events-none relative z-[1] h-auto max-h-full w-full max-w-full select-none bg-transparent object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
