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
        main ? "h-[480px]" : "h-[624px]"
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
          {/* Overlay for Dark Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

          {/* Content (Optional) */}
          <div className="relative z-10 flex justify-center items-center h-full text-white">
            <h1 className="text-4xl font-bold">{title}</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingVideo;
