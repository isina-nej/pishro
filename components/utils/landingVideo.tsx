"use client";

import { cn } from "@/lib/utils";

interface LandingVideoProps {
  vidSrc: string;
  title?: string;
  main?: boolean;
}

const LandingVideo = ({ vidSrc, title, main }: LandingVideoProps) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        main ? "h-[480px]" : "h-screen"
      )}
    >
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={vidSrc} type="video/mp4" />
        مروگر شما از ویدیو پشتیبانی نمی کند
      </video>

      {title && (
        <>
          {/* Soft vignette only — keep video clear */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />

          {/* Content (Optional) */}
          <div className="relative z-10 flex h-full items-center justify-center text-white">
            <h1 className="text-4xl font-bold drop-shadow-md">{title}</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingVideo;
