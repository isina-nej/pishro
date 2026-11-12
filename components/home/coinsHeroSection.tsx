"use client";

import { useEffect, useRef } from "react";
import { shouldPlayAmbientVideo } from "@/lib/utils/media-playback";

type CoinsHeroSectionProps = {
  title?: string;
  videoSrc?: string;
};

/**
 * V32 coins hero — full-bleed reel; video stretches to the remaining viewport
 * (e.g. square container → taller stretched video, not cropped).
 */
export default function CoinsHeroSection({
  title = "پیشرو در مسیر سرمایه گذاری هوشمند",
  videoSrc = "/videos/v32-coins.mp4",
}: CoinsHeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    );
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    if (reducedMotion || saveData) video.preload = "none";

    const canPlay = () => shouldPlayAmbientVideo({ inView, reducedMotion, saveData, hidden: document.hidden });
    const tryPlay = () => {
      if (!canPlay()) return;
      void video.play().catch(() => undefined);
    };
    const onPause = () => {
      // Do not restart a video that was intentionally paused offscreen.
      if (!video.ended && canPlay()) tryPlay();
    };
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else tryPlay();
    };

    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry.isIntersecting);
      if (canPlay()) tryPlay();
      else video.pause();
    }, { threshold: 0.15 });
    observer.observe(video);

    return () => {
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      video.pause();
    };
  }, []);

  // ponytail: video stage fixed dark (letterbox #000412 matches reel art); ink via --home-on-dark so palette admins keep contrast
  return (
    <section
      dir="rtl"
      aria-label="هیرو پیشرو"
      className="coins-hero relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex h-[100svh] max-h-[100svh] w-screen max-w-none flex-col overflow-hidden text-[var(--home-on-dark)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#000412]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[72%] coins-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 coins-hero-fade-bottom"
      />

      <div className="relative z-[3] flex shrink-0 items-end justify-center bg-transparent px-4 pb-1 pt-[4.5rem] text-center sm:px-6 sm:pb-2 md:pt-24 md:pb-3">
        <h1 className="m-0 max-w-[22ch] bg-transparent text-[clamp(1.15rem,2.4vw+0.55rem,2.45rem)] font-black leading-[1.3] tracking-tight text-[var(--home-on-dark)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          {title}
        </h1>
      </div>

      {/* فضای باقی‌مانده: ویدیو کشیده می‌شود تا ظرف را پر کند، نه کات */}
      <div className="relative z-[1] min-h-0 w-full flex-1 overflow-hidden bg-transparent">
        <div className="coins-hero-reel absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="coins-hero-video pointer-events-none relative z-[1] h-full w-full select-none bg-transparent"
          />
        </div>
      </div>
    </section>
  );
}
