"use client";

import { useEffect, useRef } from "react";

type CoinsHeroSectionProps = {
  title?: string;
  videoSrc?: string;
};

/**
 * V32 coins hero — title + full coins reel fitted inside the viewport.
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-10%] h-[70%] bg-[radial-gradient(ellipse_at_50%_40%,_rgba(68,144,216,0.38)_0%,_rgba(19,51,212,0.18)_32%,_transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[linear-gradient(180deg,#000412_0%,rgba(0,4,18,0.8)_50%,transparent_100%)]"
      />

      {/* Clearance for absolute/fixed navbar */}
      <div className="relative z-[1] mx-auto flex w-full max-w-[1180px] shrink-0 flex-col items-center px-4 pb-1 pt-[5.25rem] text-center sm:px-6 sm:pb-2 md:pt-24 lg:pt-28">
        <h1 className="m-0 max-w-[22ch] text-[clamp(1.35rem,3.4vw,2.75rem)] font-black leading-[1.25] tracking-tight text-white">
          {title}
        </h1>
      </div>

      <div className="coins-hero-reel relative z-[1] flex min-h-0 w-full flex-1 items-end justify-center overflow-hidden">
        <div
          aria-hidden
          className="coins-hero-fade-top pointer-events-none absolute inset-x-0 top-0 z-[2] h-[10%]"
        />
        <div
          aria-hidden
          className="coins-hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[10%]"
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
          className="pointer-events-none relative z-[1] block h-full w-full max-w-none select-none bg-transparent object-contain object-bottom"
        />
      </div>
    </section>
  );
}
